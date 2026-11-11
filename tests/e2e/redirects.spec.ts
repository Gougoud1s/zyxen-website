import { expect, test } from '@playwright/test';

const cases: Record<string, string> = {
  '/el/websites': '/websites',
  '/en/websites': '/websites',
  '/el': '/',
  '/en/projects/led7': '/projects/led7',
  '/el/services/ai-integrations': '/services/ai-integrations',
  '/technologies': '/services',
  '/audit': '/contact',
  '/free-website-review': '/contact',
};

test('old URLs answer 301 with the right target', async ({ request }, info) => {
  test.skip(info.project.name !== 'chromium-1440', 'HTTP-level check, one browser is enough');
  for (const [from, to] of Object.entries(cases)) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(301);
    expect(new URL(res.headers()['location'], 'http://x').pathname, from).toBe(to);
  }
});
