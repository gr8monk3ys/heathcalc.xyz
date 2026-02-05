import { describe, it, expect } from 'vitest';
import { calculateBodyFrameSize } from './bodyFrameSize';

describe('Body Frame Size Calculator', () => {
  it('returns a category from height and wrist', () => {
    const result = calculateBodyFrameSize({ gender: 'female', heightCm: 165, wristCm: 15 });
    expect(result.category).toBeTruthy();
  });
});
