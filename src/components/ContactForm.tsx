'use client';

import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { BUDGETS, SERVICES } from '@/lib/contact/options';
import { markSent, pulseMark } from './three/events';
import { useClientValue } from './useClientValue';

// Prefill for links from /services and /websites (same as the previous site).
const offers: Record<string, { service: string; budget?: string; details: string }> = {
  website: { service: 'Business website', budget: 'Discuss the website package', details: 'I am interested in the business website package.\n\nMy business: ' },
  commerce: { service: 'High-Scale E-Commerce', details: 'I would like to discuss an e-commerce project.\n\nNew store or existing store: \nMy catalogue and requirements: ' },
  custom: { service: 'AI Integration & Automation', details: 'I would like to discuss custom software or automation.\n\nThe process I want to improve: \nSystems involved: ' },
};

const FIELD_LABELS: Record<string, string> = {
  service: 'choose a service',
  name: 'your name',
  email: 'a valid email address',
  website: 'a website address like yourbusiness.gr',
  message: 'your message',
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm() {
  // Read after hydration, so the form itself is in the static HTML (useSearchParams would make it client-only).
  const search = useClientValue(() => location.search, '');
  const params = new URLSearchParams(search);
  const offer = offers[params.get('offer') ?? ''];
  const care = params.get('care') === 'yes' ? ' With optional website care.' : '';
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [invalid, setInvalid] = useState<string[]>([]);
  const form = useRef<HTMLFormElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    setStatus('sending');
    setError('');
    setInvalid([]);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          service: data.service,
          budget: data.budget ?? '',
          message: data.message,
          website: data.website ?? '',
          nickname: data.nickname ?? '',
          elapsed: Math.round(performance.now()),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; fields?: string[] };
      if (!res.ok) {
        const fields = (body.fields ?? []).filter((f) => f in FIELD_LABELS);
        setInvalid(fields);
        setStatus('error');
        setError(
          fields.length
            ? `Please add ${fields.map((f) => FIELD_LABELS[f]).join(', ')}.`
            : (body.error ?? 'Your message could not be sent. Please try again, or email hello@zyxen.gr directly.'),
        );
        if (fields[0]) form.current?.querySelector<HTMLElement>(`[name="${fields[0]}"]`)?.focus();
        return;
      }
      markSent();
      setStatus('sent');
    } catch {
      setStatus('error');
      setError('Your message could not be sent. Please try again, or email hello@zyxen.gr directly.');
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="flex flex-col gap-3">
        <p className="display m-0 text-[36px] leading-[1.1] tracking-[-0.04em]">Thank you. We’ll reply within one business day.</p>
        <Link className="zx-link self-start text-[15px] text-muted" href="/projects">
          Meanwhile, explore our work
        </Link>
      </div>
    );
  }

  const field = 'flex flex-col gap-1 text-[13px] text-muted';
  const bad = (name: string) => (invalid.includes(name) ? { 'aria-invalid': true, 'aria-describedby': 'contact-error' } : {});
  return (
    <form ref={form} key={search} onSubmit={submit} onInput={pulseMark} className="flex flex-col gap-[22px]">
      {offer?.service === 'Business website' && (
        <p className="m-0 border-l border-accent pl-4 text-[14px] text-soft">
          Business website with up to 5 pages. Scope, schedule and cost are agreed before starting. An enquiry is not an
          order.
        </p>
      )}
      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0" {...bad('service')}>
        <legend className="mb-2.5 p-0 text-[13px] text-muted">What do you need help with?</legend>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s, i) => (
            <label key={s}>
              <input className="sr-only" type="radio" name="service" value={s} required={i === 0} defaultChecked={offer?.service === s} />
              <span className="zx-chip">{s}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className={field}>
        Your name
        <input className="zx-in" type="text" name="name" autoComplete="name" required maxLength={120} {...bad('name')} />
      </label>
      <label className={field}>
        Email address
        <input className="zx-in" type="email" name="email" autoComplete="email" required maxLength={254} {...bad('email')} />
      </label>
      <label className={field}>
        Your current website (optional)
        <input className="zx-in" type="text" inputMode="url" name="website" placeholder="yourbusiness.gr" maxLength={200} {...bad('website')} />
      </label>
      {/* Honeypot: off-screen and skipped by keyboard and assistive tech; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input type="text" name="nickname" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <label className={field}>
        Budget range (optional)
        <select className="zx-in bg-bg" name="budget" defaultValue={offer?.budget ?? ''}>
          <option value="">Choose a range</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>
      <label className={field}>
        What would you like to achieve?
        <textarea
          className="zx-in resize-y"
          name="message"
          rows={4}
          required
          maxLength={4000}
          defaultValue={offer ? offer.details.replace('package.', `package.${care}`) : ''}
          {...bad('message')}
        />
      </label>
      <button type="submit" className="zx-cta self-start text-[16px]" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send enquiry'} <span aria-hidden="true">→</span>
      </button>
      <p id="contact-error" role="status" aria-live="polite" className="m-0 min-h-6 text-[14px] text-accent">
        {error}
      </p>
    </form>
  );
}
