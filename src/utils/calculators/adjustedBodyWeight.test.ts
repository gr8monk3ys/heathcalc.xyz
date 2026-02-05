import { describe, it, expect } from 'vitest';
import { calculateAdjustedBodyWeight } from './adjustedBodyWeight';

describe('Adjusted Body Weight Calculator', () => {
  it('calculates ideal and adjusted body weight', () => {
    const result = calculateAdjustedBodyWeight({ gender: 'male', heightCm: 180, weightKg: 100 });
    expect(result.idealBodyWeightKg).toBeGreaterThan(0);
    expect(result.adjustedBodyWeightKg).toBeGreaterThan(0);
  });
});
