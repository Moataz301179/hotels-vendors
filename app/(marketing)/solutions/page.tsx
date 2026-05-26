import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Store,
  Banknote,
  ShieldCheck,
  Zap,
  Globe,
  FileCheck,
  Users,
  TrendingUp,
  Package,
  Clock,
  ArrowLeftRight,
  Landmark,
  Wallet,
  Gift,
  Scale,
  BadgeCheck,
  Receipt,
  Truck,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { getCmsPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsPage("solutions");
  return {
    title: cms?.metaTitle || "Solutions — Hotels Vendors | Built for Egyptian Hospitality",
    description:
      cms?.metaDescription ||
      "End-to-end procurement solutions for hotels, suppliers, logistics providers, and factoring companies. AI-powered sourcing, ETA compliance, and guaranteed payments.",
  };
}

/* ═══════════════════════════════════════════════════════════════
   STRIPE MARKETPLACE GAP ANALYSIS → EGYPTIAN HOSPITALITY
   ═══════════════════════════════════════════════════════════════

   Stripe Marketplace features we mapped to our platform:

   1. CONNECT (Onboarding/KYC)      →  Supplier verification + EGS codes + compliance scoring
   2. CHECKOUT (Payments)           →  Paymob B2B integration (<50k EGP lane)
   3. PAYOUTS                       →  Factoring disbursements + instant supplier cashout
   4. RADAR (Fraud)                 →  Risk engine + compliance scoring + certificate vault
   5. SPLIT PAYMENTS                →  Multi-party settlements (NEW — no Egyptian platform does this)
   6. TAX                           →  ETA e-invoicing integration (mandatory, built-in)
   7. IDENTITY                      →  KYC via I-Score, D&B, GAFI portals
   8. INSTANT PAYOUTS               →  Same-day supplier cashout after delivery
   9. PLATFORM FEES                 →  Automated SaaS fee per transaction
   10. DISPUTES                     →  Built-in hotel-supplier dispute resolution
   11. SUBSCRIPTIONS                →  Recurring procurement orders for consumables
   12. LOYALTY                      →  Hotels earn points for procurement volume

   EGYPTIAN MARKET GAPS WE DOMINATE:
   ─ No B2B procurement platform exists for Egyptian hospitality (WhatsApp-based)
   ─ No embedded factoring in any Egyptian marketplace
   ─ No multi-party settlements (hotel→platform→supplier→factoring)
   ─ No supplier credit scoring (we have I-Score, D&B, GAFI)
   ─ No ETA-native procurement (we're the only ones)
   ─ No logistics-procurement integration
   ─ No loyalty/rewards for B2B hospitality procurement
   ─ No rolling reserves for supplier protection
*/

