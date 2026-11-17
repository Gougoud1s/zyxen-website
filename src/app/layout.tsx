import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/Header';
import JsonLd from '@/components/JsonLd';
import MobileCta from '@/components/MobileCta';
import SmoothScroll from '@/components/SmoothScroll';
import { organizationSchema, websiteSchema } from '@/lib/seo.js';
import { SITE_URL } from '@/lib/site';
import MotionRuntime from '@/components/motion/MotionRuntime';
import './globals.css';
import './motion.css';

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

/** If the motion runtime has not taken over by then, everything waiting for a scroll reveal is shown. */
const MOTION_FAILSAFE_MS = 4000;

/*
 * Runs before the first paint: switches on scroll reveals (never under reduced motion), so content below the
 * fold starts in its waiting state without a flash.
 */
const motionBoot = `(function(){var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.setAttribute('data-kx','');setTimeout(function(){if(!window.__kxLive)d.removeAttribute('data-kx')},${MOTION_FAILSAFE_MS})})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The motion scripts set data attributes on <html> before hydration.
    <html lang="en" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
        <div className="kx-progress" aria-hidden="true" />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <SmoothScroll />
        <MotionRuntime />
        <Header />
        <main id="main">{children}</main>
        <MobileCta />
        {/* Cookieless, so no consent banner. Its script exists only once Web Analytics is enabled on the Vercel project. */}
        {process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === '1' && <Analytics />}
      </body>
    </html>
  );
}
