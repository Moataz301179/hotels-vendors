import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BrainCircuit,
  Receipt,
  Banknote,
  ShieldCheck,
  Store,
  TrendingUp,
  Zap,
  FileCheck,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { getCmsPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsPage("home");
  return {
    title:
      cms?.metaTitle ||
      "Hotels Vendors — AI Procurement OS for Egyptian Hospitality",
    description:
      cms?.metaDescription ||
      "An AI-native procurement operating system that predicts demand, automates workflows, secures cashflow, and enforces ETA compliance. Built for Egyptian hospitality.",
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

const CAPABILITIES = [
  {
    icon: BrainCircuit,
    title: "Predictive Demand Intelligence",
    desc: "Our AI engine analyzes consumption velocity across your properties, anticipates seasonal spikes, and auto-generates purchase orders before stockouts occur — not after.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    icon: Receipt,
    title: "Native ETA E-Invoicing",
    desc: "Every invoice is digitally signed, UUID-tagged, and submitted to the Egyptian Tax Authority in real time. Compliance is not a module — it is the foundation.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
  },
  {
    icon: Banknote,
    title: "Embedded Cashflow Architecture",
    desc: "Invoice factoring, payment guarantees, and credit-line management are woven into the transaction flow. Suppliers get liquidity; hotels preserve working capital.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  },
  {
    icon: ShieldCheck,
    title: "Authority Matrix Governance",
    desc: "Multi-level approval chains enforced at the database layer. No PO can be approved above its threshold without the required signatures — bypassing is technically impossible.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
  {
    icon: Store,
    title: "Verified Supplier Network",
    desc: "Every supplier is audited for commercial registration, tax compliance, and delivery track record. Not a directory — a vetted ecosystem.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  },
  {
    icon: TrendingUp,
    title: "Procurement Intelligence Layer",
    desc: "Cross-property spend analysis, price benchmarking against market indices, and anomaly detection that flags unusual pricing or delivery patterns before they become problems.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
];

const CITIES = [
  { name: "Cairo", properties: 18, region: "Capital Corridor" },
  { name: "Alexandria", properties: 8, region: "Mediterranean" },
  { name: "Hurghada", properties: 12, region: "Red Sea" },
  { name: "Sharm El-Sheikh", properties: 9, region: "South Sinai" },
  { name: "Luxor", properties: 3, region: "Upper Egypt" },
  { name: "Aswan", properties: 2, region: "Upper Egypt" },
];

const WORKFLOW = [
  {
    num: "01",
    title: "Intelligent Demand Sensing",
    desc: "The system ingests historical consumption, seasonal patterns, and property-specific events to forecast exactly what each outlet needs and when.",
  },
  {
    num: "02",
    title: "Autonomous Sourcing & Negotiation",
    desc: "AI evaluates supplier bids against quality scores, delivery SLAs, and historical pricing. The optimal vendor is selected automatically — or flagged for human review.",
  },
  {
    num: "03",
    title: "Governed Order Execution",
    desc: "Purchase orders route through your authority matrix automatically. ETA-compliant invoices generate at order confirmation. Payments execute per contracted terms.",
  },
  {
    num: "04",
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
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[640px] md:min-h-[720px] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80"
            alt="Luxury hotel lobby"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-[120px] pb-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B0000]/90 text-white text-[11px] font-semibold uppercase tracking-[0.15em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Procurement OS for Egyptian Hospitality
            </div>

            <h1 className="text-[30px] md:text-[44px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
              {cms?.heroTitle || "The AI Procurement Operating System Egypt's Hotels Actually Needed"}
            </h1>

            <p className="mt-5 text-[14px] md:text-[16px] text-white/70 leading-relaxed max-w-lg">
              {cms?.heroDescription || "Not a marketplace. Not a directory. Hotels Vendors is an AI-native procurement operating system that predicts demand across your properties, automates purchasing workflows, secures cashflow through embedded factoring, and enforces full ETA compliance — before problems ever reach your desk."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#6B0000] text-white text-[14px] font-semibold rounded-lg transition-colors"
              >
                Request Platform Access
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/25 text-white text-[14px] font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Schedule Executive Briefing
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
                <div className="mt-1 text-[11px] font-medium text-white/60 uppercase tracking-wide">
                  {stat.label}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PLATFORM PREVIEW — Screenshot
          ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.2em] mb-3">
              Platform Preview
            </p>
            <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight">
              One Dashboard. Full Control.
            </h2>
          </div>
          <div className="relative rounded-2xl border border-white/10 overflow-hidden bg-[#0a0a0a]">
            <Image
              src="/user-screenshot2.png"
              alt="Hotels Vendors Platform Dashboard"
              width={2880}
              height={1800}
              className="w-full h-auto"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          NETWORK COVERAGE
          ═══════════════════════════════════════════ */}
      <section className="py-14 border-y border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.2em] mb-3">
              Network Coverage
            </p>
            <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight">
              Active Across Egypt's Hospitality Corridors
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CITIES.map((city) => (
              <div key={city.name} className="p-5 rounded-xl bg-[#111] border border-white/[0.08] text-center hover:border-[#8B0000]/30 transition-colors">
                <MapPin className="w-5 h-5 text-white mx-auto mb-3" />
                <p className="text-[15px] font-semibold text-white">{city.name}</p>
                <p className="text-[22px] font-bold text-white mt-1">{city.properties}</p>
                <p className="text-[11px] text-gray-500 mt-1">{city.region}</p>
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
            <p className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.2em] mb-3">
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
                className="group relative rounded-2xl bg-[#111] border border-white/10 hover:border-white/15 transition-all overflow-hidden"
              >
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={cap.image}
                    alt=""
                    fill
                    className="object-cover opacity-10 group-hover:opacity-15 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/95 to-[#111]/80" />
                </div>
                <div className="relative z-10 p-6">
                  <div className="w-10 h-10 rounded-xl bg-[#8B0000]/10 border border-[#8B0000]/20 flex items-center justify-center mb-4 group-hover:bg-[#8B0000]/15 group-hover:border-[#8B0000]/30 transition-all">
                    <cap.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-white mb-2">{cap.title}</h3>
                  <p className="text-[13px] text-gray-400 leading-relaxed">{cap.desc}</p>
                </div>
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
            <p className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.2em] mb-3">
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
                <div className="p-6 rounded-2xl bg-[#111] border border-white/10 h-full">
                  <div className="text-[44px] font-bold text-white/10 leading-none mb-4">
                    {step.num}
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
          <div className="relative overflow-hidden rounded-3xl bg-[#111] border border-white/10 p-10 md:p-16 text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B0000]/[0.08] rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-[28px] md:text-[38px] font-bold text-white tracking-tight">
                {cms?.ctaTitle || "Ready to Stop Leaking Money?"}
              </h2>
              <p className="mt-4 text-[14px] md:text-[15px] text-gray-400 max-w-xl mx-auto">
                {cms?.ctaDescription || "Join the hotels that have turned procurement from a cost center into a competitive advantage."}
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
                  <Zap className="w-3.5 h-3.5" />
                  No setup fees, no long-term commitments
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
