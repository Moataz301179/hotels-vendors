"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  image: string;
  alt: string;
  caption?: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=85",
    alt: "Luxury resort poolside at sunset",
    caption: "Premium Hospitality Procurement",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=85",
    alt: "Premium hotel suite interior",
    caption: "Verified Suppliers Nationwide",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=85",
    alt: "Beachfront hotel aerial view",
    caption: "Coastal to Cairo Coverage",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=85",
    alt: "Modern hotel lobby",
    caption: "AI-Powered Sourcing",
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

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.08,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 1.05,
    }),
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          {/* Background image with Ken Burns zoom */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${SLIDES[current].image})` }}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Refined overlays — darker for text readability, not pitch black */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40" />

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-6 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/25 transition-all z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-6 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/25 transition-all z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Slide caption + dots */}
      <div className="absolute bottom-8 left-6 md:left-8 flex items-end gap-6 z-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block text-[12px] font-medium text-white/50 tracking-wide"
          >
            {SLIDES[current].caption}
          </motion.p>
        </AnimatePresence>
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? "w-8 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="text-[12px] font-medium text-white/40 tabular-nums">
          {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
