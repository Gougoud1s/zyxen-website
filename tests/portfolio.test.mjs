import assert from 'node:assert/strict';
import { test } from 'node:test';
import puppeteer from 'puppeteer';

const base = process.env.SITE_TEST_URL || 'http://127.0.0.1:5173';
test('portfolio and service proposal journeys', async () => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const width of [1440, 390]) {
      await page.setViewport({ width, height: 1000 });
      for (const slug of ['led7', 'artistishop', 'ips']) {
        await page.goto(`${base}/projects/${slug}`, { waitUntil: 'networkidle0' });
        assert.equal(await page.locator('h1').map(el => el.textContent).wait() !== '', true);
        for (const text of ['The business', 'The need', 'Our contribution', 'The outcome']) {
          assert.ok(await page.$eval('.project-story', (el, value) => el.textContent.includes(value), text));
        }
        assert.equal(await page.$$eval('h1', els => els.length), 1);
        assert.equal(await page.$eval('body', () => document.documentElement.scrollWidth <= innerWidth), true);
        assert.equal(await page.$eval('.project-story', el => el.innerText.includes('%')), false);
        assert.equal(await page.$eval('img[src^="/projects/"]:not([src*="favicon"])', el => el.complete && el.naturalWidth > 0), true);
        if (slug === 'ips') assert.ok(await page.$('a[href="https://redirect.gr"]'));
      }
      await page.goto(`${base}/services`, { waitUntil: 'networkidle0' });
      await page.locator('.offer-choices button:nth-child(2)').click();
      assert.equal(await page.$eval('.offer-choices button:nth-child(2)', el => el.getAttribute('aria-pressed')), 'true');
      assert.match(await page.$eval('#offer-details', el => el.textContent), /Catalogue and customer journey planning/);
      await page.locator('#offer-details .story-button').click();
      await page.waitForSelector('#contact-service');
      assert.equal(await page.$eval('#contact-service', el => el.value), 'High-Scale E-Commerce');
      assert.match(await page.$eval('#contact-details', el => el.value), /e-commerce project/);
      await page.goto(`${base}/services`, { waitUntil: 'networkidle0' });
      await page.locator('.offer-choices button:nth-child(3)').click();
      await page.locator('#offer-details .story-button').click();
      await page.waitForSelector('#contact-service');
      assert.equal(await page.$eval('#contact-service', el => el.value), 'AI Integration & Automation');
      assert.match(await page.$eval('#contact-details', el => el.value), /process I want to improve/);
      await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
      assert.equal(await page.$$eval('h1', els => els.length), 1);
      assert.ok(await page.$('a[href="/projects/led7"]'));
      await page.focus('.offer-choices button:nth-child(2)');
      await page.keyboard.press('Enter');
      assert.equal(await page.$eval('.offer-choices button:nth-child(2)', el => el.getAttribute('aria-pressed')), 'true');
      assert.equal(await page.$eval('body', () => document.documentElement.scrollWidth <= innerWidth), true);
    }
    await page.goto(`${base}/projects/creta-maris`, { waitUntil: 'networkidle0' });
    assert.match(await page.$eval('main', el => el.textContent), /THE CHALLENGE/);
    await page.goto(`${base}/contact?offer=website`, { waitUntil: 'networkidle0' });
    assert.equal(await page.$eval('#contact-service', el => el.value), 'Business website');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
