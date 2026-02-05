import { describe, it, expect } from 'vitest';
import { calculateRestingHeartRate } from './restingHeartRate';

describe('Resting Heart Rate Calculator', () => {
  it('categorizes resting heart rate', () => {
    const result = calculateRestingHeartRate(55);
    expect(result.category).toBe('Athletic / Low');
  });
});
