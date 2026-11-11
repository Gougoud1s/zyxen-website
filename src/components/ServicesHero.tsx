'use client';

import { useState } from 'react';
import { serviceGroups } from '@/lib/site';
import SceneCanvas from './three/SceneCanvas';

/** Services hero: hovering or focusing a service changes the sculpture's shape. */
export default function ServicesHero() {
  const [sel, setSel] = useState(0);
  const cur = serviceGroups[sel];
  return (
    <section className="stage-glow relative flex min-h-[700px] flex-col lg:h-screen" style={{ ['--glow-x' as string]: '68%' }}>
      <div className="over-canvas relative flex flex-1 flex-col justify-between gap-12 px-gutter pb-9 pt-[120px]">
        <div className="relative z-[1] flex flex-col gap-[18px]">
          <p className="label">(Services)</p>
          <h1 className="display m-0 text-[clamp(48px,7.4vw,124px)] leading-[0.88]">
            Every system
            <br />
            has a shape.
          </h1>
        </div>
        <SceneCanvas
          band
          scene="shapes"
          className="-my-12 lg:my-0"
          label="A glass and gold sculpture that changes shape for each service. Drag to rotate it."
          sceneProps={{ active: sel, onSelect: setSel }}
        />
        <div className="relative z-[1] flex flex-wrap items-end justify-between gap-8">
          <ul className="m-0 flex w-full max-w-[560px] list-none flex-col border-t border-line p-0" aria-label="Services">
            {serviceGroups.map((g, i) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  aria-current={i === sel ? 'true' : undefined}
                  onMouseEnter={() => setSel(i)}
                  onFocus={() => setSel(i)}
                  className={`zx-pick flex min-h-[52px] items-baseline gap-[18px] py-2.5 ${i === sel ? '!text-ink' : ''}`}
                >
                  <span className="w-[22px] text-[12px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display text-[clamp(26px,2.8vw,40px)] leading-[1.1] tracking-[-0.04em]">{g.title}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex max-w-[340px] flex-col gap-2.5 text-[15px]" aria-live="polite">
            <p className="m-0">{cur.text}</p>
            <p className="m-0 text-[13px] text-muted">{cur.tech}</p>
            <p className="m-0 mt-2 text-[12px] text-dim">Hover a service · drag to rotate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
