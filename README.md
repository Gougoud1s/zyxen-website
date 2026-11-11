# zyxen.gr

The ZYXEN website: Next.js (App Router, static pages), TypeScript, Tailwind and React Three Fiber.
Hosted on Vercel (project `zyxen-digital-flow`).

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in only what you need; the site runs without them
npm run dev                  # http://localhost:3000
```

## Content

Copy and project data live in `src/lib/data.js`, `projectStories.js`, `serviceOffers.js`, `serviceQuestions.js`
and `legal.json`. Project screenshots are in `public/projects/` (`<slug>.webp` plus a `-640.webp` used on the 3D ring).

## 3D scenes

`src/components/three/` holds the six scenes (Home, Services, Work, Websites, About, Contact) and the shared kit.
Each scene is loaded after first paint, only when in view, and pauses off-screen. Visitors with reduced motion,
no WebGL or a low-end phone see a static poster instead.

After changing a scene's look, re-render its posters (and the social image background):

```bash
npm run build && npm start
npm run posters              # writes public/posters/*.webp and src/assets/og-hero.png
```

## Contact form

`POST /api/contact` validates the enquiry, then emails both owners and the visitor (Resend) and creates a lead in the
Notion Leads data source. Notion problems never block the email. Required in Vercel (Preview and Production):
`RESEND_API_KEY`, `NOTION_TOKEN`, `NOTION_LEADS_DATA_SOURCE_ID` (see `.env.example`).

## Tests

```bash
npm run build
npm run test:smoke      # against a running `npm start` (routes, redirects, sitemap)
npm run test:contact    # contact API against local mocks of Resend and Notion
npm run test:e2e        # Playwright: every page in Chromium and WebKit at 390-1920px, a11y, links, form, 3D fallbacks
```

`E2E_BASE_URL=https://<preview-url> npm run test:e2e` runs the browser suite against a deployed preview.

## Deploy

Every push to a branch gets a Vercel preview. Production deploys from `main`.
Redirects (old `/en` and `/el` URLs, retired pages, apex to www) are in `next.config.ts`.
