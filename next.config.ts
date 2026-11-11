import type { NextConfig } from 'next';

const lang = ':lang(en|el)';

const config: NextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return [
      // Apex → www (canonical host).
      { source: '/:path*', has: [{ type: 'host', value: 'zyxen.gr' }], destination: 'https://www.zyxen.gr/:path*', statusCode: 301 },
      // Retired pages, sent straight to their final target (no chains).
      ...['', `/${lang}`, '/en/en'].flatMap((prefix) => [
        { source: `${prefix}/technologies`, destination: '/services', statusCode: 301 },
        { source: `${prefix}/audit`, destination: '/contact', statusCode: 301 },
        { source: `${prefix}/free-website-review`, destination: '/contact', statusCode: 301 },
      ]),
      // The site is English-only: old /en and /el URLs (including /el/websites) drop the prefix.
      { source: `/${lang}`, destination: '/', statusCode: 301 },
      { source: `/${lang}/:path*`, destination: '/:path*', statusCode: 301 },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default config;
