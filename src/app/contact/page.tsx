import Link from 'next/link';
import AthensClock from '@/components/AthensClock';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import SceneCanvas from '@/components/three/SceneCanvas';
import { EMAIL, pageMeta } from '@/lib/site';
import JsonLd, { Breadcrumbs } from '@/components/JsonLd';
import { faqPageSchema } from '@/lib/structuredData.js';

export const metadata = pageMeta(
  '/contact',
  'Contact ZYXEN — Start a Website, Store or App Project',
  'Tell ZYXEN what you want to build or improve. Websites, commerce, mobile apps and automation, from Athens to your team.',
);

const faq = [
  ['How much does a website cost?', 'Every project gets a written proposal with a fixed scope and price before work begins. For smaller businesses, our website package covers up to 5 pages with a clear scope.'],
  ['What is Zyxen’s typical engagement model?', 'We agree on the scope and milestones before starting. Ongoing work can be arranged through a monthly retainer.'],
  ['When can we get started?', 'Discovery typically starts within 3–5 business days after we agree on the initial scope and any confidentiality requirements.'],
  ['Can you support the project after launch?', 'Yes. Maintenance, security updates and performance support are agreed around your project’s needs.'],
  ['Do you work with clients outside Greece?', 'Yes. We’re remote-first and work with teams internationally.'],
  ['Can you take over an existing site or store?', 'Yes. We support existing stores and websites, including Umbraco and nopCommerce projects.'],
];

export default function Contact() {
  return (
    <>
      <Breadcrumbs trail={[['Contact', '/contact']]} />
      <JsonLd data={faqPageSchema(faq.map(([q, a]) => ({ q, a })))} />
      <section className="stage-glow relative min-h-screen" style={{ ['--glow-x' as string]: '72%', ['--glow-y' as string]: '48%' }}>
        <div className="over-canvas relative flex max-w-[640px] flex-col gap-9 px-gutter pb-12 pt-[120px] lg:static">
          <p className="label relative z-[1]">(Contact)</p>
          <div className="relative z-[1] flex flex-col gap-5">
            <h1 className="display m-0 text-[clamp(52px,8vw,132px)] leading-[0.86] tracking-[-0.065em]">Let&apos;s build.</h1>
            <p className="m-0 text-[17px] text-soft">
              What would you like to build or improve? Share your goals and timeline. We’ll respond within one business day.
            </p>
          </div>
          <SceneCanvas
            band
            scene="listen"
            className="-my-9 h-[320px] lg:my-0"
            label="The ZYXEN sculpture. It opens up as you type and lights up when you send."
          />
          <div className="relative z-[1]">
          <ContactForm />
          </div>
        </div>
      </section>

      <section className="flex flex-wrap gap-x-20 gap-y-12 px-gutter pb-10 pt-28">
        <div className="flex flex-[1_1_360px] flex-col gap-[22px]">
          <h2 className="label">(Direct)</h2>
          <a className="zx-link display self-start text-[clamp(30px,3.4vw,52px)] tracking-[-0.04em]" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <p className="m-0 text-soft">
            Athens, Greece (EEST / UTC+3) — remote-first, working with teams internationally. Athens time: <AthensClock />.
          </p>
          <p className="m-0 text-soft">
            An engineer will review your enquiry and discuss scope options and next steps within one business day.
          </p>
        </div>
        <div className="flex flex-[1_1_480px] flex-col border-t border-line">
          <h2 className="label mb-1.5 pt-[18px]">(Questions) Before you get in touch</h2>
          {faq.map(([q, a]) => (
            <details key={q} className="border-b border-line py-[18px]">
              <summary className="display min-h-8 text-[22px] tracking-[-0.02em]">{q}</summary>
              <p className="mb-0 mt-3 text-soft">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-24 px-gutter pb-8">
        <p className="mb-4 text-[13px]">
          <Link className="zx-link text-muted" href="/">Back to home</Link>
        </p>
        <Footer />
      </div>
    </>
  );
}
