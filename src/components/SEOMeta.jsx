import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE = 'https://www.zyxen.gr';
const OG_IMAGE = `${BASE}/og-image.jpg`;

/**
 * SEO meta tag manager — updates document <head> on route change.
 * Usage: <SEOMeta title="..." description="..." noindex jsonLd={obj|array} />
 */
export default function SEOMeta({ title, description, canonical, image, noindex = false, jsonLd }) {
  const { pathname } = useLocation();
  const isGreek = pathname.startsWith('/el') || pathname === '/' || (!pathname.startsWith('/en'));
  const lang = isGreek ? 'el' : 'en';

  const defaultTitle = isGreek
    ? 'Κατασκευή Ιστοσελίδων & Κατασκευή Εφαρμογών (Apps) | ZYXEN Digital Agency'
    : 'Website Creation & Mobile App Development Agency | ZYXEN Software Studio';

  const defaultDesc = isGreek
    ? 'Εξειδικευμένη εταιρεία στην κατασκευή ιστοσελίδων, κατασκευή e-shop & δημιουργία mobile εφαρμογών (iOS & Android). Κορυφαία ταχύτητα φόρτωσης, SEO & Awwwards design.'
    : 'Leading software agency specializing in website creation, custom web applications & iOS/Android app development. High-performance SEO & enterprise digital platforms.';

  const fullTitle = title || defaultTitle;
  const desc = description || defaultDesc;
  
  // Strip trailing slash to keep one canonical form per page.
  const cleanPath = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  const fullCanonical = canonical || `${BASE}${cleanPath}`;
  const ogImage = image || OG_IMAGE;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = fullTitle;

    setMeta('name', 'description', desc);
    setMeta('name', 'keywords', isGreek 
      ? 'κατασκευή ιστοσελίδων, κατασκευή εφαρμογών, δημιουργία site, κατασκευή eshop, κατασκευή mobile app, εταιρεία πληροφορικής Αθήνα, SEO βελτιστοποίηση, custom software studio'
      : 'website creation, app development Athens, mobile app creation, custom web development, eshop creation, software agency Greece, SEO agency'
    );
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1');
    setLink('canonical', fullCanonical);

    // Open Graph
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', fullCanonical);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:locale', isGreek ? 'el_GR' : 'en_US');
    setMeta('property', 'og:locale:alternate', isGreek ? 'en_US' : 'el_GR');

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', ogImage);

    // Hreflang — el / en / x-default
    const langPath = cleanPath.replace(/^\/(el|en)/, '');
    setHreflang('el', `${BASE}/el${langPath}`);
    setHreflang('en', `${BASE}/en${langPath}`);
    setHreflang('x-default', `${BASE}/el${langPath}`);

    // Dynamic BreadcrumbList JSON-LD Schema
    const segments = cleanPath.split('/').filter(Boolean);
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: isGreek ? 'Αρχική' : 'Home',
        item: `${BASE}/${lang}`
      }
    ];

    if (segments.length > 1) {
      let currentAcc = `${BASE}/${lang}`;
      segments.slice(1).forEach((seg, idx) => {
        currentAcc += `/${seg}`;
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: idx + 2,
          name: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
          item: currentAcc
        });
      });
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems
    };

    // Combine custom page JSON-LD with auto Breadcrumb Schema
    const pageLd = jsonLd ? (Array.isArray(jsonLd) ? [breadcrumbSchema, ...jsonLd] : [breadcrumbSchema, jsonLd]) : [breadcrumbSchema];
    setJsonLd(pageLd);

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