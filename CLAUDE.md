# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HealthCheck is a Next.js 16 health calculator application with 6 working calculators and 4 placeholder pages. Built with TypeScript, React 19, and TailwindCSS.

**Working Calculators (6/10):** BMI, TDEE, Body Fat, Body Fat Burn, ABSI, WHR
**Placeholder Pages (4/10):** Calorie Deficit, Weight Management, Maximum Fat Loss, Conversions

## Development Commands

```bash
# Development
npm run dev                    # Start dev server at localhost:3000
npm run build                  # Build for production
npm run start                  # Start production server

# Testing
npm test                       # Run all tests (537 tests across 12 files)
npm test -- --run              # Run tests once (CI mode)
npm run test:watch             # Watch mode
npm run test:coverage          # Run with coverage report
npm test -- src/utils/calculators/bmi.test.ts  # Run single test file

# Code Quality
npm run lint                   # ESLint check
npm run lint:fix               # Auto-fix lint errors
npm run format                 # Format with Prettier
npm run format:check           # Check formatting
npm run type-check             # TypeScript type check
npm run validate               # Run all checks + tests

# Maintenance
npm run clean                  # Remove .next, out, cache
```

Note: Use `npm install --legacy-peer-deps` if you encounter peer dependency conflicts.

## Architecture

### File-Based Routing (Next.js App Router)
- **Calculator routes:** `src/app/[calculator-name]/page.tsx` (client components with `'use client'`)
- **Metadata:** Working calculators use `metadata.ts`, placeholder pages use `layout.tsx`
- **API routes:** `src/app/api/` re-export from `src/utils/calculators/` (no business logic here)

### Calculation Logic (Primary Location)
All calculation logic lives in `src/utils/calculators/`:
- `bmi.ts` - BMI with adult/child support
- `tdee.ts` - Multiple formulas (Mifflin-St Jeor, Harris-Benedict, Katch-McArdle)
- `bodyFat.ts` - Navy method & BMI method
- `bodyFatBurn.ts` - Activity-based calorie burn
- `absi.ts` - ABSI and waist-to-height ratio
- `whr.ts` - Waist-to-hip ratio
- Each has a corresponding `.test.ts` file

### Input Validation
Use `src/utils/validation.ts` for all input validation:
- `validateAge()`, `validateHeight()`, `validateWeight()`, `validateWaist()`, etc.
- All validators return `{ isValid: boolean, error?: string, sanitized?: number }`
- `VALIDATION_RANGES` contains min/max values

### Unit Conversions
Single source of truth: `src/utils/conversions.ts`
- `heightFtInToCm()`, `heightCmToFtIn()`, `weightLbToKg()`, `weightKgToLb()`
- `convertHeight()`, `convertWeight()`, `convertTemperature()`, `convertLength()`
- Do NOT add conversion logic elsewhere

### State Management
Two React Contexts in `src/app/layout.tsx`:
- `PreferencesContext` - User preferences (units, dark mode) persisted to localStorage
- `SavedResultsContext` - Calculator result history

### Component Organization
```
src/components/
├── ui/                         # Reusable primitives (buttons, cards, inputs)
├── calculators/                # Calculator-specific components
│   ├── bmi/                    # BMIResult, BMIUnderstanding, etc.
│   ├── tdee/
│   └── ...
├── Header.tsx, Footer.tsx      # Layout components
└── ErrorBoundary.tsx           # Error handling (use withErrorBoundary HOC)
```

### Types
- Calculator form data and results: `src/types/[calculator-name].ts`
- Common types (Gender, ActivityLevel): `src/types/common.ts`

## Key Patterns

### Adding a New Calculator
1. Create route folder: `src/app/[calculator-name]/`
2. Add `page.tsx` (client component) and `metadata.ts`
3. Create types in `src/types/[calculator-name].ts`
4. Add calculation logic in `src/utils/calculators/[calculator-name].ts`
5. **Add tests** in `src/utils/calculators/[calculator-name].test.ts`
6. Add constants in `src/constants/[calculator-name].ts`
7. Create components in `src/components/calculators/[calculator-name]/`
8. Add API re-export in `src/app/api/[calculator-name].ts`
9. Update `public/sitemap.xml`

### Testing Pattern
Tests use Vitest with jsdom environment:
```typescript
import { describe, it, expect } from 'vitest';
import { calculateBMI } from './bmi';

describe('BMI Calculation', () => {
  it('should calculate BMI correctly', () => {
    const result = calculateBMI({ weight: 70, height: 175 });
    expect(result.bmi).toBeCloseTo(22.86, 2);
  });
});
```

## Infrastructure

### SEO
- Metadata in `metadata.ts` or `layout.tsx` for each page
- Structured data via `GlobalStructuredData` component (Schema.org JSON-LD)
- Sitemap at `public/sitemap.xml`

### Middleware
`src/middleware.ts` handles URL canonicalization, trailing slash removal, www redirects (301)

### PWA
Service worker in `public/sw.js`, manifest at `public/manifest.json`, auto-registered via `PWAInit` component

### Styling
TailwindCSS with neumorphic design tokens in `tailwind.config.js`. Import alias `@/*` maps to `src/*`.

### CI/CD
GitHub Actions workflow at `.github/workflows/ci.yml`:
- Runs on Node 18.x and 20.x
- format:check → lint → type-check → tests → build
- Lighthouse performance checks on PRs
- Security audit

## Known Issues

### Placeholder Pages
4 calculator pages (Calorie Deficit, Weight Management, Maximum Fat Loss, Conversions) have full SEO metadata but show "Coming Soon" content. This creates poor UX when users land from search.

### Bundle Size
Body Fat Burn calculator (`/body-fat-burn`) is ~50% larger than other calculators. Consider auditing dependencies.

### Type Safety
4 remaining `any` types in `src/components/calculators/CalculatorForm.tsx`. These should be properly typed.

### Code Duplication
Each calculator page reimplements form handling (150-260 lines). Consider extracting common form logic.
