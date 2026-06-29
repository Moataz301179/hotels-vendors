"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useCounter } from "@/hooks/use-counter";

interface MetricCardProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
  highlight?: boolean;
}

export function MetricCard({
  end,
  suffix = "",
  prefix = "",
  label,
  description,
  highlight = false,
}: MetricCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useCounter(end, 2200, isInView);

  return (
    <div ref={ref} className="text-center px-4">
      <div
        className="text-[36px] md:text-[48px] lg:text-[56px] font-bold tracking-tight"
        style={{
          fontVariantNumeric: "tabular-nums",
          fontFamily: "var(--font-serif)",
          color: "#ffffff",
        }}
      >
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div
        className="text-[11px] md:text-[12px] mt-2 uppercase tracking-[0.15em] font-medium"
        style={{ color: highlight ? "#FF6B00" : "rgba(255,255,255,0.3)" }}
      >
        {label}
      </div>
      {description && (
        <p className="text-[11px] text-white/25 mt-1 max-w-[200px] mx-auto">{description}</p>
      )}
    </div>
  );
}
