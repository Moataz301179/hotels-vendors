"use client";

import Link from "next/link";
import { Shield, FileCheck, Lock } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/[0.04] bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <BrandLogo variant="dark" size="xs" />
            </div>
            <p className="text-[12px] text-zinc-500 leading-relaxed max-w-xs">
              Egypt&apos;s B2B procurement operating system for hospitality. AI-powered, ETA-compliant, built for scale.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Marketplace", href: "/marketplace" },
                { label: "Hotel Solutions", href: "/solutions" },
                { label: "Hotel Dashboard", href: "/sandbox" },
                { label: "Supplier Portal", href: "/become-supplier" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] text-zinc-500 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stakeholders */}
          <div>
            <h4 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-4">Stakeholders</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Hotels", href: "/hotels" },
                { label: "Suppliers", href: "/become-supplier" },
                { label: "Pricing", href: "/pricing" },
                { label: "ETA Compliance", href: "/compliance" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] text-zinc-500 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About", href: "/about" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Sign In", href: "/login" },
                { label: "Get Started", href: "/register" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] text-zinc-500 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Foundation Block */}
        <div className="border-t border-white/[0.04] pt-6 pb-4">
          <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <p className="text-[11px] text-zinc-500 leading-relaxed text-center">
              Platform owned and operated by <strong className="text-zinc-400">Restaurants for E-Marketing</strong><br />
              Tax ID: <span className="text-zinc-500">704226146</span> · Unified Commercial Registry Number: <span className="text-zinc-500">105300900196948</span>
            </p>
          </div>
        </div>

        {/* Data Privacy & Cookie Clause */}
        <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "rgba(139,0,0,0.5)" }} />
            <div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                <strong className="text-zinc-400">Data Isolation & Privacy Commitment:</strong> HotelsVendors processes enterprise financial data exclusively as a technical data orchestrator under explicit data processing agreements. All corporate transaction data, invoice payloads, and ETA submission records are handled with AES-256-GCM encryption at rest and TLS 1.3 in transit. Data is logically isolated per tenant with zero cross-contenant exposure. Session cookies are strictly necessary for platform operation and do not track user behavior for advertising purposes. Full compliance with Egyptian data protection regulations. For data processing inquiries, contact the Data Controller at <span className="text-zinc-400">privacy@hotelsvendors.com</span>.
              <br />For support inquiries: <span className="text-zinc-400">support@hotelsvendors.com</span>.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  className="text-[10px] text-zinc-500 hover:text-white/70 transition-colors underline underline-offset-2 decoration-white/15 hover:decoration-white/30"
                  onClick={() => {}}
                >
                  Cookie Preferences
                </button>
                <span className="text-white/10">|</span>
                <Link href="/compliance" className="text-[10px] text-zinc-500 hover:text-white/70 transition-colors underline underline-offset-2 decoration-white/15 hover:decoration-white/30">
                  Data Policy
                </Link>
                <span className="text-white/10">|</span>
                <Link href="/compliance" className="text-[10px] text-zinc-500 hover:text-white/70 transition-colors underline underline-offset-2 decoration-white/15 hover:decoration-white/30">
                  DPA Terms
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-zinc-500">
            &copy; {new Date().getFullYear()} HotelsVendors. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" style={{ color: "#8B0000" }} />
              Bank-grade security
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" style={{ color: "#8B0000" }} />
              ETA compliant
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" style={{ color: "#8B0000" }} />
              Data isolated
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
