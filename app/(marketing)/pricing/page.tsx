import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Building2, Landmark, Shield, Zap, Scale, Banknote, TrendingUp, Users } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = {
  title: "Enterprise Hospitality Procurement Pricing | HotelsVendors Egypt",
  description: "Transparent subscription pricing for Egyptian hospitality procurement. No per-transaction fees. Revenue embedded in factoring funding fees (FRA/ETA compliant disclosure).",
  keywords: ["B2B hospitality procurement Egypt", "hotel procurement pricing Egypt", "factoring funding fees", "SaaS subscription hospitality", "تسعير المشتريات الفندقية مصر"],
  openGraph: {
    title: "Enterprise Hospitality Procurement Pricing | HotelsVendors Egypt",
    description: "Transparent subscription pricing for Egyptian hospitality. No per-transaction fees. Factoring-embedded funding fees.",
    type: "website",
  },
};

const accent = "var(--accent-base)";
const accentMuted = "rgba(163,230,53,0.08)";
const accentBorder = "rgba(163,230,53,0.20)";
const surface = "#111520";
const borderSubtle = "rgba(255,255,255,0.06)";

const tiers = [
  {
    name: "Essential",
    price: "2,500",
    period: "EGP /property /month",
    desc: "For single-property hotels and small resorts (100-200 rooms).",
    features: [
      "AI demand forecasting (14-day window)",
      "ETA e-invoicing compliance (unlimited)",
      "Automated PO generation & budget blockades",
      "Factoring eligibility assessment",
      "Up to 200 orders/month (hard cap)",
      "3 user seats (no expansion)",
      "Email & chat support (48h SLA)",
    ],
    metrics: [
      { label: "Monthly Orders", value: "200 max" },
      { label: "Factoring Fee (HV)", value: "1.8%" },
      { label: "Platform Volume Cap", value: "800K EGP" },
    ],
    cta: "Get Started",
    highlighted: false,
    icon: Building2,
  },
  {
    name: "Business",
    price: "5,900",
    period: "EGP /property /month",
    desc: "For multi-property hotel groups and chains (200-500 rooms).",
    features: [
      "Unlimited orders across all properties",
      "Multi-property authority matrix",
      "Shared-route logistics integration",
      "Embedded factoring (Net-60 terms)",
      "Real-time cost control & anomaly detection",
      "Budget blockades at branch/department level",
      "15 user seats (expandable to 50)",
      "Priority support & account manager (4h SLA)",
    ],
    metrics: [
      { label: "Monthly Orders", value: "Unlimited" },
      { label: "Factoring Fee (HV)", value: "1.2%" },
      { label: "Platform Volume Cap", value: "5M EGP" },
    ],
    cta: "Contact Sales",
    highlighted: true,
    icon: Building2,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored pricing",
    desc: "For large hotel chains, resort groups, and management companies (500+ rooms).",
    features: [
      "Everything in Business, plus:",
      "Unlimited properties & user seats",
      "Custom authority matrices (branch/department/role)",
      "Dedicated account & success manager",
      "API access & ERP integrations (SAP, Opera, Mews)",
      "Custom SLA with 99.99% uptime guarantee",
      "Volume-based factoring fee discounts (down to 0.8%)",
      "White-label portal option",
    ],
    metrics: [
      { label: "Monthly Orders", value: "Unlimited" },
      { label: "Factoring Fee (HV)", value: "0.8–1.5%" },
      { label: "Platform Volume Cap", value: "Unlimited" },
    ],
    cta: "Talk to Us",
    highlighted: false,
    icon: Landmark,
  },
];

