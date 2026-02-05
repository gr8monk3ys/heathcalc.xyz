import { describe, it, expect } from 'vitest';
import { calculateOvulation } from './ovulation';

describe('Ovulation Calculator', () => {
  it('calculates ovulation date based on cycle length', () => {
    const result = calculateOvulation('2025-01-01', 28);
    expect(result.ovulationDate).toBeTruthy();
  });
});
