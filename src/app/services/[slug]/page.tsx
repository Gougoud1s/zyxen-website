import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageEnd from '@/components/PageEnd';
import { services } from '@/lib/data.js';
import { clip, getService, groupForService, pad, pageMeta, projectsForService } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMeta(`/services/${s.slug}`, `${s.en.name} | ZYXEN Engineering`, clip(s.en.description));
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
  const group = groupForService(s.slug);
  const related = projectsForService(s);
  const index = services.indexOf(s);
  const next = services[index + 1];

  return (
    <>
      <section className="stage-glow flex min-h-[600px] flex-col justify-end gap-10 px-gutter pb-12 pt-[120px] lg:min-h-[80vh]" style={{ ['--glow-x' as string]: '72%' }}>
        <nav aria-label="Breadcrumb" className="label">
          <Link className="zx-link" href="/services">Services</Link> <span aria-hidden="true">/</span>{' '}
          <Link className="zx-link" href={`/services#${group.id}`}>{group.title}</Link>
        </nav>
        <h1 className="display m-0 max-w-[16ch] text-[clamp(48px,7.4vw,124px)] leading-[0.88]">{s.en.name}</h1>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="m-0 max-w-[640px] text-[18px] text-soft">{s.en.description}</p>
          <p className="m-0 text-[13px] text-muted">{s.tech.join(' · ')}</p>
        </div>
      </section>

      <section className="flex flex-col gap-20 px-gutter pt-20">
        <List n={1} title="Core deliverables" items={s.en.subServices} />
        <List n={2} title="Use cases" items={s.en.useCases} numbered />
        <List n={3} title="Business impact" items={s.en.benefits} />

        {related.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="label">Case studies using this stack</p>
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
