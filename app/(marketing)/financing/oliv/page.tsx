"use client";

import Link from "next/link";
import { CreditCard, Shield, Banknote, ArrowRight, FileCheck, Zap, CheckCircle2 } from "lucide-react";

const features = [
  { icon: Zap, color: "#D4A843", title: "Instant Liquidity", desc: "Get funded within 48 hours of invoice approval. No waiting for 60-90 day payment terms." },
  { icon: Shield, color: "#39ff7e", title: "Non-Recourse Factoring", desc: "Zero default risk for suppliers. Factoring partners absorb credit risk, priced into the discount rate." },
  { icon: FileCheck, color: "#c455ff", title: "ETA-Compliant Invoices", desc: "Only verified, ETA-submitted invoices qualify. Full tax compliance baked into the financing flow." },
  { icon: Banknote, color: "#64b5f6", title: "Competitive Rates", desc: "Rates from 1.5% per month. Better than traditional bank loans. No hidden fees." },
];

const steps = [
  { step: "01", title: "Supplier invoices hotel", desc: "Standard order flow generates an ETA-compliant invoice." },
  { step: "02", title: "Invoice qualifies", desc: "Oliv verifies ETA status, invoice authenticity, and hotel creditworthiness." },
  { step: "03", title: "Factoring partner matched", desc: "Best-rate offer generated from our network of licensed factoring companies." },
  { step: "04", title: "Supplier gets funded", desc: "Funds transferred within 48 hours. Hotel pays the factoring partner on due date." },
];

export default function OlivFinancingPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#D4A843]/[0.04] blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(212,168,67,0.15)] bg-[rgba(212,168,66,0.05)] px-4 py-1.5 text-[12px] text-[#D4A843]/80">
            <CreditCard className="h-3.5 w-3.5" />Powered by Oliv Finance
          </div>
          <h1 className="mx-auto max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
            Get paid <span className="text-[#D4A843]">instantly.</span><br />Never chase invoices again.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15px] text-white/40">Oliv Finance provides embedded non-recourse factoring for Egyptian hospitality. Suppliers get fast liquidity, hotels get extended payment terms.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-md bg-[#D4A843] px-8 py-3 text-[14px] font-medium text-black transition-all hover:bg-[#D4A843]/90">Apply for Factoring <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/contact" className="btn-ghost !px-8 !py-3 !text-[14px]">Talk to Sales</Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-[clamp(1.5rem,3vw,2.2rem)] font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Why Suppliers Choose Oliv</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="surface-card neon-card p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${f.color}10` }}><f.icon className="h-5 w-5" style={{ color: f.color }} /></div>
                <h3 className="text-[15px] font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/40">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-[clamp(1.5rem,3vw,2.2rem)] font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>How Factoring Works</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mb-3 text-[36px] font-bold text-[#D4A843]/15" style={{ fontFamily: "var(--font-display)" }}>{s.step}</div>
                <h3 className="text-[15px] font-semibold text-white mb-1.5">{s.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/35">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl border border-[rgba(212,168,67,0.1)] bg-[rgba(212,168,67,0.02)] p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-[22px] font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>Simple, Transparent Pricing</h2>
              <p className="mt-2 text-[14px] text-white/35">No hidden fees. No surprises.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { label: "Factoring Fee", value: "1.5–3%", desc: "Per month, based on hotel credit risk" },
                { label: "Processing", value: "EGP 500", desc: "One-time per invoice" },
                { label: "Advance Rate", value: "80–90%", desc: "Of invoice value, upfront" },
              ].map((r) => (
                <div key={r.label} className="text-center">
                  <p className="text-[28px] font-bold text-[#D4A843]" style={{ fontFamily: "var(--font-display)" }}>{r.value}</p>
                  <p className="text-[13px] font-medium text-white mt-1">{r.label}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[clamp(1.6rem,3.5vw,2.5rem)] font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Ready to unlock your cash flow?</h2>
          <p className="mt-4 text-[14px] text-white/40">Join the suppliers and hotels already using Oliv Finance.</p>
          <div className="mt-8"><Link href="/register" className="inline-flex items-center gap-2 rounded-md bg-[#D4A843] px-10 py-3.5 text-[15px] font-medium text-black transition-all hover:bg-[#D4A843]/90">Get Started <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>
    </>
  );
}
