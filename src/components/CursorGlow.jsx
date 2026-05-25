import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

/**
 * Soft ambient cursor glow — desktop only.
 * A large, very blurred orb that lazily follows the cursor.
 * Creates depth and atmosphere without distraction.
 */
export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -400, y: -400 });
  const [mounted, setMounted] = useState(false);

  const springX = useSpring(pos.x, { stiffness: 40, damping: 20, mass: 1 });
  const springY = useSpring(pos.y, { stiffness: 40, damping: 20, mass: 1 });

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setMounted(true);

    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-0"
      style={{
        left: springX,
        top: springY,
        translateX: '-50%',
        translateY: '-50%',
        width: 560,
        height: 560,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,44,0.055) 0%, rgba(175,153,77,0.025) 40%, transparent 70%)',
        filter: 'blur(40px)',
      }}
      aria-hidden="true"
    />
  );
}