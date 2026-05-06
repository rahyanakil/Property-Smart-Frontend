'use client';

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const shouldReduce = useReducedMotion();

  if (shouldReduce) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-primary-500 via-blue-400 to-primary-600"
      style={{ scaleX }}
    />
  );
}
