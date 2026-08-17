"use client";

import { type LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function KpiCard({ label, value, change, changeType = "neutral", icon: Icon, iconColor = "#D4A843" }: KpiCardProps) {
  const changeColor = changeType === "positive" ? "text-[#84cc16]" : changeType === "negative" ? "text-[#dc3545]" : "text-white/30";
  return (
    <div className="rounded-xl border border-[rgba(212,168,67,0.06)] bg-[rgba(212,168,67,0.02)] p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${iconColor}10` }}>
          <Icon className="h-4 w-4" style={{ color: iconColor }} />
        </div>
        {change && <span className={`text-[11px] font-medium ${changeColor}`}>{change}</span>}
      </div>
      <p className="text-[24px] font-semibold text-white tracking-tight">{value}</p>
      <p className="mt-1 text-[12px] text-white/35">{label}</p>
    </div>
  );
}
