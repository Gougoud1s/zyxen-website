'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** Below Tailwind's `sm` breakpoint (640px), where the summary row is shown. Keep the two in step. */
const PHONE_QUERY = '(max-width: 639px)';

/**
 * Detail that is always visible on wider screens and folds behind a tappable row on phones, to keep long
 * pages short there. Built on a native <details> that is rendered open, so everything is readable without
 * JavaScript and for crawlers; on phones it is closed once the page is interactive.
 */
export default function CollapseOnPhones({ summary, children }: { summary: string; children: ReactNode }) {
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const phone = matchMedia(PHONE_QUERY);
    // Also reopens it when a phone-sized window grows: the summary row is hidden there, so it could not be reopened.
    const sync = () => {
      if (details.current) details.current.open = !phone.matches;
    };
    sync();
    phone.addEventListener('change', sync);
    return () => phone.removeEventListener('change', sync);
  }, []);

  return (
    <details ref={details} open>
      <summary className="border-y border-line py-2 text-[17px] sm:hidden">{summary}</summary>
      <div className="flex flex-col gap-6 max-sm:pt-5">{children}</div>
    </details>
  );
}
