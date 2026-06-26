import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, CheckCircle2, TrendingUp, ShieldCheck, Clock, Banknote, BrainCircuit, FileCheck, Users } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingPage } from "@/components/layout/marketing-page";
import { ProblemSolutionSplit } from "@/components/marketing/problem-solution-split";

export const metadata: Metadata = {
  title: "Hotel Procurement Platform Egypt | AI Demand Forecasting for Resorts | HotelsVendors",
  description: "AI-automated procurement OS for Egyptian hotels. 14-day demand forecasting, budget blockades, ETA e-invoicing compliance, and net-60 factoring. Built for Sharm El-Sheikh and Hurghada resorts.",
  keywords: ["B2B hospitality procurement Egypt", "automated factoring lines Cairo", "hotel supply chain management Egypt", "ETA e-invoicing compliance", "hospitality vendor marketplace", "digital invoice Egypt", "coastal hotel suppliers Red Sea", "تجهيزات الفنادق بالجملة", "منصة المشتريات الفندقية مصر", "الفوترة الإلكترونية هيئة الضرائب"],
  openGraph: {
    title: "Hotel Procurement Platform Egypt | AI Demand Forecasting for Resorts | HotelsVendors",
    description: "AI-automated procurement OS for Egyptian hotels. 14-day demand forecasting, budget blockades, ETA compliance, and net-60 factoring.",
    type: "website",
  },
};

const features = [
  { icon: BrainCircuit, title: "AI Demand Forecasting", desc: "14-day forward predictions from occupancy curves, events, and seasonality. Auto-generates POs against your budget ceilings — no more emergency orders at premium prices." },
  { icon: ShieldCheck, title: "Budget Blockades", desc: "Pre-occurrence spending limits at property, branch, and department level. No PO without available budget. Finance stays in control without slowing operations." },
  { icon: Building2, title: "Multi-Property Control", desc: "Manage procurement across your entire portfolio from one dashboard. Per-property catalogs, approval hierarchies, and consolidated reporting." },
  { icon: Banknote, title: "Net-60+ Embedded Factoring", desc: "Stretch working capital without balance-sheet debt. Suppliers paid in 24 hours via competitive bidding among 4+ licensed grantors." },
  { icon: Clock, title: "48-Hour Coastal Delivery", desc: "Shared-route logistics to Sharm, Hurghada, and 4 additional governorates. Cold-chain capable. Real-time GPS tracking from dock to receiving." },
  { icon: TrendingUp, title: "Cost Analytics & Anomaly Detection", desc: "Real-time spend analysis across properties, departments, and vendors. AI flags pricing deviations and recommends savings before they compound." },
];

const trustBadges = [
  { icon: FileCheck, label: "ETA Phase 1 & 2", desc: "Cryptographic e-invoicing" },
  { icon: ShieldCheck, label: "FRA Aligned", desc: "Anti-fraud compliance" },
  { icon: CheckCircle2, label: "SOC 2 Roadmap", desc: "Enterprise-grade security" },
];

export default function HotelsPage() {
  return (
    <>
      <MarketingNav />
      <MarketingPage>
        {/* Hero */}
        <section className="pt-28 pb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--accent-muted) 0%, transparent 70%)" }} />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-[0.15em] mb-3 block">For Hotels</span>
            <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-foreground">
              Stop Chasing Suppliers.<br /><span className="text-gradient-accent">Start Commanding<br />Your Supply Chain.</span>
            </h1>
            <p className="text-[15px] text-foreground-secondary max-w-2xl leading-relaxed mb-8">
              From Sharm El-Sheikh to Alexandria, Egyptian hotel groups use HotelsVendors to automate procurement, enforce budgets, and stretch working capital — all from one platform built for coastal hospitality.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register?sector=procurement" className="cta-glow inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all" style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text)" }}>
                Register Your Property <ArrowRight size={14} className="cta-arrow" />
              </Link>
              <Link href="/platform" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-surface-hover" style={{ border: "1px solid var(--border-visible)", color: "var(--text-secondary)" }}>
                Explore Platform
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-8 border-y" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--background)" }}>
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap justify-center gap-8">
              {trustBadges.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <b.icon size={16} style={{ color: "var(--accent-base)" }} />
                  <div>
                    <p className="text-[11px] font-medium text-foreground-secondary">{b.label}</p>
                    <p className="text-[9px] text-foreground-muted">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem / Solution */}
        <ProblemSolutionSplit />

        {/* Features Grid */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-[11px] font-medium text-foreground-muted uppercase tracking-[0.15em] mb-8">What You Get</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <div key={f.title} className="surface-card rounded-xl p-6 transition-all">
                  <f.icon size={20} className="mb-4" style={{ color: "var(--accent-base)" }} />
                  <h3 className="text-[14px] font-medium text-foreground mb-2">{f.title}</h3>
                  <p className="text-[12px] text-foreground-secondary leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16" style={{ backgroundColor: "var(--bg-surface-1)" }}>
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto text-center">
              {[
                { value: "24h", label: "Supplier Settlement via Factoring" },
                { value: "6", label: "Governorates with Logistics Coverage" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[32px] font-medium mb-1" style={{ color: "var(--accent-base)" }}>{s.value}</p>
                  <p className="text-[11px] text-foreground-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-[11px] font-medium text-foreground-muted uppercase tracking-[0.15em] mb-6">Where We Operate</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { region: "Sharm El-Sheikh", props: "120+ properties", icon: MapPin },
                { region: "Hurghada / Red Sea", props: "95+ properties", icon: MapPin },
                { region: "Cairo / Giza", props: "200+ properties", icon: MapPin },
                { region: "Alexandria / North Coast", props: "65+ properties", icon: MapPin },
              ].map((r) => (
                <div key={r.region} className="surface-card rounded-xl p-5 flex items-center gap-3 transition-all">
                  <r.icon size={16} style={{ color: "var(--accent-base)" }} />
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{r.region}</p>
                    <p className="text-[11px] text-foreground-muted">{r.props}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <Users size={28} className="mx-auto mb-6" style={{ color: "var(--accent-base)" }} />
            <h2 className="text-[24px] font-medium mb-4 text-foreground">Ready to Transform Your Procurement?</h2>
            <p className="text-[13px] text-foreground-secondary mb-8 max-w-lg mx-auto">Quick onboarding. No credit card required. Start with a demo property.</p>
            <Link href="/register?sector=procurement" className="cta-glow inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all" style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text)" }}>
              Get Started Free <ArrowRight size={14} className="cta-arrow" />
            </Link>
          </div>
        </section>
      </MarketingPage>
      <MarketingFooter />
    </>
  );
}
