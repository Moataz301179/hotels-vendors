/**
 * BrandLogo — Bold Typography edition.
 * Icon 34px + wordmark 13px/0.22em tracking, single line (icon LEFT of text).
 * Old stacked tiny-logo layout removed. Sizes: sm 28 / md 34 / lg 44.
 */
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showTagline?: boolean; // deprecated — ignored, kept for old call sites
}

const SIZE_MAP = {
  sm: { icon: 28, text: 12 },
  md: { icon: 34, text: 13 },
  lg: { icon: 44, text: 15 },
};

export function BrandLogo({
  className,
  variant = "light",
  size = "md",
  showText = true,
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];
  const logoSrc = variant === "dark" ? "/logo-white.svg" : "/logo-colored.svg";

  return (
    <span className={cn("inline-flex items-center gap-2.5 shrink-0", className)} dir="ltr">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt="HotelsVendors"
        width={dims.icon}
        height={dims.icon}
        className="object-contain shrink-0"
        style={{ width: dims.icon, height: dims.icon }}
      />
      {showText && (
        <span
          className="font-semibold uppercase whitespace-nowrap text-[var(--foreground)]"
          style={{
            fontSize: dims.text,
            letterSpacing: "0.22em",
          }}
        >
          HotelsVendors
        </span>
      )}
    </span>
  );
}
