"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export function InvoFooter() {
  return (
    <footer className="border-t border-[rgba(212,168,67,0.06)] bg-black">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded bg-[#D4A843] flex items-center justify-center"><Zap className="h-3.5 w-3.5 text-black" /></div>
              <span className="text-[12px] font-semibold text-white">INVO</span>
            </div>
            <p className="text-[11px] text-white/25 leading-relaxed">Fast invoicing for Egyptian hospitality. ETA-compliant, factoring-ready.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-medium text-white/25 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/invo/dashboard" className="text-[12px] text-white/30 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/invo/dashboard/invoices" className="text-[12px] text-white/30 hover:text-white transition-colors">Invoices</Link></li>
              <li><Link href="/invo/dashboard/factoring" className="text-[12px] text-white/30 hover:text-white transition-colors">Factoring</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-medium text-white/25 uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-[12px] text-white/30 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-[12px] text-white/30 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/pricing" className="text-[12px] text-white/30 hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-medium text-white/25 uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/compliance" className="text-[12px] text-white/30 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/compliance" className="text-[12px] text-white/30 hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[rgba(212,168,67,0.04)] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/15">&copy; {new Date().getFullYear()} INVO by HotelsVendors.</p>
          <p className="text-[10px] text-white/15">ETA Compliant &middot; Bank-Grade Security</p>
        </div>
      </div>
    </footer>
  );
}
