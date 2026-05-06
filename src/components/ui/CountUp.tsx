'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  to: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function CountUp({ to, duration = 1.8, decimals = 0, suffix = '', prefix = '', className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const shouldReduce = useReducedMotion();
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduce) { setValue(to); return; }

    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - start) / (duration * 1000);
      const progress = Math.min(elapsed, 1);
      // Ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(parseFloat((eased * to).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isInView, to, duration, decimals, shouldReduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}
