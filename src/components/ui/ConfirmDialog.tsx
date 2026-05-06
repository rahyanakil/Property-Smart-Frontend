'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { backdrop, modalPanel } from '@/lib/animations';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  loading?: boolean;
}

export default function ConfirmDialog({ title, message, onConfirm, onCancel, danger, loading }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={backdrop}
        initial="hidden"
        animate="show"
        exit="exit"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
        onClick={onCancel}
      >
        <motion.div
          className="card max-w-sm w-full p-6"
          variants={modalPanel}
          initial="hidden"
          animate="show"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-3 mb-4">
            {danger && (
              <motion.div
                className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.15 }}
              >
                <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
              </motion.div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{message}</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <motion.button
              onClick={onCancel}
              disabled={loading}
              className="btn-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={onConfirm}
              disabled={loading}
              className={danger ? 'btn-danger' : 'btn-primary'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? 'Processing...' : 'Confirm'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
