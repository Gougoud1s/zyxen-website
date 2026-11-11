import Image from 'next/image';
import Link from 'next/link';
import Disclaimer from '@/components/Disclaimer';
import PageEnd from '@/components/PageEnd';
import { projects } from '@/lib/data.js';
import { pad, pageMeta, sector, summary } from '@/lib/site';

export const metadata = pageMeta(
  '/projects',
  'Featured Work & Case Studies | ZYXEN',
  'Explore case studies across hospitality, industry, public information and commerce: real projects ZYXEN has contributed to, with each role and lead agency clearly credited.',
);

export default function Projects() {
  return (
    <>
      <section className="stage-glow relative flex min-h-[680px] flex-col justify-between gap-12 px-gutter pb-9 pt-[120px] lg:h-screen" style={{ ['--glow-x' as string]: '62%' }}>
        <p className="label">(Work) — {pad(projects.length)} projects</p>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex min-w-0 flex-col gap-7">
            <h1 className="display page-title m-0">
              Selected
              <br />
              work
            </h1>
            <ul className="m-0 flex max-w-[460px] list-none flex-col border-t border-line p-0">
              {projects.map((p) => (
                <li key={p.slug}>
                  <a href={`#${p.slug}`} className="zx-pick flex min-h-12 items-baseline justify-between gap-4 py-3">
                    <span className="display text-[22px] tracking-[-0.03em]">{p.en.name}</span>
                    <span className="shrink-0 text-[12px] text-muted">{sector(p)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="m-0 max-w-[320px] text-[15px] text-soft">
            Real projects. Clearly credited. Platforms we have contributed to across hospitality, industry, public
            information and commerce. Each case study describes our role and credits the lead agency where supplied.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-28 px-gutter pb-10 pt-20 sm:gap-36">
        {projects.map((p, i) => (
          <article key={p.slug} id={p.slug} className="flex scroll-mt-24 flex-col gap-7">
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4 border-b border-line pb-6">
              <div className="flex flex-col gap-2.5">
                <p className="label">
                  ({pad(i + 1)}) {p.en.category}
                </p>
                <h2 className="display m-0 text-[clamp(44px,7vw,112px)] leading-[0.9]">
                  <Link href={`/projects/${p.slug}`} className="zx-big">{p.en.name}</Link>
                </h2>
              </div>
              <div className="flex max-w-[360px] flex-col gap-1.5 text-[15px]">
                <p className="m-0">Our contribution: {p.en.focus}</p>
                {p.leadAgency && <p className="m-0 text-muted">Lead agency: {p.leadAgency.name}</p>}
              </div>
            </div>
            <Link href={`/projects/${p.slug}`} className="block bg-panel" aria-label={`${p.en.name} case study`}>
              <Image
                src={p.image}
                alt={`${p.en.name} website screenshot`}
                width={p.imageWidth}
                height={p.imageHeight}
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="h-auto w-full"
              />
            </Link>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="m-0 max-w-[640px] text-soft">{summary(p)}</p>
              <Link className="zx-link text-[15px]" href={`/projects/${p.slug}`}>
                Read the case study <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="placeholder m-0 justify-start py-3 text-left">Placeholder: one measurable result for {p.en.name} (owner to supply, real numbers only).</p>
          </article>
        ))}
        <Disclaimer />
      </section>

      <PageEnd href="/services" label="Services" />
    </>
  );
}
