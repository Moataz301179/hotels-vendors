"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85",
    title: "Marketplace + AI Sourcing",
    subtitle: "10,000+ SKUs from 1,200+ verified Egyptian suppliers",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=85",
    title: "Coastal Logistics Network",
    subtitle: "Shared-route delivery to Red Sea and North Coast clusters",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=85",
    title: "Embedded Finance & Factoring",
    subtitle: "Non-recourse liquidity. Suppliers paid in 24 hours.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=85",
    title: "ETA E-Invoicing Compliance",
    subtitle: "Native Egyptian Tax Authority integration on every invoice",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => (
      {
        x: dir > 0 ? "-100%" : "100%",
        opacity: 0,
      }
    ),
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${SLIDES[current].image})` }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

          {/* Slide content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-[#022349]/80 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">
                    {String(current + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.15em]">
                  Slide {current + 1} of {SLIDES.length}
                </span>
              </div>
              <h3 className="text-[18px] md:text-[24px] font-bold text-white tracking-tight">
                {SLIDES[current].title}
              </h3>
              <p className="text-[13px] md:text-[14px] text-white/60 mt-1 max-w-md">
                {SLIDES[current].subtitle}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all z-10"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all z-10"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-10 flex items-center gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 bg-[#022349]"
                : "w-1.5 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
