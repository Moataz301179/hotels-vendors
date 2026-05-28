"use client";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_MAP = {
  sm: { width: 36, height: 36 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
  xl: { width: 88, height: 88 },
};

/**
 * Hotels Vendors brand mark — geometric HV monograph.
 * Sharp, authoritative, vector-perfect at every scale.
 */
export function BrandLogo({
  className,
  variant = "dark",
  size = "md",
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];
  const fg = variant === "dark" ? "#FFFFFF" : "#000000";
  const accent = "#00FF66";

  return (
    <svg
      width={dims.width}
      height={dims.height}
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="Hotels Vendors"
    >
      {/* Outer shield shape */}
      <rect x="2" y="2" width="84" height="84" rx="20" fill="none" stroke={accent} strokeWidth="2.5" />
      {/* Inner divider — horizontal rule */}
      <line x1="20" y1="44" x2="68" y2="44" stroke={fg} strokeWidth="1.5" opacity="0.12" />
      {/* H left column */}
      <rect x="18" y="14" width="22" height="26" rx="4" fill="none" stroke={fg} strokeWidth="2.2" opacity="0.9" />
      <line x1="29" y1="20" x2="29" y2="34" stroke={fg} strokeWidth="2" opacity="0.9" />
      {/* V right column — stylized chevron */}
      <path d="M50 14 L68 44 L50 30 L32 44 L50 74" fill="none" stroke={accent} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Accent dot */}
      <circle cx="44" cy="62" r="3" fill={accent} />
    </svg>
  );
}
