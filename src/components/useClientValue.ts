'use client';

import { useSyncExternalStore } from 'react';

const noop = () => () => {};

/** A browser-only value read after hydration (the server and first client render use `server`). */
export function useClientValue<T>(get: () => T, server: T, subscribe: (cb: () => void) => () => void = noop) {
  return useSyncExternalStore(subscribe, get, () => server);
}

const motionQuery = '(prefers-reduced-motion: reduce)';
export const useReducedMotion = () =>
  useClientValue(
    () => matchMedia(motionQuery).matches,
    true,
    (cb) => {
      const m = matchMedia(motionQuery);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
  );
