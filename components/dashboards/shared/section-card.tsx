"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "subtle";
}

const variantStyles = {
  default: "bg-[#0a0a0a] border-white/[0.05]",
  elevated: "bg-[#0d0d0d] border-white/[0.06]",
  subtle: "bg-transparent border-white/[0.03]",
};

export function SectionCard({ title, icon: Icon, children, action, className = "", variant = "default" }: SectionCardProps) {
  return (
    <div className={`rounded-xl border ${variantStyles[variant]} overflow-hidden hover:border-white/[0.08] transition-all duration-300 group relative ${className}`}>
      {/* Edge frame highlight */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 50%, rgba(255,255,255,0.01) 100%)" }} />

      {/* Header */}
      <div className="relative flex items-center justify-between px-5 py-3.5 border-b border-white/[0.03]">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={14} className="text-white/25" />}
          <h3 className="text-[13px] font-semibold text-white/70">{title}</h3>
        </div>
        {action && <div>{action}</div>}
      </div>
      {/* Content */}
      <div className="relative p-5">
        {children}
      </div>
    </div>
  );
}
