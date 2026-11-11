import { z } from 'zod';
import { BUDGETS, SERVICES } from './options';

const text = (max: number) => z.string().trim().min(1).max(max);

/** Normalise "yourbusiness.gr" to "https://yourbusiness.gr"; anything that is not a web address is rejected. */
const website = z
  .string()
  .trim()
  .max(200)
  .transform((v, ctx) => {
    if (!v) return undefined;
    try {
      const url = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
      if (!/^https?:$/.test(url.protocol) || !url.hostname.includes('.')) throw new Error();
      return url.toString();
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Enter a website address like yourbusiness.gr' });
      return z.NEVER;
    }
  });

export const contactSchema = z.object({
  name: text(120),
  email: z.email().max(254),
  service: z.enum(SERVICES),
  budget: z.union([z.enum(BUDGETS), z.literal('')]).default(''),
  message: text(4000),
  website: website.optional(),
  /** Honeypot: hidden from people, filled by bots. */
  nickname: z.string().max(200).default(''),
  /** Milliseconds between page load and submit, reported by the form. */
  elapsed: z.number().int().nonnegative(),
});

export type ContactInput = z.infer<typeof contactSchema>;
