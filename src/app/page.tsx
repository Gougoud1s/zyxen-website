import Link from 'next/link';
import AthensClock from '@/components/AthensClock';
import Footer from '@/components/Footer';
import RevealLines from '@/components/RevealLines';
import StatementReveal from '@/components/StatementReveal';
import SceneCanvas from '@/components/three/SceneCanvas';
import { getProject, pageMeta, pad, serviceGroups, EMAIL } from '@/lib/site';

export const metadata = pageMeta(
  '/',
  'Websites, E-commerce & Custom Software | ZYXEN Greece',
  'ZYXEN is a software studio in Greece building business websites, e-commerce, mobile apps and automation. Explore our services and real project contributions.',
);

const selected = ['creta-maris', 'led7', 'artistishop', 'ips'].map((slug) => getProject(slug)!);

const steps = [
  ['Discover', 'Stakeholder alignment, constraints, KPIs and written scope.'],
  ['Blueprint', 'User flows, component model, CMS/app architecture and implementation plan.'],
  ['Build', 'Sprint milestones, demos, QA gates and staging releases.'],
  ['Ship & Tune', 'Production rollout, monitoring, performance checks and conversion improvements.'],
];

const groupTags: Record<string, string> = {
  websites: 'Umbraco · .NET · SEO',
  'online-stores': 'nopCommerce · Ads',
  apps: 'Flutter · iOS · Android',
  automation: 'AI · Integrations',
};

const section = 'relative z-[1] flex min-h-screen flex-col justify-center gap-7 px-gutter pb-16 pt-32 sm:pt-36';

export default function Home() {
  return (
    <>
      <div className="stage-glow sticky top-0 z-0 -mb-[100vh] h-screen" style={{ ['--glow-y' as string]: '42%' }}>
        <SceneCanvas
          scene="hero"
          label="The ZYXEN mark: a smoked-glass icosahedron in a gold cage around a glowing orange core, moving as the page scrolls."
          className="pointer-events-none absolute inset-0"
        />
      </div>

      <section data-scene-section className="relative z-[1] flex min-h-screen flex-col justify-between px-gutter pb-9 pt-[120px]">
        <p className="m-0 max-w-[320px] text-[14px] text-muted">
          A software studio in Athens. We help businesses serve customers, sell online and reduce manual work through
          websites, apps and connected systems.
        </p>
        <div className="flex flex-col gap-7">
          <h1 className="display m-0 text-[clamp(64px,13.6vw,230px)] leading-[0.86] tracking-[-0.065em]">
            <RevealLines lines={['Systems,', 'engineered.']} indent={[1]} />
          </h1>
          <div className="flex flex-wrap justify-between gap-x-8 gap-y-3 text-[13px] text-muted">
            <span>Athens, Greece — working worldwide</span>
            <span className="flex gap-6">
              <Link className="zx-link text-ink" href="/contact">Start a project</Link>
              <Link className="zx-link text-ink" href="/projects">View our work</Link>
            </span>
          </div>
        </div>
      </section>

      <section data-scene-section className={`${section} gap-10`}>
        <p className="label">(01) Studio</p>
        <StatementReveal
          className="display m-0 max-w-[980px] text-[clamp(30px,4.3vw,66px)] font-normal leading-[1.08] tracking-[-0.035em]"
          text="We design and engineer websites, online stores and software that make businesses easier to find, easier to buy from and simpler to run."
        />
        <Link className="zx-link self-start text-[15px]" href="/about">About the studio</Link>
      </section>

      <section data-scene-section className={`${section} items-end`}>
        <p className="label w-full max-w-[760px]">(02) What we build</p>
        <nav aria-label="What we build" className="flex w-full max-w-[760px] flex-col border-t border-line">
          {serviceGroups.map((g) => (
            <Link key={g.id} href={`/services#${g.id}`} className="zx-row py-[18px]">
              <span className="zx-dot" aria-hidden="true" />
              <span className="display flex-1 text-[clamp(36px,5.4vw,84px)] leading-none tracking-[-0.05em]">{g.title}</span>
              <span className="max-w-[200px] text-right text-[13px] text-muted">{groupTags[g.id]}</span>
            </Link>
          ))}
        </nav>
      </section>

      <section data-scene-section className={section}>
        <p className="label max-w-[820px]">(03) Selected work</p>
        <nav aria-label="Selected work" className="flex w-full max-w-[820px] flex-col border-t border-line">
          {selected.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="zx-row flex-wrap items-baseline gap-x-5 gap-y-1.5 py-[22px]">
              <span className="flex flex-[1_1_360px] flex-col gap-2">
                <span className="display text-[clamp(30px,3.8vw,58px)] leading-none tracking-[-0.045em]">{p.en.name}</span>
                <span className="legible text-[14px] text-muted">
                  {p.en.focus}
                  {p.leadAgency && ` · Lead agency: ${p.leadAgency.name}`}
                </span>
              </span>
              <span className="text-[13px] text-muted">{p.en.category}</span>
            </Link>
          ))}
        </nav>
        <Link className="zx-link self-start text-[15px]" href="/projects">All projects</Link>
      </section>

      <section data-scene-section className={`${section} gap-12`}>
        <div className="flex max-w-[820px] flex-col gap-4">
          <p className="label">(04) Working together</p>
          <h2 className="display m-0 text-[clamp(40px,5.4vw,88px)] leading-[0.92] tracking-[-0.055em]">
            Clear scope.
            <br />
            Visible progress.
          </h2>
          <p className="m-0 max-w-[520px] text-[18px] text-soft">
            We work with your team in agreed milestones, with a clear handover at launch.
          </p>
        </div>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-10 gap-y-10 p-0">
          {steps.map(([title, text], i) => (
            <li key={title} className="flex flex-col gap-2.5 border-t border-line pt-5">
              <span className="text-[13px] text-muted">({pad(i + 1)})</span>
              <h3 className="display m-0 text-[28px] leading-[1.1] tracking-[-0.035em]">{title}</h3>
              <p className="m-0 text-soft">{text}</p>
            </li>
          ))}
        </ol>
        <p className="m-0 max-w-[640px] text-[15px] text-soft">
          We collaborate with{' '}
          <a className="zx-link text-ink" href="https://aiconvert.it" rel="noopener" target="_blank">
            AI Convert It
          </a>{' '}
          by Alpdev to connect document processing and AI workflows with .NET business software.
        </p>
      </section>

      <section data-scene-section className="relative z-[1] flex min-h-screen flex-col justify-between gap-12 px-gutter pb-8 pt-36">
        <p className="label">(05) Contact</p>
        <div className="flex flex-col items-center gap-7 text-center">
          <h2 className="display m-0 text-[clamp(64px,12vw,200px)] leading-[0.86] tracking-[-0.065em]">Let&apos;s build.</h2>
          <p className="m-0 max-w-[460px] text-soft">
            Tell us what you want to build or improve. We’ll discuss the scope and the next steps.
          </p>
          <a
            className="display text-[clamp(24px,3vw,44px)] font-normal tracking-[-0.03em] underline decoration-1 underline-offset-8"
            href={`mailto:${EMAIL}`}
          >
            {EMAIL}
          </a>
          <Link className="zx-link text-[15px] text-muted" href="/contact">Or tell us about your project</Link>
        </div>
        <div className="flex flex-col gap-3">
          <p className="label text-right">
            Athens · <AthensClock />
          </p>
          <Footer />
        </div>
      </section>
    </>
  );
}
