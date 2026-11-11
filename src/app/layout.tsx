import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/Header';
import JsonLd from '@/components/JsonLd';
import SmoothScroll from '@/components/SmoothScroll';
import { organizationSchema, websiteSchema } from '@/lib/seo.js';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const display = Inter_Tight({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-display' });
const text = Inter({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-text' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'ZYXEN',
  authors: [{ name: 'ZYXEN' }],
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  verification: { google: 'zUxosUGEi55-ycqcSMhewKWzfGPXP5JI70Rgr1P2rzc' },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = { themeColor: '#0A0A0B', colorScheme: 'dark' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
        {/* Cookieless, so no consent banner. Its script exists only once Web Analytics is enabled on the Vercel project. */}
        {process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === '1' && <Analytics />}
      </body>
    </html>
  );
}
