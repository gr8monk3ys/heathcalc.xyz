import { describe, it, expect } from 'vitest';
import { calculateIdealWeight } from './idealWeight';

describe('Ideal Weight Calculator', () => {
  it('calculates ideal weight ranges', () => {
    const result = calculateIdealWeight(180, 'male');
    expect(result.formulas.length).toBeGreaterThan(0);
    expect(result.rangeKg.min).toBeLessThanOrEqual(result.rangeKg.max);
  });

  it('returns averages in both units', () => {
    const result = calculateIdealWeight(165, 'female');
    expect(result.averageKg).toBeGreaterThan(0);
    expect(result.averageLb).toBeGreaterThan(0);
  });
});
