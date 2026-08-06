"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface OlivLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "dark" | "light" | "green";
}

const SIZE_MAP = {
  xs: { width: 60, height: 20 },
  sm: { width: 80, height: 28 },
  md: { width: 100, height: 34 },
  lg: { width: 140, height: 48 },
  xl: { width: 180, height: 60 },
};

export function OlivLogo({ className, size = "md", variant = "dark" }: OlivLogoProps) {
  const dims = SIZE_MAP[size];
  const src = variant === "light" ? "/oliv-logo-white.png" : "/oliv-logo.png";

  return (
    <Image
      src={src}
      alt="Oliv — Invoice Financing"
      width={dims.width}
      height={dims.height}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
