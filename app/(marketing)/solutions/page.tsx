import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Store,
  Truck,
  Banknote,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  Zap,
  Globe,
  FileCheck,
  Users,
  TrendingUp,
  Package,
  Clock,
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

const SOLUTIONS = [
  {
    icon: Building2,
    title: "Hotel Procurement",
    tagline: "Cut costs. Save time. Stay compliant.",
    description:
      "A complete procurement operating system for hotels of every size. From boutique properties to international chains, streamline purchasing across all categories.",
    benefits: [
      "AI-suggested suppliers based on historical spend",
      "Automated purchase orders with multi-level approvals",
      "Real-time ETA e-invoicing compliance",
      "Consolidated dashboards across all properties",
      "30% average cost savings across categories",
    ],
    stat: "30%",
    statLabel: "Avg Cost Savings",
  },
  {
    icon: Store,
    title: "Supplier Growth",
    tagline: "Reach 450+ hotel buyers. Get paid faster.",
    description:
      "Join Egypt's largest hospitality supplier network. List your catalog, receive guaranteed orders, and unlock early payments through embedded factoring.",
    benefits: [
      "Direct access to verified hotel buyers",
      "Fixed pricing — no bidding wars",
      "Guaranteed payments via invoice factoring",
      "Shared-route logistics to reduce delivery costs",
      "Demand forecasting to optimize inventory",
    ],
    stat: "1,200+",
    statLabel: "Verified Suppliers",
  },
  {
    icon: Truck,
    title: "Logistics & Fulfillment",
    tagline: "48-hour delivery. Nationwide coverage.",
    description:
      "Our shared-route fulfillment network consolidates deliveries across hotel clusters — cutting fuel costs, reducing waste, and guaranteeing on-time arrival.",
    benefits: [
      "Shared routes across coastal and urban clusters",
      "Real-time tracking from warehouse to hotel",
      "Temperature-controlled transport for F&B",
      "Delivery consolidation reduces carbon footprint",
      "Nationwide coverage including South Sinai",
    ],
    stat: "48hr",
    statLabel: "Delivery Guarantee",
  },
  {
    icon: Banknote,
    title: "Invoice Factoring",
    tagline: "Unlock cash flow. Eliminate default risk.",
    description:
      "Embedded liquidity for suppliers and flexible payment terms for hotels. Non-recourse factoring means suppliers get paid early with zero default risk.",
    benefits: [
      "Suppliers paid within 24–48 hours of delivery",
      "Hotels keep net-30/60 payment terms",
      "Non-recourse — supplier bears zero default risk",
      "Integrated with ETA e-invoice validation",
      "Competitive discount rates priced by risk engine",
    ],
    stat: "24hr",
    statLabel: "Supplier Payout",
  },
];

const CASE_STUDIES = [
  {
    industry: "Hotel Chain",
    title: "Multi-property group cuts procurement admin by 80%",
    desc: "A 15-property chain replaced WhatsApp ordering with automated POs, approval chains, and real-time spend tracking across all locations.",
    results: [
      "80% reduction in procurement admin time",
      "EGP 2.3M saved in first 12 months",
      "100% ETA compliance from day one",
    ],
  },
  {
    industry: "SME Supplier",
    title: "Factory supplier scales to 50+ hotel clients",
    desc: "A linens manufacturer in 6th of October City joined the platform and leveraged shared logistics to cut delivery costs by 40%.",
    results: [
      "50+ active hotel buyers within 6 months",
      "40% reduction in per-delivery logistics cost",
      "Cash flow improved via invoice factoring",
    ],
  },
];

