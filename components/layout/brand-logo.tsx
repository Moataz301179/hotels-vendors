"use client";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  showText?: boolean;
}

const TEXT_SIZE_MAP = {
  xs: { text: 12, slogan: 8, tracking: "0.04em" },
  sm: { text: 14, slogan: 10, tracking: "0.05em" },
  md: { text: 18, slogan: 12, tracking: "0.08em" },
  lg: { text: 24, slogan: 14, tracking: "0.1em" },
  xl: { text: 32, slogan: 18, tracking: "0.12em" },
  xxl: { text: 36, slogan: 16, tracking: "0.04em" },
};

const ICON_SIZE_MAP = {
  xs: 32,
  sm: 40,
  md: 56,
  lg: 72,
  xl: 88,
  xxl: 108,
};

/**
 * Inline chess horse SVG — renders reliably everywhere (no next/image SVG issues).
 */
function KnightIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }}
    >
      <path d="M65 15 L75 25 L70 35 L80 45 L70 60 L55 55 L45 65 L35 60 L30 70 L25 65 L30 50 L40 45 L35 35 L45 25 L55 30 L65 15Z" />
      <path d="M35 60 L30 70 L25 65 L30 50Z" opacity="0.6" />
      <path d="M55 30 L65 15 L60 25Z" opacity="0.4" />
      <circle cx="58" cy="38" r="3" opacity="0.9" />
    </svg>
  );
}

export function BrandLogo({
  className,
  variant = "light",
  size = "md",
  showText = true,
}: BrandLogoProps) {
  const textDims = TEXT_SIZE_MAP[size];
  const iconSize = ICON_SIZE_MAP[size];
  const color = variant === "dark" ? "#ffffff" : "#0B0F1A";

  return (
    <div className={cn("flex items-center gap-2.5 shrink-0", className)}>
      <KnightIcon size={iconSize} />
      {showText && (
        <div className="flex flex-col justify-center select-none">
          <span
            className="font-semibold tracking-tight leading-none"
            style={{
              color,
              fontSize: textDims.text,
              letterSpacing: textDims.tracking,
            }}
          >
            Hotels Vendors
          </span>
          <span
            className="tracking-wider uppercase font-medium opacity-80 mt-0.5 leading-none"
            style={{
              color: variant === "dark" ? "#39ff7e" : "#059669",
              fontSize: textDims.slogan,
            }}
          >
            Smarter Together
          </span>
        </div>
      )}
    </div>
  );
}