export default function PricingPage() {
  return (
    <main style={{ backgroundColor: "#0B0F17", color: "#ffffff", minHeight: "100vh", fontFamily: "'Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
      <MarketingNav />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px] pointer-events-none" style={{ background: `radial-gradient(circle, ${accentMuted} 0%, transparent 70%)` }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Layer 2 — Financing & Monetization</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-semibold leading-[1.05] tracking-tight mb-5 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            No Per-Transaction Fees.<br />Subscription-Based.<br />Factoring-Funded.
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl mx-auto leading-relaxed">
            HotelsVendors charges a <strong className="text-white/60">monthly subscription</strong> based on your property size and room count — <strong className="text-white/60">not per transaction</strong>. Platform revenue is generated through <strong className="text-white/60">factoring funding fees (HV)</strong>, fully disclosed under FRA and ETA compliance frameworks.
          </p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y" style={{ borderColor: borderSubtle, backgroundColor: "#0D1119" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: Shield, label: "FRA Compliant Disclosure", desc: "Fully transparent" },
              { icon: Zap, label: "No Per-Transaction Fees", desc: "Subscription only" },
              { icon: Scale, label: "ETA Compliance Ready", desc: "Funding fee disclosure" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <b.icon size={16} style={{ color: accent }} />
                <div>
                  <p className="text-[11px] font-medium text-white/60">{b.label}</p>
                  <p className="text-[9px] text-white/25">{b.desc}</p>
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
            <h2 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
              <Banknote size={16} style={{ color: accent }} />
              How HotelsVendors Generates Revenue
            </h2>
            <div className="space-y-4 text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              <p>
                <strong className="text-white/70">1. Subscription Fees:</strong> Hotels pay a monthly subscription based on property size, room count, and number of properties in your chain. No per-transaction fees. No hidden charges.
              </p>
              <p>
                <strong className="text-white/70">2. Factoring Funding Fees (HV):</strong> Revenue is generated through the factoring process. When a supplier opts for early payment via reverse factoring, a <strong className="text-white/70">Funding Fee (HV)</strong> of 0.8%–1.8% is embedded in the factoring spread based on your tier. This is fully compliant with FRA anti-fraud regulations and ETA e-invoicing disclosure requirements.
              </p>
              <p>
                <strong className="text-white/70">3. No Hidden Costs:</strong> Your subscription covers the full platform — from AI forecasting to ETA compliance to settlement. Revenue is generated when value is created through the factoring process, not on every purchase order.
              </p>
              <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: accentMuted, border: `1px solid ${accentBorder}` }}>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <strong className="text-white/60">Regulatory Note:</strong> Funding Fees (HV) are disclosed in accordance with FRA Anti-Fraud Compliance (three-way matching gate: PO + ETA UUID + Signed Digital GRN) and ETA e-invoicing regulations. All fees are itemized in the factoring bid terms and settlement documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.15em] mb-6 text-center">Subscription Plans — Based on Your Property Size</p>
          <div className="grid md:grid-cols-3 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl p-7 flex flex-col transition-all"
                style={{
                  backgroundColor: tier.highlighted ? surface : "#0D1119",
                  border: tier.highlighted ? `1px solid ${accentBorder}` : `1px solid ${borderSubtle}`,
                }}
              >
                {tier.highlighted && (
                  <span className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: accent }}>Most Popular</span>
                )}
                <tier.icon size={20} className="mb-3" style={{ color: tier.highlighted ? accent : "rgba(255,255,255,0.3)" }} />
                <h3 className="text-[18px] font-medium text-white mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-[32px] font-semibold text-white">{tier.price}</span>
                  {tier.period && <span className="text-[12px] text-white/30">{tier.period}</span>}
                </div>
                <p className="text-[12px] text-white/35 mb-4">{tier.desc}</p>

                {/* Hardcoded Metrics */}
                <div className="mb-4 p-3 rounded-lg space-y-2" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${borderSubtle}` }}>
                  {tier.metrics.map((m) => (
                    <div key={m.label} className="flex items-center justify-between">
                      <span className="text-[10px] text-white/35">{m.label}</span>
                      <span className="text-[11px] font-semibold text-white/70">{m.value}</span>
                    </div>
                  ))}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: accent }} />
                      <span className="text-[11px] text-white/50">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-medium transition-all"
                  style={tier.highlighted
                    ? { backgroundColor: accent, color: "#ffffff" }
                    : { border: `1px solid ${borderSubtle}`, color: "rgba(255,255,255,0.6)" }
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
      <section className="py-16" style={{ backgroundColor: "#0D1119" }}>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-6">Frequently Asked</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            {[
              { q: "How is my subscription calculated?", a: "Based on your number of properties, total room count, and monthly order volume. Essential fits single properties (100-200 rooms), Business fits groups (200-500 rooms), Enterprise is tailored for larger portfolios." },
              { q: "What is the Factoring Funding Fee (HV)?", a: "When a supplier opts for early payment via reverse factoring, a Funding Fee (HV) is embedded in the factoring spread: Essential 1.8%, Business 1.2%, Enterprise 0.8–1.5% (volume-based). This is fully FRA/ETA compliant and disclosed in bid terms." },
              { q: "Can I switch plans later?", a: "Yes. Upgrade or downgrade at any time. When you add properties or your volume grows, we'll adjust your plan accordingly. No penalties for scaling up or down." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl p-5" style={{ backgroundColor: surface, border: `1px solid ${borderSubtle}` }}>
                <h3 className="text-[13px] font-medium text-white mb-2">{faq.q}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[24px] font-semibold mb-4 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Ready to Get Started?</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">Tell us about your property portfolio. We'll build a subscription plan that fits your size, volume, and factoring needs.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all" style={{ backgroundColor: accent, color: "#fff" }}>
            Get Your Quote <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
