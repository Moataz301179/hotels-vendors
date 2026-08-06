import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
  iconOnly?: boolean;
}

const SIZE_MAP = {
  xs: { icon: 22, text: 12, tagline: 10 },
  sm: { icon: 28, text: 13, tagline: 11 },
  md: { icon: 36, text: 14, tagline: 12 },
  lg: { icon: 48, text: 16, tagline: 13 },
  xl: { icon: 64, text: 18, tagline: 14 },
};

export function BrandLogo({
  className,
  variant = "light",
  size = "md",
  showText = true,
  showTagline = false,
  iconOnly = false,
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];
  const logoSrc = iconOnly
    ? "/logo-icon.svg"
    : variant === "dark" ? "/logo-colored.svg" : "/logo-white.svg";

  return (
    <div className={cn("inline-flex items-center gap-2 shrink-0", className)}>
      <div className="w-8 h-8 rounded-lg bg-accent-base flex items-center justify-center">
        <Zap className="w-5 h-5 text-white" />
      </div>
      {showText && (
        <span
          className="font-medium tracking-tight whitespace-nowrap"
          style={{
            fontSize: dims.text,
            color: "var(--foreground)",
            fontFamily: "var(--font-display), system-ui, sans-serif",
          }}
        >
          INVO
        </span>
      )}
    </div>
  );
}
