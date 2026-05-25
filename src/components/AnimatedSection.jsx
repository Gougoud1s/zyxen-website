import { motion } from 'framer-motion';

const variants = {
  fade: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  depth: {
    hidden: { opacity: 0, y: 48, scale: 0.97, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  },
  slide: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
};

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  variant = 'fade',
  duration = 0.7,
}) {
  const v = variants[variant] || variants.fade;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={v}
      className={className}
    >
      {children}
    </motion.div>
  );
}