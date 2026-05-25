import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30, restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] pointer-events-none"
      aria-hidden="true"
      role="progressbar"
    >
      <div className="h-full w-full" style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), #AF994D)' }} />
    </motion.div>
  );
}