import { describe, it, expect } from 'vitest';
import { calculateStepsToMiles } from './stepsToMiles';

describe('Steps to Miles Calculator', () => {
  it('converts steps to miles', () => {
    const result = calculateStepsToMiles(2000, 30, 'in');
    expect(result.miles).toBeGreaterThan(0.5);
  });
});
