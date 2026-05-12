"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, TrendingDown, TrendingUp, AlertTriangle, Zap } from "lucide-react";

export type StakeholderRole = "HOTEL" | "SUPPLIER" | "FACTORING" | "LOGISTICS";

interface RoleContent {
  headline: string;
  subheadline: string;
  pains: string[];
  benefits: { title: string; description: string }[];
  stat: { value: string; label: string };
}

const ROLE_CONTENT: Record<StakeholderRole, RoleContent> = {
  HOTEL: {
    headline: "Stop Overpaying. Start Controlling.",
    subheadline:
      "The average Egyptian hotel group loses 20–30% on procurement due to fragmented processes. We fix that.",
    pains: [
      "Purchasing scattered across WhatsApp, Excel, and phone calls — zero audit trail",
      "Paying inflated prices because every property negotiates alone",
      "Late deliveries disrupting housekeeping, F&B, and maintenance schedules",
      "Cash frozen in storage instead of working capital",
      "ETA e-invoicing compliance eating hours of manual reconciliation every month",
    ],
    benefits: [
      {
        title: "30% Average Cost Savings",
        description:
          "Consolidated purchasing power + AI price benchmarking across 1,200+ suppliers means you pay less for the same quality.",
      },
      {
        title: "48-Hour Delivery Guarantee",
        description:
          "Nationwide shared-route logistics. From Cairo to Sharm El-Sheikh, your order arrives on time or we make it right.",
      },
      {
        title: "Tamper-Proof Approval Hierarchies",
        description:
          "Every purchase order flows through your authority matrix by design. No backdoor approvals. Full audit trail, always.",
      },
      {
        title: "Real-Time Spend Analytics",
        description:
          "See exactly what every property is spending, category by category, supplier by supplier — in real time.",
      },
      {
        title: "Native ETA E-Invoicing",
        description:
          "Every invoice is born compliant. Automated generation, digital signing, and direct submission to the Egyptian Tax Authority.",
      },
      {
        title: "AI-Powered Demand Forecasting",
        description:
          "Our AI analyzes historical consumption patterns and predicts what you will need before you run out. Never over-order. Never stock out.",
      },
    ],
    stat: { value: "30%", label: "Average savings for hotel groups on the platform" },
  },

  SUPPLIER: {
    headline: "Get Paid. Grow Fast. Stop Chasing.",
    subheadline:
      "Egyptian hospitality suppliers spend 40% of their time on collections. We flip that — so you focus on production, not paperwork.",
    pains: [
      "Hotel buyers paying net-60, net-90, sometimes never — killing your cash flow",
      "Spending more time chasing payments than making products",
      "Delivery costs eating 15–20% of margins with no route optimization",
      "Invisible to procurement managers who do not know you exist",
      "Bidding wars forcing you to slash prices until there is no profit left",
    ],
    benefits: [
      {
        title: "Guaranteed Payments via Factoring",
        description:
          "Submit your invoice. Get paid within days — not months. Non-recourse factoring means zero default risk to you.",
      },
      {
        title: "Direct Access to 450+ Hotel Buyers",
        description:
          "Your catalog is visible to verified procurement managers at Hilton, Marriott, Pickalbatros, and hundreds more.",
      },
      {
        title: "Shared-Route Logistics",
        description:
          "Deliver to multiple hotels on one optimized route. Cut fuel costs, reduce empty miles, and increase delivery capacity.",
      },
      {
        title: "Fixed Pricing — No Bidding Wars",
        description:
          "List your price. Hotels buy at that price. No reverse auctions. No race to the bottom. Your margin is protected.",
      },
      {
        title: "AI Demand Forecasting",
        description:
          "Know what hotels will need before they order. Plan production, optimize inventory, and never miss a high-volume opportunity.",
      },
      {
        title: "ETA Invoicing on Autopilot",
        description:
          "E-invoices are generated, signed, and submitted automatically. Compliance is handled. You just deliver.",
      },
    ],
    stat: { value: "EGP 0", label: "Cost to list. You only pay when you earn." },
  },

  FACTORING: {
    headline: "Curated Receivables. Verified Risk. Real Returns.",
    subheadline:
      "Stop hunting for hospitality invoices. We deliver a pipeline of pre-verified, ETA-compliant receivables from Egypt's top hotel groups.",
    pains: [
      "Sourcing quality hospitality receivables is manual, slow, and relationship-dependent",
      "Assessing hotel credit risk requires deep sector knowledge you do not have time to build",
      "Verifying invoice authenticity and delivery confirmation is labor-intensive and error-prone",
      "Deal flow scattered across brokers, emails, and spreadsheets — impossible to scale",
      "Regulatory friction (ETA, CBE) adds cost and delay to every transaction",
    ],
    benefits: [
      {
        title: "Pre-Verified Invoice Pipeline",
        description:
          "Every invoice on our platform is matched to a confirmed purchase order, verified delivery, and a live hotel account in good standing.",
      },
      {
        title: "AI Credit Risk Scoring",
        description:
          "Our model is trained on hospitality-specific data — seasonal cash flows, occupancy rates, and payment histories. You see risk before you price it.",
      },
      {
        title: "ETA-Integrated Validation",
        description:
          "Invoices are already digitally signed and ETA-registered. No manual verification. No compliance gaps. Just assess and fund.",
      },
      {
        title: "Real-Time Portfolio Analytics",
        description:
          "Monitor exposure, concentration risk, yield curves, and default predictions across your entire portfolio in one dashboard.",
      },
      {
        title: "Direct ERP Integration",
        description:
          "Connect to hotel financial systems for instant payment status updates. Know when a hotel pays — the moment it happens.",
      },
      {
        title: "Flexible Structures",
        description:
          "Non-recourse for risk-averse capital. Recourse for yield seekers. Configure terms, discount rates, and limits per client.",
      },
    ],
    stat: { value: "450+", label: "Verified hotel properties generating invoice flow" },
  },

  LOGISTICS: {
    headline: "Fill Empty Miles. Optimize Routes. Scale Seasonally.",
    subheadline:
      "The average delivery truck in Egypt runs 35% empty. Our shared-route network turns that dead capacity into recurring revenue.",
    pains: [
      "Empty return trips wasting fuel, driver hours, and vehicle depreciation",
      "Fragmented hotel delivery schedules — one drop here, another 50km away",
      "Fuel costs rising with no route optimization or load consolidation",
      "Seasonal demand spikes (Ramadan, coastal summer) are unpredictable and hard to staff",
      "No visibility into what other carriers are delivering nearby — missing consolidation opportunities",
    ],
    benefits: [
      {
        title: "AI-Optimized Shared Routes",
        description:
          "Our algorithm clusters deliveries by geography and time window. You deliver to 5 hotels on one loop instead of 5 separate trips.",
      },
      {
        title: "Predictable Recurring Routes",
        description:
          "Hotels order on predictable cycles. We turn those patterns into fixed weekly routes you can plan around.",
      },
      {
        title: "450+ Delivery Points Nationwide",
        description:
          "From Cairo towers to Red Sea resorts. One platform connects you to Egypt's entire hospitality corridor.",
      },
      {
        title: "Real-Time Load Matching",
        description:
          "Got empty space on your return leg? Our system matches you with backhaul loads instantly. Dead miles become paid miles.",
      },
      {
        title: "Coastal Cluster Optimization",
        description:
          "Summer season floods the coast with orders. We pre-cluster deliveries by resort zone so you maximize load factor during peak.",
      },
      {
        title: "Integrated Tracking & POD",
        description:
          "Digital proof-of-delivery, GPS tracking, and automated ETA updates. Hotels see where their order is. You see your performance metrics.",
      },
    ],
    stat: { value: "35%", label: "Average dead-mileage reduction for partner carriers" },
  },
};

