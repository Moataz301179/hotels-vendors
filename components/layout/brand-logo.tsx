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
  md: 44,
  lg: 56,
  xl: 72,
  xxl: 96,
};

function KnightIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }}
    >
      <defs>
        <linearGradient id={`kg-${size}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#00E5CC" />
        </linearGradient>
      </defs>
      <path d="M65 15 L75 25 L70 35 L80 45 L70 60 L55 55 L45 65 L35 60 L30 70 L25 65 L30 50 L40 45 L35 35 L45 25 L55 30 L65 15Z" fill={`url(#kg-${size})`} />
      <path d="M35 60 L30 70 L25 65 L30 50Z" fill={color} opacity="0.4" />
      <path d="M55 30 L65 15 L60 25Z" fill="#00E5CC" opacity="0.3" />
      <circle cx="58" cy="38" r="3" fill="#ffffff" opacity="0.9" />
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
  const accentColor = variant === "dark" ? "#FF6B00" : "#FF6B00";

  return (
    <div className={cn("flex items-center gap-2 shrink-0", className)}>
      <KnightIcon size={iconSize} color={accentColor} />
      {showText && (
        <div className="flex flex-col justify-center select-none">
          <span
            className="font-semibold leading-none uppercase"
            style={{
              color,
              fontSize: textDims.text,
              letterSpacing: textDims.tracking,
              lineHeight: 1.1,
            }}
          >
            HotelsVendors
          </span>
          <span
            className="tracking-wider uppercase font-medium leading-none"
            style={{
              color: accentColor,
              fontSize: textDims.slogan,
              marginTop: size === "xs" || size === "sm" ? 2 : 3,
            }}
          >
            Smarter Together
          </span>
        </div>
      )}
    </div>
  );
}
