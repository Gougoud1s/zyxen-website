import { useState, useEffect, useCallback } from 'react';

/**
 * Tracks mouse position and returns normalized x/y values (-1 to 1)
 * for use in parallax/tilt motion effects.
 */
export default function useMouseParallax(strength = 1) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e) => {
    const x = ((e.clientX / window.innerWidth) * 2 - 1) * strength;
    const y = ((e.clientY / window.innerHeight) * 2 - 1) * strength;
    setPos({ x, y });
  }, [strength]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [handleMove]);

  return pos;
}