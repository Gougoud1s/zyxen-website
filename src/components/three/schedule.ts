/** Longest a preparation step waits for the main thread to go idle before it runs anyway. */
const IDLE_TIMEOUT_MS = 200;

/**
 * Resolves in a later task, once the main thread is idle. Awaiting it between heavy steps keeps
 * each one in its own task, so the page can respond to input in between.
 */
export function nextIdle(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestIdleCallback === 'function') requestIdleCallback(() => resolve(), { timeout: IDLE_TIMEOUT_MS });
    else setTimeout(resolve, 0); // Safari has no requestIdleCallback
  });
}
