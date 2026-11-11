'use client';

import Link from 'next/link';
import { useState } from 'react';
import SceneCanvas from './three/SceneCanvas';

const pages = [
  ['Home', 'Your first impression: who you are, what you offer and one clear next step.'],
  ['Services', 'Each service in plain language, with the action you want visitors to take.'],
  ['About', 'Your story, team and values — the reasons customers choose you.'],
  ['Work', 'Projects, photos or case studies that prove you deliver.'],
  ['Contact', 'An enquiry form and your details, set up to reach your inbox.'],
];
const names = pages.map(([n]) => n);

/** Websites hero: each page of the package lifts out of the glass stack. */
export default function WebsitesHero() {
  const [sel, setSel] = useState(0);
  return (
    <section className="stage-glow relative flex min-h-[720px] flex-col lg:h-screen" style={{ ['--glow-x' as string]: '68%', ['--glow-y' as string]: '50%' }}>
      <div className="over-canvas relative flex flex-1 flex-col justify-between gap-12 px-gutter pb-9 pt-[120px]">
        <div className="relative z-[1] flex max-w-[760px] flex-col gap-[18px]">
          <p className="label">(Business websites)</p>
          <h1 className="display m-0 text-[clamp(48px,7.4vw,124px)] leading-[0.88]">
            A website,
            <br />
            ready to work.
          </h1>
          <p className="m-0 mt-1.5 max-w-[440px] text-[17px] text-soft">
            Your business deserves a proper website. Show what you do, share your work and give customers an easy way to
            find and contact you.
          </p>
        </div>
        <SceneCanvas
          band
          scene="layers"
          className="-my-12 lg:my-0"
          label="Five glass panels stacked like the pages of a website. Pick a page name to lift it out."
          sceneProps={{ names, active: sel, onSelect: setSel }}
        />
        <div className="relative z-[1] flex flex-wrap items-end justify-between gap-8">
          <div className="flex w-full max-w-[420px] flex-col">
            <ul className="m-0 flex list-none flex-col border-t border-line p-0" aria-label="Pages included">
              {pages.map(([name], i) => (
                <li key={name}>
                  <button
                    type="button"
                    aria-pressed={i === sel}
                    onClick={() => setSel(i)}
                    onMouseEnter={() => setSel(i)}
                    onFocus={() => setSel(i)}
                    className={`zx-pick flex min-h-[46px] w-full cursor-pointer items-baseline gap-[18px] border-x-0 border-t-0 bg-transparent py-2 text-left ${i === sel ? '!text-ink' : ''}`}
                  >
                    <span className="w-[22px] text-[12px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                    <span className="display text-[26px] tracking-[-0.035em]">{name}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="m-0 mt-3.5 min-h-12 text-[15px] text-soft" aria-live="polite">
              {pages[sel][1]}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3.5">
            <p className="label">Defined scope. Clear price.</p>
            <p className="display m-0 text-[clamp(48px,6vw,88px)] leading-none tracking-[-0.05em]">€1,200</p>
            <p className="m-0 text-[15px] text-soft">+ VAT · one-off build</p>
            <Link className="zx-cta mt-2" href="/contact?offer=website">
              Let’s discuss your website <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
