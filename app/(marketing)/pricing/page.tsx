"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Star, Zap } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

const tiers = [
  {
    name: "Essential",
    desc: "Independent hotels and small chains",
    price: { monthly: 2900, semi: 2610, annual: 2320 },
    features: [
      "Up to 3 properties",
      "AI Demand Forecasting",
      "ETA E-Invoicing (50/mo)",
      "Basic Analytics Dashboard",
      "Email Support",
      "Shared-Route Logistics",
    ],
    cta: "Start Free Trial",
    color: "border-white/[0.06]",
  },
  {
    name: "Professional",
    desc: "Growing hotel chains",
    popular: true,
    price: { monthly: 7900, semi: 7110, annual: 6320 },
    features: [
      "Up to 10 properties",
      "Advanced AI Forecasting",
      "Unlimited ETA Invoicing",
      "Embedded Factoring Access",
      "Priority Support",
      "Custom Integrations",
      "Multi-user Roles",
    ],
    cta: "Start Free Trial",
    color: "border-[rgba(139,0,0,0.25)]",
    highlight: true,
  },
  {
    name: "Enterprise",
    desc: "Large hotel groups & resorts",
    custom: true,
    price: { monthly: 0, semi: 0, annual: 0 },
    features: [
      "Unlimited properties",
      "Custom AI Models",
      "Unlimited Everything",
      "Dedicated Account Manager",
      "SLA Guarantee (99.9%)",
      "On-premise Option",
      "Custom Development",
    ],
    cta: "Contact Sales",
    color: "border-white/[0.06]",
  },
];

const loyalty = [
  { name: "Silver", spend: "EGP 100K+", cashback: "1.5%", color: "text-slate-300" },
  { name: "Gold", spend: "EGP 500K+", cashback: "2.5%", color: "text-[#D4A843]" },
  { name: "Platinum", spend: "EGP 1M+", cashback: "4%", color: "text-[#C084FC]" },
];

type Period = "monthly" | "semi" | "annual";

const periodLabels: Record<Period, string> = {
  monthly: "Monthly",
  semi: "Semi-Annual",
  annual: "Annual",
};

export default function PricingPage() {
  const [period, setPeriod] = useState<Period>("monthly");

  return (
    <main className="min-h-screen bg-black">
      <MarketingNav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[rgba(212,168,67,0.03)] rounded-full blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <p className="label-upper mb-3">Pricing</p>
          <h1 className="text-[32px] md:text-[52px] font-medium text-white tracking-tight mb-4">
            Simple, Transparent
            <br />
            <span className="text-gradient-red-gold">Enterprise Pricing</span>
          </h1>
          <p className="text-[14px] text-white/40 max-w-lg mx-auto mb-8">
            Choose the plan that fits your property portfolio. All plans include
            core AI procurement features.
          </p>

          {/* Toggle */}
          <div
            className="inline-flex p-1 rounded-xl"
            style={{
              background: "var(--bg-surface-1)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {(["monthly", "semi", "annual"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-5 py-2.5 text-[12px] font-medium rounded-lg transition-all"
                style={
                  period === p
                    ? {
                        background: "var(--invo-base)",
                        color: "#000",
                        boxShadow: "0 4px 20px rgba(212,168,67,0.2)",
                      }
                    : {
                        color: "var(--text-muted)",
                        background: "transparent",
                      }
                }
              >
                {periodLabels[p]}
                {p === "annual" && (
                  <span className="ml-1.5 text-[10px] opacity-80">-20%</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {tiers.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative rounded-2xl overflow-hidden transition-all hover:-translate-y-1 ${
                  t.highlight
                    ? "ring-1 ring-[rgba(139,0,0,0.25)] scale-[1.02]"
                    : ""
                }`}
                style={{
                  background: "var(--bg-surface-1)",
                  border: t.highlight
                    ? "1px solid rgba(139,0,0,0.25)"
                    : "1px solid var(--border-subtle)",
                }}
              >
                {t.popular && (
                  <div
                    className="text-[10px] font-medium py-1.5 text-center uppercase tracking-wider flex items-center justify-center gap-1"
                    style={{
                      background: "linear-gradient(to right, #8B0000, #a50000)",
                      color: "#fff",
                    }}
                  >
                    <Star size={10} />
                    Most Popular
                  </div>
                )}
                <div className="p-7">
                  <h3 className="text-[18px] font-medium text-white mb-1">
                    {t.name}
                  </h3>
                  <p className="text-[11px] text-white/25 mb-6">{t.desc}</p>
                  <div className="mb-6">
                    {t.custom ? (
                      <div>
                        <span className="text-[28px] font-medium text-white">
                          Custom
                        </span>
                        <p className="text-[10px] text-white/25 mt-1">
                          Tailored to your portfolio
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[32px] font-medium text-white">
                          EGP {t.price[period].toLocaleString()}
                        </span>
                        <span className="text-[12px] text-white/25 ml-1">
                          /mo
                        </span>
                        {period !== "monthly" && (
                          <p className="text-[10px] text-[#22C55E] mt-1">
                            Save vs monthly &middot; Billed{" "}
                            {period === "semi"
                              ? "every 6 months"
                              : "annually"}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <ul className="space-y-3 mb-7">
                    {t.features.map((f, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-[12px] text-white/40"
                      >
                        <Check
                          size={14}
                          className="text-[#D4A843] mt-0.5 shrink-0"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={t.custom ? "/support" : "/register"}
                    className={`flex items-center justify-center py-3 rounded-xl text-[13px] font-medium transition-all ${
                      t.highlight
                        ? "bg-[#8B0000] text-white hover:bg-[#a50000] hover:shadow-[0_4px_20px_rgba(139,0,0,0.3)]"
                        : "border border-white/[0.06] text-white/40 hover:border-white/[0.12] hover:text-white"
                    }`}
                  >
                    {t.cta}{" "}
                    <ArrowRight size={13} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cashback */}
      <section className="py-20" style={{ background: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap size={16} className="text-[#D4A843]" />
            <span className="label-upper">Rewards Program</span>
          </div>
          <h2 className="text-[26px] font-medium text-white mb-4">
            Cashback Tiers
          </h2>
          <p className="text-[13px] text-white/40 mb-10 max-w-md mx-auto">
            The more you procure through HotelsVendors, the more you earn back.
            Automatic cashback on every qualified transaction.
          </p>
          <div className="grid md:grid-cols-3 gap-5 max-w-2xl mx-auto">
            {loyalty.map((tier, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="surface-card p-6"
              >
                <p
                  className={`text-[16px] font-medium mb-1 ${tier.color}`}
                >
                  {tier.name}
                </p>
                <p className="text-[11px] text-white/25 mb-4">
                  {tier.spend} annual spend
                </p>
                <p className={`text-[36px] font-medium ${tier.color}`}>
                  {tier.cashback}
                </p>
                <p className="text-[10px] text-white/25 mt-1">
                  cashback on procurement
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-[24px] font-medium text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I switch plans at any time?",
                a: "Yes. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
              },
              {
                q: "Is there a free trial?",
                a: "All paid plans include a 14-day free trial. No credit card required to start.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept bank transfers, credit cards, and enterprise invoicing for annual plans.",
              },
              {
                q: "Does pricing include ETA e-invoicing?",
                a: "Essential includes 50 ETA invoices/mo. Professional and Enterprise include unlimited ETA invoicing.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="surface-card p-5"
              >
                <h3 className="text-[13px] font-medium text-white/70 mb-2">
                  {faq.q}
                </h3>
                <p className="text-[12px] text-white/40 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
