"use client";

import Link from "next/link";
import Image from "next/image";

export function MarketingFooter() {
  return (
    <footer className="bg-[#050505] border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
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
              Egypt's first AI-powered digital procurement hub built exclusively for the hospitality sector.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {["How it Works", "Features", "Security", "API Docs"].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-[13px] text-white/30 hover:text-white/70 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5">
              {["Browse Products", "Categories", "Top Suppliers", "Deals & Offers"].map((item) => (
                <li key={item}>
                  <Link href="/marketplace" className="text-[13px] text-white/30 hover:text-white/70 transition-colors">
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
              {["About Us", "Careers", "Press", "Partners", "Contact"].map((item) => (
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
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
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
            &copy; 2026 Hotels Vendors. All rights reserved. Cairo, Egypt.
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
