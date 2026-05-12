import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  X,
  Sparkles,
  Building2,
  Infinity,
  HelpCircle,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { getCmsPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsPage("pricing");
  return {
    title: cms?.metaTitle || "Pricing — Hotels Vendors | Flexible Plans for Every Stage",
    description:
      cms?.metaDescription ||
      "Choose the plan that fits your business. Starter (free), Growth (subscription), or Enterprise (custom). No hidden fees. Transparent pricing for Egyptian hospitality.",
  };
}

const TIERS = [
  {
    name: "Starter",
    price: "Free",
    sub: "Forever free",
    icon: Sparkles,
    popular: false,
    description: "Perfect for small hotels and independent suppliers exploring digital procurement.",
    cta: "Get Started Free",
    href: "/register",
    features: [
      { label: "Up to 3 users", included: true },
      { label: "Basic supplier catalog", included: true },
      { label: "Manual purchase orders", included: true },
      { label: "Email support", included: true },
      { label: "ETA e-invoicing", included: false },
      { label: "AI sourcing assistant", included: false },
      { label: "Shared-route logistics", included: false },
      { label: "Invoice factoring", included: false },
      { label: "Spend analytics", included: false },
      { label: "Dedicated account manager", included: false },
    ],
  },
  {
    name: "Growth",
    price: "EGP 2,900",
    sub: "/ month",
    icon: Building2,
    popular: true,
    description: "For growing hotel groups and suppliers ready to scale with automation.",
    cta: "Start Growing",
    href: "/register",
    features: [
      { label: "Up to 25 users", included: true },
      { label: "Full supplier catalog", included: true },
      { label: "Automated purchase orders", included: true },
      { label: "Priority support", included: true },
      { label: "ETA e-invoicing", included: true },
      { label: "AI sourcing assistant", included: true },
      { label: "Shared-route logistics", included: true },
      { label: "Invoice factoring", included: false },
      { label: "Advanced spend analytics", included: false },
      { label: "Dedicated account manager", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    sub: "Tailored to you",
    icon: Infinity,
    popular: false,
    description: "For large hotel chains, distributor networks, and multi-property groups.",
    cta: "Contact Sales",
    href: "/register",
    features: [
      { label: "Unlimited users", included: true },
      { label: "Full supplier catalog + API", included: true },
      { label: "Automated purchase orders", included: true },
      { label: "24/7 dedicated support", included: true },
      { label: "ETA e-invoicing + custom ERP", included: true },
      { label: "AI sourcing assistant", included: true },
      { label: "Shared-route logistics", included: true },
      { label: "Invoice factoring", included: true },
      { label: "Advanced spend analytics", included: true },
      { label: "Dedicated account manager", included: true },
    ],
  },
];

const FAQS = [
  {
    q: "Is there really a free plan with no time limit?",
    a: "Yes. The Starter plan is free forever for hotels and suppliers with basic needs. You only upgrade when you are ready to unlock automation, AI features, and advanced analytics.",
  },
  {
    q: "Can I switch plans at any time?",
    a: "Absolutely. You can upgrade from Starter to Growth or Enterprise at any time. Downgrades take effect at the start of your next billing cycle.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept bank transfers, credit cards, and Vodafone Cash for Egyptian businesses. Enterprise clients may request invoicing with net-30 terms.",
  },
  {
    q: "Are there any hidden transaction fees?",
    a: "No hidden fees. The platform charges a transparent transaction fee of 1.5–2.5% on completed orders, depending on volume. This is clearly displayed before checkout.",
  },
  {
    q: "Do you offer discounts for annual billing?",
    a: "Yes. Growth and Enterprise plans receive a 15% discount when billed annually. Contact our sales team for custom multi-year agreements.",
  },
  {
    q: "Is ETA e-invoicing included in all plans?",
    a: "ETA e-invoicing is included in Growth and Enterprise plans. Starter users can generate invoices but must manually submit them to the Egyptian Tax Authority.",
  },
];

export default async function PricingPage() {
  const cms = await getCmsPage("pricing");
  const faqs: Array<{ question: string; answer: string }> =
    cms?.faqs?.map((f) => ({
      question: f.question || (f as unknown as { q: string }).q || "",
      answer: f.answer || (f as unknown as { a: string }).a || "",
    })) || FAQS.map((f) => ({ question: f.q, answer: f.a }));
  return (
    <main className="min-h-screen bg-black">
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-[11px] font-semibold uppercase tracking-[0.15em] mb-6">
            <Sparkles className="w-3 h-3" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-[30px] md:text-[44px] font-bold text-white leading-[1.05] tracking-[-0.02em]">
            {cms?.heroTitle || "Plans built for every stage of growth."}
          </h1>
          <p className="mt-5 text-[16px] md:text-[18px] text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {cms?.heroDescription || "No hidden fees. No long-term contracts. Start free and scale as your procurement volume grows."}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRICING CARDS
          ═══════════════════════════════════════════ */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-6 md:p-8 transition-all ${
                  tier.popular
                    ? "bg-[#111] border-[#8B0000]/30 shadow-[0_0_40px_-12px_rgba(139,0,0,0.25)]"
                    : "bg-[#111] border-white/10 hover:border-white/15"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B0000] text-white text-[11px] font-semibold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <tier.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[18px] font-semibold text-white">
                    {tier.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-[32px] font-bold text-white tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-[13px] text-gray-500">{tier.sub}</span>
                  </div>
                  <p className="mt-3 text-[13px] text-gray-400 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <div key={f.label} className="flex items-start gap-3">
                      {f.included ? (
                        <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-[13px] ${
                          f.included ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={tier.href}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold rounded-lg transition-colors ${
                    tier.popular
                      ? "bg-[#8B0000] hover:bg-[#6B0000] text-white"
                      : "border border-white/15 text-white hover:bg-white/5"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURE COMPARISON TABLE
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.2em] mb-3">
              Compare Plans
            </p>
            <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight">
              Full Feature Comparison
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 pr-6 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="py-4 px-4 text-center text-[13px] font-semibold text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Starter
                  </th>
                  <th className="py-4 px-4 text-center text-[13px] font-semibold text-white uppercase tracking-wider min-w-[120px]">
                    Growth
                  </th>
                  <th className="py-4 px-4 text-center text-[13px] font-semibold text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {TIERS[0].features.map((feature, idx) => (
                  <tr
                    key={feature.label}
                    className={
                      idx % 2 === 0 ? "bg-white/[0.03]" : "bg-transparent"
                    }
                  >
                    <td className="py-3.5 pr-6 text-[13px] text-gray-400">
                      {feature.label}
                    </td>
                    {TIERS.map((tier) => {
                      const f = tier.features.find((x) => x.label === feature.label);
                      return (
                        <td key={tier.name} className="py-3.5 px-4 text-center">
                          {f?.included ? (
                            <Check className="w-4 h-4 text-white mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-gray-600 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ ACCORDION
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/10">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.2em] mb-3">
              FAQ
            </p>
            <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl bg-[#111] border border-white/10 open:border-white/15 transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer p-5 list-none">
                  <span className="text-[14px] font-medium text-white flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-white shrink-0" />
                    {faq.question}
                  </span>
                  <span className="text-gray-600 group-open:rotate-180 transition-transform shrink-0">
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      className="text-current"
                    >
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 pl-12">
                  <p className="text-[13px] text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#111] border border-white/10 p-10 md:p-16 text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B0000]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-[32px] md:text-[44px] font-bold text-white tracking-tight">
                {cms?.ctaTitle || "Still have questions?"}
              </h2>
              <p className="mt-4 text-[15px] text-gray-400 max-w-xl mx-auto">
                {cms?.ctaDescription || "Our team is here to help you choose the right plan and get your properties set up in under 10 minutes."}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#6B0000] text-white text-[14px] font-semibold rounded-lg transition-colors"
                >
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-gray-300 text-[14px] font-medium rounded-lg hover:bg-white/5 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
