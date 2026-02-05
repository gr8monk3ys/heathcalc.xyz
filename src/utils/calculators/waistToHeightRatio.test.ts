import { describe, it, expect } from 'vitest';
import { calculateWaistToHeightRatio } from './waistToHeightRatio';

describe('Waist-to-Height Ratio Calculator', () => {
  it('returns a ratio and category', () => {
    const result = calculateWaistToHeightRatio(80, 170);
    expect(result.ratio).toBeCloseTo(0.47, 2);
    expect(result.category).toBeTruthy();
  });
});
