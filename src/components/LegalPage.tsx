import legal from '@/lib/legal.json';
import { pageMeta } from '@/lib/site';
import { Breadcrumbs } from './JsonLd';
import PageEnd from './PageEnd';

type Doc = keyof typeof legal;

export const legalMeta = (doc: Doc, path: string) =>
  pageMeta(path, `${legal[doc].title} | ZYXEN`, legal[doc].description);

const paths: Record<Doc, string> = { privacy: '/privacy-policy', cookies: '/cookie-policy', terms: '/terms' };

/** Legal texts live in src/lib/legal.json (terms as on the previous site; privacy and cookies updated Nov 2026). */
export default function LegalPage({ doc }: { doc: Doc }) {
  const c = legal[doc];
  return (
    <>
      <Breadcrumbs trail={[[c.title, paths[doc]]]} />
      <section className="flex flex-col gap-5 px-gutter pb-16 pt-[160px]">
        <p className="label">(Legal)</p>
        <h1 className="display m-0 text-[clamp(48px,7.4vw,124px)] leading-[0.88]">{c.title}</h1>
        <p className="label">{c.updated}</p>
      </section>
      <section className="flex flex-col px-gutter">
        {c.sections.map((s) => (
          <div key={s.h} className="flex flex-wrap gap-x-20 gap-y-3 border-t border-line py-8">
            <h2 className="m-0 flex-[1_1_280px] text-[18px] font-medium">{s.h}</h2>
            <p className="m-0 max-w-[720px] flex-[2_1_480px] text-soft">{s.p}</p>
          </div>
        ))}
      </section>
      <PageEnd href="/contact" label="Contact" />
    </>
  );
}
