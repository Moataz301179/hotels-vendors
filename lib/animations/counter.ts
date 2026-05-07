"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseCounterOptions {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function useCounter({
  end,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
}: UseCounterOptions) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    const obj = { value: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      onEnter: () => {
        if (hasAnimated) return;
        setHasAnimated(true);
        gsap.to(obj, {
          value: end,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            const formatted =
              decimals > 0
                ? obj.value.toFixed(decimals)
                : Math.round(obj.value).toLocaleString();
            el.textContent = `${prefix}${formatted}${suffix}`;
          },
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [end, duration, prefix, suffix, decimals, hasAnimated]);

  return ref;
}
