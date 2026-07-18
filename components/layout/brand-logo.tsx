import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
}

const SIZE_MAP = {
  xs: { width: 88, text: 9, tagline: 6 },
  sm: { width: 112, text: 11, tagline: 7 },
  md: { width: 144, text: 14, tagline: 9 },
  lg: { width: 184, text: 18, tagline: 11 },
  xl: { width: 240, text: 24, tagline: 14 },
};

export function BrandLogo({
  className,
  variant = "light",
  size = "md",
  showText = true,
  showTagline = false,
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];
  const textColor = variant === "dark" ? "#ffffff" : "#1a1a1a";
  const taglineColor = variant === "dark" ? "rgba(255,255,255,0.6)" : "rgba(26,26,26,0.55)";

  return (
    <div className={cn("inline-flex flex-col items-center shrink-0", className)}>
      {/* Plain <img> for the SVG logo: next/image refuses to optimize SVGs
          without dangerouslyAllowSVG, which breaks the logo. A logo is a static
          asset and should not be routed through the image optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo.svg"
        alt="HotelsVendors"
        width={dims.width}
        height={Math.round(dims.width * 0.54)}
        className="object-contain shrink-0 h-auto"
        fetchPriority="high"
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
