"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export function HeroVisual({ children }: { children: React.ReactNode }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 3D-like transform — wrapped in useSpring for smooth parallax
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 12]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -8]), { stiffness: 100, damping: 20 });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 0.92]), { stiffness: 100, damping: 20 });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 60]), { stiffness: 100, damping: 20 });
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.8], [1, 0]), { stiffness: 100, damping: 20 });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          y,
          opacity,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 w-full h-full"
      >
        {children}

        {/* Background image — visible behind the dashboard, no heavy overlay */}
        <div className="absolute -z-10 -top-20 -left-20 w-[140%] h-[140%] pointer-events-none opacity-50 blur-sm overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Hotel Infrastructure"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-black/60" />
        </div>
      </motion.div>
    </div>
  );
}
