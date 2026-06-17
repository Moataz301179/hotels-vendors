import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Receipt, Truck, Banknote, ShieldCheck, BarChart3, Cpu, Lock, Zap } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = {
  title: "B2B Hospitality Operating System | Procurement + Fintech + AI Automation | HotelsVendors",
  description: "Four engines. One operating system. AI-automated procurement, embedded reverse factoring, ETA e-invoicing compliance, and autonomous AI agents — purpose-built for Egyptian hospitality.",
  keywords: ["B2B hospitality procurement Egypt", "automated factoring lines Cairo", "hotel supply chain management Egypt", "ETA e-invoicing compliance", "AI procurement automation", "hospitality operating system", "منصة المشتريات الفندقية مصر", "تمويل فندقي مصر"],
  openGraph: {
    title: "B2B Hospitality Operating System | Procurement + Fintech + AI Automation | HotelsVendors",
    description: "AI-automated procurement, embedded reverse factoring, ETA e-invoicing compliance, and autonomous AI agents — purpose-built for Egyptian hospitality.",
    type: "website",
  },
};

const pillars = [
  {
    icon: BrainCircuit,
    num: "01",
    title: "AI Demand Forecasting",
    color: "#84cc16",
    desc: "14-day demand prediction engine analyzing occupancy rates, local events, seasonality patterns, and historical consumption across every property in your portfolio. Auto-generates POs against budget ceilings.",
    features: ["14-day rolling predictions", "Occupancy + event + seasonality analysis", "Auto PO generation", "Budget blockade enforcement"],
  },
  {
    icon: Receipt,
    num: "02",
    title: "ETA E-Invoicing Compliance",
    color: "#22C55E",
    desc: "Native Egyptian Tax Authority integration. Every invoice is digitally signed with RSA-2048 encryption, UUID-tracked, and submitted in real-time. Zero penalty risk.",
    features: ["RSA-2048 digital signing", "UUID-based invoice tracking", "Real-time ETA submission", "Phase 1 & 2 compliant"],
  },
  {
    icon: Truck,
    num: "03",
    title: "Shared-Route Logistics",
    color: "#3B82F6",
    desc: "AI-driven route consolidation across 6 governorates. Multi-supplier load matching reduces logistics costs. Cold-chain capable with real-time GPS.",
    features: ["Route consolidation", "6 governorate coverage", "Real-time GPS tracking", "Cold-chain capable"],
  },
  {
    icon: Banknote,
    num: "04",
    title: "Embedded Factoring",
    color: "#D4A843",
    desc: "Hotel-initiated reverse factoring with licensed grantors. Suppliers paid in 24 hours while hotels maintain net-60 terms. Non-recourse by design.",
    features: ["Licensed grantor network", "24hr supplier payment", "Net-60 preserved", "Non-recourse settlement"],
  },
];

export default function PlatformPage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <MarketingNav />
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(132,204,22,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Platform</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-white">
            Four Engines.<br /><span className="text-gradient-lime">One Operating System.<br />Zero Manual Reconciliation.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl leading-relaxed mb-8">
            AI-automated procurement, cryptographic ETA compliance, shared-route logistics, and embedded factoring — all running on a single multi-tenant platform built for Egyptian hospitality.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/sandbox" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.2)]" style={{ backgroundColor: "#84cc16", color: "#000000" }}>
              Try the Sandbox <ArrowRight size={14} />
            </Link>
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Request Enterprise Access <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y" style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: "#030303" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: ShieldCheck, label: "ETA Phase 1 & 2", desc: "Full compliance" },
              { icon: Lock, label: "RSA-2048 Signing", desc: "Cryptographic audit trail" },
              { icon: Zap, label: "AI-Native", desc: "Demand forecasting" },
              { icon: BarChart3, label: "Analytics", desc: "Spend visibility" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <b.icon size={16} style={{ color: "#84cc16" }} />
                <div>
                  <p className="text-[11px] font-medium text-white/60">{b.label}</p>
                  <p className="text-[9px] text-white/25">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 space-y-4">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-2xl p-6 md:p-8 transition-all hover:border-[#84cc16]/10" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="grid lg:grid-cols-4 gap-6 items-start">
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: p.color + "15" }}>
                      <p.icon size={20} style={{ color: p.color }} />
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-white/25 uppercase tracking-wider">Pillar {p.num}</span>
                      <h2 className="text-[18px] font-medium text-white">{p.title}</h2>
                    </div>
                  </div>
                  <p className="text-[13px] text-white/40 leading-relaxed mb-4 max-w-xl">{p.desc}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 p-2.5 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                        <span className="text-[11px] text-white/40">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-xl min-h-[120px]" style={{ backgroundColor: p.color + "08" }}>
                  <p.icon size={32} style={{ color: p.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance Bar */}
      <section className="py-12 border-y" style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, label: "ETA Phase 1 & 2", desc: "Full compliance" },
              { icon: BarChart3, label: "AI Forecasting", desc: "Demand prediction" },
              { icon: Truck, label: "6 Governorates", desc: "Coastal + Inland" },
              { icon: Banknote, label: "24-Hour Settlement", desc: "Bank-direct" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(132,204,22,0.08)" }}>
                  <b.icon size={16} style={{ color: "#84cc16" }} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-white/60">{b.label}</p>
                  <p className="text-[9px] text-white/25">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Cpu size={32} className="mx-auto mb-6" style={{ color: "#84cc16" }} />
          <h2 className="text-[24px] font-medium mb-4 text-white">Ready to Automate Your Procurement?</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">Purpose-built for Egyptian hospitality groups managing coastal and inland properties.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/sandbox" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.2)]" style={{ backgroundColor: "#84cc16", color: "#000000" }}>
              Try the Sandbox <ArrowRight size={14} />
            </Link>
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Get Started
            </Link>
          </div>
        </div>
      </section>
          <MarketingFooter />
    </main>
  );
}
