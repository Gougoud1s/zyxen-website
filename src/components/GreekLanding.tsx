import Link from 'next/link';
import JsonLd, { Breadcrumbs } from '@/components/JsonLd';
import PageEnd from '@/components/PageEnd';
import { getGreekPage, greekPages } from '@/lib/greekPages.js';
import { ORGANIZATION_ID } from '@/lib/seo.js';
import { EMAIL, SITE_URL, getProject, pad, pageMeta } from '@/lib/site';
import { faqPageSchema } from '@/lib/structuredData.js';

type GreekPage = (typeof greekPages)[number];

const page = (path: string) => getGreekPage(path) as GreekPage;

/** Metadata for a Greek landing page, paired with its English counterpart through hreflang. */
export function greekMeta(path: string) {
  const p = page(path);
  return pageMeta(p.path, p.metaTitle, p.metaDescription, {
    languages: { en: p.enPath, el: p.path, 'x-default': p.enPath },
    locale: 'el_GR',
  });
}

// Greek letterforms need a little more air than the Latin display tracking gives them.
const h2 = 'display m-0 text-[clamp(32px,4.2vw,64px)] leading-[1] tracking-[-0.035em]';
const h3 = 'display m-0 text-[26px] leading-[1.15] tracking-[-0.025em]';

/**
 * A service page written in Greek (see greekPages.js). The site chrome stays English; `lang="el"` on the
 * wrapper tells screen readers and translation tools which language the content is in.
 */
export default function GreekLanding({ path }: { path: string }) {
  const p = page(path);
  const contact = p.offer ? `/contact?offer=${p.offer}` : '/contact';
  const others = greekPages.filter((o) => o.path !== p.path);
  const next = greekPages[(greekPages.indexOf(p) + 1) % greekPages.length];

  return (
    <>
    <div lang="el">
      <Breadcrumbs trail={[[p.label, p.path]]} />
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: p.h1,
            serviceType: p.label,
            description: p.metaDescription,
            inLanguage: 'el',
            provider: { '@id': ORGANIZATION_ID },
            areaServed: { '@type': 'Country', name: 'Greece' },
            url: `${SITE_URL}${p.path}`,
          },
          faqPageSchema(p.faq),
        ]}
      />

      <section className="stage-glow flex min-h-[560px] flex-col justify-end gap-10 px-gutter pb-12 pt-[120px] lg:min-h-[72vh]" style={{ ['--glow-x' as string]: '72%' }}>
        <p className="label">{p.label} · ZYXEN, Αθήνα</p>
        <h1 className="display m-0 max-w-[18ch] text-[clamp(40px,6.4vw,104px)] leading-[0.95] tracking-[-0.04em]">{p.h1}</h1>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="m-0 max-w-[680px] text-[18px] text-soft">{p.intro}</p>
          <Link className="zx-cta" href={contact}>
            Ζητήστε προσφορά <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="flex flex-wrap gap-x-20 gap-y-8 px-gutter pb-10 pt-24">
        <div className="flex flex-[1_1_420px] flex-col gap-3.5">
          <p className="label">(01) Με λίγα λόγια</p>
          <h2 className={h2}>{p.includedTitle}</h2>
        </div>
        <ul className="m-0 flex flex-[1_1_360px] list-none flex-col self-end border-t border-line p-0">
          {p.points.map((t) => (
            <li key={t} className="hair text-[18px]">{t}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-10 px-gutter pb-10 pt-24">
        <p className="label">(02) Τι περιλαμβάνει</p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-10 gap-y-12">
          {p.included.map(([title, text], i) => (
            <div key={title} className="flex flex-col gap-2.5 border-t border-line pt-5">
              <span className="text-[13px] text-muted">({pad(i + 1)})</span>
              <h3 className={h3}>{title}</h3>
              <p className="m-0 text-soft">{text}</p>
            </div>
          ))}
        </div>
        <p className="m-0 max-w-[760px] text-[15px] text-muted">{p.note}</p>
      </section>

      <section className="flex flex-col gap-10 px-gutter pb-10 pt-24">
        <div className="flex flex-col gap-3.5">
          <p className="label">(03) Η διαδικασία</p>
          <h2 className={h2}>{p.stepsTitle}</h2>
        </div>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-10 p-0">
          {p.steps.map(([title, text], i) => (
            <li key={title} className="flex flex-col gap-2.5 border-t border-line pt-5">
              <span className="text-[13px] text-muted">({pad(i + 1)})</span>
              <h3 className={h3}>{title}</h3>
              <p className="m-0 text-soft">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-4 px-gutter pb-10 pt-24">
        <p className="label">(04) Έργα στα οποία έχουμε δουλέψει</p>
        <ul className="m-0 flex list-none flex-col border-t border-line p-0">
          {p.projects.map(([slug, text]) => {
            const project = getProject(slug)!;
            return (
              <li key={slug}>
                <Link href={`/projects/${slug}`} className="zx-row flex-wrap items-baseline gap-x-5 gap-y-2 py-5">
                  <span className="zx-dot self-center" aria-hidden="true" />
                  <span className="display flex-[1_1_260px] text-[clamp(26px,3vw,44px)] leading-none tracking-[-0.045em]" lang="en">
                    {project.en.name}
                  </span>
                  <span className="flex-[2_1_360px] text-[15px] text-soft">{text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="m-0 text-[14px] text-muted">Οι αναλυτικές παρουσιάσεις των έργων είναι στα αγγλικά.</p>
      </section>

      <section className="flex flex-wrap gap-x-20 gap-y-8 px-gutter pb-10 pt-24">
        <div className="flex flex-[1_1_280px] flex-col gap-3.5">
          <p className="label">(05) Συχνές ερωτήσεις</p>
          <h2 className={h2}>Ό,τι μας ρωτούν πιο συχνά.</h2>
        </div>
        <dl className="m-0 flex flex-[2_1_480px] flex-col border-t border-line">
          {p.faq.map(({ q, a }) => (
            <div key={q} className="hair flex flex-col gap-2">
              <dt className="text-[19px]">{q}</dt>
              <dd className="m-0 text-soft">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-8 px-gutter pt-24">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-7">
          <div className="flex max-w-[640px] flex-col gap-3">
            <h2 className={h2}>Πείτε μας τι χρειάζεστε.</h2>
            <p className="m-0 text-soft">
              Η φόρμα επικοινωνίας είναι στα αγγλικά, αλλά μπορείτε να μας γράψετε στα ελληνικά, εκεί ή στο{' '}
              <a className="zx-link text-ink" href={`mailto:${EMAIL}`}>{EMAIL}</a>.
            </p>
          </div>
          <Link className="zx-cta" href={contact}>
            Ζητήστε προσφορά <span aria-hidden="true">→</span>
          </Link>
        </div>
        <nav aria-label="Άλλες υπηρεσίες" className="flex flex-wrap gap-x-8 gap-y-2 text-[15px] text-soft">
          <span className="text-muted">Δείτε επίσης:</span>
          {others.map((o) => (
            <Link key={o.path} className="zx-link" href={o.path}>{o.label}</Link>
          ))}
          <Link className="zx-link" href={p.enPath} lang="en" hrefLang="en">This service in English</Link>
        </nav>
      </section>

    </div>
    <PageEnd href={next.path} label={next.label} />
    </>
  );
}
