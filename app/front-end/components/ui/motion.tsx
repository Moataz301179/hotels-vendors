"use client";

import { motion } from "framer-motion";

export function FadeIn({
  children,
  delay = 0,
  y = 30,
  duration = 0.6,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = "",
  delayStep = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  delayStep?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: delayStep } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{
        rotateY: -4,
        rotateX: 2,
        translateY: -8,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      }}
      style={{ perspective: 1200, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

export const sectionDivider = "w-28 h-[1px] mx-auto my-16 bg-gradient-to-r from-transparent via-[#8cff2e] to-transparent";

export function SectionLabel({ children, color = "lime" }: { children: React.ReactNode; color?: "lime" | "purple" }) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.12em] mb-4 ${
        color === "lime" ? "text-[#8cff2e]" : "text-[#a855f7]"
      }`}
    >
      {children}
    </p>
  );
}
