import { describe, it, expect } from 'vitest';
import { calculateCaloriesBurnedCycling } from './caloriesBurnedCycling';

describe('Calories Burned Cycling Calculator', () => {
  it('returns calories for a cycling speed', () => {
    const result = calculateCaloriesBurnedCycling(70, 45, 14);
    expect(result.calories).toBeGreaterThan(0);
  });
});
