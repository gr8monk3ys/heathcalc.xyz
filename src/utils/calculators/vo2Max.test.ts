import { describe, it, expect } from 'vitest';
import { calculateVo2Max } from './vo2Max';

describe('VO2 Max Calculator', () => {
  it('calculates VO2 max', () => {
    const result = calculateVo2Max({
      gender: 'male',
      age: 30,
      weightKg: 75,
      walkTimeMinutes: 15,
      heartRate: 130,
    });
    expect(result.vo2Max).toBeGreaterThan(0);
  });
});
