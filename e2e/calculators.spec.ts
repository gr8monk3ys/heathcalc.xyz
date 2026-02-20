import { test, expect } from '@playwright/test';

test.describe('Calculators Index', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculators');
  });

  test('page renders the Calculator Categories heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Calculator Categories/i })).toBeVisible();
  });

  test('page displays multiple hub cards', async ({ page }) => {
    const viewLinks = page.getByText('View calculators →');
    await expect(viewLinks.first()).toBeVisible();
    const count = await viewLinks.count();
    expect(count).toBeGreaterThan(1);
  });

  test('clicking a hub card navigates to that hub page', async ({ page }) => {
    const firstCard = page.locator('a[href^="/calculators/"]').first();
    const href = await firstCard.getAttribute('href');
    await firstCard.click();

    await expect(page).not.toHaveURL('/calculators');

    if (href) {
      await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });

  test('/bmi is reachable and functional', async ({ page }) => {
    await page.goto('/bmi');
    await expect(page.getByRole('heading', { name: /BMI Calculator/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calculate', exact: true })).toBeVisible();
  });

  test('/tdee is reachable and functional', async ({ page }) => {
    await page.goto('/tdee');
    await expect(page.getByRole('heading', { name: /TDEE Calculator/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calculate', exact: true })).toBeVisible();
  });

  test('/body-fat is reachable and functional', async ({ page }) => {
    await page.goto('/body-fat');
    await expect(page.getByRole('heading', { name: /Body Fat Calculator/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calculate', exact: true })).toBeVisible();
  });
});
