"use client";

/* Auth side panel — Bold Typography edition.
   Replaces the old BrandLogo panel: proper 44px logo, type-as-hero statement,
   hotel photography anchor, hairline dividers. No gradients, no glass. */

export function AuthLeftPanel() {
  return (
    <aside className="hidden lg:flex w-[440px] shrink-0 flex-col justify-between p-12 relative overflow-hidden bg-[#0A0A0A] border-r border-[#262626]">
      {/* Logo — proper size, wordmark beside icon */}
      <div className="relative z-10 flex items-center gap-3" dir="ltr">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-white.svg" alt="HotelsVendors" width={38} height={38} className="object-contain" />
        <span className="font-semibold uppercase text-[13px] text-[#FAFAFA]" style={{ letterSpacing: "0.22em" }}>
          HotelsVendors
        </span>
      </div>

      {/* Statement */}
      <div className="relative z-10 space-y-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/p3.jpg"
          alt="Hotel operations"
          className="w-full aspect-[4/3] object-cover border-l-2 border-t-2 border-[#262626]"
        />
        <div className="absolute top-0 right-0 h-1 w-16 bg-[#FF3D00]" style={{ marginTop: -1 }} aria-hidden />
        <h2 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.04em] text-[#FAFAFA]">
          Egyptian hospitality<br />procurement infrastructure
        </h2>
        <p className="text-[13.5px] leading-[1.7] text-[#A3A3A3]">
          AI-powered marketplace connecting hotels with verified suppliers.
          Streamlined procurement, automated compliance, and integrated
          financing on Egyptian fintech rails.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
          {["PCI-DSS", "ETA Compliant", "AML/KYC"].map((badge) => (
            <span
              key={badge}
              className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#737373]"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <p className="relative z-10 font-mono text-[10px] tracking-[0.15em] uppercase text-[#737373]">
        &copy; {new Date().getFullYear()} HotelsVendors
      </p>
    </aside>
  );
}
