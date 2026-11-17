// Captures the case-study screenshots in public/projects from each project's live site.
//
// Each shot is taken at 2x pixel density, so a 1280x800 view becomes a 2560x1600 image that stays
// sharp on wide and high-DPI screens. Non-essential cookies are declined, never accepted.
//
//   node scripts/capture-project-screenshots.mjs                 all projects in src/lib/data.js
//   node scripts/capture-project-screenshots.mjs --only led7,ips some of them
//   node scripts/capture-project-screenshots.mjs --review <dir>  also keep full-size PNGs there to review
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { projects } from '../src/lib/data.js';

const VIEWPORT = { width: 1280, height: 800 };
const SCALE = 2;
const NAV_TIMEOUT_MS = 45_000;
const SETTLE_MS = 3_000;
// Masters are near-lossless: Next.js compresses once when it serves them.
const MASTER_QUALITY = 95;
// The 3D project ring on /projects paints each screenshot into a 1024px-wide texture.
const RING_WIDTH = 1024;
const RING_QUALITY = 85;

// Per-site framing, chosen by looking at each site so the shot shows real, representative content.
// scrollY: CSS pixels to scroll before the shot. path: page to shoot instead of the project URL.
// videoTime: second of the hero video to pause on.
// viewport: a wider window for sites whose layout breaks at 1280px (keep 16:10).
// settleMs: wait before the shot (the default suits most sites; slideshows are handled by stillScreenshot).
// hide: selectors for overlays that cover the page. hideText: hide the floating box (popup, bar) holding this text.
// Overlays are hidden, never answered: nothing is accepted, declared or signed up for on the visitor's behalf.
const framing = {
  // At 1280px LED7's top menu wraps onto a second line; 1440x900 keeps the same 16:10 shape.
  led7: { hideText: /Κέρδισε 5%/, viewport: { width: 1440, height: 900 } },
  artistishop: { hideText: /We use cookies to improve/ },
  paxisarkia: { hideText: /Κατεβάστε την εφαρμογή/ },
  dannemann: { hide: ['.age-popup'] },
  // The hero is a 79s video; at 22s it shows the aerial view of the pools with no title over it.
  'creta-maris': { videoTime: 22 },
};

// Matches decline wording only: "απορρ" alone would also match privacy-policy links ("Πολιτική Απορρήτου").
const DECLINE = /reject|decline|deny|only necessary|necessary only|essential only|απόρριψη|απορρίπτω|απορρίψτε|μόνο (τα )?απαραίτητα|άρνηση/i;
const BANNERS = [
  '#CybotCookiebotDialog', '#onetrust-banner-sdk', '#onetrust-consent-sdk', '.cky-consent-container', '.cky-overlay',
  '#cmplz-cookiebanner-container', '.cmplz-cookiebanner', '#cookie-law-info-bar', '#moove_gdpr_cookie_info_bar',
  '.cc-window', '#cookie-notice', '.cookie-banner', '#cookieConsent', '.iubenda-cs-container',
  // Shadow-DOM widgets, which hideFloatingWidgets cannot see into: WPConsent, RateParity price box.
  '#wpconsent-container', '#rp-allinone',
];

const { values } = parseArgs({ options: { only: { type: 'string' }, review: { type: 'string' } } });
const wanted = values.only ? new Set(values.only.split(',').map((s) => s.trim())) : null;
const selected = projects.filter((p) => p.image && (!wanted || wanted.has(p.slug)));
if (wanted && selected.length !== wanted.size) {
  const known = new Set(projects.map((p) => p.slug));
  throw new Error(`Unknown project slug(s): ${[...wanted].filter((s) => !known.has(s)).join(', ')}`);
}

async function declineCookies(page) {
  for (const frame of page.frames()) {
    // Some banners use <a> without href, which has no link role, so match on text instead.
    const button = frame.locator('button, a, [role=button]').filter({ hasText: DECLINE }).first();
    if (await button.isVisible().catch(() => false)) {
      await button.click({ timeout: 5_000 }).catch(() => {});
      return true;
    }
  }
  return false;
}

// Hides the outermost fixed or absolute box around the given text, plus any full-screen backdrop.
// Runs in the page; Playwright passes a single argument, so the regex comes as [source, flags].
function hideFloatingText([source, flags]) {
  const pattern = new RegExp(source, flags);
  const floating = (el) => ['fixed', 'absolute', 'sticky'].includes(getComputedStyle(el).position);
  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length > 3 || !pattern.test(el.textContent ?? '')) continue;
    let box = null;
    for (let node = el; node && node !== document.body; node = node.parentElement) if (floating(node)) box = node;
    if (box) box.style.setProperty('display', 'none', 'important');
  }
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    const covers = r.width >= innerWidth * 0.95 && r.height >= innerHeight * 0.95;
    if (covers && getComputedStyle(el).position === 'fixed' && !el.textContent?.trim()) el.style.setProperty('display', 'none', 'important');
  }
}

