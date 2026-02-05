import { describe, it, expect } from 'vitest';
import { calculateBMRResult } from './bmr';

describe('BMR Calculator', () => {
  it('calculates BMR result', () => {
    const result = calculateBMRResult({
      gender: 'male',
      age: 30,
      heightCm: 180,
      weightKg: 75,
      formulaId: 'mifflin_st_jeor',
    });
    expect(result.bmr).toBeGreaterThan(0);
  });
});
