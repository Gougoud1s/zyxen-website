import Link from 'next/link';
import { greekPages } from '@/lib/greekPages.js';
import { EMAIL } from '@/lib/site';

/** One-line footer used on every page. */
export default function Footer({ className = '' }: { className?: string }) {
  return (
    <footer className={`flex flex-wrap justify-between gap-x-8 gap-y-2.5 border-t border-line pt-[22px] text-[13px] text-muted ${className}`}>
      <span>© 2026 ZYXEN</span>
      <a className="zx-link" href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>
      <span>Systems, engineered.</span>
      <nav aria-label="Στα ελληνικά" lang="el" className="flex flex-wrap gap-x-5 gap-y-1">
        {greekPages.map((p) => (
          <Link key={p.path} className="zx-link" href={p.path} hrefLang="el">{p.label}</Link>
        ))}
      </nav>
      <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-1">
        <Link className="zx-link" href="/privacy-policy">Privacy</Link>
        <Link className="zx-link" href="/cookie-policy">Cookies</Link>
        <Link className="zx-link" href="/terms">Terms</Link>
      </nav>
    </footer>
  );
}
