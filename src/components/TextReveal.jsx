import { motion } from 'framer-motion';

/**
 * Staggered word-by-word reveal animation.
 * Splits text into words and animates each with a slight delay.
 */
export default function TextReveal({
  text,
  className = '',
  delay = 0,
  stagger = 0.05,
  duration = 0.7,
  as: Tag = 'span',
}) {
  const words = text.split(' ');

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const word = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: {
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.span
      className={`inline ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} className="inline-block mr-[0.28em]">
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}