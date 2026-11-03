import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { SITE_URL as BASE, canonicalPath, languageAlternates, organizationSchema, websiteSchema } from '@/lib/seo';
const OG_IMAGE = `${BASE}/og-image.jpg`;

/**
 * SEO meta tag manager — updates document <head> on route change.
 * Usage: <SEOMeta title="..." description="..." noindex jsonLd={obj|array} />
 */
export default function SEOMeta({ title, description, canonical, image, noindex = false, jsonLd, language }) {
  const { pathname } = useLocation();
  const isGreek = language === 'el' || pathname === '/el/websites';
  const lang = isGreek ? 'el' : 'en';
  const defaultTitle = 'Websites, E-commerce & Custom Software | ZYXEN Greece';
  const defaultDesc = 'ZYXEN builds business websites, e-commerce platforms, mobile apps and automation. Explore our project contributions and discuss your requirements.';

  const fullTitle = title || defaultTitle;
  const desc = description || defaultDesc;
  
  // Strip trailing slash to keep one canonical form per page.
  const cleanPath = canonicalPath(pathname);
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
    document.querySelectorAll('meta[property="og:locale:alternate"]').forEach(el => el.remove());
    if (languageAlternates(cleanPath).length) setMeta('property', 'og:locale:alternate', isGreek ? 'en_US' : 'el_GR');

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:url', fullCanonical);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', ogImage);

    // Only advertise translations that actually exist.
    document.querySelectorAll('link[hreflang]').forEach(el => el.remove());
    languageAlternates(cleanPath).forEach(item => setHreflang(item.lang, `${BASE}${item.path}`));

    // Dynamic BreadcrumbList JSON-LD Schema
    const segments = cleanPath.replace(/^\/el(?=\/)/, '').split('/').filter(Boolean);
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: isGreek ? 'Αρχική' : 'Home',
        item: `${BASE}/`
      }
    ];

    if (segments.length > 0) {
      let currentAcc = cleanPath === '/el/websites' ? `${BASE}/el` : BASE;
      segments.forEach((seg, idx) => {
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

    const custom = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
    const pageLd = [organizationSchema, websiteSchema,
      ...(custom.some(item => item['@type'] === 'BreadcrumbList') ? [] : [breadcrumbSchema]),
      ...custom.filter(item => item['@type'] !== 'Organization' && item['@type'] !== 'WebSite')];
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