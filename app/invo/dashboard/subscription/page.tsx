import Link from "next/link";
import { Check, ArrowRight, Zap, CreditCard, Receipt } from "lucide-react";

const CURRENT_TIER = {
  name: "Growth",
  price: 1500,
  renewalDate: "2026-07-01",
  features: [
    "Unlimited SKUs",
    "Priority listing placement",
    "Dedicated account manager",
    "API access for catalog sync",
    "Same-day factoring settlement",
  ],
};

const TIERS = [
  {
    tier: "Starter",
    price: 500,
    period: "/month",
    desc: "For suppliers starting out on the network",
    features: [
      "List up to 50 SKUs",
      "Access to all hotels",
      "ETA-compliant invoicing",
      "48hr factoring settlement",
      "Email support",
    ],
    current: false,
  },
  {
    tier: "Growth",
    price: 1500,
    period: "/month",
    desc: "For active suppliers scaling their reach",
    features: [
      "Unlimited SKUs",
      "Priority listing placement",
      "Dedicated account manager",
      "API access for catalog sync",
      "Same-day factoring settlement",
    ],
    current: true,
  },
  {
    tier: "Professional",
    price: 3000,
    period: "/month",
    desc: "For established suppliers with high volume",
    features: [
      "Everything in Growth",
      "Custom pricing negotiations",
      "White-glove onboarding",
      "Priority factoring rates",
      "Quarterly business reviews",
    ],
    current: false,
  },
];

export default function SubscriptionPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[24px] font-medium text-foreground tracking-tight">
          Subscription
        </h1>
        <p className="mt-1 text-[14px] text-foreground-muted">
          Manage your INVO plan and billing.
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="mb-8 p-5 rounded-xl border border-orange-base/15 bg-orange-base/4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-base/15 flex items-center justify-center">
              <Zap className="w-6 h-6 text-orange-base" />
            </div>
            <div>
              <p className="text-[15px] font-medium text-foreground">
                {CURRENT_TIER.name} Plan
              </p>
              <p className="text-[13px] text-foreground-muted">
                EGP {CURRENT_TIER.price.toLocaleString()}/month · Renews{" "}
                {new Date(CURRENT_TIER.renewalDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-orange-base">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-base animate-pulse" />
            Active
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-orange-base/10">
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            {CURRENT_TIER.features.map((f) => (
              <span
                key={f}
                className="text-[12px] text-foreground-muted flex items-center gap-1.5"
              >
                <Check className="w-3 h-3 text-orange-base" />
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* All Plans */}
      <h2 className="text-[16px] font-medium text-foreground tracking-tight mb-4">
        All Plans
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {TIERS.map((plan) => (
          <div
            key={plan.tier}
            className={`p-5 rounded-xl border flex flex-col ${
              plan.current
                ? "border-orange-base/25 bg-orange-base/4"
                : "border-white/[0.06] bg-white/[0.02]"
            }`}
          >
            {plan.current && (
              <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-orange-base mb-3">
                Current Plan
              </div>
            )}
            <h3 className="text-[18px] text-foreground tracking-tight">{plan.tier}</h3>
            <div className="mt-3 mb-1">
              <span className="text-[28px] text-foreground tracking-tight">
                EGP {plan.price}
              </span>
              <span className="text-[13px] text-foreground-muted">{plan.period}</span>
            </div>
            <p className="text-[12px] text-foreground-muted mb-5">{plan.desc}</p>
            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map((feat) => (
                <li
                  key={feat}
                  className="flex items-start gap-2 text-[13px] text-foreground-secondary"
                >
                  <Check className="w-3.5 h-3.5 text-orange-base shrink-0 mt-0.5" />
                  {feat}
                </li>
              ))}
            </ul>
            {plan.current ? (
              <div className="py-2.5 text-center text-[13px] font-medium text-foreground-secondary border border-white/[0.06] rounded-lg">
                Current Plan
              </div>
            ) : (
              <button
                className={`py-2.5 text-center text-[13px] font-medium rounded-lg transition-colors ${
                  plan.tier === "Professional"
                    ? "border border-white/[0.1] text-foreground-secondary hover:bg-white/[0.04]"
                    : "bg-orange-base text-surface hover:bg-orange-light"
                }`}
              >
                {plan.tier === "Starter"
                  ? "Downgrade"
                  : plan.tier === "Professional"
                  ? "Upgrade"
                  : "Switch"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Billing History Link */}
      <Link
        href="/invo/dashboard/subscription/billing"
        className="inline-flex items-center gap-2 text-[13px] text-foreground-muted hover:text-orange-base transition-colors"
      >
        <Receipt size={15} />
        View Billing History
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}
