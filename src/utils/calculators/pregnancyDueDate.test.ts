import { describe, it, expect } from 'vitest';
import { calculatePregnancyDueDate } from './pregnancyDueDate';

describe('Pregnancy Due Date Calculator', () => {
  it('calculates due date from LMP', () => {
    const result = calculatePregnancyDueDate('2025-01-01', 'lmp');
    expect(result.dueDate).toBeTruthy();
  });

  it('calculates due date from conception', () => {
    const result = calculatePregnancyDueDate('2025-01-01', 'conception');
    expect(result.dueDate).toBeTruthy();
  });
});
