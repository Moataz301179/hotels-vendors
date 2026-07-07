"use client";

import { useEffect, useRef, useState } from "react";
import { useSpring, useMotionValue, useTransform, motion } from "framer-motion";

interface NumberRollProps {
  /** The target number to display */
  value: number;
  /** Optional prefix (e.g. "EGP ") */
  prefix?: string;
  /** Optional suffix (e.g. "%") */
  suffix?: string;
  /** Animation duration in seconds (default: 0.8) */
  duration?: number;
  /** Additional Tailwind classes */
  className?: string;
}

/**
 * Animated number counter that springs from the previous value to the new value.
 *
 * Uses Framer Motion's useSpring for smooth interpolation.
 * Formats numbers with Egyptian locale (en-EG).
 * Optionally flashes green on increase or red on decrease.
 */
export function NumberRoll({
  value,
  prefix = "",
  suffix = "",
  duration = 0.8,
  className = "",
}: NumberRollProps) {
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });
  const display = useTransform(springValue, (latest) =>
    new Intl.NumberFormat("en-EG").format(Math.round(latest))
  );

  const [displayValue, setDisplayValue] = useState(
    new Intl.NumberFormat("en-EG").format(value)
  );
  const prevValueRef = useRef(value);
  const [flash, setFlash] = useState<"increase" | "decrease" | null>(null);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [display]);

  useEffect(() => {
    if (value > prevValueRef.current) {
      setFlash("increase");
    } else if (value < prevValueRef.current) {
      setFlash("decrease");
    }
    prevValueRef.current = value;

    const timer = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(timer);
  }, [value]);

  const flashClass =
    flash === "increase"
      ? "text-emerald-400"
      : flash === "decrease"
      ? "text-red-500"
      : "";

  return (
    <motion.span
      className={`inline-block tabular-nums font-bold text-3xl tracking-tight ${flashClass} ${className}`}
      animate={
        flash
          ? { scale: [1, 1.04, 1] }
          : {}
      }
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {prefix}
      {displayValue}
      {suffix}
    </motion.span>
  );
}
