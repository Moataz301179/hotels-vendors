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

function KnightIcon({ size, variant }: { size: number; variant: "dark" | "light" }) {
  const src = variant === "dark" ? "/logo-horse-only.svg" : "/logo-horse-only.svg";
  return (
    <img
      src={src}
      alt="HotelsVendors"
      width={size}
      height={size}
      className={variant === "light" ? "brightness-0" : ""}
      style={{ width: size, height: size }}
    />
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
      <KnightIcon size={iconSize} variant={variant} />
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
