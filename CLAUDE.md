# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HealthCheck is a Next.js 16 health calculator application with 52 calculators and 66+ blog posts. Built with TypeScript, React 19, and TailwindCSS v4.

## Development Commands

This project uses **Bun** as the package manager. Install with `bun install` (lockfile: `bun.lock`). Bun may not be on PATH in sandboxed shells — use `export PATH="$HOME/.bun/bin:$PATH"` if commands are not found.

```bash
# Development
bun run dev                    # Start dev server at localhost:3000
bun run build                  # Build for production
bun run start                  # Start production server (requires build first)

# Unit tests (Vitest, jsdom environment)
bun run test                   # Run all 1712 unit tests across 89 files
bun run test -- --run          # Run once (CI mode, no watch)
bun run test -- src/utils/calculators/bmi.test.ts  # Run single file

# E2E tests (Playwright, separate from Vitest)
bun run test:e2e               # Run all 84 E2E tests (requires no server running)
npx playwright install chromium  # Install browser binary (first time only)

# Code quality
bun run lint                   # ESLint
bun run lint:fix               # Auto-fix lint errors
bun run format                 # Prettier write
bun run type-check             # TypeScript check
bun run validate               # All checks + tests
```

## Architecture

### Route Groups

All user-facing routes live under two route groups in `src/app/`:

- `(default)/` — English routes. All calculator pages, blog, static pages.
- `(localized)/[locale]/` — Locale-prefixed mirrors (e.g. `/es/bmi`). These pages re-export from their `(default)` counterparts; translation is incomplete and non-English paths redirect to English via middleware.

Calculator pages are client components (`'use client'`), all others are server components.

### Calculator Registry

`src/constants/calculatorCatalog.ts` is the **single source of truth** for all 52 calculators. It exports:

- `CALCULATOR_CATALOG` — full list with slug, title, description, category, hub assignment
- `CALCULATOR_HUBS` — the 10 category hub pages

The dynamic sitemap (`src/app/(default)/sitemap.ts`) generates `/sitemap.xml` from this catalog automatically. Do **not** maintain a static `public/sitemap.xml`.

### Adding a New Calculator

1. Add an entry to `CALCULATOR_CATALOG` in `src/constants/calculatorCatalog.ts`
2. Create route folder `src/app/(default)/[slug]/` with `page.tsx` + `layout.tsx`
3. Add types in `src/types/[name].ts`
4. Add calculation logic + tests in `src/utils/calculators/[name].ts` + `[name].test.ts`
5. Add constants in `src/constants/[name].ts`
6. Create components in `src/components/calculators/[name]/`
7. Add API re-export in `src/app/(default)/api/[name]/route.ts`
8. Add the slug to `e2e/calculators-all.spec.ts` (`CALCULATOR_SLUGS` array)

The sitemap updates automatically from step 1.

### Calculation Logic

All calculation logic lives in `src/utils/calculators/`. Key shared exports from `tdee.ts`:

- `calculateBMR()` and `calculateTDEE()` — imported by `calorieDeficit.ts`, `weightManagement.ts`, `maximumFatLoss.ts`, and others. Don't re-implement these.

### Input Validation

Always use `src/utils/validation.ts`:

- `validateAge()`, `validateHeight()`, `validateWeight()`, `validateWaist()`, etc.
- All return `{ isValid: boolean, error?: string, sanitized?: number }`
- `VALIDATION_RANGES` has the min/max bounds.

### Unit Conversions

Single source of truth: `src/utils/conversions.ts`. Do not add conversion logic elsewhere.

### Shared Calculator Hooks

`src/hooks/` contains shared logic used across calculator pages:

- `useCalculatorForm` — primary hook for form state, validation, submission, reset
- `useCalculatorUnits` — metric/imperial toggle tied to `PreferencesContext`
- `useFormWithValidation` — lower-level hook for form field validation
- `useSavedResultsManager` — handles saving/loading results via Supabase or localStorage
- `useLocalStorage` — typed localStorage access

### State Management

Two React Contexts in `src/app/(default)/layout.tsx`:

