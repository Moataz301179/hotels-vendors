"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PageTransitionProps {
  /** Unique key to trigger transition on route change */
  key: string;
  /** Page content to animate */
  children: ReactNode;
}

/**
 * Wraps page content with AnimatePresence for smooth route transitions.
 *
 * Exit: fade out + slight scale down (0.98)
 * Enter: fade in + slight scale up from 0.96
 * Duration: 0.35s, ease: cubic-bezier(0.16, 1, 0.3, 1)
 */
export function PageTransition({ key, children }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{
          duration: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
