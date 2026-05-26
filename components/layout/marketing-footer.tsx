"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";

export function MarketingFooter() {
  return (
    <footer className="py-16 border-t border-white/[0.04] bg-[#000000]">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Top: Brand + Trust badges */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BrandLogo variant="dark" size="sm" />
              <span className="text-sm font-semibold text-white">HotelsVendors</span>
            </div>
            <p className="text-xs text-white/30 max-w-xs leading-relaxed">
              Egypt&apos;s first AI-powered procurement orchestration platform for mid-size hotels.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <img src="/logo-instapay.png" alt="InstaPay" className="h-6 opacity-40 hover:opacity-70 transition-opacity" />
            <img src="/logo-fawry.png" alt="Fawry" className="h-6 opacity-40 hover:opacity-70 transition-opacity" />
            <img src="/logo-oliv.png" alt="Oliv" className="h-6 opacity-40 hover:opacity-70 transition-opacity" />
            <img src="/logo-eta.png" alt="ETA" className="h-6 opacity-40 hover:opacity-70 transition-opacity" />
          </div>
        </div>

        <div className="h-px bg-white/[0.04] mb-10" />

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div>
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-4">Product</h5>
            <Link href="/solutions" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">Solutions</Link>
            <Link href="/pricing" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">Pricing</Link>
            <Link href="/marketplace" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">Marketplace</Link>
          </div>
          <div>
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-4">Company</h5>
            <Link href="/about" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">About Us</Link>
            <Link href="/partners" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">Partners</Link>
            <Link href="/become-supplier" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">Become a Supplier</Link>
          </div>
          <div>
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-4">Resources</h5>
            <Link href="/help" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">Help Center</Link>
            <Link href="/blog" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">Blog</Link>
            <Link href="/api-docs" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">API Docs</Link>
          </div>
          <div>
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-4">Legal</h5>
            <Link href="/privacy" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">Privacy Policy</Link>
            <Link href="/terms" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">Terms of Service</Link>
            <Link href="/security" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">Security</Link>
          </div>
          <div>
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-4">Connect</h5>
            <a href="https://www.facebook.com/hotelsvendors" target="_blank" rel="noopener noreferrer" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">Facebook</a>
            <a href="https://www.linkedin.com/company/hotelsvendors" target="_blank" rel="noopener noreferrer" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">LinkedIn</a>
            <a href="https://twitter.com/hotelsvendors" target="_blank" rel="noopener noreferrer" className="block text-[12px] text-white/20 hover:text-white/60 transition-colors mb-3">Twitter</a>
          </div>
        </div>

        <div className="h-px bg-white/[0.04] mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[11px] text-white/10">© 2024 HotelsVendors. All rights reserved.</span>
          <span className="text-[11px] text-white/10">Cairo, Egypt · CR: [Your CR Number]</span>
        </div>
      </div>
    </footer>
  );
}
