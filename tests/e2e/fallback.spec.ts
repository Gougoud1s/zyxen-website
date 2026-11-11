import { expect, test } from '@playwright/test';

const scenes = ['/', '/projects', '/services', '/websites', '/about', '/contact'];

test('without WebGL every scene shows its poster and no canvas', async ({ page }, info) => {
  test.skip(info.project.name !== 'no-webgl');
  for (const path of scenes) {
    await page.goto(path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await expect(page.locator('[role=img] canvas'), path).toHaveCount(0);
    const poster = page.locator('[role=img] img').first();
    await expect(poster, path).toBeVisible();
    expect(await poster.evaluate((img: HTMLImageElement) => img.naturalWidth), path).toBeGreaterThan(0);
  }
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('shows posters only and the full statement text', async ({ page }, info) => {
    test.skip(info.project.name !== 'chromium-1440');
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await expect(page.locator('[role=img] canvas')).toHaveCount(0);
    // Every statement word at full ink colour, none dimmed by the scroll reveal.
    const colours = await page
      .locator('p span[aria-hidden="true"]')
      .evaluateAll((spans) => [...new Set(spans.map((s) => getComputedStyle(s).color))]);
    expect(colours).toEqual(['rgb(237, 235, 230)']);
  });
});

test('with WebGL the live scene replaces the poster and the list drives it', async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium-1440');
  await page.goto('/projects', { waitUntil: 'networkidle' });
  // The scene goes live on its own once the page is idle; no interaction needed.
  await expect(page.locator('[role=img] canvas')).toHaveCount(1, { timeout: 15_000 });
  await page.getByRole('button', { name: /^Creta Maris/ }).click();
  await expect(page.getByRole('button', { name: /^Creta Maris/ })).toHaveAttribute('aria-current', 'true');
  await expect(page.getByText('Creta Maris case study')).toBeVisible();
});
