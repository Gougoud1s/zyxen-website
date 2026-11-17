/*
 * Home intro timeline, in milliseconds from the first paint. One source for the CSS (HomeIntro writes these
 * as custom properties) and for the script (IntroPlayer).
 */
const WIPE_START_MS = 1900;
const WIPE_DURATION_MS = 600;

export const INTRO = {
  /** Pause before the first edge of the mark starts drawing. */
  leadMs: 80,
  /** Delay between one edge starting and the next. */
  edgeGapMs: 24,
  /** How long the mark keeps turning before it settles face-on. */
  drawMs: 1500,
  /** When the ZYXEN wordmark starts to resolve. */
  wordMs: 950,
  /** When the orange panel starts to rise; skipping is no longer offered from here. */
  wipeStartMs: WIPE_START_MS,
  wipeDurationMs: WIPE_DURATION_MS,
  /** The panel covers the screen: the overlay goes and the hero headline replays underneath. */
  coverMs: WIPE_START_MS + WIPE_DURATION_MS / 2,
  /** The panel has left: 2.5s in total. */
  endMs: WIPE_START_MS + WIPE_DURATION_MS,
  /** When the 3D scenes may start loading: after the headline has replayed, so neither stutters. */
  releaseScenesMs: WIPE_START_MS + WIPE_DURATION_MS + 700,
  /** Time the hero headline needs to finish its replay before the intro state is cleared. */
  heroSettleMs: 1800,
  /** How far the mark is turned away when it starts drawing (radians). */
  startYaw: 1.9,
} as const;

/** Fired on window when the intro lets the 3D scenes start (see SceneCanvas). */
export const INTRO_RELEASE_EVENT = 'zx:intro-release';
export const introIsPlaying = () => document.documentElement.dataset.intro === 'play';

export const introCssVariables = `:root{--intro-lead:${INTRO.leadMs}ms;--intro-edge-gap:${INTRO.edgeGapMs}ms;--intro-draw:${INTRO.drawMs}ms;--intro-word:${INTRO.wordMs}ms;--intro-wipe:${INTRO.wipeStartMs}ms;--intro-wipe-ms:${INTRO.wipeDurationMs}ms;--intro-cover:${INTRO.coverMs}ms}`;
