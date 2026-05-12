"use client";

import { ShieldCheck, Crown, Ship, Zap, Award, BadgeCheck } from "lucide-react";

export type BadgeType = "verified" | "premier" | "coastal" | "fast" | "premium";

const BADGE_CONFIG: Record<BadgeType, { label: string; icon: React.ElementType; className: string }> = {
  verified: {
    label: "Verified",
    icon: BadgeCheck,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  premier: {
    label: "Premier Partner",
    icon: Crown,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  coastal: {
    label: "Coastal Certified",
    icon: Ship,
    className: "bg-teal-50 text-teal-700 border-teal-200",
  },
  fast: {
    label: "48h Delivery",
    icon: Zap,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  premium: {
    label: "Premium",
    icon: Award,
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

interface SupplierBadgeProps {
  type: BadgeType;
  size?: "sm" | "md";
}

export function SupplierBadge({ type, size = "sm" }: SupplierBadgeProps) {
  const config = BADGE_CONFIG[type];
  if (!config) return null;

  const Icon = config.icon;
  const isSm = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${isSm ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"} ${config.className}`}
    >
      <Icon size={isSm ? 10 : 12} />
      {config.label}
    </span>
  );
}

export function BadgeRow({ badges, size = "sm" }: { badges: BadgeType[]; size?: "sm" | "md" }) {
  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((b) => (
        <SupplierBadge key={b} type={b} size={size} />
      ))}
    </div>
  );
}
