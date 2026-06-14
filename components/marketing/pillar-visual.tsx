"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface PillarVisualProps {
  type: "engine" | "capital" | "shield";
  accentColor: string;
}

const PILLAR_IMAGES = {
  engine: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop", // Logistics/Ops
  capital: "https://images.unsplash.com/photo-1560520653-97ef6697e67d?q=80&w=2070&auto=format&fit=crop", // Financial/Corporate
  shield: "https://images.unsplash.com/photo-1550751827-4c39ad817755?q=80&w=2070&auto=format&fit=crop", // Security/Data
};

export function PillarVisual({ type, accentColor }: PillarVisualProps) {
  return (
    <div className="relative w-full h-40 overflow-hidden rounded-t-2xl border-b border-white/10">
      <Image
        src={PILLAR_IMAGES[type]}
        alt={`${type} visual`}
        fill
        className="object-cover opacity-60"
      />
      <div 
        className="absolute inset-0" 
        style={{ background: `linear-gradient(to bottom, transparent, ${accentColor}22, #0a0a0a)` }} 
      />
    </div>
  );
}