- `PreferencesContext` — units (metric/imperial), dark mode, persisted to localStorage
- `SavedResultsContext` — calculator result history, syncs to Supabase when authenticated

### Database Layer

`src/lib/db/` contains two modules that support a **dual-backend** pattern (PostgreSQL via `pg` or SQLite for local dev):

- `submissions.ts` — newsletter, contact, embed-request form submissions with retention sweeps
- `savedResults.ts` — user saved calculator results (`user_saved_results` table, JSONB data column)

Connection strings: `SUBMISSIONS_POSTGRES_URL`, `SAVED_RESULTS_POSTGRES_URL`, `DATABASE_URL`. Driver selection via `SUBMISSIONS_DB_DRIVER` env var.

### Auth

Supabase auth with magic link (email OTP). `src/lib/supabase/` contains client helpers. Row Level Security is enabled on saved results — users can only read/write their own rows.

### Blog System

Blog posts live in `src/app/(default)/blog/[slug]/`. Adding a post requires updating **4 places**:

1. `src/app/(default)/blog/page.tsx` — `blogPosts` array (index listing)
2. `src/app/(default)/blog/[slug]/page.tsx` — `BLOG_POSTS` map + `AFFILIATE_BLOG_SLUGS` set
3. `src/constants/affiliates.ts` — for affiliate posts: products, guides, link mappings
4. `src/constants/blogMetadata.ts` — SEO metadata map (consumed by `blog/[slug]/layout.tsx`)

Blog images: `/public/images/blog/[slug].jpg` at 1200×630px.
Amazon affiliate tag: `gr8monk3ys-20`. Link format: `https://www.amazon.com/dp/ASIN?tag=gr8monk3ys-20`

### Component Organization

```
src/components/
├── ui/                     # Reusable primitives (buttons, cards, inputs)
├── calculators/            # Per-calculator result and display components
├── ReviewedBy.tsx          # Editorial reviewer byline
├── MethodologyBadge.tsx    # Methodology source badge
└── ErrorBoundary.tsx       # HOC: withErrorBoundary
```

### SEO

- Per-page metadata in `layout.tsx`. Blog SEO centralized in `src/constants/blogMetadata.ts`.
- Structured data: `GlobalStructuredData` component (Schema.org JSON-LD)
- Dynamic XML sitemap: `src/app/(default)/sitemap.ts` (serves `/sitemap.xml`)
- HTML sitemap page does **not** exist — the `sitemap.ts` metadata route owns `/sitemap`

### Middleware

`src/middleware.ts` — trailing slash removal, www → non-www redirects (301), locale detection and routing.

### CI/CD

`.github/workflows/ci.yml` runs a single `quality-checks` job: format → lint → type-check → unit tests → build → server start → smoke checks → E2E tests. Playwright report uploaded as artifact on failure. Lighthouse runs on PRs only. Security audit runs in parallel.

## Testing

### Unit tests (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { calculateBMI } from './bmi';

describe('BMI Calculation', () => {
  it('calculates correctly', () => {
    expect(calculateBMI({ weight: 70, height: 175 }).bmi).toBeCloseTo(22.86, 2);
  });
});
```

Vitest config: `vitest.config.mjs`. Excludes `e2e/` (Playwright files must not be picked up by Vitest). Zod v4 requires `server.deps.inline: ['zod']` — already configured.

### E2E tests (Playwright)

- `e2e/calculators-all.spec.ts` — smoke test for all 52 calculator slugs (h1 visible, no 404/500)
- `e2e/bmi.spec.ts`, `tdee.spec.ts`, `body-fat.spec.ts` — full interaction tests
- `e2e/navigation.spec.ts`, `calculators.spec.ts` — page-level smoke tests

**Selector discipline**: Playwright `getByLabel`/`getByRole` do **substring matching** by default. Always use `{ exact: true }` for short common words (`'Age'`, `'Male'`, `'Calculate'`) — "Language" contains "age", "Female" contains "male", FAQ buttons contain "calculate".

## Known Issues

### Code Duplication

Calculator pages still reimplement some form handling. `useCalculatorForm` in `src/hooks/` was introduced to address this but not all calculators have been migrated.
