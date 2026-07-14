import Link from "next/link";
import { Shield, Lock, Globe } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0c0c12] flex">
      {/* Left: Brand Sidebar (desktop) */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between p-10 border-r border-white/[0.06] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#8B1A1A]/[0.06] blur-[120px] pointer-events-none" />

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-lg bg-[#8B1A1A]/10 border border-[#8B1A1A]/20 flex items-center justify-center">
              <span className="text-[#8B1A1A] font-bold text-sm font-serif">HV</span>
            </div>
            <span className="text-[15px] font-semibold text-white tracking-tight uppercase">
              <span className="font-serif font-bold tracking-[0.18em]">Hotels Vendors</span>
            </span>
          </Link>

          <h2 className="text-[28px] xl:text-[34px] font-semibold text-white leading-[1.15] tracking-[-0.02em] max-w-sm">
            The B2B Operating System for{" "}
            <span className="text-gradient-lime">Egyptian Hospitality</span>
          </h2>
          <p className="mt-4 text-[14px] text-white/40 leading-relaxed max-w-sm">
            Procurement, invoicing, factoring, and logistics — unified in one platform built for hotels, suppliers, and service providers.
          </p>
        </div>

        {/* Bottom: Compliance badges */}
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Shield, label: "ETA Compliant" },
              { icon: Lock, label: "SOC 2 Type II" },
              { icon: Globe, label: "Multi-Tenant" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]"
              >
                <badge.icon size={12} className="text-[#39ff7e]" />
                <span className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-white/20">
            &copy; {new Date().getFullYear()} HotelsVendors. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[440px]">{children}</div>
      </div>
    </div>
  );
}