interface RoleBenefitsProps {
  role: StakeholderRole;
  variant?: "compact" | "full";
  theme?: "dark" | "light";
}

export function RoleBenefits({ role, variant = "full", theme = "dark" }: RoleBenefitsProps) {
  const content = ROLE_CONTENT[role];
  const isDark = theme === "dark";

  const bgCard = isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-gray-100";
  const bgPill = isDark ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-50 text-red-600 border-red-100";
  const bgBenefit = isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-gray-50 border-gray-100";
  const textHeadline = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-white/40" : "text-gray-500";
  const textBody = isDark ? "text-white/50" : "text-gray-500";
  const textMuted = isDark ? "text-white/30" : "text-gray-400";
  const textBenefitTitle = isDark ? "text-white/90" : "text-gray-900";
  const textBenefitDesc = isDark ? "text-white/40" : "text-gray-500";
  const iconPain = isDark ? "text-red-400" : "text-red-500";
  const iconBenefit = isDark ? "text-emerald-400" : "text-emerald-600";
  const statBg = isDark ? "bg-[#8B0000]/10 border-[#8B0000]/20" : "bg-[#8B0000]/5 border-[#8B0000]/10";
  const statText = isDark ? "text-[#8B0000]" : "text-[#8B0000]";

  if (variant === "compact") {
    return (
      <div className={`rounded-xl border p-5 ${bgCard}`}>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${statText}`}>
          Why join as {role === "HOTEL" ? "a Hotel" : role === "SUPPLIER" ? "a Supplier" : role === "FACTORING" ? "a Factoring Partner" : "a Logistics Provider"}?
        </p>
        <div className="space-y-2.5">
          {content.benefits.slice(0, 3).map((b) => (
            <div key={b.title} className="flex items-start gap-2.5">
              <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${iconBenefit}`} />
              <div>
                <p className={`text-[13px] font-medium ${textBenefitTitle}`}>{b.title}</p>
                <p className={`text-[11px] leading-relaxed ${textBenefitDesc}`}>{b.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-semibold ${statBg} ${statText}`}>
          <Zap className="w-3 h-3" />
          {content.stat.value} {content.stat.label}
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={role}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="space-y-5"
      >
        {/* Headline */}
        <div>
          <h3 className={`text-[20px] md:text-[24px] font-bold leading-snug ${textHeadline}`}>
            {content.headline}
          </h3>
          <p className={`mt-2 text-[13px] leading-relaxed ${textSub}`}>
            {content.subheadline}
          </p>
        </div>

        {/* Pains */}
        <div className={`rounded-xl border p-5 ${bgCard}`}>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-semibold uppercase tracking-wider mb-4 ${bgPill}`}>
            <AlertTriangle className="w-3 h-3" />
            Pains We Solve
          </div>
          <ul className="space-y-3">
            {content.pains.map((pain, i) => (
              <li key={i} className="flex items-start gap-3">
                <X className={`w-4 h-4 mt-0.5 shrink-0 ${iconPain}`} />
                <span className={`text-[13px] leading-relaxed ${textBody}`}>{pain}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
            <TrendingUp className="w-3 h-3" />
            What You Gain
          </div>
          {content.benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 rounded-lg border p-3.5 ${bgBenefit}`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${isDark ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                <Check className={`w-3.5 h-3.5 ${iconBenefit}`} />
              </div>
              <div>
                <p className={`text-[13px] font-semibold ${textBenefitTitle}`}>{benefit.title}</p>
                <p className={`text-[12px] leading-relaxed mt-0.5 ${textBenefitDesc}`}>{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stat badge */}
        <div className={`flex items-center gap-3 rounded-xl border p-4 ${statBg}`}>
          <div className={`text-[28px] font-bold tracking-tight ${statText}`}>{content.stat.value}</div>
          <div className={`text-[12px] leading-snug ${isDark ? "text-white/50" : "text-gray-500"}`}>{content.stat.label}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
