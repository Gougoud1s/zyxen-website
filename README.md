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

The live scene replaces the poster only after its first frames are drawn. Before that, `Stage.tsx` loads the
prebuilt studio environment map, links the shaders without blocking the page and uploads the textures, each in its
own idle task; if any of that fails the poster stays.

After changing a scene's look, re-render its posters (and the social image background):

```bash
npm run build && npm start
npm run posters              # writes public/posters/*.webp and src/assets/og-hero.png
```

The studio lighting the gold and glass reflect is built offline, not in the browser. After changing the room in
`src/components/three/studioRoom.ts`, rebuild the map and then the posters:

```bash
npm run bake:environment     # writes public/environment/studio-{128,256}.png, needs no running server
```

## Motion

The motion vocabulary (shared with the social reels) lives in `src/components/motion/` and `src/app/motion.css`:

- `Kinetic`: headline whose words rise out of a mask; `slam` words punch in. `when="load"` for page heroes, `when="view"` on scroll.
- `Mark` / `StepBadge`: orange underline, circle or step number that draws itself. Step badges are for real sequences only.
- `Wipe`: orange panel that crosses the boundary between two sections.
- `Counter`: number that counts up once (the real value stays in the markup).
- `data-kx="rise" | "stagger"` on any element, plus `kx-rule` instead of `border-t border-line` for a hairline that draws itself.
- Pill buttons (`.zx-cta`) follow the pointer slightly and fill with orange; a reading-progress line sits at the top of the page.

`MotionRuntime` (in the layout) marks `[data-kx]` elements with `data-in` when they scroll into view. Nothing is hidden without
JavaScript or under reduced motion, and if the runtime never starts, everything is shown after 4 seconds.

**Home intro** (`HomeIntro`, `IntroPlayer`, timings in `introTimeline.ts`): the mark draws itself, the wordmark resolves and an
orange wipe hands off to the hero, in 2.5s. It plays once per browser session, is skipped by any key, click or scroll, and never
plays under reduced motion, for crawlers or in automated browsers (`navigator.webdriver`). The page underneath is complete the
whole time; the hero's 3D scene waits for the intro to finish so the two do not compete for the main thread.

## Phones

- `MobileCta` (in the layout) keeps a "Start a project" button within thumb reach below 768px: it appears after the hero,
  steps aside near the footer and is not rendered on `/contact`.
- `HomeStage` dims the home sculpture behind the text sections on phones, where it would otherwise sit under the lists.
- `CollapseOnPhones` folds secondary detail behind a tappable row below 640px (the offers on `/services`); it is a native
  `<details>` rendered open, so wider screens, crawlers and no-JavaScript visitors see everything.
- Text links (`.zx-link`) get a larger touch area on touch screens without changing how they look.

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
