import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

/** Inter Tight 500 as TTF (satori cannot read woff2). Fetched at build time; falls back to the default font offline. */
async function displayFont() {
  try {
    const css = await (
      await fetch('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500', {
        // An old user agent makes Google Fonts serve TrueType.
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.30 (KHTML, like Gecko) Safari/534.30' },
      })
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** Social card: page title over the hero sculpture, in the site's colours. */
export async function og(title: string, eyebrow: string) {
  // og-hero.png comes from scripts/render-posters.mjs; without it the card is text only.
  const [font, hero] = await Promise.all([displayFont(), readFile(path.join(process.cwd(), 'src/assets/og-hero.png')).catch(() => null)]);
  const heroSrc = hero && `data:image/png;base64,${hero.toString('base64')}`;
  const titleSize = title.length > 40 ? 72 : 96;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: 'radial-gradient(ellipse 70% 70% at 72% 45%, #1B1712 0%, #0A0A0B 70%)',
          color: '#EDEBE6',
          fontFamily: 'Inter Tight',
        }}
      >
        {heroSrc && (
          // eslint-disable-next-line @next/next/no-img-element -- satori renders plain img only
          <img src={heroSrc} width={960} height={600} style={{ position: 'absolute', right: -170, top: 15 }} alt="" />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '56px 64px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, letterSpacing: '0.08em' }}>
            <span>ZYXEN</span>
            <span style={{ color: '#8C8A85', letterSpacing: 0, fontSize: 24 }}>{eyebrow}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 820 }}>
            {/* satori ignores em letter-spacing, so it is given in px (-0.05em). */}
            <div style={{ fontSize: titleSize, lineHeight: 0.92, letterSpacing: -0.05 * titleSize }}>{title}</div>
            <div style={{ fontSize: 26, color: '#8C8A85' }}>Systems, engineered. · zyxen.gr</div>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: font ? [{ name: 'Inter Tight', data: font, weight: 500, style: 'normal' }] : undefined },
  );
}
