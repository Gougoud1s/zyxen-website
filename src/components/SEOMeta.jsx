import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE = 'https://www.zyxen.gr';
const OG_IMAGE = `${BASE}/og-image.jpg`;

/**
 * SEO meta tag manager — updates document <head> on route change.
 * Usage: <SEOMeta title="..." description="..." noindex jsonLd={obj|array} />
 *
 * Canonical/og:url always resolve to the www apex on the current path
 * (no trailing slash) so every route self-canonicalizes correctly.
 */
export default function SEOMeta({ title, description, canonical, image, noindex = false, jsonLd }) {
  const { pathname } = useLocation();
  const isGreek = pathname.startsWith('/el');
  const lang = isGreek ? 'el' : 'en';

  const fullTitle = title || 'ZYXEN — Systems, Engineered.';
  const desc = description || 'Premium software engineering studio. AI integrations, Umbraco platforms, Flutter apps and commerce systems. Based in Greece.';
  // Strip trailing slash to keep one canonical form per page.
  const cleanPath = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  const fullCanonical = canonical || `${BASE}${cleanPath}`;
  const ogImage = image || OG_IMAGE;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = fullTitle;

    setMeta('name', 'description', desc);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setLink('canonical', fullCanonical);

    // Open Graph
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', fullCanonical);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:image:width', '1024');
    setMeta('property', 'og:image:height', '1024');
    setMeta('property', 'og:locale', isGreek ? 'el_GR' : 'en_US');
    setMeta('property', 'og:locale:alternate', isGreek ? 'en_US' : 'el_GR');

    // Twitter
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', ogImage);

    // hreflang — el / en / x-default (points to Greek as primary market)
    const langPath = cleanPath.replace(/^\/(el|en)/, '');
    setHreflang('el', `${BASE}/el${langPath}`);
    setHreflang('en', `${BASE}/en${langPath}`);
    setHreflang('x-default', `${BASE}/el${langPath}`);

    // Optional per-page structured data (managed by data-seo attr so it's idempotent)
    setJsonLd(jsonLd);
  }, [fullTitle, desc, fullCanonical, ogImage, noindex, jsonLd, lang, isGreek, cleanPath]);

  return null;
}

function setMeta(attr, key, value) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setHreflang(lang, href) {
  let el = document.querySelector(`link[hreflang="${lang}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('hreflang', lang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Inject page-level JSON-LD, replacing any previously injected by this component. */
function setJsonLd(data) {
  document.querySelectorAll('script[data-seo="page"]').forEach((n) => n.remove());
  if (!data) return;
  const blocks = Array.isArray(data) ? data : [data];
  for (const block of blocks) {
    if (!block) continue;
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-seo', 'page');
    s.textContent = JSON.stringify(block);
    document.head.appendChild(s);
  }
}
