import { describe, it, expect } from 'vitest';
import { calculateBodySurfaceArea } from './bodySurfaceArea';

describe('Body Surface Area Calculator', () => {
  it('calculates BSA using height and weight', () => {
    const result = calculateBodySurfaceArea(180, 80);
    expect(result.bsa).toBeGreaterThan(1.5);
    expect(result.bsa).toBeLessThan(2.3);
  });
});
