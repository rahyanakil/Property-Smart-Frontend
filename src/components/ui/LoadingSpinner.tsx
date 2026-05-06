'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { outer: 28, inner: 16, dot: 4 },
  md: { outer: 48, inner: 28, dot: 6 },
  lg: { outer: 72, inner: 44, dot: 9 },
};

export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const s = SIZES[size];

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative" style={{ width: s.outer, height: s.outer }}>

        {/* Outer orbit ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#2563eb', borderRightColor: '#2563eb33' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner orbit ring — counter-rotates */}
        <motion.div
          className="absolute rounded-full border-2 border-transparent"
          style={{
            inset: (s.outer - s.inner) / 2,
            borderBottomColor: '#3b82f6',
            borderLeftColor: '#3b82f680',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
        />

        {/* Pulsing center dot */}
        <motion.div
          className="absolute bg-primary-600 rounded-full"
          style={{
            width: s.dot,
            height: s.dot,
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

/* Full-page blocking loader used during auth checks */
export function PageLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-white dark:bg-gray-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-col items-center gap-5">
        <LoadingSpinner size="lg" />
        <motion.p
          className="text-sm text-gray-400 dark:text-gray-500 tracking-widest uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading…
        </motion.p>
      </div>
    </motion.div>
  );
}
