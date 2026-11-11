'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nav } from '@/lib/site';

export default function Header() {
  const path = usePathname();
  const current = (href: string) => path === href || path.startsWith(`${href}/`);

  return (
    <header
      className="sticky top-0 z-30 -mb-[84px] flex h-[84px] items-center justify-between gap-4 px-gutter"
      style={{ background: 'linear-gradient(var(--bg) 0%, color-mix(in srgb, var(--bg) 70%, transparent) 55%, transparent 100%)' }}
    >
      <Link href="/" className="font-display text-[15px] font-semibold tracking-[0.08em] text-ink hover:text-ink">
        ZYXEN
      </Link>
      <nav aria-label="Main" className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-[14px] sm:gap-x-7">
        {nav.map(({ href, label }) => (
          <Link key={href} href={href} className="zx-link" aria-current={current(href) ? 'page' : undefined}>
            {label}
          </Link>
        ))}
        <Link href="/contact" className="zx-link text-accent" aria-current={current('/contact') ? 'page' : undefined}>
          Contact
        </Link>
      </nav>
    </header>
  );
}
