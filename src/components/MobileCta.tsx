'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { greekPages } from '@/lib/greekPages.js';

/** The button appears once the visitor has scrolled this share of a screen past the top. */
const SHOW_AFTER_SCREENS = 0.6;
/** It steps aside this close to the end of the page, where the footer and the page's own closing links are. */
const HIDE_BEFORE_END_PX = 420;
const CONTACT_PATH = '/contact';

/**
 * Phones only: a "start a project" button that stays within thumb reach while the visitor reads.
 * The pages' own buttons sit far apart on a narrow screen; this keeps the next step one tap away.
 * Not shown on the contact page (the form is already there) or at the top, where each hero has its own.
 */
export default function MobileCta() {
  const path = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let queued = false;
    const measure = () => {
      queued = false;
      const page = document.documentElement;
      const pastHero = window.scrollY > window.innerHeight * SHOW_AFTER_SCREENS;
      const nearEnd = window.scrollY + window.innerHeight > page.scrollHeight - HIDE_BEFORE_END_PX;
      setShown(pastHero && !nearEnd);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [path]);

  if (path === CONTACT_PATH) return null;
  const greek = greekPages.some((page) => page.path === path);

  return (
    <Link
      href={CONTACT_PATH}
      className="mobile-cta"
      data-shown={shown}
      // Out of the tab order and the accessibility tree while it is off screen.
      tabIndex={shown ? undefined : -1}
      aria-hidden={shown ? undefined : true}
      lang={greek ? 'el' : undefined}
    >
      {greek ? 'Ζητήστε προσφορά' : 'Start a project'} <span aria-hidden="true">→</span>
    </Link>
  );
}
