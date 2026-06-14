"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface SectorVisualProps {
  sector: "procurement" | "cashflow" | "fintech" | "ai";
  accentColor: string;
}

const SECTOR_IMAGES = {
  procurement: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop", // High-tech logistics
  cashflow: "https://images.unsplash.com/photo-1450101499667-e7f5dc966734?q=80&w=2070&auto=format&fit=crop", // Abstract growth/finance
  fintech: "https://images.unsplash.com/photo-1551288049-bebda4e38a70?q=80&w=2070&auto=format&fit=crop", // Clean data analytics
  ai: "https://images.unsplash.com/photo-1677442136019-21780ef3ef8a?q=80&w=2070&auto=format&fit=crop", // AI Neural visual
};

export function SectorVisual({ sector, accentColor }: SectorVisualProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
    >
      <Image
        src={SECTOR_IMAGES[sector]}
        alt={`${sector} infrastructure visual`}
        fill
        className="object-cover"
      />
      {/* Gradient Overlay for "Marketing Hook" feel */}
      <div 
        className="absolute inset-0 opacity-60" 
        style={{ background: `linear-gradient(135deg, ${accentColor}33 0%, transparent 50%, #000000aa 100%)` }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      {/* Subtle accent border highlight */}
      <div 
        className="absolute inset-0 pointer-events-none border-[1px] opacity-20" 
        style={{ borderColor: accentColor }} 
      />
    </motion.div>
  );
}
