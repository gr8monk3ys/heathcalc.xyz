import { describe, it, expect } from 'vitest';
import { calculateFatIntake } from './fatIntake';

describe('Fat Intake Calculator', () => {
  it('calculates grams from calories and percent', () => {
    const result = calculateFatIntake(2000, 30);
    expect(result.fatGrams).toBe(67);
  });
});
