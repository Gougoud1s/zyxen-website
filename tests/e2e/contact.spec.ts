import { expect, test } from '@playwright/test';

const MOCK = 'http://localhost:4597';
test.skip(!!process.env.E2E_BASE_URL, 'needs the local mocks for Resend and Notion');

type Email = { to: string[]; html: string };
type Lead = { body: { properties: Record<string, { email?: string; url?: string; select?: { name: string } }> } };

test('contact form: happy path sends both emails and creates the Notion lead', async ({ page, request }, info) => {
  test.skip(!['chromium-1440', 'chromium-390', 'webkit-1440'].includes(info.project.name), 'desktop, phone and Safari are enough');
  const email = `e2e-${info.project.name}@zyxen.gr`;
  await page.goto('/contact?offer=commerce');
  await expect(page.getByRole('radio', { name: 'High-Scale E-Commerce' })).toBeChecked();
  await page.getByLabel('Your name').fill('Playwright Test');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Your current website (optional)').fill('playwright-shop.gr');
  await page.getByLabel('Budget range (optional)').selectOption('€5k — €10k');
  await page.getByLabel('What would you like to achieve?').fill('A new store for our catalogue.');
  await page.waitForTimeout(3200); // the API rejects anything sent within 3 s of page load
  await page.getByRole('button', { name: /Send enquiry/ }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Thank you' })).toBeVisible();

  const calls = (await (await request.get(`${MOCK}/__calls`)).json()) as { emails: Email[]; notion: Lead[] };
  expect(calls.emails.filter((e) => e.to.includes(email) || e.html.includes(email))).toHaveLength(2);
  const lead = calls.notion.find((n) => n.body.properties.Email.email === email);
  expect(lead?.body.properties.Website.url).toBe('https://playwright-shop.gr/');
  expect(lead?.body.properties.Segment.select?.name).toBe('Online shop');
});

test('contact form: an empty submit stays on the form and sends nothing', async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium-1440', 'one browser is enough');
  await page.goto('/contact');
  await page.getByRole('button', { name: /Send enquiry/ }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole('status').filter({ hasText: 'Thank you' })).toHaveCount(0);
});
