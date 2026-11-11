import type { Config } from 'tailwindcss';

// Colours map to the CSS tokens in src/app/globals.css.
const token = (name: string) => `var(--${name})`;

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        glow: token('bg-glow'),
        ink: token('ink'),
        soft: token('soft'),
        muted: token('muted'),
        dim: token('dim'),
        line: token('line'),
        accent: token('accent'),
        gold: token('gold'),
        panel: token('panel'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-text)', 'system-ui', 'sans-serif'],
      },
      spacing: { gutter: 'var(--gutter)' },
    },
  },
} satisfies Config;
