import { expect, test } from '@playwright/test';

const phones = ['chromium-390', 'webkit-390'];

test('a phone reporting 4 CPU cores still gets the live 3D scene after a touch', async ({ page }, info) => {
  test.skip(!phones.includes(info.project.name), 'phone projects only');
  // iPhones and many Androids report 4 cores or fewer; that alone must not mean "low-end".
  await page.addInitScript(() => Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 }));
  await page.goto('/projects', { waitUntil: 'load' });
  expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
  await page.touchscreen.tap(200, 700);
  await expect(page.locator('[role=img] canvas')).toHaveCount(1, { timeout: 20_000 });
});

test('phone navigation: one-line header with a menu that opens, closes and navigates', async ({ page }, info) => {
  test.skip(!phones.includes(info.project.name), 'phone projects only');
  await page.goto('/', { waitUntil: 'load' });
  const header = page.locator('header').first();
  expect((await header.boundingBox())!.height).toBeLessThanOrEqual(84);
  const toggle = page.getByRole('button', { name: 'Menu' });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  await toggle.click();
  const menu = page.getByRole('dialog', { name: 'Menu' });
  await expect(menu).toBeVisible();
  for (const name of ['Work', 'Services', 'Websites', 'About', 'Contact']) {
    await expect(menu.getByRole('link', { name, exact: true })).toBeVisible();
  }
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();

  await toggle.click();
  await menu.getByRole('link', { name: 'Services', exact: true }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
});

test('desktop keeps the inline navigation', async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium-1440');
  await page.goto('/', { waitUntil: 'load' });
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Work' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
});
