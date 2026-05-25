import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const OWNER_EMAILS = ['i.gougoudis@zyxen.gr', 't.martinis@zyxen.gr'];

/* Field length limits — reject payloads that exceed these */
const LIMITS = { name: 120, email: 254, service: 120, budget: 120, details: 4000 };

/* Strict email format check */
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,63}$/;

/* Allowed lang values */
const VALID_LANGS = new Set(['el', 'en']);

/* Escape user content before embedding into email HTML */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function ownerHtml({ name, email, service, budget, details }) {
  const n = esc(name), e = esc(email), s = esc(service), b = esc(budget), d = esc(details);
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#0F0F12;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F12;padding:40px 0;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;"><tr><td style="background:#0F0F12;padding:40px 40px 0;border-top:3px solid #AF994D;"><table width="100%"><tr><td><span style="font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:-0.02em;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">ZYX<span style="color:#AF994D;">EN</span></span></td><td align="right"><span style="font-size:10px;color:#AF994D;letter-spacing:0.2em;text-transform:uppercase;">Systems, Engineered.</span></td></tr></table></td></tr><tr><td style="background:#0F0F12;padding:32px 40px 8px;"><p style="margin:0;font-size:11px;color:#AF994D;letter-spacing:0.2em;text-transform:uppercase;">New Project Inquiry</p><h1 style="margin:10px 0 0;font-size:26px;font-weight:700;color:#FFFFFF;letter-spacing:-0.02em;">${n}</h1><p style="margin:6px 0 0;font-size:14px;color:#888;">submitted via zyxen.gr</p></td></tr><tr><td style="padding:0 40px;background:#0F0F12;"><div style="height:1px;background:linear-gradient(90deg,transparent,#AF994D,transparent);margin:20px 0;"></div></td></tr><tr><td style="background:#0F0F12;padding:0 40px 28px;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding-bottom:18px;"><p style="margin:0 0 4px;font-size:10px;color:#AF994D;letter-spacing:0.16em;text-transform:uppercase;">Full Name</p><p style="margin:0;font-size:15px;color:#F0F0F0;">${n}</p></td></tr><tr><td style="padding-bottom:18px;"><p style="margin:0 0 4px;font-size:10px;color:#AF994D;letter-spacing:0.16em;text-transform:uppercase;">Email</p><p style="margin:0;font-size:15px;"><a href="mailto:${e}" style="color:#FF6B2C;text-decoration:none;">${e}</a></p></td></tr><tr><td style="padding-bottom:18px;"><p style="margin:0 0 4px;font-size:10px;color:#AF994D;letter-spacing:0.16em;text-transform:uppercase;">Service</p><p style="margin:0;font-size:15px;color:#F0F0F0;">${s}</p></td></tr><tr><td style="padding-bottom:18px;"><p style="margin:0 0 4px;font-size:10px;color:#AF994D;letter-spacing:0.16em;text-transform:uppercase;">Budget</p><p style="margin:0;font-size:15px;color:#F0F0F0;">${b}</p></td></tr><tr><td><p style="margin:0 0 8px;font-size:10px;color:#AF994D;letter-spacing:0.16em;text-transform:uppercase;">Project Details</p><div style="background:#161618;border-left:3px solid #AF994D;border-radius:4px;padding:14px 18px;"><p style="margin:0;font-size:14px;color:#CCCCCC;line-height:1.65;white-space:pre-wrap;">${d}</p></div></td></tr></table></td></tr><tr><td style="background:#0F0F12;padding:20px 40px 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(175,153,77,0.2),transparent);margin-bottom:20px;"></div><p style="margin:0;font-size:11px;color:#555;text-align:center;">ZYXEN · <a href="https://www.zyxen.gr" style="color:#555;text-decoration:none;">zyxen.gr</a> · hello@zyxen.gr</p></td></tr></table></td></tr></table></body></html>`;
}

