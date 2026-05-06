'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ReactLenis, useLenis } from 'lenis/react';
import { useReducedMotion } from 'framer-motion';

// Sync Lenis virtual scroll position → Framer Motion's useScroll
// by dispatching a native scroll event on every Lenis tick.
function LenisFramerSync() {
  useLenis(() => {
    window.dispatchEvent(new Event('scroll', { bubbles: false }));
  });
  return null;
}

// Reset scroll position to top on every route change.
function LenisRouteReset() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion();
  const lenisRef = useRef(null);

  // When the user prefers reduced motion, skip Lenis entirely.
  if (shouldReduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        // Exponential ease-out — feels natural without being sluggish
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        duration: 1.2,
        smoothWheel: true,
        // Wheel sensitivity — slightly less than default to feel premium not floaty
        wheelMultiplier: 0.9,
        // Touch devices get native-ish feel
        touchMultiplier: 1.8,
        syncTouch: false,
        infinite: false,
        autoRaf: true,
      }}
    >
      <LenisFramerSync />
      <LenisRouteReset />
      {children}
    </ReactLenis>
  );
}

// Re-export useLenis so any component can call lenis.scrollTo()
export { useLenis };
