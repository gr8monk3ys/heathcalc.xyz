import { describe, it, expect } from 'vitest';
import { calculateLeanBodyMass } from './leanBodyMass';

describe('Lean Body Mass Calculator', () => {
  it('calculates lean mass using Boer formula', () => {
    const result = calculateLeanBodyMass({
      gender: 'male',
      weightKg: 80,
      heightCm: 180,
    });

    expect(result.leanMassKg).toBeGreaterThan(0);
    expect(result.leanMassLb).toBeGreaterThan(0);
  });
});
