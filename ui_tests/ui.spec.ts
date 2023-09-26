import { test, expect, Page } from '@playwright/test';

// Array of all menu screen ids
const menuScreens: string[] = [
  '#main-menu',
  '#scores',
  '#how-to-play',
  '#choose-difficulty',
  '#game-over',
];

// Check that the selected id div is vissible and all other ones are hidden
async function checkVisibility(page: Page, idToCheck: string): Promise<void> {
  await Promise.all(
    menuScreens.map(async (id) => {
      if (id === idToCheck) {
        await expect(page.locator(id)).toBeVisible();
      } else {
        await expect(page.locator(id)).toBeHidden();
      }
    })
  );
}

test('using UI', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');

  await checkVisibility(page, '#main-menu');

  await page.getByRole('button', { name: 'High Scores' }).click();

  await checkVisibility(page, '#scores');

  await page.getByRole('button', { name: 'Back' }).click();

  await page.getByRole('button', { name: 'How to Play' }).click();

  await checkVisibility(page, '#how-to-play');

  await page.getByRole('button', { name: 'Back' }).click();

  await page.getByRole('button', { name: 'Play', exact: true }).click();

  await checkVisibility(page, '#choose-difficulty');

  await page.getByRole('button', { name: 'Hard' }).click();

  // wait for Panda to defeat the player
  await page.locator('#game-over').waitFor();

  await checkVisibility(page, '#game-over');

  await page.getByRole('button', { name: 'Main menu' }).click();

  await checkVisibility(page, '#main-menu');
});