function autoReplyHtml({ name, service, budget, lang }) {
  const n = esc(name), s = esc(service), b = esc(budget);
  if (lang === 'el') {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#0F0F12;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F12;padding:40px 0;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;"><tr><td style="background:#0F0F12;padding:40px 40px 0;border-top:3px solid #AF994D;"><table width="100%"><tr><td><span style="font-size:22px;font-weight:700;color:#FFFFFF;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">ZYX<span style="color:#AF994D;">EN</span></span></td><td align="right"><span style="font-size:10px;color:#AF994D;letter-spacing:0.2em;text-transform:uppercase;">Systems, Engineered.</span></td></tr></table></td></tr><tr><td style="padding:36px 40px 8px;background:#0F0F12;"><p style="margin:0;font-size:11px;color:#AF994D;letter-spacing:0.2em;text-transform:uppercase;">Λάβαμε το αίτημά σας</p><h1 style="margin:10px 0 0;font-size:28px;font-weight:700;color:#FFFFFF;">Ευχαριστούμε, ${n}.</h1></td></tr><tr><td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,#AF994D,transparent);margin:20px 0;"></div></td></tr><tr><td style="padding:0 40px 28px;background:#0F0F12;"><p style="margin:0 0 16px;font-size:15px;color:#CCCCCC;line-height:1.7;">Λάβαμε το αίτημά σας και η ομάδα μας θα επικοινωνήσει μαζί σας εντός <strong style="color:#FFFFFF;">μίας εργάσιμης ημέρας</strong>.</p><p style="margin:0 0 16px;font-size:15px;color:#CCCCCC;line-height:1.7;">Εάν χρειαστείτε άμεση βοήθεια, επικοινωνήστε μαζί μας στο <a href="mailto:hello@zyxen.gr" style="color:#FF6B2C;text-decoration:none;">hello@zyxen.gr</a>.</p><table cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr><td style="background:#AF994D;border-radius:100px;"><a href="https://www.zyxen.gr" style="display:inline-block;padding:13px 28px;font-size:13px;font-weight:600;color:#0F0F12;text-decoration:none;letter-spacing:0.04em;">Επισκεφθείτε το zyxen.gr</a></td></tr></table></td></tr><tr><td style="background:#161618;padding:24px 40px;"><p style="margin:0 0 6px;font-size:13px;color:#888;">Επιλογή υπηρεσίας: <span style="color:#F0F0F0;">${s}</span></p><p style="margin:0;font-size:13px;color:#888;">Budget: <span style="color:#F0F0F0;">${b}</span></p></td></tr><tr><td style="padding:20px 40px 40px;background:#0F0F12;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(175,153,77,0.2),transparent);margin-bottom:20px;"></div><p style="margin:0;font-size:11px;color:#555;text-align:center;">ZYXEN · zyxen.gr · hello@zyxen.gr</p><p style="margin:6px 0 0;font-size:10px;color:#333;text-align:center;">Αυτό είναι αυτόματο μήνυμα. Παρακαλώ μην απαντάτε σε αυτό.</p></td></tr></table></td></tr></table></body></html>`;
  }
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#0F0F12;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F12;padding:40px 0;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;"><tr><td style="background:#0F0F12;padding:40px 40px 0;border-top:3px solid #AF994D;"><table width="100%"><tr><td><span style="font-size:22px;font-weight:700;color:#FFFFFF;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">ZYX<span style="color:#AF994D;">EN</span></span></td><td align="right"><span style="font-size:10px;color:#AF994D;letter-spacing:0.2em;text-transform:uppercase;">Systems, Engineered.</span></td></tr></table></td></tr><tr><td style="padding:36px 40px 8px;background:#0F0F12;"><p style="margin:0;font-size:11px;color:#AF994D;letter-spacing:0.2em;text-transform:uppercase;">We received your request</p><h1 style="margin:10px 0 0;font-size:28px;font-weight:700;color:#FFFFFF;">Thank you, ${n}.</h1></td></tr><tr><td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,#AF994D,transparent);margin:20px 0;"></div></td></tr><tr><td style="padding:0 40px 28px;background:#0F0F12;"><p style="margin:0 0 16px;font-size:15px;color:#CCCCCC;line-height:1.7;">We've received your inquiry and our team will get back to you within <strong style="color:#FFFFFF;">one business day</strong>.</p><p style="margin:0 0 16px;font-size:15px;color:#CCCCCC;line-height:1.7;">If you need immediate assistance, reach us at <a href="mailto:hello@zyxen.gr" style="color:#FF6B2C;text-decoration:none;">hello@zyxen.gr</a>.</p><table cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr><td style="background:#AF994D;border-radius:100px;"><a href="https://www.zyxen.gr" style="display:inline-block;padding:13px 28px;font-size:13px;font-weight:600;color:#0F0F12;text-decoration:none;letter-spacing:0.04em;">Visit zyxen.gr</a></td></tr></table></td></tr><tr><td style="background:#161618;padding:24px 40px;"><p style="margin:0 0 6px;font-size:13px;color:#888;">Selected service: <span style="color:#F0F0F0;">${s}</span></p><p style="margin:0;font-size:13px;color:#888;">Budget range: <span style="color:#F0F0F0;">${b}</span></p></td></tr><tr><td style="padding:20px 40px 40px;background:#0F0F12;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(175,153,77,0.2),transparent);margin-bottom:20px;"></div><p style="margin:0;font-size:11px;color:#555;text-align:center;">ZYXEN · zyxen.gr · hello@zyxen.gr</p><p style="margin:6px 0 0;font-size:10px;color:#333;text-align:center;">This is an automated message. Please do not reply to this email.</p></td></tr></table></td></tr></table></body></html>`;
}

export default async function handler(req, res) {
  /* Method guard */
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  /* Content-type guard */
  const ct = req.headers['content-type'] || '';
  if (!ct.includes('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }

  const { name, email, service, budget, details, lang } = req.body ?? {};

  /* Presence check */
  if (!name || !email || !service || !budget || !details) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  /* Length limits */
  for (const [field, limit] of Object.entries(LIMITS)) {
    const value = req.body[field];
    if (typeof value === 'string' && value.length > limit) {
      return res.status(400).json({ error: `Field "${field}" exceeds maximum length of ${limit}` });
    }
  }

  /* Email format validation */
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  /* Sanitise lang — default to 'en' if not a recognised value */
  const safeLang = VALID_LANGS.has(lang) ? lang : 'en';

  /* Reject if RESEND_API_KEY is not configured */
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    await Promise.all([
      resend.emails.send({
        from: 'ZYXEN Website <no-reply@zyxen.gr>',
        to: OWNER_EMAILS,
        subject: `New Inquiry: ${esc(name)} — ${esc(service)}`,
        html: ownerHtml({ name, email, service, budget, details }),
      }),
      resend.emails.send({
        from: 'ZYXEN <no-reply@zyxen.gr>',
        to: [email],
        replyTo: 'hello@zyxen.gr',
        subject: safeLang === 'el' ? 'Λάβαμε το αίτημά σας — ZYXEN' : 'We received your request — ZYXEN',
        html: autoReplyHtml({ name, service, budget, lang: safeLang }),
      }),
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email send failed:', error?.message);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
