"use client";

import { ReactNode } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

interface StaggerContainerProps {
  /** Child elements to stagger into view */
  children: ReactNode;
  /** Delay between each child's animation in seconds (default: 0.05) */
  staggerDelay?: number;
  /** Direction children enter from (default: 'up') */
  direction?: "up" | "left" | "right";
  /** Distance in pixels to translate from (default: 24) */
  distance?: number;
  /** Animation duration in seconds (default: 0.5) */
  duration?: number;
  /** Additional Tailwind classes for the container */
  className?: string;
  /** Whether to trigger animation only once (default: true) */
  once?: boolean;
  /** Margin for the in-view trigger (default: "-50px") */
  margin?: `${number}px` | `${number}px ${number}px ${number}px ${number}px`;
}

/**
 * Container that staggers its direct children into view with a fade + translate animation.
 *
 * Uses Framer Motion's useInView to trigger when scrolled into the viewport.
 * Perfect for dashboard metric cards, table rows, and list items.
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.05,
  direction = "up",
  distance = 24,
  duration = 0.5,
  className = "",
  once = true,
  margin = "-50px",
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin });

  const getOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "left":
        return { y: 0, x: distance };
      case "right":
        return { y: 0, x: -distance };
      default:
        return { y: distance, x: 0 };
    }
  };

  const offset = getOffset();

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: offset.y, x: offset.x },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>}
    </motion.div>
  );
}
