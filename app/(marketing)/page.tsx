import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  TrendingDown,
  Shield,
  Zap,
  Truck,
  Building2,
  ShoppingCart,
  Landmark,
  Package,
  BarChart3,
  FileCheck,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { MarketingNav } from "@/components/layout/marketing-nav";

export const metadata: Metadata = {
  title: "HotelsVendors — B2B Procurement for Egyptian Hospitality",
  description:
    "From F&B to capital equipment: track every dirham, automate every order, and get AI demand forecasting that prevents waste before it happens.",
};

/* ── Data ── */

const TRUST_BADGES = ["5-STAR", "BOUTIQUE", "RESORT", "BUSINESS"];

const STATS = [
  { value: "2,400+", label: "Hotels Onboarded", sub: "Across Egypt" },
  { value: "680+", label: "Verified Suppliers", sub: "Vetted & rated" },
  { value: "EGP 4.2B", label: "Annual GMV", sub: "Transactions processed" },
  { value: "36hr", label: "Avg. Delivery", sub: "From order to dock" },
  { value: "100%", label: "ETA Compliant", sub: "E-invoicing ready" },
  { value: "28%", label: "Cost Reduction", sub: "Average savings" },
];

const CAPABILITIES = [
  {
    icon: BarChart3,
    title: "AI Demand Forecasting",
    desc: "Predict consumption 14 days ahead. Reduce over-ordering by 34% and eliminate emergency purchases.",
  },
  {
    icon: Shield,
    title: "Authority Matrix",
    desc: "Multi-signature approval chains encoded into every PO. No bypass. No fraud. Full audit trail.",
  },
  {
    icon: FileCheck,
    title: "ETA E-Invoicing",
    desc: "Every invoice digitally signed and submitted to the Egyptian Tax Authority in real time. Zero manual work.",
  },
  {
    icon: Landmark,
    title: "Embedded Factoring",
    desc: "Suppliers get paid in 48 hours. Hotels keep 90-day terms. The platform bridges the gap.",
  },
  {
    icon: Truck,
    title: "Shared Logistics",
    desc: "Coastal cluster consolidation routes cut delivery costs by 40%. One truck, multiple hotels.",
  },
  {
    icon: Zap,
    title: "Auto Reorder",
    desc: "Set par levels once. The system generates purchase orders before you run out. Never stockout again.",
  },
];

const WORKFLOW = [
  {
    num: "01",
    title: "Connect Your Properties",
    desc: "Link all hotel outlets in one dashboard. Set approval thresholds per department and property.",
  },
  {
    num: "02",
    title: "Browse Verified Suppliers",
    desc: "Access 680+ vetted suppliers across F&B, housekeeping, engineering, and capital equipment.",
  },
  {
    num: "03",
    title: "AI Optimizes Every Order",
    desc: "The system suggests quantities, picks the best supplier, and routes for approval automatically.",
  },
  {
    num: "04",
    title: "Track & Settle",
    desc: "Real-time delivery tracking, automatic ETA invoicing, and embedded payment settlement.",
  },
];

const STAKEHOLDERS = [
  {
    icon: Building2,
    title: "For Hotels",
    desc: "Cut procurement costs by 28%. Eliminate stockouts. Enforce spend governance across every property.",
    cta: "See Hotel Features",
    href: "/hotels",
  },
  {
    icon: ShoppingCart,
    title: "For Suppliers",
    desc: "Access 2,400+ hotel buyers. Get paid in 48 hours. Grow your B2B hospitality revenue.",
    cta: "Become a Supplier",
    href: "/become-supplier",
  },
  {
    icon: Truck,
    title: "For Logistics",
    desc: "Optimize coastal routes. Fill deadhead miles. Earn per-kilometer on shared delivery networks.",
    cta: "Join the Network",
    href: "/register?role=shipping",
  },
  {
    icon: Landmark,
    title: "For Factoring",
    desc: "Access verified hospitality receivables. Non-recourse factoring with full transaction transparency.",
    cta: "Partner With Us",
    href: "/register?role=factoring",
  },
];

