"use client";

import Link from "next/link";
import { BrandLogo } from "./brand-logo";

export function MarketingFooter() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/[0.06] py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BrandLogo variant="dark" size="sm" />
            <span className="text-[13px] font-semibold text-white">
              Hotels Vendors
            </span>
          </div>
          <div className="flex items-center gap-6">
            {["Marketplace", "Platform", "Pricing", "Privacy", "Terms"].map(
              (l) => (
                <a
                  key={l}
                  href="#"
                  className="text-[12px] text-white/40 hover:text-white/70 transition-colors"
                >
                  {l}
                </a>
              )
            )}
          </div>
          <p className="text-[11px] text-white/25">
            &copy; 2026 Hotels Vendors
          </p>
        </div>
      </div>
    </footer>
  );
}
