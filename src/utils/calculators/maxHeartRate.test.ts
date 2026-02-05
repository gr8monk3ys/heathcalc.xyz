import { describe, it, expect } from 'vitest';
import { calculateMaxHeartRate } from './maxHeartRate';

describe('Max Heart Rate Calculator', () => {
  it('calculates max heart rate from age', () => {
    const result = calculateMaxHeartRate(30);
    expect(result.traditional).toBe(190);
    expect(result.tanaka).toBeGreaterThan(180);
  });
});
