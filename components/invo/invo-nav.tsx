"use client";

import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export function InvoNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(212,168,67,0.08)] bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link href="/invo/dashboard" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-[#D4A843] flex items-center justify-center"><Zap className="h-4 w-4 text-black" /></div>
          <span className="text-[13px] font-semibold text-white tracking-tight">INVO</span>
          <span className="hidden sm:inline text-[9px] font-medium text-white/20 px-1.5 py-0.5 rounded border border-white/10 tracking-wider">by HotelsVendors</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-[12px] text-white/35 hover:text-white transition-colors">Sign In</Link>
          <Link href="/register" className="inline-flex items-center gap-1.5 rounded-md bg-[#D4A843] px-3.5 py-1.5 text-[12px] font-medium text-black transition-all hover:bg-[#D4A843]/90">Get Started <ArrowRight className="h-3 w-3" /></Link>
        </div>
      </div>
    </nav>
  );
}