export default async function SolutionsPage() {
  const cms = await getCmsPage("solutions");
  return (
    <main className="min-h-screen bg-[#050505]">
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e11d48]/10 border border-[#e11d48]/20 text-[#e11d48] text-[11px] font-semibold uppercase tracking-[0.15em] mb-6">
              <Globe className="w-3 h-3" />
              End-to-End Platform
            </div>
            <h1 className="text-[42px] md:text-[64px] font-bold text-white leading-[1.05] tracking-[-0.02em]">
              {cms?.heroTitle || "Built for Egyptian Hospitality."}
            </h1>
            <p className="mt-6 text-[16px] md:text-[18px] text-white/50 leading-relaxed max-w-xl">
              {cms?.heroDescription || "Four integrated solutions — procurement, supplier growth, logistics, and factoring — designed to transform how Egypt's hospitality sector buys, sells, and moves goods."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#e11d48] hover:bg-[#be123c] text-white text-[14px] font-semibold rounded-lg transition-colors"
              >
                Explore the Platform
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-[14px] font-medium rounded-lg hover:bg-white/5 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SOLUTION CARDS
          ═══════════════════════════════════════════ */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SOLUTIONS.map((solution) => (
              <div
                key={solution.title}
                className="group p-6 md:p-8 rounded-2xl bg-[#0f0f0f] border border-white/[0.06] hover:border-white/[0.12] transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover:bg-[#e11d48]/10 group-hover:border-[#e11d48]/20 transition-all">
                    <solution.icon className="w-6 h-6 text-[#e11d48]" />
                  </div>
                  <div className="text-right">
                    <div className="text-[24px] font-bold text-white tracking-tight">
                      {solution.stat}
                    </div>
                    <div className="text-[11px] text-white/30 uppercase tracking-wide">
                      {solution.statLabel}
                    </div>
                  </div>
                </div>

                <h3 className="text-[20px] font-semibold text-white mb-1">
                  {solution.title}
                </h3>
                <p className="text-[13px] font-medium text-[#e11d48] mb-4">
                  {solution.tagline}
                </p>
                <p className="text-[14px] text-white/40 leading-relaxed mb-6">
                  {solution.description}
                </p>

                <ul className="space-y-2.5">
                  {solution.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2.5 text-[13px] text-white/60"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#e11d48] shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — FLOW
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#e11d48] uppercase tracking-[0.2em] mb-3">
              How It Works
            </p>
            <h2 className="text-[32px] md:text-[40px] font-bold text-white tracking-tight">
              One Platform. Four Stakeholders. Zero Friction.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Building2,
                title: "Hotel Places Order",
                desc: "Browse catalog, compare suppliers, and submit PO with automated approval chains.",
              },
              {
                icon: Store,
                title: "Supplier Fulfills",
                desc: "Confirms stock, prepares shipment, and hands off to shared logistics network.",
              },
              {
                icon: Truck,
                title: "Logistics Delivers",
                desc: "Consolidated routes guarantee 48-hour delivery anywhere in Egypt.",
              },
              {
                icon: Banknote,
                title: "Factoring Pays",
                desc: "Supplier gets paid within 24 hours. Hotel keeps net-30/60 terms.",
              },
            ].map((step, i) => (
              <div key={step.title} className="relative">
                <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.06] h-full">
                  <div className="w-10 h-10 rounded-xl bg-[#e11d48]/10 flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-[#e11d48]" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-white/40 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-white/[0.08]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CASE STUDIES
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#e11d48] uppercase tracking-[0.2em] mb-3">
              Case Studies
            </p>
            <h2 className="text-[32px] md:text-[40px] font-bold text-white tracking-tight">
              Real Results from Real Partners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CASE_STUDIES.map((cs) => (
              <div
                key={cs.title}
                className="p-6 md:p-8 rounded-2xl bg-[#0f0f0f] border border-white/[0.06]"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] font-medium text-white/50 uppercase tracking-wider mb-4">
                  {cs.industry}
                </div>
                <h3 className="text-[18px] font-semibold text-white mb-3">
                  {cs.title}
                </h3>
                <p className="text-[14px] text-white/40 leading-relaxed mb-6">
                  {cs.desc}
                </p>
                <div className="space-y-2">
                  {cs.results.map((result) => (
                    <div
                      key={result}
                      className="flex items-center gap-2 text-[13px] text-white/60"
                    >
                      <TrendingUp className="w-4 h-4 text-[#e11d48] shrink-0" />
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CAPABILITY HIGHLIGHTS
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: BarChart3,
                title: "Spend Analytics",
                desc: "Real-time dashboards tracking every EGP across all properties and categories.",
              },
              {
                icon: ShieldCheck,
                title: "Authority Matrix",
                desc: "Multi-level approval chains enforced server-side for every purchase order.",
              },
              {
                icon: FileCheck,
                title: "ETA Compliance",
                desc: "Native Egyptian Tax Authority e-invoicing with digital signing and submission.",
              },
              {
                icon: Zap,
                title: "AI Sourcing",
                desc: "Smart demand forecasting and automated reordering trained on hospitality data.",
              },
            ].map((cap) => (
              <div
                key={cap.title}
                className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.06]"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4">
                  <cap.icon className="w-5 h-5 text-[#e11d48]" />
                </div>
                <h3 className="text-[15px] font-semibold text-white mb-2">
                  {cap.title}
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — Hotels
          ═══════════════════════════════════════════ */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#0f0f0f] border border-white/[0.06] p-10 md:p-14">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#e11d48]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h3 className="text-[24px] md:text-[28px] font-bold text-white tracking-tight">
                  Are you a hotel buyer?
                </h3>
                <p className="mt-2 text-[14px] text-white/40 leading-relaxed">
                  Join 450+ properties already cutting procurement costs by 30%
                  and reducing admin work by 80%.
                </p>
              </div>
              <Link
                href="/register?role=hotel"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#e11d48] hover:bg-[#be123c] text-white text-[14px] font-semibold rounded-lg transition-colors shrink-0"
              >
                Register as Hotel
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — Suppliers
          ═══════════════════════════════════════════ */}
      <section className="py-10 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#0f0f0f] border border-white/[0.06] p-10 md:p-14">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#e11d48]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h3 className="text-[24px] md:text-[28px] font-bold text-white tracking-tight">
                  Are you a supplier?
                </h3>
                <p className="mt-2 text-[14px] text-white/40 leading-relaxed">
                  Access 450+ verified hotel buyers, get paid early via factoring,
                  and reduce logistics costs with shared-route delivery.
                </p>
              </div>
              <Link
                href="/register?role=supplier"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.10] border border-white/20 text-white text-[14px] font-semibold rounded-lg transition-colors shrink-0"
              >
                Register as Supplier
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
