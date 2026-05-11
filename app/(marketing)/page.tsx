import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Store,
  Truck,
  Landmark,
  ShieldCheck,
  BarChart3,
  BrainCircuit,
  Zap,
  TrendingUp,
  Clock,
  FileCheck,
  Wallet,
  Route,
  Bell,
  CheckCircle2,
  Star,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { getCmsPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsPage("home");
  return {
    title:
      cms?.metaTitle ||
      "Hotels Vendors — The Intelligent Procurement OS for Egyptian Hospitality",
    description:
      cms?.metaDescription ||
      "Egypt's first integrated procurement operating system for hospitality. 30% cost savings, 80% less admin, 48-hour delivery guarantee, full ETA compliance.",
  };
}

const STATS = [
  { value: "1,200+", label: "Verified Suppliers", sub: "Vetted & ETA-certified across Egypt" },
  { value: "30%", label: "Avg Cost Savings", sub: "Across all procurement categories" },
  { value: "48hr", label: "Delivery Guarantee", sub: "Nationwide with real-time tracking" },
  { value: "80%", label: "Less Admin Work", sub: "AI-automated workflows & approvals" },
  { value: "100%", label: "ETA Compliant", sub: "Real-time e-invoicing with ETA" },
  { value: "50+", label: "Product Categories", sub: "Complete hospitality SKU taxonomy" },
];

const ECOSYSTEM = [
  {
    icon: Building2,
    title: "Hotel Procurement OS",
    desc: "Multi-property governance, AI-driven reordering, spend analytics, and authority matrix approvals. One platform for your entire portfolio.",
    cta: "For Hotels",
    href: "/register?role=hotel",
    color: "bg-[#8B0000]/5 border-[#8B0000]/10",
    iconColor: "text-[#8B0000]",
  },
  {
    icon: Store,
    title: "Supplier Central",
    desc: "List inventory with fixed pricing, receive guaranteed orders, access invoice factoring, and grow your B2B hospitality business.",
    cta: "For Suppliers",
    href: "/become-supplier",
    color: "bg-emerald-50 border-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: Truck,
    title: "Logistics Network",
    desc: "Shared-route fulfillment, real-time GPS tracking, delivery confirmation, and coastal cluster optimization for seasonal demand.",
    cta: "For Logistics",
    href: "/register?role=shipping",
    color: "bg-sky-50 border-sky-100",
    iconColor: "text-sky-600",
  },
  {
    icon: Landmark,
    title: "Factoring Marketplace",
    desc: "Non-recourse invoice factoring with automated risk scoring. Suppliers get paid early; hotels keep their net-30/60 terms.",
    cta: "For Factoring",
    href: "/register?role=factoring",
    color: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-600",
  },
];

const CAPABILITIES = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Sourcing",
    desc: "Smart demand forecasting, automated reordering, and intelligent supplier matching trained on Egyptian hospitality data.",
  },
  {
    icon: FileCheck,
    title: "ETA e-Invoicing Engine",
    desc: "Fully compliant with Egyptian Tax Authority. Automated e-invoice generation, digital signing, and real-time submission.",
  },
  {
    icon: Wallet,
    title: "Embedded Payments",
    desc: "Multi-channel payment orchestration: deposits, factoring, bank transfers, and digital wallets — all audit-logged.",
  },
  {
    icon: Route,
    title: "Logistics Optimization",
    desc: "AI-optimized delivery routes, shared consolidation, and 48-hour delivery guarantees across all Egyptian governorates.",
  },
  {
    icon: BarChart3,
    title: "Spend Intelligence",
    desc: "Real-time procurement analytics, category benchmarking, and TCP (Total Cost of Procurement) reporting per order.",
  },
  {
    icon: ShieldCheck,
    title: "Authority Matrix",
    desc: "Multi-level approval chains with payment guarantee gates, dual-authorization overrides, and immutable audit trails.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Register & Verify",
    desc: "Sign up as hotel, supplier, logistics, or factoring. AI-assisted onboarding with document processing and risk scoring.",
  },
  {
    num: "02",
    title: "Connect & Configure",
    desc: "Link your ERP/PMS, set approval chains, configure credit limits, and activate ETA e-invoicing in one flow.",
  },
  {
    num: "03",
    title: "Procure Intelligently",
    desc: "Browse curated catalogs, use AI recommendations, place orders with guaranteed pricing and automated compliance.",
  },
  {
    num: "04",
    title: "Track & Optimize",
    desc: "Real-time delivery tracking, spend analytics, and continuous AI optimization of your procurement strategy.",
  },
];

