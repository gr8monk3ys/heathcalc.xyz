import { NextResponse } from 'next/server';
import { isSubmissionPersistenceStrictModeEnabled } from '@/lib/db/submissions';

interface HealthChecks {
  siteUrlConfigured: boolean;
  canonicalHostConfigured: boolean;
  persistenceDriverConfigured: boolean;
  persistenceDatabaseConfigured: boolean;
  persistenceStrictModeEnabled: boolean;
  newsletterProviderConfigured: boolean;
  contactProviderConfigured: boolean;
  embedProviderConfigured: boolean;
  clerkKeysPaired: boolean;
  clerkProductionKeysSafe: boolean;
  analyticsConfigured: boolean;
  sentryDsnConfigured: boolean;
  adsenseSlotsConfigured: boolean;
}

function has(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

function isGaMeasurementId(value: string | undefined): boolean {
  if (!value) return false;
  return /^G-[A-Z0-9]+$/i.test(value.trim());
}

function hasConfiguredAdSenseSlot(): boolean {
  return (
    has(process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT) ||
    has(process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT) ||
    has(process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR) ||
    has(process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESPONSIVE)
  );
}

function createHealthChecks(): HealthChecks {
  const hasMailchimp = has(process.env.MAILCHIMP_API_KEY) && has(process.env.MAILCHIMP_AUDIENCE_ID);
  const hasConvertKit = has(process.env.CONVERTKIT_API_KEY) && has(process.env.CONVERTKIT_FORM_ID);
  const hasResendAudience = has(process.env.RESEND_API_KEY) && has(process.env.RESEND_AUDIENCE_ID);
  const hasResend = has(process.env.RESEND_API_KEY);
  const hasPostgres = has(process.env.DATABASE_URL) || has(process.env.SUBMISSIONS_POSTGRES_URL);
  const dbDriver = (process.env.SUBMISSIONS_DB_DRIVER ?? '').trim().toLowerCase();
  const clerkPublishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  const clerkSecret = process.env.CLERK_SECRET_KEY?.trim();
  const hasClerkPublishable = has(clerkPublishable);
  const hasClerkSecret = has(clerkSecret);
  const isProductionRuntime =
    (process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? '').trim().toLowerCase() === 'production';
  const clerkUsingTestKeys =
    (clerkPublishable?.startsWith('pk_test_') ?? false) ||
    (clerkSecret?.startsWith('sk_test_') ?? false);

  return {
    siteUrlConfigured: has(process.env.NEXT_PUBLIC_SITE_URL),
    canonicalHostConfigured: has(process.env.NEXT_PUBLIC_CANONICAL_HOST),
    persistenceDriverConfigured: dbDriver === 'postgres' || dbDriver === 'sqlite',
    persistenceDatabaseConfigured: dbDriver === 'sqlite' || hasPostgres,
    persistenceStrictModeEnabled: isSubmissionPersistenceStrictModeEnabled(),
    newsletterProviderConfigured: hasMailchimp || hasConvertKit || hasResendAudience,
    contactProviderConfigured: hasResend,
    embedProviderConfigured: hasConvertKit,
    clerkKeysPaired: hasClerkPublishable === hasClerkSecret,
    clerkProductionKeysSafe: !isProductionRuntime || !clerkUsingTestKeys,
    analyticsConfigured: isGaMeasurementId(process.env.NEXT_PUBLIC_GA_ID),
    sentryDsnConfigured: has(process.env.NEXT_PUBLIC_SENTRY_DSN),
    adsenseSlotsConfigured: hasConfiguredAdSenseSlot(),
  };
}

function createWarnings(checks: HealthChecks): string[] {
  const warnings: string[] = [];

  if (!checks.analyticsConfigured) {
    warnings.push('Google Analytics is not configured.');
  }
  if (!checks.sentryDsnConfigured) {
    warnings.push('Sentry browser DSN is not configured.');
  }
  if (!checks.adsenseSlotsConfigured) {
    warnings.push('AdSense slots are not configured.');
  }
  if (!checks.clerkKeysPaired) {
    warnings.push('Clerk keys are partially configured.');
  }
  if (!checks.clerkProductionKeysSafe) {
    warnings.push('Clerk test keys are configured in production.');
  }

  return warnings;
}

function isHealthy(checks: HealthChecks): boolean {
  return (
    checks.siteUrlConfigured &&
    checks.canonicalHostConfigured &&
    checks.persistenceDriverConfigured &&
    checks.persistenceDatabaseConfigured &&
    checks.newsletterProviderConfigured &&
    checks.contactProviderConfigured &&
    checks.clerkKeysPaired &&
    checks.clerkProductionKeysSafe
  );
}

export async function GET(): Promise<NextResponse> {
  const checks = createHealthChecks();
  const warnings = createWarnings(checks);
  const ok = isHealthy(checks);

  // Log detailed health state for internal monitoring; never expose to caller.
  if (warnings.length > 0 || !ok) {
    console.warn('[health]', { ok, checks, warnings });
  }

  return NextResponse.json(
    {
      ok,
      status: ok ? 'ok' : 'degraded',
      checks,
      warnings,
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
  );
}
