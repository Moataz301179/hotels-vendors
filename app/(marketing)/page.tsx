import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  ShoppingCart,
  Truck,
  Landmark,
  FileCheck,
  ShieldCheck,
  BrainCircuit,
  BarChart3,
  Zap,
  Users,
  Plug,
  Receipt,
  Bot,
  Store,
  Banknote,
  TrendingUp,
  UserPlus,
  GitCompare,
  ClipboardList,
  Package,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { getCmsPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsPage("home");
  return {
    title:
      cms?.metaTitle ||
      "Hotels Vendors — Egypt's First Smart Procurement & Payment Hub",
    description:
      cms?.metaDescription ||
      "The all-in-one SaaS platform for Egyptian hospitality procurement. AI-powered sourcing, smart cashflow, automated supplier payments, risk mitigation, and full ETA e-invoicing compliance — in one unified hub.",
  };
}

const STATS = [
  { value: "52", label: "Hotel Properties", sub: "Across 8 governorates" },
  { value: "68", label: "Verified Suppliers", sub: "1,200+ SKU categories" },
  { value: "100%", label: "ETA Compliant", sub: "E-invoicing & tax authority integration" },
  { value: "EGP 86M", label: "Monthly GMV", sub: "Procurement volume tracked" },
  { value: "6", label: "Coastal Clusters", sub: "Cairo, Alexandria, Red Sea, Sinai, Luxor, Aswan" },
  { value: "48hr", label: "Delivery SLA", sub: "From order to dock receipt" },
];

const NETWORK_PROPERTIES = [
  { name: "Four Seasons Cairo at Nile Plaza", city: "Cairo", rooms: 365 },
  { name: "Marriott Mena House", city: "Giza", rooms: 331 },
  { name: "Fairmont Nile City", city: "Cairo", rooms: 540 },
  { name: "Conrad Cairo", city: "Cairo", rooms: 617 },
  { name: "Steigenberger Al Dau Beach Hotel", city: "Hurghada", rooms: 388 },
  { name: "Rixos Sharm El Sheikh", city: "Sharm El-Sheikh", rooms: 695 },
  { name: "Jaz Aquamarine Hurghada", city: "Hurghada", rooms: 1001 },
  { name: "Sofitel Winter Palace Luxor", city: "Luxor", rooms: 86 },
];

const CAPABILITIES = [
  {
    icon: Bot,
    title: "Predictive Demand Intelligence",
    desc: "Our AI engine analyzes consumption velocity across your properties, anticipates seasonal spikes, and auto-generates purchase orders before stockouts occur — not after.",
  },
  {
    icon: Receipt,
    title: "Native ETA E-Invoicing",
    desc: "Every invoice is digitally signed, UUID-tagged, and submitted to the Egyptian Tax Authority in real time. Compliance is not a module — it is the foundation.",
  },
  {
    icon: Banknote,
    title: "Embedded Cashflow Architecture",
    desc: "Invoice factoring, payment guarantees, and credit-line management are woven into the transaction flow. Suppliers get liquidity; hotels preserve working capital.",
  },
  {
    icon: ShieldCheck,
    title: "Authority Matrix Governance",
    desc: "Multi-level approval chains enforced at the database layer. No PO can be approved above its threshold without the required signatures — bypassing is technically impossible.",
  },
  {
    icon: Store,
    title: "Verified Supplier Network",
    desc: "Every supplier is audited for commercial registration, tax compliance, and delivery track record. Not a directory — a vetted ecosystem.",
  },
  {
    icon: TrendingUp,
    title: "Procurement Intelligence Layer",
    desc: "Cross-property spend analysis, price benchmarking against market indices, and anomaly detection that flags unusual pricing or delivery patterns before they become problems.",
  },
];

const WORKFLOW = [
  {
    num: "01",
    icon: BrainCircuit,
    title: "Intelligent Demand Sensing",
    desc: "The system ingests historical consumption, seasonal patterns, and property-specific events to forecast exactly what each outlet needs and when.",
  },
  {
    num: "02",
    icon: GitCompare,
    title: "Autonomous Sourcing & Negotiation",
    desc: "AI evaluates supplier bids against quality scores, delivery SLAs, and historical pricing. The optimal vendor is selected automatically — or flagged for human review.",
  },
  {
    num: "03",
    icon: ClipboardList,
    title: "Governed Order Execution",
    desc: "Purchase orders route through your authority matrix automatically. ETA-compliant invoices generate at order confirmation. Payments execute per contracted terms.",
  },
  {
    num: "04",
    icon: BarChart3,
    title: "Continuous Optimization",
    desc: "Post-delivery analytics feed back into the demand model. Price deviations, quality issues, and delivery failures automatically adjust future sourcing decisions.",
  },
];

