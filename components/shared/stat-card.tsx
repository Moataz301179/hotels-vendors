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
    <div
      className={cn("rounded-xl p-6", className)}
      style={{
        backgroundColor: "var(--surface-raised, rgba(255,255,255,0.05))",
        border: "1px solid var(--border-subtle, rgba(255,255,255,0.1))",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: "var(--foreground-muted, #94A3B8)" }}>{title}</span>
        <Icon className="h-5 w-5" style={{ color: "var(--foreground-muted, #94A3B8)" }} />
      </div>
      <div className="mt-4">
        <span className="text-2xl font-bold" style={{ color: "var(--foreground, #FFFFFF)" }}>{value}</span>
      </div>
      {change && (
        <div className="mt-2">
          <span
            className={cn("text-xs font-medium")}
            style={{
              color:
                changeType === "positive" ? "var(--color-success, #34D399)" :
                changeType === "negative" ? "var(--color-error, #F87171)" :
                "var(--foreground-muted, #94A3B8)",
            }}
          >
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
