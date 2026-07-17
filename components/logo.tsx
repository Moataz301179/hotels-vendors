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
    <span className={className}>
      <BrandLogo variant="dark" size="sm" showText={false} />
    </span>
  );
}
