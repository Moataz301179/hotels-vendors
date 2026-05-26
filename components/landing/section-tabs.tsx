"use client";

import { useState, useEffect, useCallback } from "react";

const SECTIONS = [
  { id: "why", label: "Platform" },
  { id: "how", label: "How It Works" },
  { id: "network", label: "Network" },
  { id: "capabilities", label: "Capabilities" },
  { id: "trust", label: "Trust" },
];

export function SectionTabs() {
  const [active, setActive] = useState("why");

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-16 z-40 backdrop-blur-xl bg-[#000000]/70 border-y border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 h-12 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`relative px-4 py-2 text-[13px] font-medium transition-colors whitespace-nowrap rounded-lg ${
              active === id
                ? "text-white"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            {label}
            {active === id && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[#bef264]" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
