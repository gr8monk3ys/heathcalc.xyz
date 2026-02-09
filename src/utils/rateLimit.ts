import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitOptions {
  /** Maximum requests per window (default: 10) */
  limit?: number;
  /** Window duration in milliseconds (default: 60000 = 1 minute) */
  windowMs?: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
}

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_MS = 60_000;

const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries from the rate limit map
 */
function cleanupExpired(): void {
  const now = Date.now();
  rateLimitMap.forEach((entry, key) => {
    if (now >= entry.resetTime) {
      rateLimitMap.delete(key);
    }
  });
}

/**
 * Get client IP address from the request
 */
function getClientIp(request: NextRequest): string {
  // Prefer request.ip which is set by the trusted reverse proxy (e.g. Vercel)
  const ip = (request as NextRequest & { ip?: string }).ip;
  if (ip) {
    return ip;
  }

  // Fallback: use the rightmost (last) X-Forwarded-For value, which is the
  // address appended by the closest trusted proxy. The leftmost entries are
  // attacker-controlled and trivially spoofed.
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',');
    return parts[parts.length - 1].trim();
  }

  return 'unknown';
}

/**
 * Simple in-memory rate limiter for API routes.
 *
 * Note: In a serverless environment each invocation may use a fresh
 * instance, so this provides per-instance burst protection. For
 * sustained protection, rely on Vercel's built-in DDoS mitigation.
 */
export function rateLimit(request: NextRequest, options?: RateLimitOptions): RateLimitResult {
  const limit = options?.limit ?? DEFAULT_LIMIT;
  const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();

  cleanupExpired();

  const ip = getClientIp(request);
  const entry = rateLimitMap.get(ip);

  if (!entry || now >= entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  entry.count += 1;

  if (entry.count > limit) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: limit - entry.count };
}
