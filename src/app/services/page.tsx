import Link from 'next/link';
import PageEnd from '@/components/PageEnd';
import ServicesHero from '@/components/ServicesHero';
import { serviceOffers } from '@/lib/serviceOffers.js';
import { serviceQuestions } from '@/lib/serviceQuestions.js';
import { getService, pad, pageMeta, serviceGroups } from '@/lib/site';
import JsonLd, { Breadcrumbs } from '@/components/JsonLd';
import { faqPageSchema } from '@/lib/structuredData.js';

export const metadata = pageMeta(
  '/services',
  'Web Development, E-commerce & Automation Services | ZYXEN',
  'Explore ZYXEN’s business websites, e-commerce, mobile apps and automation services. See proposed deliverables, project scopes and real contributions.',
);

const unseen = [
  ['Performance', 'Built to pass Core Web Vitals'],
  ['Search visibility', 'Technical SEO and structured data'],
  ['Reliable delivery', 'CI/CD and launch checks'],
  ['Care after launch', 'Optional ongoing support'],
];

const h2 = 'display m-0 text-[clamp(36px,4.6vw,72px)] leading-[0.95] tracking-[-0.05em]';

export default function Services() {
  return (
    <>
      <Breadcrumbs trail={[['Services', '/services']]} />
      <JsonLd data={faqPageSchema(serviceQuestions)} />
      <ServicesHero />
      <p className="m-0 max-w-[640px] px-gutter pt-16 text-[17px] text-soft">
        Software that solves the right problem. Build a better website, connect your business systems or make everyday work
        easier. Explore where we can help.
      </p>

      <section className="flex flex-col gap-28 px-gutter pb-10 pt-28">
        {serviceGroups.map((g, i) => (
          <article key={g.id} id={g.id} className="flex scroll-mt-24 flex-wrap gap-x-20 gap-y-8 border-t border-line pt-7">
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5">
              <p className="label">({pad(i + 1)})</p>
              <h2 className="display m-0 text-[clamp(40px,5.4vw,88px)] leading-[0.92] tracking-[-0.055em]">{g.title}</h2>
              <p className="m-0 max-w-[520px] text-[18px] text-soft">{g.text}</p>
            </div>
            <div className="flex min-w-0 flex-[1_1_360px] flex-col">
              {g.items.map((it) => (
                <p key={it} className="hair text-[17px]">{it}</p>
              ))}
              <p className="mb-6 mt-4 text-[13px] text-muted">{g.tech}</p>
              <div className="flex flex-col border-t border-line">
                {g.services.map((slug) => {
                  const s = getService(slug)!;
                  return (
                    <Link key={slug} href={`/services/${slug}`} className="zx-row gap-4 py-4">
                      <span className="zx-dot" aria-hidden="true" />
                      <span className="flex flex-1 flex-col">
                        <span className="text-[18px] text-soft">{s.en.name}</span>
                        <span className="text-[14px] text-muted">{s.en.short}</span>
                      </span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="flex flex-wrap items-end justify-between gap-8 px-gutter pb-10 pt-24">
        <div className="flex max-w-[640px] flex-col gap-3.5">
          <p className="label">(For small businesses)</p>
          <h2 className={h2}>
            Your business.
            <br />
            A proper website.
          </h2>
          <p className="m-0 text-[18px] text-soft">
            Up to 5 pages. Mobile-ready. A clear scope, with optional care after launch. A focused starting point for your
            business, with a defined scope and a clear handover.
          </p>
        </div>
        <Link className="zx-cta" href="/websites">
          Explore the website package <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="flex flex-col gap-12 px-gutter pb-10 pt-24">
        <div className="flex max-w-[820px] flex-col gap-3.5">
          <p className="label">(Ways to work together)</p>
          <h2 className={h2}>A clear starting point.</h2>
          <p className="m-0 max-w-[560px] text-[18px] text-soft">
            Choose the work you need. Explore the proposed deliverables, what we need from you and where the scope starts
            and ends.
          </p>
        </div>
        {serviceOffers.map((o, i) => (
          <article key={o.id} className="flex flex-wrap gap-x-20 gap-y-8 border-t border-line pt-7">
            <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-3">
              <p className="label">
                ({pad(i + 1)}) {o.name}
              </p>
              <h3 className="display m-0 text-[clamp(28px,3vw,44px)] leading-[1] tracking-[-0.04em]">{o.title}</h3>
              <p className="m-0 text-soft">{o.audience}</p>
            </div>
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
              <div>
                <p className="label mb-1">Proposed deliverables</p>
                {o.deliverables.map((d) => (
                  <p key={d} className="hair">{d}</p>
                ))}
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="label mb-2">What we need from you</p>
                  <p className="m-0 text-soft">{o.inputs}</p>
                </div>
                <div>
                  <p className="label mb-2">Scope & options</p>
                  <p className="m-0 text-soft">{o.scope}</p>
                </div>
              </div>
              <p className="m-0">{o.next}</p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link className="zx-cta" href={o.href}>
                  {o.cta} <span aria-hidden="true">→</span>
                </Link>
                {o.project && (
                  <Link className="zx-link text-[15px] text-muted" href={`/projects/${o.project}`}>
                    {o.proof}
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
        <p className="m-0 text-[14px] text-muted">Scope, price and schedule are agreed in a written proposal before work begins.</p>
      </section>

      <section className="flex flex-wrap gap-x-20 gap-y-8 px-gutter pb-10 pt-24">
        <div className="flex flex-[1_1_420px] flex-col gap-3.5">
          <p className="label">(In every project)</p>
          <h2 className={h2}>The engineering you don&apos;t see.</h2>
        </div>
        <div className="flex flex-[1_1_360px] flex-col border-t border-line">
          {unseen.map(([a, b]) => (
            <p key={a} className="hair flex justify-between gap-4">
              <span>{a}</span>
              <span className="text-right text-[14px] text-muted">{b}</span>
            </p>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-x-20 gap-y-8 px-gutter pb-10 pt-24">
        <div className="flex flex-[1_1_420px] flex-col gap-3.5">
          <p className="label">(Questions)</p>
          <h2 className={h2}>Before we start.</h2>
          <p className="m-0 text-soft">Practical answers about our services, proposals and project experience.</p>
        </div>
        <div className="flex flex-[1_1_480px] flex-col border-t border-line">
          {serviceQuestions.map((f) => (
            <details key={f.q} className="border-b border-line py-[18px]">
              <summary className="display min-h-8 text-[22px] tracking-[-0.02em]">{f.q}</summary>
              <p className="mb-0 mt-3 text-soft">{f.a}</p>
            </details>
          ))}
          <div className="flex flex-wrap gap-x-8 gap-y-3 pt-6 text-[15px]">
            <Link className="zx-link" href="/projects">Explore our project contributions</Link>
            <Link className="zx-link text-muted" href="/contact?offer=custom">Have a custom engineering requirement? Talk to us</Link>
          </div>
        </div>
      </section>

      <PageEnd href="/websites" label="Websites" />
    </>
  );
}
