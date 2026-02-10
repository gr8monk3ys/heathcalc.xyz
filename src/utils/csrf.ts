import { NextRequest } from 'next/server';

/**
 * Verify CSRF protection by checking Origin and Referer headers against
 * the expected host. This prevents cross-site request forgery by ensuring
 * requests originate from the same site.
 *
 * The function checks headers in order of reliability:
 * 1. Origin header (most reliable, set by browsers on cross-origin requests)
 * 2. Referer header (fallback, may contain full URL path)
 * 3. If neither is present, reject the request. Modern browsers always send
 *    at least Origin or Referer on same-origin POST requests, so missing
 *    both headers is suspicious and likely indicates a forged request.
 */
export function verifyCsrf(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const expectedHost = siteUrl ? new URL(siteUrl).host : host;

  if (!expectedHost) return false; // Fail-secure: reject if we can't verify

  // Check Origin header (most reliable)
  if (origin) {
    try {
      return new URL(origin).host === expectedHost;
    } catch {
      return false;
    }
  }

  // Fallback: check Referer header
  if (referer) {
    try {
      return new URL(referer).host === expectedHost;
    } catch {
      return false;
    }
  }

  // No Origin or Referer - reject. Modern browsers always send at least one
  // of these headers on same-origin POST requests.
  return false;
}
