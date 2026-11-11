import Link from 'next/link';
import PageEnd from '@/components/PageEnd';
import { pad, pageMeta } from '@/lib/site';

export const metadata = pageMeta(
  '/websites',
  'Business website for €1,200 + VAT | ZYXEN',
  'A professional website with up to 5 pages for €1,200 + VAT. Optional €45/month website care. Clear scope, two revision rounds and handover.',
);

const pages = [
  ['Home', 'Your first impression: who you are, what you offer and one clear next step.'],
  ['Services', 'Each service in plain language, with the action you want visitors to take.'],
  ['About', 'Your story, team and values — the reasons customers choose you.'],
  ['Work', 'Projects, photos or case studies that prove you deliver.'],
  ['Contact', 'An enquiry form and your details, set up to reach your inbox.'],
];

const included = [
  ['Up to 5 pages', 'Home, about, services, work and contact — adapted to your business.'],
  ['Designed for mobile', 'Readable content, clear navigation and a phone number that is easy to reach.'],
  ['Easy enquiries', 'An enquiry form, click-to-call and a link to your location on the map.'],
  ['Technical SEO essentials', 'Page titles, descriptions, sitemap and structured content. Search rankings are not guaranteed.'],
  ['Two revision rounds', 'Consolidated feedback and agreed changes before handover.'],
  ['A website you control', 'Your domain stays yours. Access and files are handed over after final payment.'],
];

const steps = [
  ['Tell us about your business', 'We review your services, available content and the purpose of your website.'],
  ['Agree the plan', 'Pages, content, dates and payments are set out in your written proposal.'],
  ['Review and launch', 'Review the preview, send consolidated feedback and approve publication.'],
];

const h2 = 'display m-0 text-[clamp(36px,4.6vw,72px)] leading-[0.95] tracking-[-0.05em]';
const ask = '/contact?offer=website';

