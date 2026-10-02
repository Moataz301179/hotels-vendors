import { cn } from "@/lib/utils";

interface BrandLogoProps { className?: string; variant?: "dark" | "light"; size?: "sm" | "md" | "lg"; showText?: boolean; showTagline?: boolean; }

const SIZE_MAP = {
  sm: { width: 118, height: 28 },
  md: { width: 145, height: 34 },
  lg: { width: 178, height: 42 },
};

export function BrandLogo({ className, variant = "light", size = "md" }: BrandLogoProps) {
  const dims = SIZE_MAP[size];
  const logoSrc = variant === "dark" ? "/logo-white.svg" : "/logo-dark.svg";
  return (
    <span className={cn("inline-flex items-center shrink-0", className)} dir="ltr">
      <img src={logoSrc} alt="HotelsVendors" width={dims.width} height={dims.height} className="block object-contain" style={{ width: dims.width, height: dims.height }} />
    </span>
  );
}
