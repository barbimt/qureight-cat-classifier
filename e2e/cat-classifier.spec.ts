import { expect, test } from '@playwright/test';

test('classifies a JPEG image as a cat', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('JPEG image').setInputFiles('e2e/fixtures/my-cat.jpg');

  await page.getByRole('button', { name: 'Classify image' }).click();

  await expect(
    page.getByRole('status', {
      name: 'Classification in progress',
    }),
  ).toBeVisible();

  const result = page.getByRole('alert');

  await expect(result).toBeVisible();
  await expect(result).toContainText("It's a cat");

  await page.getByRole('button', { name: 'Classify another image' }).click();

  await expect(
    page.getByRole('button', { name: 'Choose JPEG image' }),
  ).toBeVisible();
});