export default function Websites() {
  return (
    <>
      <section className="stage-glow relative flex min-h-[720px] flex-col justify-between gap-12 px-gutter pb-9 pt-[120px] lg:h-screen" style={{ ['--glow-x' as string]: '68%', ['--glow-y' as string]: '50%' }}>
        <div className="flex max-w-[760px] flex-col gap-[18px]">
          <p className="label">(Business websites)</p>
          <h1 className="display m-0 text-[clamp(48px,7.4vw,124px)] leading-[0.88]">
            A website,
            <br />
            ready to work.
          </h1>
          <p className="m-0 mt-1.5 max-w-[440px] text-[17px] text-soft">
            Your business deserves a proper website. Show what you do, share your work and give customers an easy way to
            find and contact you.
          </p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <ol className="m-0 flex w-full max-w-[460px] list-none flex-col border-t border-line p-0">
            {pages.map(([name, text], i) => (
              <li key={name} className="flex flex-col gap-0.5 border-b border-line py-2.5">
                <span className="flex items-baseline gap-[18px]">
                  <span className="w-[22px] text-[12px] text-muted">{pad(i + 1)}</span>
                  <span className="display text-[24px] tracking-[-0.035em]">{name}</span>
                </span>
                <span className="pl-10 text-[14px] text-muted">{text}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-col items-start gap-3.5">
            <p className="label">Defined scope. Clear price.</p>
            <p className="display m-0 text-[clamp(48px,6vw,88px)] leading-none tracking-[-0.05em]">€1,200</p>
            <p className="m-0 text-[15px] text-soft">+ VAT · one-off build</p>
            <Link className="zx-cta mt-2" href={ask}>
              Let’s discuss your website <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap gap-x-20 gap-y-8 px-gutter pb-10 pt-28">
        <div className="flex flex-[1_1_420px] flex-col gap-3.5">
          <p className="label">(01) The package</p>
          <h2 className={h2}>Everything a small business needs to look and sell like a big one.</h2>
        </div>
        <div className="flex flex-[1_1_360px] flex-col self-end border-t border-line">
          {['Up to 5 pages, in one language', 'Adapted to your brand', 'Two revision rounds'].map((t) => (
            <p key={t} className="hair text-[18px]">{t}</p>
          ))}
          <p className="hair flex justify-between gap-4 text-[18px]">
            <span>Add optional care</span>
            <span className="text-right text-muted">45 € / month + VAT</span>
          </p>
          <p className="hair flex justify-between gap-4 text-[18px]">
            <span>First 12 months</span>
            <span className="text-right">
              €1,200 + VAT <span className="text-muted">· €1,740 + VAT with care</span>
            </span>
          </p>
          <p className="mt-4 text-[14px] text-muted">
            Hosting is arranged separately without care. Domain registration and business email are not included. With
            care, it is billed monthly, with no annual prepayment required.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-10 px-gutter pb-10 pt-24">
        <div className="flex flex-col gap-3.5">
          <p className="label">(02) What is included</p>
          <h2 className={h2}>Everything for a considered start.</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-10 gap-y-12">
          {included.map(([title, text], i) => (
            <div key={title} className="flex flex-col gap-2.5 border-t border-line pt-5">
              <span className="text-[13px] text-muted">({pad(i + 1)})</span>
              <h3 className="display m-0 text-[28px] leading-[1.1] tracking-[-0.035em]">{title}</h3>
              <p className="m-0 text-soft">{text}</p>
            </div>
          ))}
        </div>
        <p className="m-0 max-w-[760px] text-[15px] text-muted">
          This is a business presentation website using your supplied content and a proven design foundation. E-commerce,
          booking systems, a second language, a new logo, photography and copywriting are quoted separately. You supply any
          necessary legal text.
        </p>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-12 px-gutter pb-10 pt-24">
        <div className="flex flex-col gap-3 border-t border-line pt-[22px]">
          <p className="label">(03) What we need from you</p>
          <p className="m-0 text-[18px] leading-[1.45]">Your services, brand assets, available copy and images, and the action you want visitors to take.</p>
        </div>
        <div className="flex flex-col gap-3 border-t border-line pt-[22px]">
          <p className="label">(04) Scope and options</p>
          <p className="m-0 text-[18px] leading-[1.45]">
            Page count, languages and content preparation are agreed in the proposal. Stores, custom integrations and ongoing
            care are scoped separately.
          </p>
        </div>
        <div className="flex flex-col gap-3 border-t border-accent pt-[22px]">
          <p className="label text-accent">(05) No surprises</p>
          <p className="m-0 text-[18px] leading-[1.45]">Scope, price and schedule are agreed in a written proposal before work begins.</p>
        </div>
      </section>

      <section className="flex flex-wrap gap-x-20 gap-y-8 px-gutter pb-10 pt-24">
        <div className="flex flex-[1_1_420px] flex-col gap-3.5">
          <p className="label">(06) After launch</p>
          <h2 className={h2}>Care, if you need it.</h2>
          <p className="display m-0 mt-4 text-[48px] leading-none tracking-[-0.05em]">
            45 € <span className="text-[18px] tracking-normal text-muted">/ month + VAT</span>
          </p>
        </div>
        <div className="flex flex-[1_1_420px] flex-col gap-4 text-[18px] text-soft">
          <p className="m-0">
            For websites built under this package: hosting, SSL, backups, a monthly technical check and necessary updates to
            the agreed system.
          </p>
          <p className="m-0">
            Content changes, new pages, business email and out-of-hours support are quoted separately. Care is optional, and
            cancelling it does not affect your ownership of the website.
          </p>
          <p className="m-0 text-[14px] text-muted">
            Before starting, we agree hosting, access, support procedures and cancellation terms in writing.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-10 px-gutter pb-10 pt-24">
        <div className="flex flex-col gap-3.5">
          <p className="label">(07) How we start</p>
          <h2 className={h2}>A short conversation. A clear plan.</h2>
        </div>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-10 p-0">
          {steps.map(([title, text], i) => (
            <li key={title} className="flex flex-col gap-2.5 border-t border-line pt-5">
              <span className="text-[13px] text-muted">({pad(i + 1)})</span>
              <h3 className="display m-0 text-[28px] leading-[1.1] tracking-[-0.035em]">{title}</h3>
              <p className="m-0 text-soft">{text}</p>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-7">
          <p className="m-0 max-w-[560px] text-soft">
            Need something more complex? We also build applications, commerce platforms and integrations.{' '}
            <Link className="zx-link text-ink" href="/services">All services →</Link>
          </p>
          <Link className="zx-cta" href={ask}>
            Ask about the €1,200 website <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <PageEnd href="/about" label="About" />
    </>
  );
}
