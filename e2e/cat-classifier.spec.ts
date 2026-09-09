import { expect, test } from '@playwright/test';

test('classifies a JPEG image as a cat', async ({ page }) => {
  await page.goto('/');

  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Choose a JPEG image' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('e2e/fixtures/my-cat.jpg');

  await page.getByRole('button', { name: 'Classify image' }).click();

  await expect(
    page.getByRole('status', {
      name: 'Classification in progress',
    }),
  ).toBeVisible();

  const result = page.getByRole('status');

  await expect(result).toBeVisible();
  await expect(result).toContainText("It's a cat");

  await page.getByRole('button', { name: 'Start over' }).click();

  await expect(
    page.getByRole('button', { name: 'Choose a JPEG image' }),
  ).toBeVisible();
});
