import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageEnd from '@/components/PageEnd';
import { services } from '@/lib/data.js';
import { getService, groupForService, pad, pageMeta, projectsForService, seoFor } from '@/lib/site';
import { greekPathFor, languagesFor } from '@/lib/greekPages.js';
import JsonLd, { Breadcrumbs } from '@/components/JsonLd';
import { faqPageSchema, serviceSchema } from '@/lib/structuredData.js';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) return {};
  const seo = seoFor(s.slug);
  const path = `/services/${s.slug}`;
  return pageMeta(path, seo.metaTitle, seo.metaDescription, { languages: languagesFor(path) });
}

function List({ n, title, items, numbered }: { n: number; title: string; items: string[]; numbered?: boolean }) {
  return (
    <div className="flex flex-wrap gap-x-20 gap-y-4 border-t border-line pt-7">
      <div className="flex flex-[1_1_280px] flex-col gap-2">
        <p className="label">({pad(n)})</p>
        <h2 className="display m-0 text-[clamp(28px,3vw,44px)] leading-[1] tracking-[-0.04em]">{title}</h2>
      </div>
      <ul className="m-0 flex flex-[2_1_480px] list-none flex-col p-0">
        {items.map((it, i) => (
          <li key={it} className="hair flex gap-5 text-[18px]">
            {numbered && <span className="w-6 text-[13px] leading-7 text-muted">{pad(i + 1)}</span>}
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ServiceDetail({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const seo = seoFor(s.slug);
  const greek = greekPathFor(`/services/${s.slug}`);
  const group = groupForService(s.slug);
  const related = projectsForService(s);
  const index = services.indexOf(s);
  const next = services[index + 1];

  return (
    <>
      <Breadcrumbs trail={[['Services', '/services'], [s.en.name, `/services/${s.slug}`]]} />
      <JsonLd data={[serviceSchema(s, 'en', seo.title), faqPageSchema(seo.faq)]} />
      <section className="stage-glow flex min-h-[600px] flex-col justify-end gap-10 px-gutter pb-12 pt-[120px] lg:min-h-[80vh]" style={{ ['--glow-x' as string]: '72%' }}>
        <nav aria-label="Breadcrumb" className="label">
          <Link className="zx-link" href="/services">Services</Link> <span aria-hidden="true">/</span>{' '}
          <Link className="zx-link" href={`/services#${group.id}`}>{group.title}</Link> <span aria-hidden="true">/</span> {s.en.name}
        </nav>
        {/* The heading uses the words buyers search with; the service's own name sits in the trail above. */}
        <h1 className="display m-0 max-w-[18ch] text-[clamp(44px,6.6vw,112px)] leading-[0.9]">{seo.title}</h1>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="m-0 max-w-[640px] text-[18px] text-soft">{s.en.description}</p>
          <div className="flex flex-col gap-1.5 text-[13px] text-muted">
            <p className="m-0">Technology stack: {s.tech.join(' · ')}</p>
            {greek && (
              <Link className="zx-link self-start" href={greek} lang="el" hrefLang="el">
                Διαβάστε το στα ελληνικά
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-20 px-gutter pt-20">
        <List n={1} title="Core deliverables" items={s.en.subServices} />
        <List n={2} title="Enterprise use cases" items={s.en.useCases} numbered />
        <List n={3} title="Key business impact" items={s.en.benefits} />

        {related.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="label">Case studies utilising this stack</p>
            <ul className="m-0 flex list-none flex-col border-t border-line p-0">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`} className="zx-row flex-wrap items-baseline gap-x-5 py-5">
                    <span className="zx-dot self-center" aria-hidden="true" />
                    <span className="display flex-[1_1_300px] text-[clamp(26px,3vw,44px)] leading-none tracking-[-0.045em]">{p.en.name}</span>
                    <span className="text-[13px] text-muted">{p.en.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-x-20 gap-y-4 border-t border-line pt-7">
          <div className="flex flex-[1_1_280px] flex-col gap-2">
            <p className="label">({pad(4)})</p>
            <h2 className="display m-0 text-[clamp(28px,3vw,44px)] leading-[1] tracking-[-0.04em]">Common questions</h2>
          </div>
          <dl className="m-0 flex flex-[2_1_480px] flex-col">
            {seo.faq.map(({ q, a }) => (
              <div key={q} className="hair flex flex-col gap-2">
                <dt className="text-[18px]">{q}</dt>
                <dd className="m-0 text-soft">{a}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-7">
          <h2 className="display m-0 text-[clamp(28px,3vw,44px)] leading-[1] tracking-[-0.04em]">Discuss your project specification.</h2>
          <Link className="zx-cta" href="/contact">
            Schedule technical discovery <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <PageEnd href={next ? `/services/${next.slug}` : '/websites'} label={next ? next.en.name : 'Websites'} />
    </>
  );
}
