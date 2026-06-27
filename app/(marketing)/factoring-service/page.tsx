import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Banknote, Clock, Shield, TrendingUp, Check, Landmark, FileCheck, BarChart3, Users } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingPage } from "@/components/layout/marketing-page";

export const metadata: Metadata = {
  title: "Embedded Reverse Factoring for Hotels | Bank-Direct IBAN Settlement Egypt | HotelsVendors",
  description: "Hotel-initiated reverse factoring with competitive bidding among licensed grantors. Bank-direct IBAN settlement, supplier settlement typically within 1–2 business days, non-recourse by design.",
  keywords: ["B2B hospitality procurement Egypt", "automated factoring lines Cairo", "hotel supply chain management Egypt", "ETA e-invoicing compliance", "hospitality vendor marketplace", "digital invoice Egypt", "coastal hotel suppliers Red Sea", "تجهيزات الفنادق بالجملة", "منصة المشتريات الفندقية مصر", "الفوترة الإلكترونية هيئة الضرائب"],
  openGraph: {
    title: "Embedded Reverse Factoring for Hotels | Bank-Direct IBAN Settlement Egypt | HotelsVendors",
    description: "Hotel-initiated reverse factoring with competitive bidding among licensed grantors. Bank-direct IBAN settlement, supplier settlement typically within 1–2 business days, non-recourse by design.",
    type: "website",
  },
};

const flow = [
  { step: "01", title: "Invoice Cleared", desc: "Three-way match: PO + ETA UUID + Signed Digital Delivery Note verified automatically. No manual reconciliation.", icon: Check },
  { step: "02", title: "Enter Factoring Pool", desc: "Pre-cleared invoice enters competitive bidding pool visible to all licensed grantors. Full transparency.", icon: TrendingUp },
  { step: "03", title: "Grantors Bid", desc: "Licensed grantors compete on rate. Best offer selected automatically. Market-driven pricing every time.", icon: Banknote },
  { step: "04", title: "Settlement", desc: "Supplier settlement typically within 1–2 business days via bank-direct transfer. Hotel settles at net-60. Zero recourse risk.", icon: Clock },
];

const funderFeatures = [
  { icon: FileCheck, title: "Pre-Verified Invoice Pool", desc: "Every invoice has passed three-way matching: PO + ETA UUID + Signed Digital Delivery Note. You buy cleared assets, not paper promises." },
  { icon: BarChart3, title: "Risk Scoring Engine", desc: "AI-driven risk scoring on every invoice. Hotel creditworthiness, repayment velocity, and sector concentration metrics in real-time." },
  { icon: TrendingUp, title: "Competitive Bidding", desc: "Bid on invoice pools with full visibility into competing rates. Transparent, fair, and optimized for your return targets." },
  { icon: Banknote, title: "Rapid Settlement", desc: "Bank-direct settlement to supplier IBANs, typically within 1–2 business days. Automated interest accrual and late repayment protocols. No intermediary accounts." },
  { icon: Shield, title: "Non-Recourse by Design", desc: "Once settled, the invoice is your risk — not the hotel&apos;s. Clean balance-sheet treatment for all parties." },
  { icon: Landmark, title: "Hospitality Sector Focus", desc: "Egypt&apos;s hospitality sector with hundreds of properties across coastal and urban markets." },
];

export default function FactoringServicePage() {
  return (
    <MarketingPage>
      <MarketingNav />
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="label-upper mb-3 block">Factoring</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5">
            Pre-Verified Hospitality<br />Invoices. Bank-Direct<br />Settlement. <span className="text-gradient-accent">Non-Recourse<br />by Design.</span>
          </h1>
          <p className="text-[15px] text-secondary max-w-2xl leading-relaxed mb-8">
            Access a curated pool of pre-cleared, three-way-matched invoices from Egypt&apos;s coastal hotel sector. Competitive bidding. Settlement typically within 1–2 business days. Zero paper chase. Built for licensed grantors who want corporate deal flow without SME risk.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register?sector=cashflow" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--accent-base)] text-[var(--accent-text)] text-sm font-semibold rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5">
              Register as Grantor <ArrowRight size={14} />
            </Link>
            <Link href="/platform" className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--border-visible)] text-[var(--foreground-secondary)] text-sm font-medium rounded-xl transition-all duration-200 hover:border-[var(--accent-base)] hover:text-[var(--foreground)]">
              How It Works
            </Link>
          </div>
          <p className="text-[10px] mt-5 max-w-xl" style={{ color: "var(--text-muted)", opacity: 0.8 }}>
            Restaurants for E-Marketing operates strictly as a technical data orchestrator. Zero liability for counterparty collection defaults.
          </p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: Shield, label: "Non-Recourse", desc: "Clean risk transfer" },
              { icon: Banknote, label: "Bank-Direct Settlement", desc: "No intermediary accounts" },
              { icon: FileCheck, label: "Three-Way Matched", desc: "Pre-cleared invoices" },
              { icon: Clock, label: "Rapid Settlement", desc: "Typically 1–2 business days" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <b.icon size={16} style={{ color: "var(--warning)" }} />
                <div>
                  <p className="text-[11px] font-medium text-secondary">{b.label}</p>
                  <p className="text-[9px] text-muted">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-16" style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="label-upper mb-8 text-center">The Factoring Flow</h2>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {flow.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "var(--accent-muted)" }}>
                  <item.icon size={20} style={{ color: "var(--warning)" }} />
                </div>
                <span className="label-upper">Step {item.step}</span>
                <h3 className="text-[13px] font-medium mt-1 mb-1.5">{item.title}</h3>
                <p className="text-[11px] text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funder Features */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="label-upper mb-8">Why Funders Choose HotelsVendors</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {funderFeatures.map((f) => (
              <div key={f.title} className="surface-card p-6 transition-all">
                <f.icon size={20} className="mb-3" style={{ color: "var(--warning)" }} />
                <h3 className="text-[14px] font-medium mb-2">{f.title}</h3>
                <p className="text-[12px] text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Users size={28} className="mx-auto mb-6" style={{ color: "var(--warning)" }} />
          <h2 className="text-[24px] font-medium mb-4">Access Egypt&apos;s Hospitality Invoice Market</h2>
          <p className="text-[13px] text-secondary mb-8 max-w-lg mx-auto">Licensed grantors bidding on pre-verified invoices. High-velocity corporate deal flow with cryptographic verification.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register?sector=cashflow" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--accent-base)] text-[var(--accent-text)] text-sm font-semibold rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5">
              Register as Grantor <ArrowRight size={14} />
            </Link>
            <Link href="/register?sector=procurement" className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--border-visible)] text-[var(--foreground-secondary)] text-sm font-medium rounded-xl transition-all duration-200 hover:border-[var(--accent-base)] hover:text-[var(--foreground)]">
              Register Your Hotel
            </Link>
          </div>
          <p className="text-[10px] mt-6 max-w-md mx-auto" style={{ color: "var(--text-muted)", opacity: 0.8 }}>
            Restaurants for E-Marketing operates strictly as a technical data orchestrator. Zero liability for counterparty collection defaults.
          </p>
        </div>
      </section>
      <MarketingFooter />
    </MarketingPage>
  );
}
