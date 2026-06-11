import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — HotelsVendors | HotelsVendors",
  description: "Transparent pricing for Egyptian hospitality procurement. Free tier available. Enterprise plans for hotel groups.",
};

const tiers = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "For single-property hotels getting started with digital procurement.",
    features: [
      "Up to 50 orders/month",
      "Basic AI demand forecasting",
      "ETA e-invoicing compliance",
      "1 user seat",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "Custom",
    period: "per property/month",
    desc: "For growing hotel groups needing full procurement automation.",
    features: [
      "Unlimited orders",
      "Advanced AI forecasting (14-day)",
      "Budget blockades & authority matrix",
      "Multi-property management",
      "Embedded factoring (net-60)",
      "Shared-route logistics",
      "10 user seats",
      "Priority support",
    ],
    cta: "Contact Sales",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large hotel chains and resort groups with complex requirements.",
    features: [
      "Everything in Growth",
      "Unlimited properties",
      "Custom authority matrices",
      "Dedicated account manager",
      "API access & integrations",
      "Custom SLA",
      "On-premise deployment option",
      "Unlimited user seats",
    ],
    cta: "Talk to Us",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(132,204,22,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Pricing</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-white">
            Simple, Transparent<br /><span className="text-gradient-lime">Pricing.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-xl mx-auto leading-relaxed">
            Start free. Scale when you&apos;re ready. No hidden fees, no long-term contracts.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-3 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl p-7 flex flex-col"
                style={{
                  backgroundColor: tier.highlighted ? "#0a0a0a" : "#080808",
                  border: tier.highlighted ? "1px solid rgba(132,204,22,0.2)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {tier.highlighted && (
                  <span className="text-[10px] font-medium text-[#84cc16] uppercase tracking-wider mb-3">Most Popular</span>
                )}
                <h3 className="text-[18px] font-medium text-white mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-[32px] font-medium text-white">{tier.price}</span>
                  {tier.period && <span className="text-[12px] text-white/30">{tier.period}</span>}
                </div>
                <p className="text-[12px] text-white/35 mb-6">{tier.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#84cc16" }} />
                      <span className="text-[12px] text-white/50">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.highlighted ? "/register" : "/register"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-medium transition-all"
                  style={tier.highlighted
                    ? { backgroundColor: "#84cc16", color: "#000000" }
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

      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-6">Frequently Asked</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            {[
              { q: "Is the Starter plan really free?", a: "Yes. Single-property hotels can process up to 50 orders/month at no cost. No credit card required." },
              { q: "How is Growth pricing calculated?", a: "Pricing is per property per month, based on order volume and required features. Contact us for a custom quote." },
              { q: "Can I switch plans later?", a: "Yes. Upgrade or downgrade at any time. No penalties or data loss." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl p-5" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 className="text-[13px] font-medium text-white mb-2">{faq.q}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[24px] font-medium mb-4 text-white">Need a Custom Plan?</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">We work with hotel groups of all sizes. Let&apos;s build a plan that fits your portfolio.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.2)]" style={{ backgroundColor: "#84cc16", color: "#000000" }}>
            Contact Sales <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
