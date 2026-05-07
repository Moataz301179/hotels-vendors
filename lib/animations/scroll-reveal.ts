"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  start?: string;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 24,
      x = 0,
      opacity = 0,
      duration = 0.6,
      delay = 0,
      stagger = 0.08,
      ease = "power2.out",
      start = "top 85%",
    } = options;

    const children = el.children.length > 0 ? el.children : [el];

    gsap.fromTo(
      children,
      { y, x, opacity },
      {
        y: 0,
        x: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  return ref;
}

export function useFadeIn<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay, ease: "power2.out" }
    );
  }, []);

  return ref;
}
