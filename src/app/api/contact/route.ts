import { after } from 'next/server';
import { Resend } from 'resend';
import { draftReply } from '@/lib/contact/draft';
import { autoReplyHtml, draftHtml, esc, ownerHtml, type Lead } from '@/lib/contact/emails';
import { createNotionLead } from '@/lib/contact/notion';
import { MIN_FILL_MS } from '@/lib/contact/options';
import { allow, clientIp } from '@/lib/contact/rateLimit';
import { contactSchema } from '@/lib/contact/schema';
import { SITE_URL } from '@/lib/site';

export const runtime = 'nodejs';
// Room for the reply draft, which is written after the visitor already has their answer.
export const maxDuration = 60;

// Repo fact (kept over the brief's single address): both owners receive every enquiry.
const OWNER_EMAILS = ['i.gougoudis@zyxen.gr', 't.martinis@zyxen.gr'];

const json = (status: number, body: Record<string, unknown>) => Response.json(body, { status });
const reason = (r: PromiseSettledResult<{ error?: unknown } | unknown>) =>
  r.status === 'rejected' ? r.reason : (r.value as { error?: unknown } | null)?.error;

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json(415, { error: 'Content-Type must be application/json' });
  }
  if (!allow(clientIp(request.headers))) {
    return json(429, { error: 'Too many messages in a short time. Please try again in a few minutes, or email hello@zyxen.gr.' });
  }

  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return json(400, { error: 'Please check the highlighted fields.', fields: Object.keys(parsed.error.flatten().fieldErrors) });
  }
  const input = parsed.data;

  // Bots: answer as if it worked, send nothing.
  if (input.nickname) {
    console.warn('Contact form: honeypot filled, ignored');
    return json(200, { success: true });
  }
  if (input.elapsed < MIN_FILL_MS) {
    return json(400, { error: 'That was quick. Please check your message and send it again.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return json(500, { error: 'Server configuration error' });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const lead: Lead = {
    name: input.name,
    email: input.email,
    service: input.service,
    budget: input.budget || 'Not specified',
    details: input.message,
    website: input.website,
  };

  /*
   * The owner notification is the lead itself and must not be lost. The visitor's confirmation
   * and the Notion record are courtesies: each is judged on its own, and their failures are only logged.
   */
  const [owner, confirmation, notion] = await Promise.allSettled([
    resend.emails.send({
      from: 'ZYXEN Website <no-reply@zyxen.gr>',
      to: OWNER_EMAILS,
      replyTo: lead.email,
      subject: `New Inquiry: ${esc(lead.name)} — ${esc(lead.service)}`,
      html: ownerHtml(lead),
    }),
    resend.emails.send({
      from: 'ZYXEN <no-reply@zyxen.gr>',
      to: [lead.email],
      replyTo: 'hello@zyxen.gr',
      subject: 'We received your request — ZYXEN',
      html: autoReplyHtml(lead),
    }),
    createNotionLead(input, `${SITE_URL}/contact`),
  ]);

  const confirmationError = reason(confirmation);
  if (confirmationError) console.warn('Confirmation email failed (lead still delivered):', (confirmationError as Error).message ?? confirmationError);
  if (notion.status === 'rejected' || notion.value === false) console.warn('Lead not saved to Notion; the owner email is the record');

  const ownerError = reason(owner);
  if (ownerError) {
    console.error('Owner notification failed:', (ownerError as Error).message ?? ownerError);
    return json(502, { error: 'Your message could not be sent. Please try again, or email hello@zyxen.gr directly.' });
  }

  // The lead is delivered. A reply draft follows in its own email, without keeping the visitor waiting.
  after(async () => {
    const draft = await draftReply(lead);
    if (!draft) return;
    const { error } = await resend.emails.send({
      from: 'ZYXEN Website <no-reply@zyxen.gr>',
      to: OWNER_EMAILS,
      replyTo: lead.email,
      subject: `Draft reply: ${esc(lead.name)} — ${esc(lead.service)}`,
      html: draftHtml(lead, draft),
    });
    if (error) console.warn('Draft reply email failed:', error.message);
  });
  return json(200, { success: true });
}
