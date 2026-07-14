import Image from "next/image";
import { BrandLogo } from "@/components/layout/brand-logo";

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <Image src="/assets/logo.svg" alt="HotelsVendors" fill className="object-contain" priority />
    </span>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <BrandLogo variant="dark" size="sm" showText={false} />
      <span
        className="font-semibold text-white text-[15px] uppercase whitespace-nowrap"
        style={{ letterSpacing: "0.2em", fontFamily: "var(--font-display), 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}
      >
        Hotels Vendors
      </span>
    </div>
  );
}
