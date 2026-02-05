import { describe, it, expect } from 'vitest';
import { calculateCalorieNeeds } from './calorie';

describe('Calorie Calculator', () => {
  it('calculates calorie targets from inputs', () => {
    const result = calculateCalorieNeeds({
      gender: 'male',
      age: 30,
      weightKg: 80,
      heightCm: 180,
      activityLevel: 'moderately_active',
    });

    expect(result.bmr).toBeGreaterThan(0);
    expect(result.tdee).toBeGreaterThan(result.bmr);
    expect(result.dailyCalories.maintain).toBeGreaterThan(0);
  });
});
