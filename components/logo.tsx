import Image from "next/image";

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <Image src="/assets/logo.svg" alt="HotelsVendors" fill className="object-contain" priority />
    </span>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo className="h-9 w-9" />
      <div className="leading-none">
        <span className="block text-[15px] font-semibold tracking-[0.08em] text-fg">HOTELS VENDORS</span>
        <span className="mt-1 block text-[9px] font-medium tracking-[0.34em] text-fg-3">THE MARKET CHANGER</span>
      </div>
    </div>
  );
}
