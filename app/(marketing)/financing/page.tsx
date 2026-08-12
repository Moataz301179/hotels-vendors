"use client";

/* Financing Hub — one consolidated page for all financing/factoring features.
   Replaces 4 separate dropdown items with a single hub: hero image + listed features. */

import Link from "next/link";
import { Banknote, CreditCard, Calculator, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

const FEATURES = [
  { icon: Banknote, title: "48h Reverse Factoring", desc: "Suppliers cash out on delivery — no more 60-day waits. FRA-compliant, verified GRN.", href: "/factoring-service" },
  { icon: CreditCard, title: "Oliv Partner Liquidity", desc: "EGP 10M pool, promo code CHV000. Fast-track early payout for verified suppliers.", href: "/oliv-financing" },
  { icon: Calculator, title: "Yield Calculator", desc: "Model discount rates and margin impact before committing to a factoring offer.", href: "/yield-calculator" },
  { icon: ShieldCheck, title: "FRA Regulatory Shield", desc: "Non-duplication registry checks and auditable e-factoring records.", href: "/fra-shield" },
];

export default function FinancingHubPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-5 py-12">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden mb-10 border border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-700" />
          <div className="relative z-10 p-8 lg:p-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-300/30 bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold mb-4">
              <CheckCircle2 size={12} /> FRA-compliant · ETA-connected
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Financing built into procurement</h1>
            <p className="text-slate-300 text-sm mt-3 max-w-lg leading-relaxed">
              The only Egyptian hospitality platform with factoring integrated directly into the purchase order —
              not a bolt-on. Suppliers get paid in 48 hours; hotels keep their working capital.
            </p>
            <Link href="/suppliers/join" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 text-sm font-semibold rounded-md hover:bg-slate-100 transition-colors">
              Get started <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <Link key={f.title} href={f.href} className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-400 hover:shadow-sm transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#314B43] flex items-center justify-center shrink-0">
                  <f.icon size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#314B43] transition-colors">{f.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{f.desc}</p>
                  <span className="text-xs font-semibold text-[#314B43] mt-2 inline-block group-hover:underline">Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}