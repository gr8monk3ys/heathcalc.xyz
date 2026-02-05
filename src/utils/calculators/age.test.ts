import { describe, it, expect } from 'vitest';
import { calculateAge } from './age';

describe('Age Calculator', () => {
  it('calculates years, months, and days', () => {
    const result = calculateAge('2000-01-01', '2025-01-01');
    expect(result.years).toBe(25);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
    expect(result.totalDays).toBeGreaterThan(9000);
  });
});
