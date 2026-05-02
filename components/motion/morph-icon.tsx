"use client";

import { type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface MorphIconProps {
  /** The icon to display when trigger is false */
  from: LucideIcon;
  /** The icon to display when trigger is true */
  to: LucideIcon;
  /** Toggle state that determines which icon is shown */
  trigger: boolean;
  /** Size in pixels (default: 24) */
  size?: number;
  /** Stroke width (default: 2) */
  strokeWidth?: number;
  /** Additional Tailwind classes */
  className?: string;
}

/**
 * An icon that crossfades and scales between two Lucide icons when triggered.
 *
 * Enter: fade in + scale bounce
 * Exit: fade out + scale down
 * Duration: 0.3s
 */
export function MorphIcon({
  from: FromIcon,
  to: ToIcon,
  trigger,
  size = 24,
  strokeWidth = 2,
  className = "",
}: MorphIconProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <AnimatePresence mode="wait">
        {!trigger ? (
          <motion.div
            key="from"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <FromIcon size={size} strokeWidth={strokeWidth} />
          </motion.div>
        ) : (
          <motion.div
            key="to"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ToIcon size={size} strokeWidth={strokeWidth} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
