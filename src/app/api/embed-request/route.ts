import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/utils/logger';
import { rateLimit } from '@/utils/rateLimit';

const logger = createLogger({ component: 'EmbedRequestAPI' });

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Trim and limit a string field to a maximum length.
 * Returns an empty string for non-string / falsy values.
 */
function sanitizeField(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { success: withinLimit } = rateLimit(request, {
    limit: 5,
    windowMs: 60_000,
  });
  if (!withinLimit) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const payload = await request.json();

    // Sanitize all string inputs
    const name = sanitizeField(payload?.name, 100);
    const email = sanitizeField(payload?.email, 254);
    const website = sanitizeField(payload?.website, 500);
    const calculator = sanitizeField(payload?.calculator, 100);
    const calculatorSlug = sanitizeField(payload?.calculatorSlug, 100);
    const notes = sanitizeField(payload?.notes, 1000);

    // Validate required email field
    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (CONVERTKIT_API_KEY && CONVERTKIT_FORM_ID) {
      const response = await fetch(
        `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: CONVERTKIT_API_KEY,
            email,
            first_name: name,
            fields: {
              website,
              calculator,
              calculatorSlug,
              notes,
              source: 'embed-request',
            },
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        logger.error('ConvertKit error', { responseBody: errorBody });
        return NextResponse.json({ ok: false }, { status: 502 });
      }
    } else {
      logger.warn('Missing ConvertKit config');
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error('Embed request failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
