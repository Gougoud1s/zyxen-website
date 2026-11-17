declare global {
  interface Window {
    /** performance.now() at the moment the intro was switched on. */
    __zxIntroStart?: number;
  }
}

/**
 * Decides whether the home intro plays and, if so, switches it on (`<html data-intro="play">`).
 * Plays once per browser session; never under reduced motion, for crawlers or for automated browsers.
 *
 * Self-contained on purpose: HomeIntro inlines this function's source so it runs before the first paint,
 * and IntroPlayer calls it for visitors who reach the home page by an in-site link. Keep it free of imports
 * and outer variables.
 */
export function beginIntro() {
  try {
    const root = document.documentElement;
    if (root.hasAttribute('data-intro') || sessionStorage.getItem('zx-intro-seen')) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (navigator.webdriver || /bot|crawl|spider|slurp|preview/i.test(navigator.userAgent)) return;
    sessionStorage.setItem('zx-intro-seen', '1');
    root.setAttribute('data-intro', 'play');
    window.__zxIntroStart = performance.now();
  } catch {
    // Session storage is blocked (some private modes): the intro is decoration, so the page opens without it.
  }
}
