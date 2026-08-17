import { BrandLogo } from "./brand-logo";

interface BrandLockupProps {
  productName: string;
  productTagline?: string;
  brandVariant?: "dark" | "light" | "green";
  size?: "xs" | "sm" | "md" | "lg";
}

export function BrandLockup({
  productName,
  productTagline,
  brandVariant = "dark",
  size = "md",
}: BrandLockupProps) {
  return (
    <div className="flex items-center gap-3">
      <BrandLogo variant={brandVariant} size={size} showText />
      <div className="h-8 w-px bg-white/10" />
      <div className="flex flex-col leading-none">
        <span className="text-[11px] uppercase tracking-[0.24em] text-white/35">Product Layer</span>
        <span className="text-sm font-semibold text-white">{productName}</span>
        {productTagline && (
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-white/30">
            {productTagline}
          </span>
        )}
      </div>
    </div>
  );
}