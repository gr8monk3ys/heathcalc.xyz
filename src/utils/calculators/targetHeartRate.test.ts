import { describe, it, expect } from 'vitest';
import { calculateTargetHeartRate } from './targetHeartRate';

describe('Target Heart Rate Calculator', () => {
  it('calculates target range from age', () => {
    const result = calculateTargetHeartRate({ age: 30, intensityMin: 50, intensityMax: 85 });
    expect(result.maxHeartRate).toBe(190);
    expect(result.targetMin).toBeGreaterThan(0);
  });
});
