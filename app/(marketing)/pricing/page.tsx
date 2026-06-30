import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Building2, Landmark, Shield, Zap, Scale, Banknote, TrendingUp, Users } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = {
  title: "Pricing | HotelsVendors Egypt",
  description: "Transparent pricing for Egyptian hospitality procurement. Hotels & suppliers: free trial. Funders & logistics: per-transaction fees. FRA/ETA compliant disclosure.",
  keywords: ["B2B hospitality procurement Egypt", "hotel procurement pricing Egypt", "factoring funding fees", "SaaS subscription hospitality", "تسعير المشتريات الفندقية مصر"],
  openGraph: {
    title: "Pricing | HotelsVendors Egypt",
    description: "Transparent pricing for Egyptian hospitality. Hotels & suppliers free trial. Funders & logistics: per-transaction fees.",
    type: "website",
  },
};

const accent = "var(--accent-base)";
const accentMuted = "var(--accent-muted)";
const accentBorder = "var(--border-accent)";
const surface = "var(--bg-surface-1)";
const borderSubtle = "var(--border-subtle)";

const tiers = [
  {
    name: "Hotels",
    price: "Free Trial",
    period: "limited period",
    desc: "For hotels and resorts of all sizes. Free during trial — we'll decide pricing together based on volume.",
    features: [
      "Full platform access during trial",
      "AI demand forecasting",
      "ETA e-invoicing compliance",
      "Automated PO generation",
      "Multi-property management",
      "Real-time spend analytics",
      "No payment required to start",
    ],
    metrics: [
      { label: "Monthly Orders", value: "Unlimited (trial)" },
      { label: "Platform Fee", value: "Free (trial)" },
      { label: "Per-Transaction Fee", value: "None" },
    ],
    cta: "Start Free Trial",
    highlighted: false,
    icon: Building2,
  },
  {
    name: "Suppliers",
    price: "Free Trial",
    period: "limited period",
    desc: "For suppliers and vendors of all categories. Free during trial to build your catalog and onboard.",
    features: [
      "Full catalog management",
      "Receive POs from 680+ hotels",
      "Issue ETA-compliant invoices",
      "48-hour factoring payout option",
      "Real-time order notifications",
      "Analytics dashboard",
      "No payment required to start",
    ],
    metrics: [
      { label: "Monthly Orders", value: "Unlimited (trial)" },
      { label: "Platform Fee", value: "Free (trial)" },
      { label: "Per-Transaction Fee", value: "None" },
    ],
    cta: "Start Free Trial",
    highlighted: true,
    icon: Shield,
  },
  {
    name: "Funders",
    price: "Transaction-Based",
    period: "per invoice funded",
    desc: "For factoring companies, banks, and financial institutions funding supplier invoices.",
    features: [
      "Access pre-verified invoice pool",
      "Competitive bidding dashboard",
      "FRA anti-fraud compliance",
      "Bank-direct settlement",
      "Risk scoring engine",
      "Real-time portfolio analytics",
      "Per-transaction fee applies",
    ],
    metrics: [
      { label: "Transaction Fee (HV)", value: "0.8%–1.8%" },
      { label: "Minimum Invoice", value: "EGP 5,000" },
      { label: "Settlement", value: "Bank-direct" },
    ],
    cta: "Contact Sales",
    highlighted: false,
    icon: Landmark,
  },
  {
    name: "Logistics",
    price: "Transaction-Based",
    period: "per delivery settled",
    desc: "For logistics providers handling hotel supply deliveries and shared-route optimization.",
    features: [
      "Shared-route optimization",
      "GPS tracking integration",
      "Auto-settlement on POD",
      "Coastal hub model access",
      "Delivery confirmation system",
      "On-time payment guarantee",
      "Per-transaction fee applies",
    ],
    metrics: [
      { label: "Transaction Fee (HV)", value: "2.5%–4.0%" },
      { label: "Min. Load Value", value: "EGP 2,000" },
      { label: "Settlement", value: "Auto (POD)" },
    ],
    cta: "Contact Sales",
    highlighted: false,
    icon: TrendingUp,
  },
];

