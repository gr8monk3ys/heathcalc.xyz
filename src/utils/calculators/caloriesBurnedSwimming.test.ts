import { describe, it, expect } from 'vitest';
import { calculateCaloriesBurnedSwimming } from './caloriesBurnedSwimming';

describe('Calories Burned Swimming Calculator', () => {
  it('returns calories for swimming intensity', () => {
    const result = calculateCaloriesBurnedSwimming(70, 30, 'moderate');
    expect(result.calories).toBeGreaterThan(0);
  });
});