/* ── Mini BarChart for hero stat card ── */
function MiniBarChart() {
  const bars = [35, 55, 40, 65, 50, 85, 45];
  return (
    <div className="flex items-end gap-1.5 h-16 mt-4">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{
            height: `${h}%`,
            background: i === 5 ? "var(--accent-base)" : "rgba(255,255,255,0.08)",
          }}
        />
      ))}
    </div>
  );
}

/* ── Page ── */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A]">
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--accent-base)]/30 text-[var(--accent-base)] text-[11px] font-semibold uppercase tracking-[0.12em] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-base)] animate-pulse" />
                B2B Procurement Egypt
              </div>

              <h1 className="text-[32px] md:text-[48px] lg:text-[52px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
                Control Your Hotel's
                <br />
                Supply Chain{" "}
                <span className="text-[var(--accent-base)]">Before It Controls You.</span>
              </h1>

              <p className="mt-6 text-[15px] md:text-[16px] text-gray-400 leading-relaxed max-w-lg">
                From F&B to capital equipment: track every dirham, automate every order,
                and get AI demand forecasting that prevents waste before it happens.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="btn-accent text-[14px] py-3 px-6"
                >
                  Start Free — No Credit Card
                </Link>
                <button className="inline-flex items-center gap-2 text-[14px] font-medium text-gray-400 hover:text-white transition-colors">
                  <span className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                  </span>
                  Watch How It Works
                </button>
              </div>

              {/* Trust bar */}
              <div className="mt-10 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 uppercase tracking-wide">
                <span>Trusted by hotels across Egypt</span>
                {TRUST_BADGES.map((badge) => (
                  <span key={badge} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[var(--accent-base)]" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Stat Card */}
            <div className="lg:justify-self-end w-full max-w-md">
              <div className="surface-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[32px] font-bold text-[var(--accent-base)] metric-value">
                      EGP 180K
                    </div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-wide mt-1">
                      Annual Waste Saved
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[28px] font-bold text-[var(--accent-base)] metric-value">
                      ~20%
                    </div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-wide mt-1">
                      Spoilage Reduced
                    </div>
                  </div>
                </div>
                <MiniBarChart />
                <div className="flex items-center justify-between mt-3 text-[12px]">
                  <span className="text-gray-500">Projected</span>
                  <span className="text-[var(--accent-base)] font-medium">Actual up 12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════ */}
      <section className="border-y border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[24px] md:text-[28px] font-bold text-white tracking-tight metric-value">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] font-medium text-[var(--accent-base)] uppercase tracking-wide">
                  {stat.label}
                </div>
                <div className="text-[11px] text-gray-600 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE REALITY
          ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-[var(--accent-base)] text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">
              The Reality
            </p>
            <h2 className="text-[26px] md:text-[36px] font-bold text-white tracking-tight max-w-3xl mx-auto leading-[1.2]">
              Egyptian Hotels Work With Hundreds of Suppliers.
              <br />
              <span className="text-gray-500">And Still Run Out of Stock Before They Run Out of Month.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: TrendingDown,
                stat: "32%",
                label: "Average Over-Ordering",
                desc: "Hotels order 32% more than needed to avoid stockouts. The excess spoils or expires.",
              },
              {
                icon: Clock,
                stat: "14 Days",
                label: "Payment Delay",
                desc: "Suppliers wait an average of 14-30 days. Many refuse to serve hotels without cash upfront.",
              },
              {
                icon: Package,
                stat: "8+ Hours",
                label: "Weekly Procurement Time",
                desc: "Kitchen managers, engineers, and housekeepers spend hours calling suppliers instead of running operations.",
              },
            ].map((item) => (
              <div key={item.label} className="surface-card p-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent-base)]/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-5 h-5 text-[var(--accent-base)]" />
                </div>
                <div className="text-[36px] font-bold text-white metric-value">{item.stat}</div>
                <div className="text-[13px] font-semibold text-gray-300 mt-1">{item.label}</div>
                <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PLATFORM PREVIEW — Screenshot
          ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-24 border-y border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold text-[var(--accent-base)] uppercase tracking-[0.2em] mb-3">
              Platform Preview
            </p>
            <h2 className="text-[26px] md:text-[36px] font-bold text-white tracking-tight">
              One Dashboard. Every Order. Zero Chaos.
            </h2>
          </div>
          <div className="relative rounded-2xl border border-white/8 overflow-hidden bg-[#080c14]">
            <Image
              src="/user-screenshot2.png"
              alt="HotelsVendors Platform Dashboard"
              width={2880}
              height={1800}
              className="w-full h-auto"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CAPABILITIES
          ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[var(--accent-base)] uppercase tracking-[0.2em] mb-3">
              Platform Capabilities
            </p>
            <h2 className="text-[26px] md:text-[36px] font-bold text-white tracking-tight">
              Built for Egyptian Hospitality.
              <br />
              <span className="text-gray-500">Not a generic marketplace.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="surface-card p-6 group hover:border-[var(--accent-base)]/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent-base)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent-base)]/15 transition-all">
                  <cap.icon className="w-5 h-5 text-[var(--accent-base)]" />
                </div>
                <h3 className="text-[15px] font-semibold text-white mb-2">{cap.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 border-y border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[var(--accent-base)] uppercase tracking-[0.2em] mb-3">
              How It Works
            </p>
            <h2 className="text-[26px] md:text-[36px] font-bold text-white tracking-tight">
              From Setup to First Order
              <br />
              <span className="text-gray-500">In Under 48 Hours.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW.map((step, i) => (
              <div key={step.num} className="relative">
                <div className="surface-card p-6 h-full">
                  <div className="text-[44px] font-bold text-white/[0.06] leading-none mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-[15px] font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-white/8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STAKEHOLDERS
          ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[var(--accent-base)] uppercase tracking-[0.2em] mb-3">
              For Every Stakeholder
            </p>
            <h2 className="text-[26px] md:text-[36px] font-bold text-white tracking-tight">
              Four Sides. One Platform.
              <br />
              <span className="text-gray-500">Everyone Wins.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {STAKEHOLDERS.map((s) => (
              <div
                key={s.title}
                className="surface-card p-6 flex flex-col sm:flex-row sm:items-start gap-5 group hover:border-[var(--accent-base)]/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent-base)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--accent-base)]/15 transition-all">
                  <s.icon className="w-6 h-6 text-[var(--accent-base)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] font-semibold text-white mb-1">{s.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{s.desc}</p>
                  <Link
                    href={s.href}
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--accent-base)] hover:text-[var(--accent-light)] transition-colors"
                  >
                    {s.cta}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="surface-card p-10 md:p-16 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-[28px] md:text-[38px] font-bold text-white tracking-tight leading-[1.15]">
                Stop Leaking Money Into Your Supply Chain.
              </h2>
              <p className="mt-4 text-[15px] text-gray-500 leading-relaxed">
                Join 2,400+ Egyptian hotels that have turned procurement from a cost center into a competitive advantage.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="btn-accent text-[14px] py-3 px-7"
                >
                  Start Free — No Credit Card
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/register"
                  className="btn-ghost text-[14px] py-3 px-7"
                >
                  Schedule a Demo
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-[12px] text-gray-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-base)]" />
                  Free forever for hotels under 50 rooms
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-base)]" />
                  Full ETA compliance from day one
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.04] bg-[#080c14]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <BrandLogo variant="dark" size="sm" />
                <span className="text-[14px] font-bold text-white tracking-tight">
                  HotelsVendors
                </span>
              </div>
              <p className="text-[12px] text-gray-600 leading-relaxed max-w-xs">
                Egypt's B2B procurement operating system for hospitality. AI-powered, fully compliant, built for scale.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Platform
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Solutions", href: "/solutions" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "Marketplace", href: "/marketplace" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-[13px] text-gray-500 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stakeholders */}
            <div>
              <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Stakeholders
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Hotels", href: "/hotels" },
                  { label: "Suppliers", href: "/become-supplier" },
                  { label: "Logistics", href: "/register?role=shipping" },
                  { label: "Factoring", href: "/register?role=factoring" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-[13px] text-gray-500 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "About", href: "/about" },
                  { label: "Sign In", href: "/login" },
                  { label: "Get Started", href: "/register" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-[13px] text-gray-500 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.04] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-gray-600">
              &copy; {new Date().getFullYear()} HotelsVendors. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[12px] text-gray-600">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[var(--accent-base)]" />
                Bank-grade security
              </span>
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[var(--accent-base)]" />
                ETA compliant
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
