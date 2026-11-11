'use client';

import Link from 'next/link';
import { useState } from 'react';
import SceneCanvas from './three/SceneCanvas';

export type WorkItem = { slug: string; name: string; tag: string; short: string; image: string; role: string; partner?: string };

/** Work hero: the project list drives the glass ring; dragging the ring updates the list. */
export default function WorkHero({ items }: { items: WorkItem[] }) {
  const [sel, setSel] = useState(0);
  const cur = items[sel];
  return (
    <section className="stage-glow relative flex min-h-[680px] flex-col lg:h-screen" style={{ ['--glow-x' as string]: '62%' }}>
      <div className="over-canvas relative flex flex-1 flex-col justify-between gap-12 px-gutter pb-9 pt-[120px]">
        <p className="label relative z-[1]">(Work) — {String(items.length).padStart(2, '0')} projects</p>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex min-w-0 flex-col gap-7">
            <h1 className="display page-title relative z-[1] m-0">
              Selected
              <br />
              work
            </h1>
            <SceneCanvas
              band
              scene="slabs"
              className="lg:-mt-7"
              label="Project panels in smoked glass on a slowly turning ring. Drag to turn, or pick a project from the list."
              sceneProps={{ items, active: sel, onSelect: setSel }}
            />
            <ul className="relative z-[1] m-0 flex max-w-[460px] list-none flex-col border-t border-line p-0" aria-label="Projects">
              {items.map((p, i) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    aria-current={i === sel ? 'true' : undefined}
                    onClick={() => setSel(i)}
                    className={`zx-pick flex min-h-12 w-full cursor-pointer items-baseline justify-between gap-4 border-x-0 border-t-0 bg-transparent py-3 text-left ${i === sel ? '!text-ink' : ''}`}
                  >
                    <span className="display text-[22px] tracking-[-0.03em]">{p.name}</span>
                    <span className="shrink-0 text-[12px] text-muted">{p.tag}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative z-[1] flex max-w-[320px] flex-col gap-2 text-[14px]" aria-live="polite">
            <p className="m-0 text-ink">{cur.role}</p>
            {cur.partner && <p className="m-0 text-muted">{cur.partner}</p>}
            <Link className="zx-link mt-2 self-start text-[15px] text-accent" href={`/projects/${cur.slug}`}>
              {cur.name} case study <span aria-hidden="true">→</span>
            </Link>
            <p className="m-0 mt-2.5 text-[12px] text-dim">Drag to turn · click a panel</p>
          </div>
        </div>
      </div>
    </section>
  );
}
