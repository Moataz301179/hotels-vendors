"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  image: string;
  alt: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=85",
    alt: "Luxury resort poolside at sunset",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=85",
    alt: "Premium hotel suite interior",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=85",
    alt: "Beachfront hotel aerial view",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=85",
    alt: "Modern hotel lobby",
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
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
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
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${SLIDES[current].image})` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlays */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-6 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all z-10"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-6 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all z-10"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Slide counter + dots */}
      <div className="absolute bottom-8 left-6 md:left-auto md:right-6 flex items-center gap-4 z-10">
        <span className="text-[12px] font-medium text-white/50 tabular-nums">
          {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
