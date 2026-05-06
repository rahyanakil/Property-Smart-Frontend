'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
}

export default function WordReveal({
  text,
  className = '',
  delay = 0,
  duration = 0.55,
  stagger = 0.08,
  once = true,
}: WordRevealProps) {
  const shouldReduce = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduce) return <span className={className}>{text}</span>;

  return (
    <span className={`inline-flex flex-wrap gap-x-[0.3em] ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block" style={{ verticalAlign: 'bottom' }}>
          <motion.span
            className="inline-block"
            initial={{ y: '105%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
