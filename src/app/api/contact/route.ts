import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/utils/logger';
import { rateLimit } from '@/utils/rateLimit';

const logger = createLogger({ component: 'ContactAPI' });

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_SUBJECTS = ['question', 'feedback', 'bug', 'feature', 'other'];

const SUBJECT_LABELS: Record<string, string> = {
  question: 'General Question',
  feedback: 'Feedback',
  bug: 'Bug Report',
  feature: 'Feature Request',
  other: 'Other',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: NextRequest): Promise<NextResponse<ContactResponse>> {
  // CSRF protection: verify the Origin header matches the expected host.
  const origin = request.headers.get('origin');
  if (origin) {
    const host = request.headers.get('host');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const expectedOrigin = siteUrl || (host ? `https://${host}` : null);
    if (!expectedOrigin || origin !== expectedOrigin) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }
  }

  const { success: withinLimit } = rateLimit(request);
  if (!withinLimit) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as ContactRequest;
    const { name, email, subject, message } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Please provide your name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!subject || !VALID_SUBJECTS.includes(subject)) {
      return NextResponse.json(
        { success: false, message: 'Please select a valid subject.' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: 'Message must be at least 10 characters.' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { success: false, message: 'Message must be less than 5,000 characters.' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL || 'info@healthcalc.xyz';

    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'HealthCheck Contact <noreply@healthcalc.xyz>',
          to: contactEmail,
          reply_to: email,
          subject: `[HealthCheck] ${SUBJECT_LABELS[subject] || subject} from ${name.trim()}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Subject:</strong> ${SUBJECT_LABELS[subject] || escapeHtml(subject)}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(message.trim()).replace(/\n/g, '<br />')}</p>
          `,
        }),
      });

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: "Thank you for your message! We'll get back to you within 1-2 business days.",
        });
      }

      logger.error('Resend email error', { responseBody: await response.text() });
      return NextResponse.json(
        { success: false, message: 'Failed to send message. Please try again later.' },
        { status: 500 }
      );
    }

    // No email provider configured
    logger.warn('Contact form submission (no email provider configured)');

    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        message: 'Message received! (Development mode - configure RESEND_API_KEY for production)',
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          'Contact form is temporarily unavailable. Please email us directly at info@healthcalc.xyz',
      },
      { status: 503 }
    );
  } catch (error) {
    logger.error('Contact form error', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
