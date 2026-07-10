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
      <img
        src="https://hercules-cdn.com/file_aF80ESBQpC48CEcCDJlkwg2x"
        alt="HotelsVendors"
        className="w-9 h-9 object-contain"
        width={36}
        height={36}
      />
      <span className="tracking-[0.15em] font-semibold text-foreground text-base">
        HOTELS VENDORS
      </span>
    </div>
  );
}
