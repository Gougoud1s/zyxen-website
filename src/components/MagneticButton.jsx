import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Magnetic button — follows cursor within a radius.
 * Spring physics return on mouse leave.
 */
export default function MagneticButton({ children, className = '', strength = 0.38, ...props }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 0.5 }}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}