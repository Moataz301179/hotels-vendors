"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bg: string;
  accent: string;
}

const SLIDES: BannerSlide[] = [
  {
    id: 1,
    title: "New Supplier Onboarding",
    subtitle: "Juhayna, Edita, and Oriental Weavers now live on the platform. Fixed pricing, 24h delivery.",
    cta: "Browse Suppliers",
    href: "/marketplace",
    bg: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 50%, #1a0a0a 100%)",
    accent: "#8b5cf6",
  },
  {
    id: 2,
    title: "48-Hour Coastal Delivery",
    subtitle: "Shared-route logistics to Hurghada, Sharm, and North Coast. 35% freight cost reduction.",
    cta: "Learn More",
    href: "/solutions",
    bg: "linear-gradient(135deg, #0a1a1a 0%, #0f1f1f 50%, #0a0a1a 100%)",
    accent: "#34d399",
  },
  {
    id: 3,
    title: "Embedded Non-Recourse Factoring",
    subtitle: "Suppliers get paid in 24 hours. Hotels keep 60-day terms. Zero default risk.",
    cta: "Explore Factoring",
    href: "/solutions",
    bg: "linear-gradient(135deg, #1a1010 0%, #1f0f0f 50%, #1a0a0a 100%)",
    accent: "#e1a95f",
  },
  {
    id: 4,
    title: "ETA E-Invoicing Compliance",
    subtitle: "Every invoice automatically submitted to the Egyptian Tax Authority. Real-time validation.",
    cta: "Explore Compliance",
    href: "/solutions",
    bg: "linear-gradient(135deg, #0a0a1a 0%, #0f0f2e 50%, #0a0a1a 100%)",
    accent: "#55b3ff",
  },
];

export function MarketplaceBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full h-[180px] md:h-[200px] rounded-xl overflow-hidden mb-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-center px-6 md:px-10"
          style={{ background: slide.bg }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-[0.04]" style={{ background: slide.accent, filter: "blur(60px)" }} />
          <div className="absolute bottom-0 left-[20%] w-[200px] h-[200px] rounded-full opacity-[0.03]" style={{ background: slide.accent, filter: "blur(40px)" }} />

          <div className="relative z-10 max-w-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: slide.accent }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: slide.accent }}>
                Featured
              </span>
            </div>
            <h3 className="text-[18px] md:text-[22px] font-bold text-white leading-tight mb-2">
              {slide.title}
            </h3>
            <p className="text-[13px] text-white/45 leading-relaxed mb-4 max-w-md">
              {slide.subtitle}
            </p>
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all hover:opacity-90"
              style={{ background: slide.accent }}
            >
              {slide.cta}
              <ArrowRight size={13} />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors z-10">
        <ChevronLeft size={14} />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors z-10">
        <ChevronRight size={14} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all ${i === current ? "w-4 bg-white" : "w-1 bg-white/25"}`}
          />
        ))}
      </div>
    </div>
  );
}
