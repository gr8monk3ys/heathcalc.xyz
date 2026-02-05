import { describe, it, expect } from 'vitest';
import { calculateCaloriesBurnedWalking } from './caloriesBurnedWalking';

describe('Calories Burned Walking Calculator', () => {
  it('returns calories for a walking speed', () => {
    const result = calculateCaloriesBurnedWalking(70, 30, 3);
    expect(result.calories).toBeGreaterThan(0);
  });
});
