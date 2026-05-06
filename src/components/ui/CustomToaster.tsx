'use client';

import { useEffect } from 'react';
import { useToaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  CheckCircle2, XCircle, AlertCircle, Info, X, Loader2,
} from 'lucide-react';

// ── Per-type visual config ──────────────────────────────────────────────────
const CONFIG = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    bar: 'bg-emerald-500',
    ring: 'ring-emerald-200 dark:ring-emerald-800',
    label: 'Success',
  },
  error: {
    icon: XCircle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50 dark:bg-red-900/30',
    bar: 'bg-red-500',
    ring: 'ring-red-200 dark:ring-red-800',
    label: 'Error',
  },
  loading: {
    icon: Loader2,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-900/30',
    bar: 'bg-blue-500',
    ring: 'ring-blue-200 dark:ring-blue-800',
    label: 'Loading',
  },
  blank: {
    icon: Info,
    iconColor: 'text-gray-500',
    iconBg: 'bg-gray-100 dark:bg-gray-800',
    bar: 'bg-gray-400',
    ring: 'ring-gray-200 dark:ring-gray-700',
    label: 'Info',
  },
  custom: {
    icon: Info,
    iconColor: 'text-primary-500',
    iconBg: 'bg-primary-50 dark:bg-primary-900/30',
    bar: 'bg-primary-500',
    ring: 'ring-primary-200 dark:ring-primary-800',
    label: 'Notice',
  },
} as const;

// ── Individual toast card ───────────────────────────────────────────────────
function ToastCard({
  t,
  onDismiss,
  paused,
}: {
  t: ReturnType<typeof useToaster>['toasts'][number];
  onDismiss: () => void;
  paused: boolean;
}) {
  const shouldReduce = useReducedMotion();
  const type = (t.type in CONFIG ? t.type : 'blank') as keyof typeof CONFIG;
  const cfg = CONFIG[type];
  const Icon = cfg.icon;
  const duration = t.duration ?? 4000;
  const isLoading = t.type === 'loading';

  // Pause/resume via CSS animation-play-state on the progress bar
  const barStyle: React.CSSProperties = {
    animationDuration: `${duration}ms`,
    animationPlayState: paused ? 'paused' : 'running',
  };

  return (
    <div className={`
      relative flex items-start gap-3
      w-[340px] max-w-[calc(100vw-2rem)]
      bg-white dark:bg-gray-900
      border border-gray-100 dark:border-gray-700/80
      rounded-2xl shadow-lg shadow-black/8 dark:shadow-black/30
      p-4 pr-3 overflow-hidden
      ring-1 ${cfg.ring}
    `}>

      {/* Coloured accent bar — left edge */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${cfg.bar} rounded-l-2xl`} />

      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl ${cfg.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon
          size={18}
          className={`${cfg.iconColor} ${isLoading && !shouldReduce ? 'animate-spin' : ''}`}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide leading-none mb-1">
          {cfg.label}
        </p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug break-words">
          {typeof t.message === 'string' ? t.message : null}
        </p>
      </div>

      {/* Dismiss */}
      {!isLoading && (
        <button
          onClick={onDismiss}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={14} />
        </button>
      )}

      {/* Progress bar — shrinks from full to 0 over `duration` ms */}
      {!isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-100 dark:bg-gray-800 rounded-b-2xl overflow-hidden">
          <div
            className={`h-full ${cfg.bar} opacity-60 origin-left`}
            style={{
              ...barStyle,
              animation: shouldReduce ? 'none' : `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// ── Container ───────────────────────────────────────────────────────────────
export default function CustomToaster() {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight } = handlers;
  const shouldReduce = useReducedMotion();

  // Inject the keyframes once
  useEffect(() => {
    if (document.getElementById('ps-toast-kf')) return;
    const style = document.createElement('style');
    style.id = 'ps-toast-kf';
    style.textContent = `
      @keyframes shrink {
        from { transform: scaleX(1); }
        to   { transform: scaleX(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 pointer-events-none"
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {toasts
          .filter((t) => t.visible)
          .map((t) => {
            const offset = calculateOffset(t, { reverseOrder: false, gutter: 10 });
            void updateHeight;   // satisfy lint — we let flex handle positioning
            void offset;
            return (
              <motion.div
                key={t.id}
                layout
                className="pointer-events-auto"
                initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: 72, scale: 0.92 }}
                animate={shouldReduce ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
                exit={shouldReduce ? { opacity: 0 } : { opacity: 0, x: 72, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.9 }}
              >
                <ToastCard
                  t={t}
                  onDismiss={() => toast.dismiss(t.id)}
                  paused={false}
                />
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
}
