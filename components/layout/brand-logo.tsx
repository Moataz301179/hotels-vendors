import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
}

const SIZE_MAP = {
  xs: { icon: 22, text: 9, tagline: 6 },
  sm: { icon: 28, text: 11, tagline: 7 },
  md: { icon: 36, text: 14, tagline: 9 },
  lg: { icon: 48, text: 18, tagline: 11 },
  xl: { icon: 64, text: 24, tagline: 14 },
};

export function BrandLogo({
  className,
  variant = "light",
  size = "md",
  showText = true,
  showTagline = false,
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];
  const textColor = variant === "dark" ? "#0f172a" : "#ffffff";
  const taglineColor = variant === "dark" ? "rgba(15,23,42,0.5)" : "rgba(255,255,255,0.5)";
  // Use the clean gold logo for both variants - it works on both backgrounds
  const logoSrc = "/logo.svg";

  return (
    <div className={cn("inline-flex flex-col items-center shrink-0", className)}>
      <img
        src={logoSrc}
        alt="HotelsVendors"
        width={dims.icon}
        height={dims.icon}
        className="object-contain shrink-0"
        style={{ width: dims.icon, height: dims.icon }}
      />
      {showText && (
        <div className="flex flex-col items-center gap-1 mt-2">
          <span
            className="font-semibold uppercase whitespace-nowrap"
            style={{
              fontSize: dims.text,
              color: textColor,
              letterSpacing: "0.2em",
              fontFamily: "var(--font-display), 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
            }}
          >
            Hotels Vendors
          </span>
          {showTagline && (
            <span
              className="uppercase whitespace-nowrap"
              style={{
                fontSize: dims.tagline,
                color: taglineColor,
                letterSpacing: "0.25em",
                fontFamily: "var(--font-display), 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
              }}
            >
              The Market Changer
            </span>
          )}
        </div>
      )}
    </div>
  );
}
