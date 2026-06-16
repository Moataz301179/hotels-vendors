"use client";

import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#0B0F1A] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 pb-12 border-b border-white/5">
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Regulatory</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                <span className="text-sm text-white/60">FRA Registered Partner</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                <span className="text-sm text-white/60">ETA E-Invoice Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                <span className="text-sm text-white/60">ISO 27001 Ready</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Partners</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">Paymob</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">Oliv Finance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">CIB</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Security</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span className="text-sm text-white/60">AES-256 Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span className="text-sm text-white/60">TLS 1.3 In Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span className="text-sm text-white/60">SHA-256 Audit Trail</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Compliance</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">Law 194/2020 (Fintech)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">Law 151/2020 (Data Privacy)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">Law 67/2018 (ETA)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/catalog" className="text-sm text-white/40 hover:text-white/60 transition-colors">Catalog</Link></li>
              <li><Link href="/marketplace" className="text-sm text-white/40 hover:text-white/60 transition-colors">Marketplace</Link></li>
              <li><Link href="/pricing" className="text-sm text-white/40 hover:text-white/60 transition-colors">Pricing</Link></li>
              <li><Link href="/solutions" className="text-sm text-white/40 hover:text-white/60 transition-colors">Solutions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-white/40 hover:text-white/60 transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm text-white/40 hover:text-white/60 transition-colors">Contact</Link></li>
              <li><Link href="/become-supplier" className="text-sm text-white/40 hover:text-white/60 transition-colors">Become a Supplier</Link></li>
              <li><Link href="/help" className="text-sm text-white/40 hover:text-white/60 transition-colors">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-white/40 hover:text-white/60 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-white/40 hover:text-white/60 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Infrastructure</h4>
            <ul className="space-y-2">
              <li><Link href="https://invo.hotelsvendors.com" className="text-sm text-white/40 hover:text-white/60 transition-colors">INVO Platform</Link></li>
              <li><span className="text-sm text-white/40">Cairo, Egypt</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Hotels Vendors. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Hotels Vendors is a technology orchestration layer. Financial services provided by licensed third-party partners.
          </p>
        </div>
      </div>
    </footer>
  );
}
