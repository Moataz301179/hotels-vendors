"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "warning" | "error";

export interface Toast {
  /** Unique identifier for the toast */
  id: string;
  /** Message text to display */
  message: string;
  /** Visual category affecting border color and icon */
  type: ToastType;
  /** Auto-dismiss duration in ms (default: 4000) */
  duration?: number;
}

interface GlassToastProps {
  /** Array of active toasts to render */
  toasts: Toast[];
  /** Callback when a toast is dismissed */
  onDismiss?: (id: string) => void;
}

const toastStyles: Record<ToastType, string> = {
  success: "border-emerald-500/40",
  warning: "border-amber-500/40",
  error: "border-red-600/40",
};

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
};

/**
 * Glassmorphism notification toast stack positioned at the top-right.
 *
 * - Enter: slide in from right + fade
 * - Exit: slide out to right + shrink
 * - Auto-dismiss after duration (default 4s)
 * - Glass styling with type-specific colored borders
 */
export function GlassToast({ toasts, onDismiss }: GlassToastProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss?: (id: string) => void;
}) {
  const duration = toast.duration ?? 4000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss?.(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-auto flex items-start gap-3 min-w-[280px] max-w-[380px] px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border ${toastStyles[toast.type]} shadow-lg shadow-black/20`}
    >
      <div className="mt-0.5 shrink-0">{toastIcons[toast.type]}</div>
      <p className="text-sm text-white/90 leading-relaxed flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss?.(toast.id)}
        className="shrink-0 text-white/40 hover:text-white/80 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
