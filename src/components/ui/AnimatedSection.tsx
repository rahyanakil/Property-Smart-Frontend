'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  stagger?: boolean;
  delay?: number;
  once?: boolean;
}

export default function AnimatedSection({
  children,
  className,
  variants = fadeUp,
  stagger = false,
  delay = 0,
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const shouldReduce = useReducedMotion();

  if (shouldReduce) return <div className={className}>{children}</div>;

  const container = stagger ? staggerContainer : variants;

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-60px' }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  );
}

// Convenience: a single animated child item
export function AnimatedItem({
  children,
  className,
  variants = fadeUp,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}) {
  const shouldReduce = useReducedMotion();
  if (shouldReduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
