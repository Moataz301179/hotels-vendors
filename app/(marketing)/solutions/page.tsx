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
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Solutions — Hotels Vendors | Built for Egyptian Hospitality",
    description:
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
      "Embedded invoice factoring for smart cashflow",
    ],
    stat: "All-in-One",
    statLabel: "Procurement OS",
    gradient: "from-red-500/10 to-transparent",
  },
  {
    icon: Store,
    title: "Supplier Growth",
    tagline: "Reach 52+ hotel properties. Get paid faster.",
    description:
      "Join Egypt's largest hospitality supplier network. List your catalog, receive guaranteed orders, and unlock early payments through embedded factoring.",
    benefits: [
      "Direct access to verified hotel buyers",
      "Fixed pricing — no bidding wars",
      "Guaranteed payments via invoice factoring",
      "Shared-route logistics to reduce delivery costs",
      "Demand forecasting to optimize inventory",
    ],
    stat: "100+",
    statLabel: "Verified Suppliers",
    gradient: "from-amber-500/10 to-transparent",
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
    gradient: "from-emerald-500/10 to-transparent",
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
    gradient: "from-blue-500/10 to-transparent",
  },
];

const FLOW = [
  { icon: Building2, title: "Hotel Places Order", desc: "Browse catalog, compare suppliers, submit PO with automated approval chains." },
  { icon: Store, title: "Supplier Fulfills", desc: "Confirms stock, prepares shipment, hands off to shared logistics network." },
  { icon: Truck, title: "Logistics Delivers", desc: "Consolidated routes guarantee 48-hour delivery anywhere in Egypt." },
  { icon: Banknote, title: "Factoring Pays", desc: "Supplier gets paid within 24 hours. Hotel keeps net-30/60 terms." },
];

const CAPABILITIES = [
  { icon: BarChart3, title: "Spend Analytics", desc: "Real-time dashboards tracking every EGP across all properties and categories." },
  { icon: ShieldCheck, title: "Authority Matrix", desc: "Multi-level approval chains enforced server-side for every purchase order." },
  { icon: Globe, title: "ETA Compliance", desc: "Native Egyptian Tax Authority e-invoicing with digital signing and submission." },
  { icon: Zap, title: "AI Sourcing", desc: "Smart demand forecasting and automated reordering trained on hospitality data." },
];

export default async function SolutionsPage() {
  return (
    <main className="min-h-screen bg-black">
      <MarketingNav />

      {/* Hero */}
      <section className="relative pt-36 pb-24">
        <div className="absolute top-20 right-1/3 w-[500px] h-[500px] bg-[#D4A843]/[0.02] rounded-full blur-[150px] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 text-[11px] font-medium uppercase tracking-[0.15em] mb-6">
              <Globe className="w-3 h-3" />
              End-to-End Platform
            </div>
            <h1 className="text-[32px] md:text-[48px] font-medium text-white leading-[1.05] tracking-[-0.02em]">
              Built for Egyptian
              <br />
              <span className="text-white/30">Hospitality.</span>
            </h1>
            <p className="mt-6 text-[16px] md:text-[18px] text-white/40 leading-relaxed max-w-xl">
              Four integrated solutions — procurement, supplier growth, logistics, and factoring — designed to transform how Egypt&apos;s hospitality sector buys, sells, and moves goods.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#a50000] text-white text-[14px] font-medium rounded-xl transition-colors"
              >
                Explore the Platform
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/[0.08] text-white/50 text-[14px] font-medium rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Cards */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SOLUTIONS.map((s) => (
              <div
                key={s.title}
                className="group p-7 md:p-8 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] hover:border-white/[0.12] transition-all relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <s.icon className="w-6 h-6 text-white/60" />
                    </div>
                    <div className="text-right">
                      <div className="text-[24px] font-medium text-white tracking-tight">
                        {s.stat}
                      </div>
                      <div className="text-[11px] text-white/25 uppercase tracking-wide">
                        {s.statLabel}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-[20px] font-medium text-white mb-1">
                    {s.title}
                  </h3>
                  <p className="text-[13px] font-medium text-white/40 mb-4">
                    {s.tagline}
                  </p>
                  <p className="text-[14px] text-white/35 leading-relaxed mb-6">
                    {s.description}
                  </p>

                  <ul className="space-y-2.5">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-[13px] text-white/40">
                        <CheckCircle2 className="w-4 h-4 text-white/15 shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Flow */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="label-upper mb-4">How It Works</p>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white">
              One Platform. Four Stakeholders.
              <br />
              <span className="text-white/30">Zero Friction.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FLOW.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] h-full hover:border-white/[0.12] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-white/50" />
                  </div>
                  <h3 className="text-[15px] font-medium text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-white/35 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {i < FLOW.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2.5 text-white/10">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] hover:border-white/[0.12] transition-all group"
              >
                <cap.icon className="w-8 h-8 text-white/15 mb-4 group-hover:text-white/30 transition-colors" />
                <h3 className="text-[15px] font-medium text-white mb-2">
                  {cap.title}
                </h3>
                <p className="text-[13px] text-white/35 leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Hotels */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/[0.06] p-10 md:p-14 cta-bleed">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h3 className="text-[24px] md:text-[30px] font-medium text-white tracking-tight">
                  Are you a hotel buyer?
                </h3>
                <p className="mt-3 text-[14px] text-white/35 leading-relaxed">
                  Join hotels across Egypt running their entire procurement lifecycle — from AI sourcing and ordering to payments, factoring, and ETA compliance — on one unified platform.
                </p>
              </div>
              <Link
                href="/register?role=hotel"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#8B0000] hover:bg-[#a50000] text-white text-[14px] font-medium rounded-xl transition-colors shrink-0"
              >
                Register as Hotel
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Suppliers */}
      <section className="py-8 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-[rgba(212,168,67,0.15)] p-10 md:p-14">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#D4A843]/[0.04] rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h3 className="text-[24px] md:text-[30px] font-medium text-white tracking-tight">
                  Are you a supplier?
                </h3>
                <p className="mt-3 text-[14px] text-white/35 leading-relaxed">
                  Access 52+ verified hotel properties, get paid early via factoring, and reduce logistics costs with shared-route delivery.
                </p>
              </div>
              <Link
                href="/register?role=supplier"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#D4A843] text-black text-[14px] font-medium rounded-xl hover:bg-[#e0b856] transition-colors shrink-0"
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
