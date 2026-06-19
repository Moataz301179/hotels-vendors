"use client";

import Image from "next/image";
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

/**
 * Icon size fills the header height (80px) with padding.
 * For the nav bar, we want the horse icon to be ~56px tall (header 80px - 24px padding).
 */
const ICON_SIZE_MAP = {
  xs: 32,
  sm: 40,
  md: 56,
  lg: 72,
  xl: 88,
  xxl: 108,
};

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
      {/* Chess horse logo — fills header height */}
      <Image
        src="/knight-icon.svg"
        alt="HotelsVendors"
        width={iconSize}
        height={iconSize}
        className="object-contain"
        priority
        style={{ width: iconSize, height: iconSize }}
      />
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
