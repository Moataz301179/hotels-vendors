"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  y?: number;
}

export function HoverLift({
  children,
  className = "",
  scale = 1.02,
  y = -4,
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{ scale, y }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({
  children,
  className = "",
  glowColor = "rgba(139, 0, 0, 0.15)",
}: GlowCardProps) {
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 30px ${glowColor}`,
      }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