// Runs in the page. Hides floating widgets pinned to the screen: cookie-settings icons, chat buttons,
// accessibility buttons, toasts, reCAPTCHA badges, price widgets. Full-width bars (headers) and
// full-screen backgrounds are kept, because they are part of the site's own layout.
function hideFloatingWidgets() {
  const viewportArea = innerWidth * innerHeight;
  // Widgets such as RateParity render inside shadow DOM and force themselves visible, so walk shadow roots too.
  const visit = (root) => {
    for (const el of root.querySelectorAll('*')) {
      if (el.shadowRoot) visit(el.shadowRoot);
      if (getComputedStyle(el).position !== 'fixed') continue;
      const r = el.getBoundingClientRect();
      const fullWidth = r.width >= innerWidth * 0.6;
      const large = r.width * r.height >= viewportArea * 0.25;
      if (!fullWidth && !large) el.style.setProperty('display', 'none', 'important');
    }
  };
  visit(document.body);
}

// Runs in the page. Pauses the hero video on a chosen frame, so the shot never catches a fading title.
async function pauseVideoAt(seconds) {
  const video = document.querySelector('video');
  if (!video) throw new Error('videoTime is set but the page has no <video>');
  video.pause();
  video.currentTime = seconds;
  await new Promise((resolve) => video.addEventListener('seeked', resolve, { once: true }));
}

const STILL_INTERVAL_MS = 400;
const STILL_ATTEMPTS = 15;
// Mean per-channel difference (0-255) on a small thumbnail below which two frames count as the same.
const STILL_THRESHOLD = 1.5;

async function thumbnail(png) {
  return sharp(png).resize(160, 100, { fit: 'fill' }).raw().toBuffer();
}

// Waits for a frame where nothing moves, so slideshows are never caught mid-transition.
// Pages that never settle (video, constant animation) get the last frame taken.
async function stillScreenshot(page) {
  let previous = await page.screenshot({ type: 'png' });
  for (let attempt = 0; attempt < STILL_ATTEMPTS; attempt += 1) {
    await page.waitForTimeout(STILL_INTERVAL_MS);
    const current = await page.screenshot({ type: 'png' });
    const [a, b] = await Promise.all([thumbnail(previous), thumbnail(current)]);
    let total = 0;
    for (let i = 0; i < a.length; i += 1) total += Math.abs(a[i] - b[i]);
    if (total / a.length < STILL_THRESHOLD) return current;
    previous = current;
  }
  return previous;
}

async function capture(browser, project) {
  const { scrollY = 0, path: subPath, hide = [], hideText, settleMs = SETTLE_MS, viewport = VIEWPORT, videoTime } =
    framing[project.slug] ?? {};
  const url = subPath ? new URL(subPath, project.url).href : project.url;
  const context = await browser.newContext({ viewport, deviceScaleFactor: SCALE, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'load', timeout: NAV_TIMEOUT_MS });
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    const declined = await declineCookies(page);
    // Hide any consent UI that is still on screen after declining (or that offers no decline button).
    await page.addStyleTag({ content: `${[...BANNERS, ...hide].join(',')}{display:none!important}` });
    if (hideText) {
      // Popups often open a few seconds after load, so wait before looking for them.
      await page.waitForTimeout(SETTLE_MS);
      await page.evaluate(hideFloatingText, [hideText.source, hideText.flags]);
    }
    if (scrollY) await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollY);
    await page.waitForTimeout(settleMs);
    if (videoTime !== undefined) await page.evaluate(pauseVideoAt, videoTime);
    // Widgets often load last, so this runs right before the shot.
    await page.evaluate(hideFloatingWidgets);
    return { png: await stillScreenshot(page), declined, url };
  } finally {
    await context.close();
  }
}

async function save(project, png, reviewDir) {
  const base = path.join('public', project.image.replace(/\.webp$/, ''));
  // Every master has the same size, also for sites shot in a wider window.
  const master = await sharp(png).resize(VIEWPORT.width * SCALE).webp({ quality: MASTER_QUALITY, smartSubsample: true }).toFile(`${base}.webp`);
  await sharp(png).resize(RING_WIDTH).webp({ quality: RING_QUALITY }).toFile(`${base}-${RING_WIDTH}.webp`);
  if (reviewDir) await sharp(png).toFile(path.join(reviewDir, `${project.slug}.png`));
  return master;
}

const browser = await chromium.launch();
if (values.review) await mkdir(values.review, { recursive: true });
let failed = 0;
try {
  for (const project of selected) {
    try {
      const { png, declined, url } = await capture(browser, project);
      const out = await save(project, png, values.review);
      console.log(`ok    ${project.slug.padEnd(20)} ${out.width}x${out.height} ${(out.size / 1024).toFixed(0)} KB  cookies declined: ${declined}  ${url}`);
    } catch (error) {
      failed += 1;
      console.error(`FAIL  ${project.slug.padEnd(20)} ${error.message.split('\n')[0]}`);
    }
  }
} finally {
  await browser.close();
}
process.exitCode = failed ? 1 : 0;
