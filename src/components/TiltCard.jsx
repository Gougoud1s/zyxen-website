import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * 3D perspective tilt card.
 * On hover, card tilts toward the mouse cursor.
 * Degrades gracefully on touch devices.
 */
export default function TiltCard({ children, className = '', intensity = 8, scale = 1.02 }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTransform({
      rotateX: -dy * intensity,
      rotateY: dx * intensity,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
        scale: transform.rotateX !== 0 || transform.rotateY !== 0 ? scale : 1,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.6 }}
      style={{ transformStyle: 'preserve-3d', perspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}