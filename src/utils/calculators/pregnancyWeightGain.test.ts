import { describe, it, expect } from 'vitest';
import { calculatePregnancyWeightGain } from './pregnancyWeightGain';

describe('Pregnancy Weight Gain Calculator', () => {
  it('returns BMI and ranges', () => {
    const result = calculatePregnancyWeightGain({ heightCm: 165, weightKg: 65 });
    expect(result.bmi).toBeGreaterThan(18);
    expect(result.totalGain.minLb).toBeGreaterThan(0);
  });
});
