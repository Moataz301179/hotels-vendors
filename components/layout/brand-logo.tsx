"use client";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  forceColor?: "bw" | string;
}

const SIZE_MAP = {
  xs: { icon: 18, text: 10 },
  sm: { icon: 22, text: 12 },
  md: { icon: 28, text: 14 },
  lg: { icon: 38, text: 18 },
  xl: { icon: 48, text: 22 },
};

/**
 * Hotels Vendors brand logo — red geometric arrow/chevron mark with text.
 * Matches the official logo in public/assets/logo.svg.
 */
export function BrandLogo({
  className,
  variant = "light",
  size = "md",
  showText = true,
  forceColor,
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];
  const isDark = variant === "dark";

  // Colors from the official logo
  const red = "#ed1c24";
  const darkText = isDark ? "#ffffff" : "#333132";
  const greyText = isDark ? "rgba(255,255,255,0.6)" : "#6d6e71";

  return (
    <div className={cn("inline-flex items-center gap-2 shrink-0", className)}>
      {/* Geometric arrow/chevron mark */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 42.26 14.2"
        width={dims.icon}
        height={dims.icon * 0.335}
        className="shrink-0"
        aria-label="Hotels Vendors"
      >
        {/* Red arrow/chevron */}
        <path
          d="M35.6,0s-3.13.52-5.04,2.76-1.61,5.04-1.61,5.04l5.75,5.76-1.16,1.16-4.59-4.57v2.5l8.41,8.48h2.62l-5.15-5.13,1.16-1.16,6.27,6.29v-2.62L30.79,7.06s.07-1.91,1.46-3.44c1.38-1.53,3.7-1.64,3.7-1.64h4.56l1.76-1.98h-6.66Z"
          fill={forceColor && forceColor !== "bw" ? forceColor : red}
        />
        {/* Red diagonal accent */}
        <polygon
          points="40.5,11.73 35.94,7.1 33.33,7.1 40.5,14.2 42.26,12.55 42.26,1.98 40.5,1.98 40.5,11.73"
          fill={forceColor && forceColor !== "bw" ? forceColor : red}
        />
        <polygon
          points="28.96,17.67 32.39,21.15 35.01,21.15 28.96,15.13 28.96,17.67"
          fill={forceColor && forceColor !== "bw" ? forceColor : red}
        />
      </svg>

      {/* Text */}
      {showText && (
        <span className="leading-none tracking-[0.08em] font-bold" style={{ fontSize: dims.text }}>
          <span style={{ color: darkText }}>Hotels</span>
          <span style={{ color: forceColor && forceColor !== "bw" ? forceColor : red }}>Vendors</span>
        </span>
      )}
    </div>
  );
}