const FEATURES = [
  {
    slug: "procurement",
    icon: Building2,
    title: "Hotel Procurement OS",
    headline: "Cut procurement costs by 23%. Stay compliant by default.",
    description:
      "A complete procurement operating system for hotels of every size. From boutique properties to international chains, streamline purchasing across all categories with AI-suggested suppliers, automated POs, and real-time ETA e-invoicing.",
    benefits: [
      "AI-suggested suppliers based on 12-month historical spend patterns",
      "Automated purchase orders with multi-level approval matrices",
      "Real-time ETA e-invoicing with digital signatures",
      "Consolidated dashboards across all properties and outlets",
      "Embedded invoice factoring for smart cashflow management",
    ],
    stat: "23%",
    statLabel: "Average cost reduction",
    accent: "#bef264",
  },
  {
    slug: "supplier",
    icon: Store,
    title: "Verified Supplier Network",
    headline: "Reach 52+ hotel properties. Get paid within 24 hours.",
    description:
      "Join Egypt's largest hospitality supplier network. List your catalog, receive guaranteed orders from vetted hotels, and unlock early payments through embedded factoring — not 90-day NET terms.",
    benefits: [
      "Direct access to verified hotel buyers with pre-approved credit lines",
      "Fixed pricing agreements — no bidding wars or race-to-bottom",
      "Guaranteed payments via non-recourse invoice factoring",
      "Shared-route logistics to reduce your delivery costs by 35%",
      "Demand forecasting to optimize inventory and production",
    ],
    stat: "24hr",
    statLabel: "Average time to payment",
    accent: "#10B981",
  },
  {
    slug: "split",
    icon: ArrowLeftRight,
    title: "Split Payments",
    headline: "One payment. Four recipients. Zero manual reconciliation.",
    description:
      "When a hotel pays EGP 100,000, the platform automatically splits it: supplier gets EGP 93,500, platform keeps EGP 1,500, factoring company gets EGP 3,500, logistics gets EGP 1,500. No spreadsheets. No errors.",
    benefits: [
      "Single payment from hotel → automatic multi-party settlement",
      "Platform fee deducted automatically per transaction",
      "Factoring discount calculated and routed in real time",
      "Logistics delivery fee split at the point of payment",
      "Full audit trail for every EGP across all parties",
    ],
    stat: "4",
    statLabel: "Parties settled in one transaction",
    accent: "#6366F1",
  },
  {
    slug: "factoring",
    icon: Banknote,
    title: "Embedded Invoice Factoring",
    headline: "Unlock cash flow. Eliminate default risk entirely.",
    description:
      "Non-recourse invoice factoring built directly into the transaction flow. Suppliers get paid within 24–48 hours of delivery confirmation. Hotels keep their NET-30/60 terms. The factoring company bears the default risk.",
    benefits: [
      "Suppliers paid within 24–48 hours of GRN confirmation",
      "Hotels preserve working capital with extended payment terms",
      "Non-recourse — supplier bears zero default risk",
      "Integrated with ETA e-invoice validation for instant verification",
      "Competitive discount rates priced by our AI risk engine",
    ],
    stat: "0%",
    statLabel: "Default risk to suppliers",
    accent: "#F59E0B",
  },
  {
    slug: "compliance",
    icon: ShieldCheck,
    title: "Authority Compliance Engine",
    headline: "ETA e-invoicing. Credit scoring. Certificate vault. Built in.",
    description:
      "Every invoice is digitally signed with your e-Seal, UUID-tagged, and submitted to the Egyptian Tax Authority automatically. Supplier credit scores blend I-Score, Dun & Bradstreet, GAFI, and platform internal data.",
    benefits: [
      "AES-256-GCM encrypted e-Seal and e-Signature storage",
      "Automatic ETA submission with digital signature validation",
      "Composite credit scoring from 5 independent sources",
      "Certificate expiry alerts (30-day HIGH, 7-day CRITICAL)",
      "API for partner banks to query supplier scores in real time",
    ],
    stat: "100%",
    statLabel: "ETA compliance from day one",
    accent: "#06B6D4",
  },
  {
    slug: "logistics",
    icon: Truck,
    title: "Shared-Route Fulfillment",
    headline: "48-hour delivery. Nationwide coverage. Temperature-controlled.",
    description:
      "Our shared-route fulfillment network consolidates deliveries across hotel clusters — cutting fuel costs, reducing waste, and guaranteeing on-time arrival. Temperature-controlled transport for F&B. Real-time tracking from warehouse to dock.",
    benefits: [
      "Shared routes across coastal and urban clusters reduce cost 35%",
      "Real-time GPS tracking from warehouse to hotel dock",
      "Temperature-controlled transport for F&B and pharmaceuticals",
      "Delivery consolidation reduces carbon footprint per shipment",
      "Nationwide coverage including South Sinai and Red Sea resorts",
    ],
    stat: "48hr",
    statLabel: "Delivery SLA guarantee",
    accent: "#EC4899",
  },
];

const TRUST_SIGNALS = [
  { icon: ShieldCheck, label: "Bank-grade KYC", desc: "Every partner verified before first transaction" },
  { icon: Globe, label: "Nationwide Coverage", desc: "All 27 governorates, from Matruh to Aswan" },
  { icon: Zap, label: "Fast Onboarding", desc: "Approved and transacting within 48 hours" },
  { icon: Clock, label: "Same-day Support", desc: "Dedicated success manager per account" },
];

const GAP_FEATURES = [
  {
    icon: ArrowLeftRight,
    title: "Multi-Party Split Payments",
    desc: "No Egyptian platform settles payments across hotel → platform → supplier → factoring in one atomic transaction. We do.",
  },
  {
    icon: Wallet,
    title: "Instant Supplier Payouts",
    desc: "Suppliers can cash out immediately after delivery confirmation. Not NET-30. Not NET-60. Same day.",
  },
  {
    icon: Scale,
    title: "Rolling Reserves",
    desc: "Hold a configurable percentage of supplier earnings as security. Auto-release after the dispute window closes.",
  },
  {
    icon: Gift,
    title: "Procurement Loyalty Program",
    desc: "Hotels earn points for every EGP spent. Redeem for discounted platform fees, free months, or priority support.",
  },
  {
    icon: Receipt,
    title: "Recurring Procurement Subscriptions",
    desc: "Auto-reorder consumables on a schedule. Never run out of cleaning supplies, F&B, or linens again.",
  },
  {
    icon: Landmark,
    title: "Partner API for Banks",
    desc: "Banks and factoring companies can query real-time supplier credit scores via our public API with HMAC-signed webhooks.",
  },
];

