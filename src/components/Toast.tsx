/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Info, XCircle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-full max-w-sm px-4 md:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            className={`flex items-center gap-3 p-4 rounded-xl shadow-xl dark:bg-slate-900 border backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800 dark:border-emerald-900/30'
                : toast.type === 'error'
                ? 'bg-rose-50/95 border-rose-200 text-rose-800 dark:border-rose-900/30'
                : 'bg-amber-50/95 border-amber-200 text-amber-800 dark:border-amber-900/30'
            }`}
            id={`toast-${toast.id}`}
          >
            <div className="flex-shrink-0">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-amber-600" />}
            </div>
            
            <p className="text-sm font-medium flex-grow">{toast.message}</p>
            
            <button
              id={`toast-close-${toast.id}`}
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
