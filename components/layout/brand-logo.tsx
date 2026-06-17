"use client";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  showText?: boolean;
}

const SIZE_MAP = {
  xs: { icon: 36, text: 14, slogan: 8, tracking: "0.04em" },
  sm: { icon: 48, text: 18, slogan: 11, tracking: "0.05em" },
  md: { icon: 72, text: 28, slogan: 16, tracking: "0.08em" },
  lg: { icon: 96, text: 38, slogan: 22, tracking: "0.1em" },
  xl: { icon: 120, text: 48, slogan: 28, tracking: "0.12em" },
  xxl: { icon: 108, text: 14, slogan: 8, tracking: "0.04em" },
};

export function BrandLogo({
  className,
  variant = "light",
  size = "md",
  showText = true,
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];
  const color = variant === "dark" ? "#ffffff" : "#0B0F1A";

  return (
    <div className={cn("flex items-center gap-2.5 shrink-0", className)}>
      {/* Interlocking HV SVG Monogram — clean, no background box */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: dims.icon, height: dims.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          className="fill-none stroke-current"
          style={{
            width: "100%",
            height: "100%",
            color: color,
            strokeWidth: 6.5,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        >
          {/* Left pillar — H vertical stem */}
          <path d="M 30 20 L 30 80" />
          {/* Diagonal bridging — interlocking H and V */}
          <path d="M 30 50 L 70 50" />
          {/* Right dynamic loop — V and padlock interlocking */}
          <path d="M 70 20 L 70 65 C 70 75, 55 80, 45 80" />
          {/* Modern geometric style cuts */}
          <path d="M 50 35 L 70 20" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col justify-center select-none">
          <span
            className="font-bold tracking-tight leading-none"
            style={{
              color,
              fontSize: dims.text,
              letterSpacing: dims.tracking,
            }}
          >
            Hotels Vendors
          </span>
          <span
            className="tracking-wider uppercase font-medium opacity-80 mt-0.5 leading-none"
            style={{
              color: variant === "dark" ? "#10B981" : "#059669",
              fontSize: dims.slogan,
            }}
          >
            Smarter Together
          </span>
        </div>
      )}
    </div>
  );
}
