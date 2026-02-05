import { describe, it, expect } from 'vitest';
import { calculateArmyBodyFat } from './armyBodyFat';

describe('Army Body Fat Calculator', () => {
  it('calculates body fat percentage for men', () => {
    const result = calculateArmyBodyFat({
      gender: 'male',
      heightIn: 70,
      waistIn: 34,
      neckIn: 15,
    });
    expect(result.bodyFatPercentage).toBeGreaterThan(0);
  });
});
