"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export function HeroVisual({ children }: { children: React.ReactNode }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 3D-like transform: Rotate X and Y, Scale, and Translate
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 25]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center perspective-1000">
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
        
        {/* The "Marketing Hook" Image: An architectural high-end backdrop */}
        <div className="absolute -z-10 -top-20 -left-20 w-[140%] h-[140%] pointer-events-none opacity-30 blur-sm overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Hotel Infrastructure"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-black/40" />
        </div>
      </motion.div>
    </div>
  );
}
