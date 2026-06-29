"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCounter } from "@/hooks/use-counter";
import {
  Building2,
  Users,
  Banknote,
  Clock,
  ShieldCheck,
  Truck,
} from "lucide-react";

const HOTEL_GROUPS = [
  { name: "Jaz Hotels", initials: "JZ", properties: 75 },
  { name: "Sunrise Resorts", initials: "SR", properties: 28 },
  { name: "Pickalbatros", initials: "PB", properties: 22 },
  { name: "Pyramisa", initials: "PY", properties: 12 },
  { name: "Baron Hotels", initials: "BR", properties: 8 },
  { name: "Stella Di Mare", initials: "ST", properties: 5 },
  { name: "Tolip Hotels", initials: "TL", properties: 7 },
  { name: "Coral Sea", initials: "CS", properties: 4 },
  { name: "Tropitel", initials: "TR", properties: 6 },
  { name: "Reef Oasis", initials: "RO", properties: 5 },
  { name: "Al Nabila", initials: "AN", properties: 4 },
  { name: "Charmillion", initials: "CH", properties: 3 },
];

const STATS = [
  { end: 52, suffix: "+", label: "Active Hotel Properties", icon: Building2 },
  { end: 680, suffix: "+", label: "Verified Vendors", icon: Users },
  { end: 14, suffix: "M", label: "EGP Transaction Volume", prefix: "", icon: Banknote, isCurrency: true },
  { end: 72, suffix: "%", label: "Faster Procurement Cycle", icon: Clock },
];

function AnimatedCounter({ end, suffix = "", prefix = "", highlight = false }: { end: number; suffix?: string; prefix?: string; highlight?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useCounter(end, 2200, isInView);

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-[28px] md:text-[36px] lg:text-[40px] font-bold tracking-tight leading-none"
        style={{
          fontVariantNumeric: "tabular-nums",
          fontFamily: "var(--font-serif)",
          color: "#ffffff",
        }}
      >
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div
        className="text-[10px] md:text-[11px] mt-1.5 uppercase tracking-[0.12em] font-medium"
        style={{ color: highlight ? "#FF6B00" : "rgba(255,255,255,0.25)" }}
      >
        {highlight ? "· " : ""}
      </div>
    </div>
  );
}

export function EnterpriseTrustBanner() {
  const duplicated = [...HOTEL_GROUPS, ...HOTEL_GROUPS];

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      {/* Subtle top border gradient */}
      <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }} />

      <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        {/* Monochrome metric badges row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 mb-10">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            const isHighlight = i === 1; // Highlight "Verified Vendors"
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group"
              >
                <div
                  className="rounded-2xl p-5 md:p-6 text-center transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.025)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.015)";
                  }}
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-3">
                    <Icon size={16} className="text-white/15 group-hover:text-white/25 transition-colors" />
                  </div>

                  {/* Counter */}
                  <AnimatedCounter
                    end={stat.end}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    highlight={isHighlight}
                  />

                  {/* Label */}
                  <div className="text-[10px] md:text-[11px] mt-2 uppercase tracking-[0.1em] font-medium text-white/30">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Divider with gradient */}
        <div className="h-px w-full mb-8" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)" }} />

        {/* Hotel logo marquee label */}
        <p className="text-[9px] font-medium text-white/15 uppercase tracking-[0.25em] text-center mb-5">
          Trusted by Egypt&apos;s Leading Hotel Groups · موثوق من أكبر المجموعات الفندقية
        </p>

        {/* Hotel logo marquee */}
        <div className="relative overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 100%)" }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 100%)" }}
          />

          <motion.div
            className="flex gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {duplicated.map((hotel, i) => (
              <div
                key={`${hotel.initials}-${i}`}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl shrink-0 transition-all duration-200 group"
                style={{
                  backgroundColor: "rgba(255,255,255,0.01)",
                  border: "1px solid rgba(255,255,255,0.03)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.025)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.01)";
                }}
              >
                {/* Monochrome icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors duration-200"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  {hotel.initials}
                </div>
                <div>
                  <div className="text-[12px] font-medium text-white/40 group-hover:text-white/60 transition-colors whitespace-nowrap">
                    {hotel.name}
                  </div>
                  <div className="text-[9px] text-white/15 whitespace-nowrap">
                    {hotel.properties} properties
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Subtle bottom border gradient */}
      <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }} />
    </section>
  );
}
