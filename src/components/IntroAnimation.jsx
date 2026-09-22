import { useEffect } from 'react';

/**
 * All intros removed — returns null immediately.
 */
export default function IntroAnimation({ onComplete }) {
  useEffect(() => {
    if (onComplete) onComplete();
  }, [onComplete]);

  return null;
}
