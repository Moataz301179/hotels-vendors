"use client";

import { useSearchParams } from "next/navigation";
import { HovinDevice } from "@/components/marketing/hovin-device";

/**
 * Auth side panel — role-aware.
 * /register (default, hotel role) → hotel mobile app preview
 * /register?type=supplier         → supplier mobile app preview (same device frame,
 *   different HUD labels/colors until owner supplies the supplier screenshots)
 *
 * The device is the HOVIN Swiss-frame component; the panel adapts its copy and
 * an accent tag so the user sees THEIR app while signing up.
 */

export function AuthLeftPanel() {
  const searchParams = useSearchParams();
  const isSupplier = searchParams.get("type") === "supplier";

  return (
    <aside className="hidden lg:flex w-[480px] shrink-0 flex-col justify-between p-10 relative overflow-hidden bg-[#F8FAFC] border-r border-[#E2E8F0]">
      {/* Logo lockup */}
      <div className="relative z-10 flex items-center gap-3" dir="ltr">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-colored.svg" alt="HotelsVendors" width={36} height={36} className="object-contain" />
        <span className="font-semibold uppercase text-[13px] text-[#0F172A]" style={{ letterSpacing: "0.22em" }}>
          HotelsVendors
        </span>
      </div>

      {/* Live app preview */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-8 min-h-0 overflow-hidden">
        <p
          className="font-mono text-[10px] tracking-[0.2em] uppercase mb-4"
          style={{ color: "#2563EB" }}
        >
          {isSupplier ? "HOVIN · Supplier app" : "HOVIN · Hotel app"}
        </p>
        <div className="origin-top" style={{ transform: "scale(0.82)", transformOrigin: "top center" }}>
          <HovinDevice variant={isSupplier ? "supplier" : "hotel"} />
        </div>
      </div>

      {/* Statement */}
      <div className="relative z-10 space-y-4">
        <h2 className="text-[24px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#0F172A]">
          {isSupplier ? (
            <>Your products,<br />in every hotel.</>
          ) : (
            <>Egyptian hospitality<br />procurement infrastructure</>
          )}
        </h2>
        <p className="text-[13px] leading-[1.7] text-[#475569]">
          {isSupplier
            ? "List products, respond to verified hotel demand, and connect eligible invoices with external funders. The app above is your daily ops layer."
            : "Virtual Shadow surfaces spend leaks, supplier options, and cash-flow signals. External funders—not HotelsVendors—make financing decisions."}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
          {["PCI-DSS", "ETA Compliant", "AML/KYC"].map((b) => (
            <span key={b} className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#64748B]">
              {b}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
