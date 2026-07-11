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
  xs: { width: 18, height: 26 },
  sm: { width: 22, height: 32 },
  md: { width: 28, height: 40 },
  lg: { width: 38, height: 54 },
  xl: { width: 48, height: 68 },
};

/**
 * Hotels Vendors brand logo — shield with H and diagonal stripes.
 * No baked-in text. Scales crisply at any size.
 */
export function BrandLogo({
  className,
  variant = "light",
  size = "md",
  showText,
  forceColor,
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];
  const fill = forceColor && forceColor !== "bw" ? forceColor : variant === "dark" ? "#ffffff" : "#0B0F1A";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 170 240"
      width={dims.width}
      height={dims.height}
      fill={fill}
      className={cn("shrink-0", className)}
      aria-label="Hotels Vendors"
    >
      <path
        d="M20 15 C55 5, 105 5, 140 15 L150 20 L150 160 C150 190, 105 225, 85 235 C65 225, 20 190, 20 160 L20 20 Z"
        opacity="0.95"
      />
      <path
        d="M45 45 L45 190 L60 190 L60 125 L105 125 L105 190 L120 190 L120 45 L105 45 L105 100 L60 100 L60 45 Z"
        opacity="0.95"
      />
      <path d="M20 85 L150 160 L150 140 L20 65 Z" opacity="0.3" />
      <path d="M20 120 L150 195 L150 175 L20 100 Z" opacity="0.3" />
      <path d="M20 155 L110 210 L95 220 L20 175 Z" opacity="0.3" />
    </svg>
  );
}
