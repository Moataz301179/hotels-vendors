"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Banknote, Zap } from "lucide-react";

export default function HotelsVendorsLanding() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#84cc16] flex items-center justify-center">
              <span className="text-black font-bold text-xl">HV</span>
            </div>
            <span className="font-semibold text-2xl tracking-tight">HotelsVendors</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/login" className="px-4 py-2 text-white/70 hover:text-white">Sign in</Link>
            <Link href="/register" className="px-6 py-2.5 rounded-xl bg-[#84cc16] text-black font-semibold hover:bg-[#a3d94d]">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 text-sm">
            <div className="w-2 h-2 bg-[#84cc16] rounded-full animate-pulse" />
            Egypt&rsquo;s B2B Hospitality Procurement Platform
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-[-2.5px] leading-none mb-6">
            Suppliers get paid<br />in <span className="text-[#84cc16]">24 hours.</span><br />
            You keep <span className="text-white/50">Net-60+</span>.
          </h1>

          <p className="max-w-xl mx-auto text-xl text-white/60 mb-10">
            AI-powered procurement. Embedded reverse factoring. ETA e-invoicing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold rounded-2xl bg-[#84cc16] text-black hover:bg-[#a3d94d]">
              Request Access <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/sandbox" className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-medium rounded-2xl border border-white/20 hover:bg-white/5">
              Try the Sandbox
            </Link>
          </div>
        </div>
      </section>

      <div className="border-y border-white/10 py-10 bg-black/50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-8 text-center">
          {[
            ["ETA Phase 1 & 2", "E-Invoicing Compliant"],
            ["AES-256 Encryption", "Bank-grade Security"],
            ["99.99% Uptime", "Production SLA"],
            ["24h Settlement", "Bank-direct IBAN"],
          ].map(([title, sub], i) => (
            <div key={i}>
              <div className="text-[#84cc16] text-xl font-semibold">{title}</div>
              <div className="text-sm text-white/50 mt-1">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold tracking-tight mb-8">Ready to modernize your procurement?</h2>
        <Link href="/register" className="inline-flex items-center gap-3 px-10 py-4 text-lg font-semibold rounded-2xl bg-[#84cc16] text-black hover:bg-[#a3d94d]">
          Start Free Trial <ArrowRight />
        </Link>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/40">
        &copy; {new Date().getFullYear()} HotelsVendors &mdash; Cairo, Egypt
      </footer>
    </div>
  );
}
