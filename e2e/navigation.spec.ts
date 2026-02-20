import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('home page loads with main heading', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', {
        name: /free health calculators/i,
      })
    ).toBeVisible();
  });

  test('/calculators page loads with calculator categories', async ({ page }) => {
    await page.goto('/calculators');
    await expect(page.getByRole('heading', { name: /Calculator Categories/i })).toBeVisible();
    await expect(page.getByText('View calculators →').first()).toBeVisible();
  });

  test('/blog page loads with article sections', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByText('Guides & Research').first()).toBeVisible();
  });

  test('/bmi page loads with the calculator form', async ({ page }) => {
    await page.goto('/bmi');
    await expect(page.getByRole('heading', { name: /BMI Calculator/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calculate', exact: true })).toBeVisible();
  });
});
