export const SITE_URL = 'https://www.zyxen.gr';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function canonicalPath(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/el/websites') return path;
  return path.replace(/^\/(en|el)(?=\/|$)/, '') || '/';
}

export function languageAlternates(pathname) {
  const path = canonicalPath(pathname);
  return path === '/websites' || path === '/el/websites'
    ? [{ lang: 'en', path: '/websites' }, { lang: 'el', path: '/el/websites' }, { lang: 'x-default', path: '/websites' }]
    : [];
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'ZYXEN',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon.svg`,
  email: 'hello@zyxen.gr',
  description: 'ZYXEN is a software studio based in Greece, building business websites, e-commerce platforms, mobile applications and business automation.',
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'ZYXEN',
  url: `${SITE_URL}/`,
  publisher: { '@id': ORGANIZATION_ID },
  inLanguage: ['en', 'el'],
};
