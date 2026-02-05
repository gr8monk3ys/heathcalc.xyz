import { describe, it, expect } from 'vitest';
import { calculateWaterIntake } from './waterIntake';

describe('Water Intake Calculator', () => {
  it('calculates baseline intake', () => {
    const result = calculateWaterIntake(70, 'low', 'kg');
    expect(result.liters).toBeGreaterThan(0);
  });

  it('adds activity adjustment', () => {
    const low = calculateWaterIntake(70, 'low', 'kg');
    const high = calculateWaterIntake(70, 'high', 'kg');
    expect(high.totalMl).toBeGreaterThan(low.totalMl);
  });
});
