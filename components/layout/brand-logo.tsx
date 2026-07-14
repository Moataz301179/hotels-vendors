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
      {/* H+V Monogram Icon — accurate to brand CDN source */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 220"
        width={dims.icon}
        height={dims.icon * 1.1}
        className="shrink-0"
        aria-label="Hotels Vendors"
      >
        {/* Shield shape — rounded top-left, angled bottom-right */}
        <path
          d={`
            M 55 8
            C 55 4, 58 2, 62 2
            L 148 2
            C 152 2, 155 4, 158 8
            L 178 110
            C 180 118, 174 130, 164 136
            L 104 190
            C 96 195, 84 190, 78 180
            L 28 100
            C 22 88, 26 72, 32 60
            Z
          `}
          fill={iconColor}
        />
        {/* Inner cutout — creates H left vertical bar + V diagonal intersection */}
        <path
          d={`
            M 44 40
            L 68 40
            L 76 54
            L 82 40
            L 106 40
            L 106 148
            L 86 148
            L 64 82
            L 64 148
            L 44 148
            Z
          `}
          fill={bgColor}
        />
        {/* Diagonal stripe 1 — upper */}
        <path
          d="M 32 64 L 164 122 L 158 128 L 26 70 Z"
          fill={bgColor}
        />
        {/* Diagonal stripe 2 — middle */}
        <path
          d="M 28 88 L 160 146 L 154 152 L 22 94 Z"
          fill={bgColor}
        />
        {/* Diagonal stripe 3 — lower */}
        <path
          d="M 34 108 L 132 170 L 126 176 L 28 114 Z"
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