export default function PricingPage() {
  return (
    <main style={{ backgroundColor: "var(--background)", color: "var(--text-primary)", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
      <MarketingNav />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px] pointer-events-none" style={{ background: `radial-gradient(circle, ${accentMuted} 0%, transparent 70%)` }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-[0.15em] mb-3 block">Simple, Transparent Pricing</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-semibold leading-[1.05] tracking-tight mb-5 text-foreground" style={{ fontFamily: "var(--font-sans)" }}>
            Free Trial for Hotels & Suppliers.<br />Transaction-Based for Funders & Logistics.
          </h1>
          <p className="text-[15px] text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
            Hotels and suppliers start free during our trial period — no payment required. 
            Funders (factoring companies) and logistics providers pay per-transaction fees. 
            We'll decide long-term pricing together based on volume and usage.
          </p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y" style={{ borderColor: borderSubtle, backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-8">
              {[
                { icon: Shield, label: "FRA Compliant", desc: "Fully transparent" },
                { icon: Zap, label: "Hotels & Suppliers: Free Trial", desc: "No payment needed" },
                { icon: Scale, label: "Funders & Logistics: Per-Txn", desc: "Only when you transact" },
              ].map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <b.icon size={16} style={{ color: accent }} />
                <div>
                  <p className="text-[11px] font-medium text-foreground-secondary">{b.label}</p>
                  <p className="text-[9px] text-foreground-muted">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Pricing Works — Revenue Model */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl p-6 max-w-3xl mx-auto" style={{ backgroundColor: surface, border: `1px solid ${accentBorder}` }}>
            <h2 className="text-[14px] font-semibold text-foreground mb-4 flex items-center gap-2">
              <Banknote size={16} style={{ color: accent }} />
              How Pricing Works
            </h2>
            <div className="space-y-4 text-[12px] leading-relaxed text-foreground-secondary">
              <p>
                <strong className="text-foreground">🏨 Hotels — Free Trial:</strong> Full platform access during trial. No subscription fees, no per-transaction fees. We'll evaluate usage patterns together to determine a fair model once the trial ends.
              </p>
              <p>
                <strong className="text-foreground">📦 Suppliers — Free Trial:</strong> Onboard your catalog, receive POs, issue ETA invoices, and get paid — all free during trial. We'll decide on a fair structure after we see traction.
              </p>
              <p>
                <strong className="text-foreground">🏦 Funders — Per-Transaction Fee:</strong> A fee of <strong className="text-foreground">0.8%–1.8%</strong> per invoice funded. This covers risk assessment, platform processing, and settlement. Fully FRA/ETA compliant.
              </p>
              <p>
                <strong className="text-foreground">🚚 Logistics — Per-Transaction Fee:</strong> A fee of <strong className="text-foreground">2.5%–4.0%</strong> per delivery settled. Covers route optimization, tracking, and auto-settlement processing.
              </p>
              <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: accentMuted, border: `1px solid ${accentBorder}` }}>
                <p className="text-[11px] text-foreground-muted">
                  <strong className="text-foreground-secondary">Regulatory Note:</strong> All fees are fully disclosed under FRA Anti-Fraud Compliance (three-way matching: PO + ETA UUID + Signed Digital GRN) and ETA e-invoicing regulations. No hidden charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-[10px] font-medium text-foreground-muted uppercase tracking-[0.15em] mb-6 text-center">Pricing by Role — Choose Your Path</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl p-7 flex flex-col transition-all"
                style={{
                  backgroundColor: tier.highlighted ? surface : "var(--bg-surface-1)",
                  border: tier.highlighted ? `1px solid ${accentBorder}` : `1px solid ${borderSubtle}`,
                }}
              >
                {tier.highlighted && (
                  <span className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: accent }}>Most Popular</span>
                )}
                <tier.icon size={20} className="mb-3" style={{ color: tier.highlighted ? accent : "var(--text-muted)" }} />
                <h3 className="text-[18px] font-medium text-foreground mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-[32px] font-semibold text-foreground">{tier.price}</span>
                  {tier.period && <span className="text-[12px] text-foreground-muted">{tier.period}</span>}
                </div>
                <p className="text-[12px] text-foreground-secondary mb-4">{tier.desc}</p>

                {/* Hardcoded Metrics */}
                <div className="mb-4 p-3 rounded-lg space-y-2" style={{ backgroundColor: "var(--bg-surface-2)", border: `1px solid ${borderSubtle}` }}>
                  {tier.metrics.map((m) => (
                    <div key={m.label} className="flex items-center justify-between">
                      <span className="text-[10px] text-foreground-muted">{m.label}</span>
                      <span className="text-[11px] font-semibold text-foreground-secondary">{m.value}</span>
                    </div>
                  ))}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: accent }} />
                      <span className="text-[11px] text-foreground-secondary">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.name === "Business" ? "/contact" : tier.name === "Enterprise" ? "/register?sector=enterprise" : "/register"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-medium transition-all"
                  style={tier.highlighted
                    ? { backgroundColor: accent, color: "var(--accent-text)" }
                    : { border: `1px solid ${borderSubtle}`, color: "var(--text-secondary)" }
                  }
                >
                  {tier.cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16" style={{ backgroundColor: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[11px] font-medium text-foreground-muted uppercase tracking-[0.15em] mb-6">Frequently Asked</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            {[
              { q: "How long is the free trial for hotels and suppliers?", a: "The trial period is designed to give you full access to evaluate the platform. We'll work with you to determine a fair long-term pricing model based on your usage and volume once we have enough data." },
              { q: "What are the per-transaction fees for funders?", a: "Funders pay 0.8%–1.8% per invoice funded, depending on volume and risk profile. This covers risk scoring, platform processing, and bank-direct settlement." },
              { q: "What are the per-transaction fees for logistics providers?", a: "Logistics providers pay 2.5%–4.0% per delivery settled. This includes route optimization, GPS tracking, and auto-settlement on proof of delivery." },
              { q: "Why free trial instead of fixed pricing?", a: "We want to understand real usage patterns before committing to a pricing structure. This ensures fairness for all parties and lets us build a model that aligns with actual value delivered." },
            ].map((faq) => (
              <div key={faq.q} className="surface-card rounded-xl p-5">
                <h3 className="text-[13px] font-medium text-foreground mb-2">{faq.q}</h3>
                <p className="text-[12px] text-foreground-secondary leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[24px] font-semibold mb-4 text-foreground" style={{ fontFamily: "var(--font-sans)" }}>Ready to Get Started?</h2>
          <p className="text-[13px] text-foreground-secondary mb-8 max-w-lg mx-auto">Tell us about your business. Hotels & suppliers start free. Funders & logistics — let's talk about your volume.</p>
          <Link href="/register" className="cta-glow inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all" style={{ backgroundColor: accent, color: "var(--accent-text)" }}>
            Start Free Trial <ArrowRight size={14} className="cta-arrow" />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
