import { describe, it, expect } from 'vitest';
import { calculateCaloriesBurnedRunning } from './caloriesBurnedRunning';

describe('Calories Burned Running Calculator', () => {
  it('returns calories for a running speed', () => {
    const result = calculateCaloriesBurnedRunning(70, 30, 6);
    expect(result.calories).toBeGreaterThan(0);
  });
});
