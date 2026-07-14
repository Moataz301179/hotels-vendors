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
  xs: { icon: 20, text: 9, tagline: 6 },
  sm: { icon: 26, text: 11, tagline: 7 },
  md: { icon: 34, text: 14, tagline: 9 },
  lg: { icon: 46, text: 18, tagline: 11 },
  xl: { icon: 60, text: 24, tagline: 14 },
};

/**
 * Hotels Vendors brand logo — H+V monogram with diagonal stripes.
 * Matches the official logo (white on dark, sans-serif text, "THE MARKET CHANGER").
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
  const bgColor = isDark ? "transparent" : "transparent";
  const textColor = isDark ? "#ffffff" : "#ffffff";
  const taglineColor = isDark ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.5)";

  return (
    <div className={cn("inline-flex flex-col items-center shrink-0", className)}>
      {/* H+V Monogram Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 110"
        width={dims.icon}
        height={dims.icon * 1.1}
        className="shrink-0"
        aria-label="Hotels Vendors"
      >
        {/* Outer shield shape — rounded top-left, pointed bottom-right, tilted */}
        <path
          d={`
            M 30 8
            C 30 4, 34 2, 38 2
            L 72 2
            C 76 2, 78 4, 80 8
            L 88 55
            C 90 62, 85 70, 78 74
            L 50 95
            C 44 98, 36 95, 32 88
            L 14 50
            C 10 42, 12 32, 16 24
            Z
          `}
          fill={iconColor}
        />
        {/* Left vertical notch — creates the H left bar */}
        <path
          d={`
            M 24 20
            L 34 20
            L 38 28
            L 38 72
            L 34 80
            L 24 80
            L 20 72
            L 20 28
            Z
          `}
          fill={bgColor}
        />
        {/* Diagonal stripe 1 — top */}
        <path
          d="M 18 32 L 78 68 L 74 72 L 14 36 Z"
          fill={bgColor}
        />
        {/* Diagonal stripe 2 — middle */}
        <path
          d="M 16 50 L 76 86 L 72 90 L 12 54 Z"
          fill={bgColor}
        />
        {/* Diagonal stripe 3 — bottom */}
        <path
          d="M 20 66 L 68 96 L 64 100 L 16 70 Z"
          fill={bgColor}
        />
      </svg>

      {/* Text */}
      {showText && (
        <div className="flex flex-col items-center gap-1 mt-2">
          <span
            className="font-semibold uppercase whitespace-nowrap"
            style={{
              fontSize: dims.text,
              color: textColor,
              letterSpacing: "0.2em",
              fontFamily: "var(--font-display), 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
            }}
          >
            Hotels Vendors
          </span>
          {showTagline && (
            <span
              className="uppercase whitespace-nowrap"
              style={{
                fontSize: dims.tagline,
                color: taglineColor,
                letterSpacing: "0.25em",
                fontFamily: "var(--font-display), 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
              }}
            >
              The Market Changer
            </span>
          )}
        </div>
      )}
    </div>
  );
}
