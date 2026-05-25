import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO meta tag manager — updates document <head> on route change.
 * Usage: <SEOMeta title="..." description="..." />
 */
export default function SEOMeta({ title, description, canonical }) {
  const { pathname } = useLocation();
  const base = 'https://zyxen.gr';
  const fullTitle = title || 'ZYXEN — Systems, Engineered.';
  // Use pathname as-is — no trailing slash to avoid canonical mismatch
  const fullCanonical = canonical || `${base}${pathname}`;

  useEffect(() => {
    // HTML lang based on URL
    document.documentElement.lang = pathname.startsWith('/el') ? 'el' : 'en';

    // Title
    document.title = fullTitle;

    // Meta description
    setMeta('name', 'description', description || 'Premium software engineering studio. AI integrations, Umbraco platforms, Flutter apps and commerce systems. Based in Greece.');

    // Canonical
    setLink('canonical', fullCanonical);

    // OG
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description || '');
    setMeta('property', 'og:url', fullCanonical);
    setMeta('property', 'og:image', 'https://zyxen.gr/og-image.png');
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');

    // Twitter
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description || '');
    setMeta('name', 'twitter:image', 'https://zyxen.gr/og-image.png');

    // hreflang
    const langPath = pathname.replace(/^\/(el|en)/, '');
    setHreflang('el', `${base}/el${langPath}`);
    setHreflang('en', `${base}/en${langPath}`);
  }, [fullTitle, description, fullCanonical, pathname]);

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