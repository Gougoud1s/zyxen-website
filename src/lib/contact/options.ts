// Form choices, shared by the client form and the server schema (no zod here, so the form bundle stays small).
export const SERVICES = [
  'Business website',
  'Website care',
  'Monthly development partnership',
  'Enterprise Web & CMS (Umbraco)',
  'High-Scale E-Commerce',
  'Custom SaaS & Mobile (Flutter)',
  'AI Integration & Automation',
  'Architectural Consulting',
] as const;

export const BUDGETS = ['Discuss the website package', '€1.5k — €5k', '€5k — €10k', '€10k — €25k', '€25k — €50k', '€50k — €100k', '€100k+'] as const;

/** Submissions faster than this after the page loaded are treated as bots. */
export const MIN_FILL_MS = 3000;
