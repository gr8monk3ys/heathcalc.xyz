import { describe, it, expect } from 'vitest';
import { calculateStepsToCalories } from './stepsToCalories';

describe('Steps to Calories Calculator', () => {
  it('returns calories for steps and duration', () => {
    const result = calculateStepsToCalories(8000, 30, 'in', 60, 70);
    expect(result.calories).toBeGreaterThan(0);
  });
});
