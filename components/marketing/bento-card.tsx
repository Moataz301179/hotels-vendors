"use client";

import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

interface BentoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  metric?: { value: string; label: string };
  accent?: boolean;
  className?: string;
  children?: ReactNode;
}

export function BentoCard({
  icon: Icon,
  title,
  description,
  metric,
  accent = false,
  className = "",
  children,
}: BentoCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1 group ${className}`}
      style={{
        backgroundColor: accent ? "rgba(255,107,0,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${accent ? "rgba(255,107,0,0.2)" : "rgba(255,255,255,0.06)"}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent ? "rgba(255,107,0,0.35)" : "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = accent ? "rgba(255,107,0,0.2)" : "rgba(255,255,255,0.06)";
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
        style={{
          backgroundColor: accent ? "rgba(255,107,0,0.12)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${accent ? "rgba(255,107,0,0.2)" : "rgba(255,255,255,0.06)"}`,
        }}
      >
        <Icon size={18} style={{ color: "#FF6B00" }} />
      </div>

      {metric && (
        <div className="mb-3">
          <span
            className="text-[28px] md:text-[32px] font-bold tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#ffffff" }}
          >
            {metric.value}
          </span>
          <span className="text-[11px] text-white/30 ml-2">{metric.label}</span>
        </div>
      )}

      <h3 className="text-[15px] font-semibold text-white mb-2">{title}</h3>
      <p className="text-[12px] text-white/40 leading-relaxed">{description}</p>

      {children}
    </div>
  );
}
