import type { Variants } from 'framer-motion';

// Smooth cubic-bezier matching SaaS design trends
const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease } },
};

// Container that staggers children
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Faster stagger for dense grids
export const staggerFast: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.0,
    },
  },
};

// Modal backdrop
export const backdrop: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Modal panel
export const modalPanel: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: 0.18, ease },
  },
};

// Mobile menu slide down
export const mobileMenu: Variants = {
  hidden: { opacity: 0, height: 0 },
  show: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.28, ease },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.22, ease },
  },
};

// Dropdown
export const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -6 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 500, damping: 35 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -4,
    transition: { duration: 0.15, ease },
  },
};
