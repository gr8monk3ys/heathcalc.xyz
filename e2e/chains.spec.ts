import { test, expect } from '@playwright/test';

test.describe('Calculator Chains', () => {
  test('chains page renders all 4 chains', async ({ page }) => {
    await page.goto('/chains');
    await expect(
      page.getByRole('heading', { name: 'Guided Health Workflows', exact: true })
    ).toBeVisible();
    await expect(page.getByText('Weight Loss Journey', { exact: true })).toBeVisible();
    await expect(page.getByText('Body Composition Deep Dive', { exact: true })).toBeVisible();
    await expect(page.getByText('Fitness Baseline', { exact: true })).toBeVisible();
    await expect(page.getByText('Nutrition Planning', { exact: true })).toBeVisible();
  });

  test('starting a chain navigates to first calculator', async ({ page }) => {
    await page.goto('/chains');
    await page.getByText('Weight Loss Journey', { exact: true }).click();
    await expect(page).toHaveURL('/bmi');
    // Chain progress bar should show the chain name
    await expect(page.getByText('Weight Loss Journey')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Exit guided workflow' })).toBeVisible();
  });

  test('chain auto-start via query param', async ({ page }) => {
    await page.goto('/chains?start=fitness-baseline');
    await expect(page).toHaveURL('/max-heart-rate');
  });

  test('homepage shows guided workflows section', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Guided Health Workflows', exact: true })
    ).toBeVisible();
  });

  test('calculator page shows chain suggestions when not in chain', async ({ page }) => {
    await page.goto('/bmi');
    // BMI participates in 2 chains: Weight Loss Journey and Body Composition Deep Dive
    // The "Guided Workflows" heading appears in the chain suggestions section
    await expect(page.getByText('Guided Workflows').first()).toBeVisible();
  });

  test('exiting a chain removes progress bar', async ({ page }) => {
    await page.goto('/chains?start=fitness-baseline');
    await expect(page).toHaveURL('/max-heart-rate');
    await expect(page.getByRole('button', { name: 'Exit guided workflow' })).toBeVisible();
    await page.getByRole('button', { name: 'Exit guided workflow' }).click();
    await expect(page.getByRole('button', { name: 'Exit guided workflow' })).not.toBeVisible();
  });
});
