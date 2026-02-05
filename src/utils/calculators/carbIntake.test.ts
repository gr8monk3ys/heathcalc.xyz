import { describe, it, expect } from 'vitest';
import { calculateCarbIntake } from './carbIntake';

describe('Carb Intake Calculator', () => {
  it('calculates grams from calories and percent', () => {
    const result = calculateCarbIntake(2000, 50);
    expect(result.carbGrams).toBe(250);
  });
});