export default async function HomePage() {
  const cms = await getCmsPage("home");
  return (
    <main className="min-h-screen bg-black">
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          HERO SECTION — Full bleed carousel
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[640px] md:min-h-[720px] flex items-center">
        <HeroCarousel />

        {/* Hero content overlay */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-[120px] pb-20 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B0000]/90 text-white text-[11px] font-semibold uppercase tracking-[0.15em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Procurement OS for Egyptian Hospitality
            </div>

            {/* Headline — reduced size */}
            <h1 className="text-[30px] md:text-[44px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
              {cms?.heroTitle || "One Smart Platform. Every Procurement Need. From Sourcing to Payment."}
            </h1>

            {/* Subtitle — reduced size */}
            <p className="mt-5 text-[14px] md:text-[16px] text-white/70 leading-relaxed max-w-lg">
              {cms?.heroDescription || "Hotels Vendors is Egypt's first comprehensive SaaS procurement hub. AI-powered sourcing, integrated marketplace, smart cashflow & invoice factoring, automated ETA e-invoicing, and risk-mitigated supplier payments — all in one unified platform."}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#6B0000] text-white text-[14px] font-semibold rounded-lg transition-colors"
              >
                Book a Demo
                <span className="text-white/70">/</span>
                Explore Platform
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/25 text-white text-[14px] font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════ */}
      <section className="relative z-10 -mt-16 mx-auto max-w-6xl px-6">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[26px] md:text-[30px] font-bold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] font-medium text-[#8B0000] uppercase tracking-wide">
                  {stat.label}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          NETWORK COVERAGE
          ═══════════════════════════════════════════ */}
      <section className="py-14 border-y border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-[11px] font-semibold text-[#8B0000] uppercase tracking-[0.2em] mb-6 text-center">
            Properties on the Network
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {NETWORK_PROPERTIES.map((prop) => (
              <div key={prop.name} className="p-4 rounded-xl bg-[#111] border border-white/[0.08]">
                <p className="text-[13px] font-semibold text-white truncate">{prop.name}</p>
                <p className="text-[11px] text-gray-500 mt-1">{prop.city} · {prop.rooms} rooms</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PLATFORM CAPABILITIES
          ═══════════════════════════════════════════ */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#8B0000] uppercase tracking-[0.2em] mb-3">
              Platform Capabilities
            </p>
            <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight">
              One Operating System.
              <br />
              <span className="text-gray-500">Six Critical Capabilities.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="group p-6 rounded-2xl bg-[#111] border border-white/10 hover:border-white/15 transition-all shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#8B0000]/10 border border-[#8B0000]/20 flex items-center justify-center mb-4 group-hover:bg-[#8B0000]/15 group-hover:border-[#8B0000]/30 transition-all">
                  <cap.icon className="w-5 h-5 text-[#8B0000]" />
                </div>
                <h3 className="text-[16px] font-semibold text-white mb-2">{cap.title}</h3>
                <p className="text-[13px] text-gray-400 leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#8B0000] uppercase tracking-[0.2em] mb-3">
              How It Works
            </p>
            <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight">
              Autonomous Procurement
              <br />
              <span className="text-gray-500">From Signal to Settlement</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW.map((step, i) => (
              <div key={step.num} className="relative">
                <div className="p-6 rounded-2xl bg-[#111] border border-white/10 h-full shadow-sm">
                  <div className="text-[44px] font-bold text-white/10 leading-none mb-4">
                    {step.num}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#8B0000]/10 flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-[#8B0000]" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-[13px] text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════ */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#111] border border-white/10 p-10 md:p-16 text-center shadow-sm">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B0000]/[0.08] rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-[28px] md:text-[38px] font-bold text-white tracking-tight">
                {cms?.ctaTitle || "Ready to Run Your Procurement on Autopilot?"}
              </h2>
              <p className="mt-4 text-[14px] md:text-[15px] text-gray-400 max-w-xl mx-auto">
                {cms?.ctaDescription || "Join hotels and suppliers across Egypt using the first all-in-one procurement OS. From AI sourcing to smart payments and ETA compliance — everything connected, everything automated."}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#6B0000] text-white text-[14px] font-semibold rounded-lg transition-colors"
                >
                  Request Platform Access
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-gray-300 text-[14px] font-medium rounded-lg hover:bg-white/5 transition-colors"
                >
                  Schedule Executive Briefing
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[12px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  No setup fees, no long-term commitments
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Onboard your full team in under 10 minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5" />
                  Full ETA e-invoicing compliance from day one
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
