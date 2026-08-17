"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Truck,
  FileCheck,
  CreditCard,
  Building2,
  Package,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Globe,
  BarChart3,
} from "lucide-react";

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="scanline" />
        <div className="shader-stack" aria-hidden="true">
          <div className="shader-ribbon" />
          <div className="shader-grain" />
          <div className="shader-orb shader-orb-brass left-[18%] top-[-8%] h-[480px] w-[480px]" />
          <div className="shader-orb shader-orb-slate right-[4%] top-[20%] h-[420px] w-[420px]" />
          <div className="shader-orb shader-orb-slate left-[40%] bottom-[-24%] h-[360px] w-[360px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-[12px] text-white/50">
            <Globe className="h-3.5 w-3.5 text-[var(--accent-light)]" />
            Egypt&apos;s B2B Procurement Operating System
          </div>
          <div className="mx-auto mb-7 flex w-fit items-center rounded-full border border-[var(--accent-base)]/40 bg-[#1d1712d6] p-1 pr-3">
            <span className="rounded-full bg-[var(--accent-base)] px-2 py-1 text-[10px] font-semibold text-[#1b1510]">SIGNATURE</span>
            <span className="pl-2 text-[10px] uppercase tracking-[0.2em] text-[#c8f4ff]" style={{ fontFamily: "var(--font-mono)" }}>
              Ledger Atelier UI
            </span>
          </div>
          <h1 className="mx-auto max-w-4xl text-[clamp(2.2rem,5.5vw,4.5rem)] font-semibold leading-[1.05] tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
            Procure smarter. <span className="text-gradient-holo">Ship faster.</span><br />Pay later.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-[16px] leading-relaxed text-white/45">
            HotelsVendors connects Egyptian hotels with verified suppliers, logistics partners, and embedded
            financing — all in one platform. From PO to ETA-compliant invoice, fully automated.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="btn-accent !px-8 !py-3 !text-[15px]">Start Free<ArrowRight className="h-4 w-4" /></Link>
            <Link href="/marketplace" className="btn-ghost !px-8 !py-3 !text-[15px]">Browse Marketplace</Link>
          </div>
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[var(--accent-base)]/35 bg-[#18130fd9] p-3 text-left shadow-[0_14px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between border-b border-white/[0.08] pb-2">
              <span className="text-[11px] uppercase tracking-[0.16em] text-white/45" style={{ fontFamily: "var(--font-mono)" }}>
                Ledger Pulse / Cairo Node
              </span>
              <span className="tech-chip px-2 py-0.5 text-[9px]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-base)]" />
                19ms sync
              </span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {[
                { label: "Open RFQs", value: "128", delta: "+18 today" },
                { label: "Pending Payouts", value: "EGP 2.7M", delta: "48h window" },
                { label: "ETA Clear Rate", value: "99.2%", delta: "live validation" },
              ].map((metric) => (
                <div key={metric.label} className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3">
                  <div className="text-[10px] uppercase tracking-[0.15em] text-white/40" style={{ fontFamily: "var(--font-mono)" }}>
                    {metric.label}
                  </div>
                  <div className="mt-1 text-[20px] font-semibold text-white">{metric.value}</div>
                  <div className="mt-1 text-[11px] text-[var(--accent-light)]">{metric.delta}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12px] text-white/25">
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-[var(--accent-light)]/80" />Bank-grade security</span>
            <span className="flex items-center gap-1.5"><FileCheck className="h-3.5 w-3.5 text-[var(--accent-light)]/80" />ETA e-invoicing native</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-light)]/80" />100+ suppliers onboarded</span>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              One platform. Four sides. Zero friction.
            </h2>
            <p className="mt-4 text-[15px] text-white/40 max-w-xl mx-auto">The complete procurement operating system purpose-built for Egyptian hospitality.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
            {[
              { icon: ShoppingCart, color: "#c8a36f", title: "Hotels", desc: "Browse verified supplier catalogs, build POs in seconds, track orders end-to-end." },
              { icon: Package, color: "#8fa3b1", title: "Suppliers", desc: "List inventory with fixed pricing, fulfill orders digitally, reach 100+ hotels." },
              { icon: Truck, color: "#a9b6bf", title: "Logistics", desc: "Shared-route fulfillment reduces delivery overhead by 60%. Optimized for Egyptian geography." },
              { icon: CreditCard, color: "#a28cb4", title: "Factoring", desc: "Embedded liquidity for hotel cash-flow cycles. Non-recourse factoring with risk-adjusted pricing." },
            ].map((p) => (
              <div key={p.title} className="surface-card neon-card tech-panel p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${p.color}10` }}>
                  <p.icon className="h-5 w-5" style={{ color: p.color }} />
                </div>
                <h3 className="text-[16px] font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/40">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-14 text-center text-[clamp(1.6rem,3vw,2.4rem)] font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            From search to ETA invoice — in minutes
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Search", desc: "Find products from verified local suppliers in our hospitality-tuned marketplace." },
              { step: "02", title: "Order", desc: "Build a purchase order with fixed pricing. Approval chain enforced by Authority Matrix." },
              { step: "03", title: "Fulfill", desc: "Suppliers confirm, logistics picks up. Real-time tracking from warehouse to hotel door." },
              { step: "04", title: "Invoice", desc: "ETA-compliant e-invoice auto-generated and submitted to the Egyptian Tax Authority." },
            ].map((s) => (
              <div key={s.step}>
                <div className="mb-4 text-[32px] font-bold text-[var(--accent-base)]/35" style={{ fontFamily: "var(--font-display)" }}>{s.step}</div>
                <h3 className="text-[15px] font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/40">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10 md:p-14">
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="flex-shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--purple-base)]/20">
                <BarChart3 className="h-7 w-7 text-[var(--purple-light)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[18px] font-semibold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>AI-Powered Smart Assistant</h3>
                <p className="text-[14px] leading-relaxed text-white/40 max-w-xl">
                  Role-specific intelligence on every dashboard. Hotels get supplier suggestions and spend optimization. Suppliers get demand forecasting and pricing insights.
                </p>
              </div>
              <Link href="/platform" className="btn-ghost flex-shrink-0">Learn More<ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Shield, title: "Authority Matrix", desc: "Multi-level approval chains enforce procurement governance. Dual-authorization on overrides." },
              { icon: FileCheck, title: "ETA E-Invoicing", desc: "Real-time submission to the Egyptian Tax Authority. Digital signing, UUID generation, dead-letter retry." },
              { icon: Building2, title: "Multi-Tenant Isolation", desc: "Every query is tenant-scoped. Zero cross-contamination. AES-256-GCM at rest, TLS 1.3 in transit." },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
                <c.icon className="mb-3 h-5 w-5 text-[var(--accent-light)]" />
                <h3 className="text-[14px] font-semibold text-white mb-1.5">{c.title}</h3>
                <p className="text-[12px] leading-relaxed text-white/35">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/[0.04] py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 bottom-0 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--accent-base)]/[0.1] blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Ready to modernize your procurement?</h2>
          <p className="mt-5 text-[15px] text-white/40">Join the hotels and suppliers already saving time and cost on every order.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="btn-accent !px-10 !py-3.5 !text-[15px]">Get Started Free<ArrowRight className="h-4 w-4" /></Link>
            <Link href="/contact" className="btn-ghost !px-10 !py-3.5 !text-[15px]">Talk to Sales</Link>
          </div>
        </div>
      </section>
    </>
  );
}
