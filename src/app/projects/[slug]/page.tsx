import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Disclaimer from '@/components/Disclaimer';
import PageEnd from '@/components/PageEnd';
import { projects } from '@/lib/data.js';
import { clip, getProject, pad, pageMeta, storyFor } from '@/lib/site';
import JsonLd, { Breadcrumbs } from '@/components/JsonLd';
import { ORGANIZATION_ID } from '@/lib/seo.js';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) return {};
  const lead = p.leadAgency ? ` Lead agency: ${p.leadAgency.name}.` : '';
  // Our part and the lead agency come first, so they survive when the overview is clipped to snippet length.
  const description = clip(`ZYXEN’s work on ${p.en.name}: ${p.en.focus}.${lead} ${p.en.overview}`, 158);
  return pageMeta(`/projects/${p.slug}`, `${p.en.name} — Project Contribution | ZYXEN`, description);
}

function Block({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-20 gap-y-4 border-t border-line pt-7">
      <div className="flex flex-[1_1_280px] flex-col gap-2">
        <p className="label">({pad(n)})</p>
        <h2 className="display m-0 text-[clamp(28px,3vw,44px)] leading-[1] tracking-[-0.04em]">{title}</h2>
      </div>
      <div className="flex flex-[2_1_480px] flex-col gap-5 text-[18px] text-soft">{children}</div>
    </div>
  );
}

export default async function CaseStudy({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const story = storyFor(p.slug);
  const index = projects.indexOf(p);
  const next = projects[(index + 1) % projects.length];
  const more = [1, 2, 3].map((k) => projects[(index + k) % projects.length]);

  return (
    <>
      <Breadcrumbs trail={[['Work', '/projects'], [p.en.name, `/projects/${p.slug}`]]} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: p.en.name,
          headline: story?.headline ?? p.en.overview,
          description: p.en.overview,
          url: `https://www.zyxen.gr/projects/${p.slug}`,
          image: `https://www.zyxen.gr${p.image}`,
          genre: p.en.category,
          keywords: p.tech.join(', '),
          contributor: { '@id': ORGANIZATION_ID },
          ...(p.leadAgency ? { creator: { '@type': 'Organization', name: p.leadAgency.name, url: p.leadAgency.url } } : {}),
          isBasedOn: p.url,
        }}
      />
      <section className="stage-glow flex min-h-[640px] flex-col justify-end gap-10 px-gutter pb-12 pt-[120px] lg:min-h-[86vh]" style={{ ['--glow-x' as string]: '70%' }}>
        <nav aria-label="Breadcrumb" className="label">
          <Link className="zx-link" href="/projects">Work</Link> <span aria-hidden="true">/</span> {p.en.name}
        </nav>
        <div className="flex flex-col gap-5">
          <p className="label">{p.en.category} — project contribution</p>
          <h1 className="display page-title m-0 max-w-[14ch]">{p.en.name}</h1>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="m-0 max-w-[620px] text-[18px] text-soft">{p.en.overview}</p>
          <dl className="m-0 flex max-w-[360px] flex-col gap-1.5 text-[15px]">
            <dt className="label">Our contribution</dt>
            <dd className="m-0">{p.en.focus}</dd>
            {p.leadAgency && (
              <dd className="m-0 text-muted">
                Lead agency:{' '}
                <a className="zx-link" href={p.leadAgency.url} rel="noopener" target="_blank">
                  {p.leadAgency.name}
                </a>
              </dd>
            )}
            <dd className="m-0 mt-3">
              <a className="zx-link text-accent" href={p.url} rel="noopener" target="_blank">
                Visit the live platform <span aria-hidden="true">↗</span>
              </a>
            </dd>
          </dl>
        </div>
      </section>

      <figure className="m-0 flex flex-col gap-3 px-gutter">
        <div className="bg-panel">
          <Image
            src={p.image}
            alt={`${p.en.name} website screenshot`}
            width={p.imageWidth}
            height={p.imageHeight}
            sizes="100vw"
            className="h-auto w-full"
            priority
          />
        </div>
        <figcaption className="text-[13px] text-muted">{story?.caption ?? `${p.en.name} — ${p.url}`}</figcaption>
      </figure>

      <section className="flex flex-col gap-20 px-gutter pt-28">
        {story ? (
          <>
            <p className="display m-0 max-w-[1080px] text-[clamp(28px,3.8vw,58px)] font-normal leading-[1.1] tracking-[-0.035em]">
              {story.headline}
            </p>
            <Block n={1} title="The business"><p className="m-0">{story.context}</p></Block>
            <Block n={2} title="The need"><p className="m-0">{story.need}</p></Block>
            <Block n={3} title="Our contribution">
              {story.work.map((w) => (
                <div key={w.title} className="flex flex-col gap-1.5">
                  <h3 className="m-0 text-[18px] font-medium text-ink">{w.title}</h3>
                  <p className="m-0">{w.text}</p>
                </div>
              ))}
            </Block>
            <Block n={4} title="The outcome"><p className="m-0">{story.outcome}</p></Block>
          </>
        ) : (
          <>
            <Block n={1} title="The challenge"><p className="m-0">{p.en.challenge}</p></Block>
            <Block n={2} title="The approach"><p className="m-0">{p.en.solution}</p></Block>
            <Block n={3} title="The outcome"><p className="m-0">{p.en.results}</p></Block>
          </>
        )}

        <div className="flex flex-wrap gap-x-20 gap-y-6 border-t border-line pt-7">
          <div className="flex flex-[1_1_280px] flex-col gap-3">
            <p className="label">Technology stack & tools</p>
            <p className="m-0 text-[18px]">{p.tech.join(' · ')}</p>
          </div>
          <div className="flex flex-[2_1_480px] flex-col gap-4">
            <Disclaimer />
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-7">
          <div className="flex flex-col gap-2">
            <p className="label">Your next project</p>
            <h2 className="display m-0 text-[clamp(28px,3vw,44px)] leading-[1] tracking-[-0.04em]">Working on a similar challenge?</h2>
            <p className="m-0 text-soft">Explore the scope of our services, then tell us what your business needs.</p>
          </div>
          <Link className="zx-cta" href="/services">
            Explore service proposals <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <p className="label">More case studies</p>
          <ul className="m-0 flex list-none flex-col border-t border-line p-0">
            {more.map((m) => (
              <li key={m.slug}>
                <Link href={`/projects/${m.slug}`} className="zx-row flex-wrap items-baseline gap-x-5 py-5">
                  <span className="zx-dot self-center" aria-hidden="true" />
                  <span className="display flex-[1_1_300px] text-[clamp(26px,3vw,44px)] leading-none tracking-[-0.045em]">{m.en.name}</span>
                  <span className="text-[13px] text-muted">{m.en.category}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PageEnd href={`/projects/${next.slug}`} label={next.en.name} />
    </>
  );
}
