"use client";

import Link from "next/link";
import Image from "next/image";

export function MarketingFooter() {
  return (
    <footer className="bg-[#0a0a12] border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo-icon-white.png"
                alt="Hotels Vendors"
                width={32}
                height={44}
                className="object-contain"
                priority
              />
              <div>
                <span className="text-[14px] font-bold text-white tracking-tight block">
                  Hotels Vendors
                </span>
                <span className="text-[9px] font-medium text-white/30 uppercase tracking-[0.1em]">
                  Smarter Together
                </span>
              </div>
            </div>
            <p className="text-[12px] text-white/30 leading-relaxed max-w-xs">
              The intelligent procurement platform for Egyptian hospitality.
              Tenant-isolated, ETA-native, and governed by Authority Matrix.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {["Marketplace", "For Hotels", "For Suppliers", "Logistics", "Factoring", "ETA Compliance"].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-[13px] text-white/30 hover:text-white/70 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {["About", "Pricing", "Careers", "Contact", "Blog", "Press"].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-[13px] text-white/30 hover:text-white/70 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-[13px] text-white/30 hover:text-white/70 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/20">
            &copy; 2026 Hotels Vendors. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["LinkedIn", "Twitter", "Facebook"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[11px] text-white/20 hover:text-white/50 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
