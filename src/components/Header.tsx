'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { EMAIL, nav } from '@/lib/site';

const links = [...nav, { href: '/contact', label: 'Contact' }];

export default function Header() {
  const path = usePathname();
  const current = (href: string) => path === href || path.startsWith(`${href}/`);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  // While the phone menu is open: lock page scroll, focus the first link, keep Tab inside, Escape closes.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = 'hidden';
    const focusable = () => [...(sheet.current?.querySelectorAll<HTMLElement>('a, button') ?? [])];
    focusable()[1]?.focus(); // [0] is Close; start on the first page link
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      } else if (e.key === 'Tab') {
        const items = focusable();
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = before;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    toggle.current?.focus();
  };

  return (
    <header
      className="sticky top-0 z-30 -mb-[84px] flex h-[84px] items-center justify-between gap-4 px-gutter"
      style={{ background: 'linear-gradient(var(--bg) 0%, color-mix(in srgb, var(--bg) 70%, transparent) 55%, transparent 100%)' }}
    >
      <Link href="/" className="font-display text-[15px] font-semibold tracking-[0.08em] text-ink hover:text-ink">
        ZYXEN
      </Link>

      <nav aria-label="Main" className="hidden gap-x-7 text-[14px] md:flex">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`zx-link ${href === '/contact' ? 'text-accent' : ''}`}
            aria-current={current(href) ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>

      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen(true)}
        className="-mr-2 inline-flex min-h-11 items-center gap-2.5 bg-transparent px-2 text-[14px] text-ink md:hidden"
      >
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
        Menu
      </button>

      {open && (
        <div
          ref={sheet}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-lenis-prevent
          className="menu-sheet fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-bg px-gutter pb-8 md:hidden"
        >
          <div className="flex h-[84px] shrink-0 items-center justify-between">
            <span className="font-display text-[15px] font-semibold tracking-[0.08em]">ZYXEN</span>
            <button type="button" onClick={close} className="-mr-2 inline-flex min-h-11 items-center bg-transparent px-2 text-[14px] text-ink">
              Close
            </button>
          </div>

          <nav aria-label="Pages" className="flex flex-col border-t border-line">
            {links.map(({ href, label }, i) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={current(href) ? 'page' : undefined}
                className={`menu-link flex items-baseline gap-4 border-b border-line py-3.5 ${href === '/contact' ? 'text-accent' : 'text-ink'}`}
                style={{ '--i': i } as CSSProperties}
              >
                <span aria-hidden="true" className="w-6 text-[12px] text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="display text-[clamp(44px,13vw,64px)] leading-none">{label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-1.5 pt-10 text-[14px] text-muted">
            <a className="zx-link self-start text-[18px] text-ink" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <span>Athens, Greece · Systems, engineered.</span>
          </div>
        </div>
      )}
    </header>
  );
}
