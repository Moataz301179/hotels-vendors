"use client";

interface BrandLogoProps {
  variant?: "dark" | "light" | "green";
  size?: "xs" | "sm" | "md" | "lg";
  showText?: boolean;
  label?: string;
  subLabel?: string;
}

const sizeMap = { xs: 20, sm: 24, md: 32, lg: 48 };
const textSizeMap = { xs: "text-[11px]", sm: "text-[13px]", md: "text-[15px]", lg: "text-[20px]" };

export function BrandLogo({
  variant = "dark",
  size = "md",
  showText = true,
  label = "HotelsVendors",
  subLabel,
}: BrandLogoProps) {
  const px = sizeMap[size];
  const cls = textSizeMap[size];
  const iconColor = variant === "green" ? "#39ff7e" : variant === "light" ? "#0f172a" : "#fff";
  const bgFill = variant === "green" ? "rgba(57,255,126,0.1)" : variant === "light" ? "rgba(15,23,42,0.04)" : "rgba(255,255,255,0.06)";

  return (
    <div className="flex items-center gap-2">
      <svg width={px} height={px} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill={bgFill} />
        <path d="M14 16h20v4H14zM14 24h14v4H14zM14 32h8v4H14z" fill={iconColor} opacity="0.9" />
        <circle cx="36" cy="34" r="6" fill="#39ff7e" opacity="0.8" />
        <path d="M34 34l1.5 1.5 3-3" stroke="#07090f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-semibold ${cls} tracking-wide`}
            style={{
              fontFamily: "var(--font-display)",
              color: variant === "light" ? "#0f172a" : "#fff",
            }}
          >
            {label}
          </span>
          {subLabel && (
            <span
              className="mt-0.5 text-[10px] uppercase tracking-[0.22em]"
              style={{ color: variant === "light" ? "rgba(15,23,42,0.56)" : "rgba(255,255,255,0.30)" }}
            >
              {subLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
