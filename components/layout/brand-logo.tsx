"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  showText?: boolean;
}

const SIZE_MAP = {
  xs: { icon: 36, text: 14, slogan: 8, tracking: "0.04em" },
  sm: { icon: 48, text: 18, slogan: 11, tracking: "0.05em" },
  md: { icon: 72, text: 28, slogan: 16, tracking: "0.08em" },
  lg: { icon: 96, text: 38, slogan: 22, tracking: "0.1em" },
  xl: { icon: 120, text: 48, slogan: 28, tracking: "0.12em" },
  xxl: { icon: 108, text: 14, slogan: 8, tracking: "0.04em" },
};

export function BrandLogo({
  className,
  variant = "light",
  size = "md",
  showText = true,
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];
  const color = variant === "dark" ? "#ffffff" : "#0B0F1A";

  return (
    <div className={cn("flex items-center gap-2.5 shrink-0", className)}>
      {/* Chess Knight logo — clean, no background box */}
      <div className="relative flex items-center justify-center" style={{ width: dims.icon, height: dims.icon }}>
        <Image
          src="/logo-brand.jpg"
          alt="Hotels Vendors"
          width={dims.icon}
          height={dims.icon}
          className="object-contain"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      {showText && (
        <div className="flex flex-col justify-center select-none">
          <span
            className="font-bold tracking-tight leading-none"
            style={{
              color,
              fontSize: dims.text,
              letterSpacing: dims.tracking,
            }}
          >
            Hotels Vendors
          </span>
          <span
            className="tracking-wider uppercase font-medium opacity-65 mt-0.5 leading-none"
            style={{
              color: variant === "dark" ? "rgba(255,255,255,0.7)" : "rgba(11,15,26,0.7)",
              fontSize: dims.slogan,
            }}
          >
            Smarter Together
          </span>
        </div>
      )}
    </div>
  );
}