const TRUST_SIGNALS = [
  "Pickalbatros", "Hilton", "Marriott", "Accor", "Four Seasons",
  "InterContinental", "Steigenberger", "Sunrise Resorts", "Jaz Hotels", "Movenpick",
];

export default async function HomePage() {
  const cms = await getCmsPage("home");
  return (
    <main className="min-h-screen bg-white">
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          HERO SECTION — Light institutional
          ═══════════════════════════════════════════ */}
      <section className="relative pt-[120px] pb-20 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8B0000]/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A227]/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B0000]/5 border border-[#8B0000]/10 text-[#8B0000] text-[11px] font-semibold uppercase tracking-[0.12em] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] animate-pulse" />
                Now Live in Egypt
              </div>

              <h1 className="text-[40px] md:text-[52px] lg:text-[56px] font-bold text-gray-900 leading-[1.08] tracking-[-0.02em]">
                {cms?.heroTitle || "The Intelligent Procurement Operating System for Egyptian Hospitality"}
              </h1>

              <p className="mt-5 text-[16px] md:text-[17px] text-gray-500 leading-relaxed max-w-lg">
                {cms?.heroDescription || "One platform connecting hotels, suppliers, logistics, and factoring — with AI-driven automation, real-time ETA compliance, and guaranteed payments."}
              </p>

              {/* Value props */}
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { icon: TrendingUp, text: "30% cost savings" },
                  { icon: Clock, text: "48h delivery" },
                  { icon: Zap, text: "80% less admin" },
                  { icon: ShieldCheck, text: "Guaranteed payments" },
                ].map((vp) => (
                  <span key={vp.text} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-[12px] font-medium text-gray-600">
                    <vp.icon className="w-3.5 h-3.5 text-[#8B0000]" />
                    {vp.text}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#6B0000] text-white text-[14px] font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Book a Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/solutions"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 text-[14px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Explore Platform
                </Link>
              </div>
            </div>

            {/* Right: Visual / Dashboard preview */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl border border-gray-200 shadow-2xl bg-white overflow-hidden">
                {/* Mock dashboard header */}
                <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="ml-4 flex-1 h-5 bg-gray-100 rounded-md" />
                </div>
                <div className="p-5 grid grid-cols-3 gap-3">
                  {/* Stat cards */}
                  {[
                    { label: "Monthly Spend", val: "EGP 2.4M", change: "+12%" },
                    { label: "Active Orders", val: "147", change: "+8" },
                    { label: "ETA Invoices", val: "98.2%", change: "+2.1%" },
                  ].map((card) => (
                    <div key={card.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{card.label}</p>
                      <p className="text-[18px] font-bold text-gray-900 mt-1">{card.val}</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-0.5">{card.change}</p>
                    </div>
                  ))}
                  {/* Chart area */}
                  <div className="col-span-3 h-32 rounded-xl bg-gradient-to-r from-[#8B0000]/5 to-[#C9A227]/5 border border-gray-100 flex items-end justify-around p-4 gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm bg-[#8B0000]/20" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  {/* Order rows */}
                  <div className="col-span-3 space-y-2">
                    {["Linen supplier — DELIVERED", "F&B order — IN TRANSIT", "Amenities — CONFIRMED"].map((order, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 bg-white">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[12px] text-gray-600 flex-1">{order}</span>
                        <span className="text-[11px] text-gray-400">EGP {(i + 1) * 12500}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl border border-gray-200 shadow-lg p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-900">Payment Guaranteed</p>
                  <p className="text-[10px] text-gray-400">Escrow secured via Paymob</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR — Dark contrast strip
          ═══════════════════════════════════════════ */}
      <section className="bg-[#0a0a0a] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[28px] md:text-[32px] font-bold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] font-semibold text-[#C9A227] uppercase tracking-wide">
                  {stat.label}
                </div>
                <div className="text-[11px] text-white/30 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ECOSYSTEM — Four-sided marketplace
          ═══════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#8B0000] uppercase tracking-[0.2em] mb-3">
              Four-Sided Ecosystem
            </p>
            <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 tracking-tight">
              Every Stakeholder.
              <br />
              <span className="text-gray-400">One Connected Platform.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ECOSYSTEM.map((item) => (
              <div
                key={item.title}
                className={`group p-7 rounded-2xl border ${item.color} bg-white hover:shadow-lg transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[17px] font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{item.desc}</p>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#8B0000] hover:gap-2 transition-all"
                    >
                      {item.cta}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CAPABILITIES — Alternating white
          ═══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#8B0000] uppercase tracking-[0.2em] mb-3">
              Platform Capabilities
            </p>
            <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 tracking-tight">
              Built for Scale.
              <br />
              <span className="text-gray-400">Engineered for Compliance.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="group p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#8B0000]/5 border border-[#8B0000]/10 flex items-center justify-center mb-4 group-hover:bg-[#8B0000]/10 transition-all">
                  <cap.icon className="w-5 h-5 text-[#8B0000]" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{cap.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — Dark strip
          ═══════════════════════════════════════════ */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#C9A227] uppercase tracking-[0.2em] mb-3">
              How It Works
            </p>
            <h2 className="text-[32px] md:text-[40px] font-bold text-white tracking-tight">
              From Registration to Delivery
              <br />
              <span className="text-white/40">in 4 Simple Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                <div className="p-6 rounded-2xl bg-[#111] border border-white/[0.06] h-full">
                  <div className="text-[48px] font-bold text-white/[0.06] leading-none mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-[16px] font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-[13px] text-white/40 leading-relaxed">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-white/[0.08]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUSTED BY — Light
          ═══════════════════════════════════════════ */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-6">
            Trusted by Egypt's Leading Hotel Chains
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST_SIGNALS.map((name) => (
              <span key={name} className="text-[14px] font-semibold text-gray-300 hover:text-gray-500 transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIAL / SOCIAL PROOF
          ═══════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Hotels Vendors cut our procurement admin by 80%. The AI reordering alone saves us 20 hours a week across 12 properties.",
                author: "Ahmed Hassan",
                role: "Procurement Director, Jaz Hotel Group",
                rating: 5,
              },
              {
                quote: "We went from WhatsApp orders to a fully automated system. ETA compliance is now zero-touch, and factoring keeps our cash flow healthy.",
                author: "Sara El-Masry",
                role: "CFO, Sunrise Resorts",
                rating: 5,
              },
              {
                quote: "As a supplier, the guaranteed payments and non-recourse factoring changed our business. We're growing 3x faster since joining.",
                author: "Khaled Ibrahim",
                role: "CEO, Nile Linens & Textiles",
                rating: 5,
              },
            ].map((t) => (
              <div key={t.author} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#C9A227] fill-[#C9A227]" />
                  ))}
                </div>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-5">"{t.quote}"</p>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">{t.author}</p>
                  <p className="text-[11px] text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA SECTION — Burgundy
          ═══════════════════════════════════════════ */}
      <section className="py-20 bg-[#8B0000]">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[32px] md:text-[44px] font-bold text-white tracking-tight">
            {cms?.ctaTitle || "Ready to Transform Your Hotel's Procurement?"}
          </h2>
          <p className="mt-4 text-[15px] text-white/60 max-w-xl mx-auto">
            {cms?.ctaDescription || "Join hundreds of hotels and suppliers already benefiting from smarter, faster, more transparent procurement across Egypt."}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#8B0000] text-[14px] font-semibold rounded-lg transition-colors hover:bg-gray-100"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white text-[14px] font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              Book a Demo
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-[12px] text-white/40">
            <span className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              No setup fees, no long-term commitments
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Onboard your full team in under 10 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              Full ETA e-invoicing from day one
            </span>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
