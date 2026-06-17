import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Building2, Landmark, TrendingUp, Shield, Zap, Users, Receipt, Wallet, Scale, Info } from "lucide-react";
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

const tiers = [
  {
    name: "Essential",
    price: "Custom",
    period: "/property/month",
    desc: "For single-property hotels and small resorts. Subscription is tailored to your property size, room count, and procurement volume.",
    features: [
      "Full AI demand forecasting (14-day)",
      "ETA e-invoicing compliance (Phase 1 & 2)",
      "Automated PO generation & budget blockades",
      "Factoring eligibility assessment",
      "Up to 200 orders/month",
      "3 user seats",
      "Email & chat support",
    ],
    cta: "Get a Quote",
    highlighted: false,
    icon: Building2,
  },
  {
    name: "Business",
    price: "Custom",
    period: "/property/month",
    desc: "For multi-property hotel groups and chains. Pricing factors in total room count, consumption volume, and chain-wide procurement consolidation.",
    features: [
      "Unlimited orders across all properties",
      "Multi-property authority matrix",
      "Shared-route logistics integration",
      "Embedded factoring (net-60+)",
      "Real-time cost control & anomaly detection",
      "Budget blockades at branch/department level",
      "15 user seats",
      "Priority support & account manager",
    ],
    cta: "Contact Sales",
    highlighted: true,
    icon: Building2,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large hotel chains, resort groups, and management companies. Tailored to portfolio size, procurement complexity, and factoring volume.",
    features: [
      "Everything in Business, plus:",
      "Unlimited properties & user seats",
      "Custom authority matrices",
      "Dedicated account & success manager",
      "API access & ERP integrations",
      "Custom SLA with 99.99% uptime",
      "On-premise deployment option",
      "Volume-based factoring fee discounts",
    ],
    cta: "Talk to Us",
    highlighted: false,
    icon: Landmark,
  },
];

export default function PricingPage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <MarketingNav />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,176,0,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Pricing</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-white">
            No Per-Transaction Fees.<br /><span className="text-gradient-lime">Subscription-Based.<br />Factoring-Funded.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl mx-auto leading-relaxed">
            HotelsVendors charges a <strong className="text-white/60">subscription fee</strong> based on your property size, room count, consumption volume, and chain requirements — <strong className="text-white/60">not per transaction</strong>. Our platform revenue is generated through <strong className="text-white/60">factoring funding fees (HV)</strong>, fully disclosed under FRA and ETA compliance frameworks.
          </p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y" style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: "#030303" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: Shield, label: "FRA Compliant Disclosure", desc: "Fully transparent" },
              { icon: Zap, label: "No Per-Transaction Fees", desc: "Subscription only" },
              { icon: Scale, label: "ETA Compliance Ready", desc: "Funding fee disclosure" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <b.icon size={16} style={{ color: "#FFB000" }} />
                <div>
                  <p className="text-[11px] font-medium text-white/60">{b.label}</p>
                  <p className="text-[9px] text-white/25">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Pricing Works */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl p-6 max-w-3xl mx-auto" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,176,0,0.1)" }}>
            <h2 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
              <Info size={16} style={{ color: "#FFB000" }} />
              How HotelsVendors Generates Revenue
            </h2>
            <div className="space-y-4 text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              <p>
                <strong className="text-white/70">1. Subscription Fees:</strong> Hotels pay a monthly subscription based on property size, room count, consumption volume, number of hotels in the chain, order volume, and factoring eligibility. No per-transaction fees. No hidden charges.
              </p>
              <p>
                <strong className="text-white/70">2. Factoring Funding Fees (HV):</strong> The platform generates revenue through the factoring process. When a supplier opts for early payment via reverse factoring, a <strong className="text-white/70">Funding Fee (HV)</strong> is embedded in the factoring spread. This is a disclosed fee — fully compliant with FRA anti-fraud regulations and ETA e-invoicing disclosure requirements. The fee is transparently reflected in the factoring bid terms.
              </p>
              <p>
                <strong className="text-white/70">3. No Hidden Costs:</strong> There are no per-transaction commissions, no document processing fees, and no surprise charges. Your subscription covers the full platform — from AI forecasting to ETA compliance to settlement. Revenue is generated when value is created through the factoring process, not on every purchase order.
              </p>
              <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: "rgba(255,176,0,0.04)", border: "1px solid rgba(255,176,0,0.08)" }}>
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
          <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.15em] mb-6 text-center">Subscription Plans — Based on Your Profile</p>
          <div className="grid md:grid-cols-3 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl p-7 flex flex-col transition-all hover:border-[#FFB000]/10"
                style={{
                  backgroundColor: tier.highlighted ? "#0a0a0a" : "#080808",
                  border: tier.highlighted ? "1px solid rgba(255,176,0,0.2)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {tier.highlighted && (
                  <span className="text-[10px] font-medium text-[#FFB000] uppercase tracking-wider mb-3">Most Popular</span>
                )}
                <tier.icon size={20} className="mb-3" style={{ color: tier.highlighted ? "#FFB000" : "rgba(255,255,255,0.3)" }} />
                <h3 className="text-[18px] font-medium text-white mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-[32px] font-medium text-white">{tier.price}</span>
                  {tier.period && <span className="text-[12px] text-white/30">{tier.period}</span>}
                </div>
                <p className="text-[12px] text-white/35 mb-4">{tier.desc}</p>
                <div className="mb-1">
                  <p className="text-[9px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>
                    Pricing Factors
                  </p>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#FFB000" }} />
                      <span className="text-[11px] text-white/50">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-medium transition-all"
                  style={tier.highlighted
                    ? { backgroundColor: "#FFB000", color: "#000000" }
                    : { border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }
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
      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-6">Frequently Asked</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            {[
              { q: "How is my subscription calculated?", a: "Your subscription is based on your property profile: number of rooms, average consumption volume, number of hotels in your chain, monthly order volume, and factoring eligibility. We tailor each plan to your specific needs — no one-size-fits-all." },
              { q: "Are there any per-transaction fees?", a: "No. HotelsVendors does not charge per-transaction fees. Your subscription covers the full platform. Revenue is generated through disclosed factoring funding fees (HV) embedded in the factoring spread — fully transparent and FRA/ETA compliant." },
              { q: "But doesn't the pricing page say free starter plan?", a: "We've updated our model. The Essential plan is a custom subscription based on your property size — not free. Contact us for a quote tailored to your portfolio." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl p-5" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
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
          <h2 className="text-[24px] font-medium mb-4 text-white">Get Your Custom Quote</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">Tell us about your property portfolio. We'll build a subscription plan that fits your size, volume, and factoring needs.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(255,176,0,0.2)]" style={{ backgroundColor: "#FFB000", color: "#0B0F1A" }}>
            Get a Quote <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
