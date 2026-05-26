"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_MAP = {
  sm: { width: 40, height: 56 },
  md: { width: 52, height: 74 },
  lg: { width: 72, height: 102 },
  xl: { width: 96, height: 136 },
};

/**
 * Hotels Vendors brand logo — real HV monogram shield.
 * Use variant="dark" on dark backgrounds (white logo).
 * Use variant="light" on light backgrounds (dark logo).
 */
export function BrandLogo({
  className,
  variant = "light",
  size = "md",
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];

  const logoSrc = variant === "dark" ? "/logo-icon-white.png" : "/logo-icon.png";

  return (
    <Image
      src={logoSrc}
      alt="Hotels Vendors"
      width={dims.width}
      height={dims.height}
      className={cn("object-contain", className)}
      priority
    />
  );
}
