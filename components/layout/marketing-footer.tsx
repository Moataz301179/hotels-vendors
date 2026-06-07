"use client";

import Link from "next/link";
import { Shield, FileCheck } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#080510]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="24" height="24" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <g fill="#ffffff" stroke="#ffffff" strokeWidth="12" strokeLinejoin="round">
                  <rect x="80" y="100" width="40" height="200" rx="8"/>
                  <rect x="80" y="140" width="160" height="40" rx="8"/>
                  <path d="M260 100 L300 300 L340 100"/>
                  <path d="M120 300 Q200 280 280 300" strokeWidth="8" fill="none"/>
                </g>
              </svg>
              <div>
                <span className="text-[14px] font-bold text-white tracking-tight block">
                  HotelsVendors
                </span>
              </div>
            </div>
            <p className="text-[12px] text-gray-600 leading-relaxed max-w-xs">
              Egypt's B2B procurement operating system for hospitality. AI-powered, fully compliant, built for scale.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Solutions", href: "/solutions" },
                { label: "Pricing", href: "/pricing" },
                { label: "Marketplace", href: "/marketplace" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] text-gray-500 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stakeholders */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Stakeholders
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Hotels", href: "/hotels" },
                { label: "Suppliers", href: "/become-supplier" },
                { label: "Logistics", href: "/register?role=shipping" },
                { label: "Factoring", href: "/register?role=factoring" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] text-gray-500 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "About", href: "/about" },
                { label: "Sign In", href: "/login" },
                { label: "Get Started", href: "/register" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] text-gray-500 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-600">
            &copy; {new Date().getFullYear()} HotelsVendors. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[12px] text-gray-600">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[var(--accent-base)]" />
              Bank-grade security
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-[var(--accent-base)]" />
              ETA compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
