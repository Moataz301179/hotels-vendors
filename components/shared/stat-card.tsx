"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <div className="mt-4">
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      {change && (
        <div className="mt-2">
          <span
            className={cn(
              "text-xs font-medium",
              changeType === "positive" && "text-emerald-400",
              changeType === "negative" && "text-red-400",
              changeType === "neutral" && "text-slate-400"
            )}
          >
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
