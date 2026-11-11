import AthensClock from '@/components/AthensClock';
import PageEnd from '@/components/PageEnd';
import SceneCanvas from '@/components/three/SceneCanvas';
import { pad, pageMeta } from '@/lib/site';

export const metadata = pageMeta(
  '/about',
  'About ZYXEN — Software Engineering Studio',
  'ZYXEN is a software studio in Athens. Design, engineering and delivery in one team, building websites, online stores, apps and automation for businesses.',
);

const principles = [
  ['One team', 'Design, engineering and delivery under one roof. No hand-offs, no lost details.'],
  ['Performance first', 'Fast pages, clean code and search visibility are built in, not bolted on.'],
  ['Plain language', 'Written proposals with clear scope and price. You always know what happens next.'],
  ['Built to last', 'Proven platforms and care after launch keep your systems secure and current.'],
];

const method = [
  ['Discover', 'Stakeholder alignment, constraints, KPIs and written scope.'],
  ['Blueprint', 'User flows, component model, CMS/app architecture and implementation plan.'],
  ['Build', 'Sprint milestones, demos, QA gates and staging releases.'],
  ['Ship & Tune', 'Production rollout, monitoring, performance checks and conversion improvements.'],
];

const partners = [
  { name: 'Redirect', url: 'https://redirect.gr', role: 'Lead agency on selected projects' },
  { name: 'Threenitas', url: 'https://threenitas.gr', role: 'Lead agency on the Dannemann Group project' },
  { name: 'AI Convert It', url: 'https://aiconvert.it', role: 'Document processing and AI workflows, by Alpdev' },
];

const card = 'flex flex-col gap-2.5 border-t border-line pt-5';
const cardTitle = 'display m-0 text-[28px] leading-[1.1] tracking-[-0.035em]';

export default function About() {
  return (
    <>
      <section className="stage-glow relative flex min-h-[700px] flex-col lg:h-screen" style={{ ['--glow-x' as string]: '66%', ['--glow-y' as string]: '48%' }}>
        <div className="over-canvas relative flex flex-1 flex-col justify-between gap-12 px-gutter pb-9 pt-[120px]">
        <p className="label relative z-[1]">(About)</p>
        <SceneCanvas
          band
          scene="globe"
          className="-my-12 lg:my-0"
          label="A gold globe with Athens glowing orange and arcs reaching cities around the world. Drag to turn it."
        />
        <div className="relative z-[1] flex flex-wrap items-end justify-between gap-8">
          <h1 className="display m-0 text-[clamp(52px,9vw,150px)] leading-[0.86] tracking-[-0.065em]">
            Athens.
            <br />
            Worldwide.
          </h1>
          <div className="flex max-w-[320px] flex-col gap-2.5 text-[15px]">
            <p className="m-0">
              37.9838° N, 23.7275° E — <span className="text-muted"><AthensClock /></span>
            </p>
            <p className="m-0 text-muted">A remote-first studio working with teams internationally.</p>
            <p className="m-0 mt-2 text-[12px] text-dim">Drag to turn the globe</p>
          </div>
        </div>
        </div>
      </section>

      <section className="flex flex-col gap-10 px-gutter pb-16 pt-36">
        <p className="label">(01) Studio</p>
        <p className="display m-0 max-w-[1080px] text-[clamp(28px,3.8vw,58px)] font-normal leading-[1.1] tracking-[-0.035em]">
          ZYXEN is a software studio for businesses that want more from their website than a brochure. Design, engineering
          and delivery sit in one team — so what we promise is what gets built, and what gets built keeps working.
        </p>
      </section>

      <section className="flex flex-wrap gap-x-20 gap-y-8 px-gutter pb-10 pt-20">
        <div className="flex-[1_1_360px]">
          <h2 className="label">(02) How we work</h2>
        </div>
        <div className="grid flex-[2_1_560px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-10 gap-y-12">
          {principles.map(([title, text]) => (
            <div key={title} className={card}>
              <h3 className={cardTitle}>{title}</h3>
              <p className="m-0 text-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-x-20 gap-y-8 px-gutter pb-10 pt-24">
        <div className="flex flex-[1_1_360px] flex-col gap-3.5">
          <p className="label">(03) Method</p>
          <h2 className="display m-0 text-[clamp(36px,4.6vw,72px)] leading-[0.95] tracking-[-0.05em]">From concept to production.</h2>
        </div>
        <ol className="m-0 grid flex-[2_1_560px] list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-10 gap-y-12 p-0">
          {method.map(([title, text], i) => (
            <li key={title} className={card}>
              <span className="text-[13px] text-muted">({pad(i + 1)})</span>
              <h3 className={cardTitle}>{title}</h3>
              <p className="m-0 text-soft">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-wrap gap-x-20 gap-y-12 px-gutter pb-10 pt-24">
        <div className="flex flex-[1_1_420px] flex-col gap-[18px]">
          <h2 className="label">(04) Stack</h2>
          <p className="display m-0 text-[clamp(30px,3.4vw,52px)] leading-[1.08] tracking-[-0.04em] text-dim">
            <span className="text-ink">Umbraco</span> · .NET / C# · <span className="text-ink">nopCommerce</span> · Flutter ·{' '}
            <span className="text-ink">AI integrations</span> · Jenkins · Bitbucket Pipelines
          </p>
        </div>
        <div className="flex flex-[1_1_420px] flex-col gap-[18px]">
          <h2 className="label">(05) Partners</h2>
          <ul className="m-0 flex list-none flex-col border-t border-line p-0">
            {partners.map((p) => (
              <li key={p.name} className="hair flex flex-wrap justify-between gap-x-4 gap-y-2 py-[18px]">
                <a className="zx-link text-[20px]" href={p.url} rel="noopener" target="_blank">
                  {p.name}
                </a>
                <span className="text-[14px] text-muted">{p.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex flex-col gap-7 px-gutter pb-10 pt-24">
        <h2 className="label">(06) People</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,340px))] gap-6">
          <figure className="m-0 flex flex-col gap-3">
            <div className="placeholder aspect-[4/5]">Placeholder: portrait photo (owner to supply)</div>
            <figcaption className="flex justify-between gap-3">
              <span>Iraklis Gkougkoudis</span>
              <span className="text-muted">[Role — owner to supply]</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <PageEnd href="/contact" label="Let's build" />
    </>
  );
}
