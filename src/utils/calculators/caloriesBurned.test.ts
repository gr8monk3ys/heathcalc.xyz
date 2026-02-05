import { describe, it, expect } from 'vitest';
import { calculateCaloriesBurned } from './caloriesBurned';

describe('Calories Burned Calculator', () => {
  it('returns calories based on METs', () => {
    const result = calculateCaloriesBurned(70, 30, 8, 'Running');
    expect(result.calories).toBeGreaterThan(0);
    expect(result.caloriesPerHour).toBeGreaterThan(result.calories);
  });
});
