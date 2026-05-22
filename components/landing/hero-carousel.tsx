"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { carouselSlides } from "@/lib/content/marketing-content";

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slide = carouselSlides[current];

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => {
      const next = prev + newDirection;
      if (next < 0) return carouselSlides.length - 1;
      if (next >= carouselSlides.length) return 0;
      return next;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [paginate]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 300 : -300, opacity: 0 }),
  };

  return (
    <section className="relative min-h-[640px] md:min-h-[720px] flex items-center overflow-hidden bg-black">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${slide.gradientFrom}15 0%, transparent 60%),
                       radial-gradient(ellipse 60% 50% at 70% 80%, ${slide.gradientTo}10 0%, transparent 50%),
                       #000000`,
        }}
      />
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 w-full pt-[120px] pb-20">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="max-w-3xl"
          >
            {/* Portal badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{
                background: `${slide.gradientFrom}20`,
                border: `1px solid ${slide.gradientFrom}30`,
                color: slide.gradientFrom,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: slide.gradientFrom }} />
              {slide.portal.charAt(0).toUpperCase() + slide.portal.slice(1)} Portal
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6"
              style={{ textWrap: "balance" }}
            >
              {slide.headline}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-white/60 leading-relaxed mb-8 max-w-2xl"
              style={{ textWrap: "pretty" }}
            >
              {slide.subtext}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link
                href={slide.ctaPrimary.href}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl transition-all hover:scale-105"
                style={{ background: slide.gradientFrom }}
              >
                {slide.ctaPrimary.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={slide.ctaSecondary.href}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white/80 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
              >
                {slide.ctaSecondary.label}
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-8"
            >
              {slide.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button
            onClick={() => paginate(-1)}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {carouselSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className="relative h-1.5 rounded-full transition-all duration-300 overflow-hidden"
                style={{
                  width: i === current ? 32 : 8,
                  background: i === current ? slide.gradientFrom : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
          <button
            onClick={() => paginate(1)}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
