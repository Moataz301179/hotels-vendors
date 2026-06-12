"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

const SIZE_MAP = {
  sm: { icon: 28, text: 14, tracking: "-0.01em" },
  md: { icon: 36, text: 16, tracking: "-0.02em" },
  lg: { icon: 48, text: 20, tracking: "-0.02em" },
  xl: { icon: 64, text: 26, tracking: "-0.03em" },
};

export function BrandLogo({
  className,
  variant = "light",
  size = "md",
  showText = true,
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];
  const color = variant === "dark" ? "#ffffff" : "#0B0F1A";
  const bgColor = variant === "dark" ? "#000000" : "#000000";
  const borderColor = variant === "dark" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.1)";

  return (
    <div className={cn("flex items-center gap-2.5 shrink-0", className)}>
      {/* Knight / Horse head logo — chess piece in white on black */}
      <div
        className="relative flex items-center justify-center rounded-lg overflow-hidden"
        style={{
          width: dims.icon,
          height: dims.icon,
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
        }}
      >
        <Image
          src="/knight-icon.svg"
          alt="HotelsVendors — Knight"
          width={Math.round(dims.icon * 0.65)}
          height={Math.round(dims.icon * 0.65)}
          className="object-contain"
        />
      </div>
      {showText && (
        <span
          style={{
            color,
            fontWeight: 600,
            fontSize: dims.text,
            letterSpacing: dims.tracking,
            lineHeight: 1,
          }}
        >
          HotelsVendors
        </span>
      )}
    </div>
  );
}
