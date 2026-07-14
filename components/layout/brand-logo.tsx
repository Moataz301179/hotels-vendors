"use client";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
  forceColor?: "bw" | string;
}

const SIZE_MAP = {
  xs: { icon: 20, text: 9, tagline: 7 },
  sm: { icon: 26, text: 11, tagline: 8 },
  md: { icon: 34, text: 14, tagline: 10 },
  lg: { icon: 46, text: 18, tagline: 13 },
  xl: { icon: 60, text: 24, tagline: 16 },
};

// Brand colors
const BRAND_RED = "#8B1A1A";
const BRAND_DARK_RED = "#6B0F0F";

/**
 * Hotels Vendors brand logo — intertwined H+V monogram with diagonal stripes.
 * Matches the official logo from logo-transparent.png / logo-banner.png.
 */
export function BrandLogo({
  className,
  variant = "light",
  size = "md",
  showText = true,
  showTagline = false,
  forceColor,
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];
  const isDark = variant === "dark";

  const iconColor = forceColor && forceColor !== "bw" ? forceColor : "#ffffff";
  const textColor = isDark ? "#ffffff" : BRAND_RED;
  const taglineColor = isDark ? "rgba(255,255,255,0.7)" : "rgba(107,15,15,0.7)";

  return (
    <div className={cn("inline-flex flex-col items-center gap-1 shrink-0", className)}>
      {/* H+V Monogram Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width={dims.icon}
        height={dims.icon}
        className="shrink-0"
        aria-label="Hotels Vendors"
      >
        {/* Shield / monogram outer shape */}
        <path
          d="M50 5 
             C72 5, 90 15, 92 35 
             L92 55 
             C92 72, 78 88, 62 95 
             L50 98 
             L38 95 
             C22 88, 8 72, 8 55 
             L8 35 
             C8 15, 28 5, 50 5Z"
          fill={iconColor}
        />
        {/* Inner cutout to form the H shape — left vertical */}
        <rect x="22" y="20" width="10" height="58" rx="2" fill={forceColor && forceColor !== "bw" ? forceColor : BRAND_RED} />
        {/* Inner cutout — right vertical */}
        <rect x="68" y="20" width="10" height="58" rx="2" fill={forceColor && forceColor !== "bw" ? forceColor : BRAND_RED} />
        {/* Inner cutout — center horizontal bar */}
        <rect x="32" y="42" width="36" height="8" rx="1" fill={forceColor && forceColor !== "bw" ? forceColor : BRAND_RED} />
        {/* Diagonal stripe 1 — top */}
        <line x1="12" y1="30" x2="88" y2="65" stroke={forceColor && forceColor !== "bw" ? forceColor : BRAND_RED} strokeWidth="4" strokeLinecap="round" />
        {/* Diagonal stripe 2 — middle */}
        <line x1="12" y1="50" x2="88" y2="85" stroke={forceColor && forceColor !== "bw" ? forceColor : BRAND_RED} strokeWidth="4" strokeLinecap="round" />
        {/* Diagonal stripe 3 — bottom */}
        <line x1="15" y1="70" x2="75" y2="95" stroke={forceColor && forceColor !== "bw" ? forceColor : BRAND_RED} strokeWidth="3" strokeLinecap="round" />
      </svg>

      {/* Text */}
      {showText && (
        <div className="flex flex-col items-center gap-0.5">
          <span
            className="tracking-[0.22em] font-serif font-bold uppercase"
            style={{ fontSize: dims.text, color: textColor }}
          >
            Hotels Vendors
          </span>
          {showTagline && (
            <span
              className="tracking-[0.12em] font-serif italic"
              style={{ fontSize: dims.tagline, color: taglineColor }}
            >
              Smarter Together
            </span>
          )}
        </div>
      )}
    </div>
  );
}
