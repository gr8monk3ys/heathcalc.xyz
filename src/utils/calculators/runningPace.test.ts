import { describe, it, expect } from 'vitest';
import { calculateRunningPace } from './runningPace';

describe('Running Pace Calculator', () => {
  it('calculates pace and speed', () => {
    const result = calculateRunningPace({
      distance: 5,
      distanceUnit: 'km',
      hours: 0,
      minutes: 25,
      seconds: 0,
    });
    expect(result.pacePerKm).toBeTruthy();
    expect(result.speedKph).toBeGreaterThan(0);
  });
});
