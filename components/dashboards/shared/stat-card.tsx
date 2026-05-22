"use client";

import { motion } from "framer-motion";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  up?: boolean;
  icon: LucideIcon;
  color?: "crimson" | "emerald" | "amber" | "blue" | "purple" | "neutral";
  delay?: number;
}

const colorMap = {
  crimson: { accent: "bg-[#8b5cf6]/20", dot: "bg-[#8b5cf6]", icon: "text-[#8b5cf6]", glow: "hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]" },
  emerald: { accent: "bg-emerald-500/15", dot: "bg-emerald-500", icon: "text-emerald-400", glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]" },
  amber: { accent: "bg-amber-500/15", dot: "bg-amber-500", icon: "text-amber-400", glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]" },
  blue: { accent: "bg-blue-500/15", dot: "bg-blue-500", icon: "text-blue-400", glow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]" },
  purple: { accent: "bg-purple-500/15", dot: "bg-purple-500", icon: "text-purple-400", glow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.08)]" },
  neutral: { accent: "bg-white/[0.03]", dot: "bg-white/20", icon: "text-white/30", glow: "" },
};

export function StatCard({ label, value, change, up = true, icon: Icon, color = "neutral", delay = 0 }: StatCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-xl border border-white/[0.05] bg-[#0a0a0a] p-5 hover:border-white/[0.08] transition-all duration-300 group ${c.glow}`}
    >
      {/* Colored top edge */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${c.accent}`} />

      {/* Edge frame highlight */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.015) 100%)" }} />

      <div className="relative flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-white/25 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-[24px] font-semibold text-white tracking-tight mt-1.5 leading-none metric-value">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {up ? (
                <ArrowUpRight size={11} className="text-emerald-400" />
              ) : (
                <ArrowDownRight size={11} className="text-red-400" />
              )}
              <span className={`text-[11px] font-medium ${up ? "text-emerald-400" : "text-red-400"}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center flex-shrink-0">
          <Icon size={16} className={c.icon} />
        </div>
      </div>
    </motion.div>
  );
}