export default async function SolutionsPage() {
  const cms = await getCmsPage("solutions");
  return (
    <main className="min-h-screen bg-[#000000] text-white">
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#bef264]/[0.06] rounded-full blur-[140px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-5">
            Platform Solutions
          </p>
          <h1 className="text-[34px] md:text-[48px] font-bold leading-[1.08] tracking-[-0.03em]">
            Everything to Run Hospitality Procurement
            <br />
            <span className="text-white/30">in Egypt. In One Platform.</span>
          </h1>
          <p className="mt-6 text-[16px] text-white/35 leading-relaxed max-w-2xl mx-auto">
            From AI demand forecasting to automatic multi-party settlements,
            we built the infrastructure Egyptian hotels and suppliers have been missing.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#bef264] hover:bg-[#6d28d9] text-white text-[14px] font-semibold rounded-xl transition-all active:scale-[0.98]"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/[0.10] text-white/60 text-[14px] font-medium rounded-xl hover:bg-white/[0.03] transition-all"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST BAR
          ═══════════════════════════════════════════ */}
      <section className="border-y border-white/[0.04] bg-white/[0.01]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_SIGNALS.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-4 h-4 text-white/30" />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-white/50">{s.label}</p>
                  <p className="text-[11px] text-white/20">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURE SECTIONS — Alternating layout
          ═══════════════════════════════════════════ */}
      {FEATURES.map((feature, i) => (
        <section
          key={feature.slug}
          className={`py-28 ${i % 2 === 1 ? "bg-white/[0.01]" : ""} border-t border-white/[0.04]`}
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              {/* Text */}
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] text-[11px] text-white/30 uppercase tracking-wider mb-5">
                  <feature.icon className="w-3.5 h-3.5" style={{ color: feature.accent }} />
                  {feature.title}
                </div>
                <h2 className="text-[26px] md:text-[32px] font-bold tracking-tight leading-[1.15] mb-4">
                  {feature.headline}
                </h2>
                <p className="text-[14px] text-white/30 leading-relaxed mb-8">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${feature.accent}15` }}>
                        <BadgeCheck className="w-3 h-3" style={{ color: feature.accent }} />
                      </div>
                      <span className="text-[13px] text-white/40 leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-center gap-6">
                  <div>
                    <div className="text-[28px] font-bold" style={{ color: feature.accent }}>{feature.stat}</div>
                    <div className="text-[11px] text-white/25">{feature.statLabel}</div>
                  </div>
                </div>
              </div>

              {/* Visual — Abstract gradient card */}
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className="relative aspect-[4/3] rounded-2xl border border-white/[0.06] overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${feature.accent}, transparent 70%)` }}
                  />
                  <div className="absolute inset-0 bg-[#0a0a0a]" />
                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: `linear-gradient(${feature.accent} 1px, transparent 1px), linear-gradient(90deg, ${feature.accent} 1px, transparent 1px)`, backgroundSize: "40px 40px" }}
                  />
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: `${feature.accent}10`, border: `1px solid ${feature.accent}20` }}>
                      <feature.icon className="w-10 h-10" style={{ color: feature.accent, opacity: 0.6 }} />
                    </div>
                  </div>
                  {/* Floating stats */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-[10px] text-white/20 uppercase tracking-wider">Status</div>
                      <div className="text-[12px] text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active
                      </div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-[10px] text-white/20 uppercase tracking-wider">Uptime</div>
                      <div className="text-[12px] text-white/50 font-medium">99.9%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ═══════════════════════════════════════════
          MARKET GAP — What no one else in Egypt has
          ═══════════════════════════════════════════ */}
      <section className="py-28 border-t border-white/[0.04] bg-white/[0.01]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em] mb-3">
              Egyptian Market Gap
            </p>
            <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight">
              What No Other Platform in Egypt Offers
            </h2>
            <p className="mt-4 text-[14px] text-white/25 max-w-2xl mx-auto">
              We studied Stripe's marketplace infrastructure and built what Egyptian hospitality
              has been missing — multi-party settlements, instant payouts, rolling reserves, and loyalty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAP_FEATURES.map((gap) => (
              <div
                key={gap.title}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 hover:border-white/[0.10] hover:bg-white/[0.02] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4 group-hover:border-white/[0.10] transition-colors">
                  <gap.icon className="w-5 h-5 text-white/40" />
                </div>
                <h3 className="text-[14px] font-semibold text-white mb-2">{gap.title}</h3>
                <p className="text-[12px] text-white/25 leading-relaxed">{gap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS GRID
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "EGP 1.9T", label: "Annual B2B procurement volume in Egypt" },
              { value: "0", label: "Existing platforms with embedded factoring" },
              { value: "100%", label: "Hotels required to use ETA by 2025" },
              { value: "52+", label: "Properties already on the platform" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-[28px] font-bold text-white tracking-tight">{s.value}</div>
                <div className="text-[12px] text-white/25 mt-1 leading-relaxed">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.015] p-12 md:p-16 text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#bef264]/[0.06] rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-[28px] md:text-[38px] font-bold tracking-tight">
                The Infrastructure Egyptian Hospitality Needs
              </h2>
              <p className="mt-4 text-[15px] text-white/30 max-w-lg mx-auto">
                Join the hotels and suppliers that have turned procurement from a cost center into a competitive advantage.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#bef264] hover:bg-[#6d28d9] text-white text-[14px] font-semibold rounded-xl transition-all active:scale-[0.98]"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/partners"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/[0.10] text-white/50 text-[14px] font-medium rounded-xl hover:bg-white/[0.03] transition-all"
                >
                  Partner With Us
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
