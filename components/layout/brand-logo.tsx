"use client";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  showText?: boolean;
}

const TEXT_SIZE_MAP = {
  xs: { text: 11, slogan: 8, tracking: "0.06em" },
  sm: { text: 13, slogan: 9, tracking: "0.08em" },
  md: { text: 16, slogan: 10, tracking: "0.1em" },
  lg: { text: 22, slogan: 12, tracking: "0.12em" },
  xl: { text: 28, slogan: 14, tracking: "0.14em" },
  xxl: { text: 34, slogan: 14, tracking: "0.06em" },
};

const ICON_SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 52,
  xl: 64,
  xxl: 88,
};

function KnightIcon({ size, variant }: { size: number; variant: "dark" | "light" }) {
  const iconColor = variant === "dark" ? "#ffffff" : "#0B0F1A";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="12 8 60 72"
      width={size}
      height={size}
      style={{ width: size, height: size, flexShrink: 0, display: "block" }}
      aria-label="HotelsVendors"
      role="img"
    >
      <path
        d="M55 8 L68 22 L62 35 L72 48 L60 65 L42 58 L30 70 L18 64 L12 78 L8 72 L14 52 L26 46 L20 32 L32 18 L45 24 L55 8Z"
        fill={iconColor}
        opacity="0.95"
      />
      <path
        d="M30 70 L18 64 L14 52 L26 46 L20 32"
        fill="none"
        stroke={iconColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M42 58 L30 70"
        fill="none"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="48" cy="38" r="3" fill={iconColor} opacity="0.8" />
    </svg>
  );
}

export function BrandLogo({
  className,
  variant = "dark",
  size = "md",
  showText = true,
}: BrandLogoProps) {
  const textDims = TEXT_SIZE_MAP[size];
  const iconSize = ICON_SIZE_MAP[size];
  const color = variant === "dark" ? "#ffffff" : "#0B0F1A";
  const accentColor = "#FF6B00";

  return (
    <div className={cn("flex items-center gap-2.5 shrink-0", className)}>
      <KnightIcon size={iconSize} variant={variant} />
      {showText && (
        <div className="flex flex-col items-center select-none">
          <span
            className="font-semibold leading-none uppercase whitespace-nowrap"
            style={{
              color,
              fontSize: textDims.text,
              letterSpacing: textDims.tracking,
              lineHeight: 1.1,
            }}
          >
            HOTELS VENDORS
          </span>
          <span
            className="tracking-wider uppercase font-medium leading-none"
            style={{
              color: accentColor,
              fontSize: textDims.slogan,
              marginTop: size === "xs" || size === "sm" ? 2 : 3,
              letterSpacing: "0.12em",
            }}
          >
            Smarter Together
          </span>
        </div>
      )}
    </div>
  );
}
