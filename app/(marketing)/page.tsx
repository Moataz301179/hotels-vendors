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
      "Hotels Vendors — Egypt's First AI-Powered Hospitality Procurement Hub",
    description:
      cms?.metaDescription ||
      "The intelligent procurement platform for Egyptian hospitality. Cut costs by up to 30%. 48-hour delivery. Guaranteed payments. Full ETA compliance.",
  };
}

const STATS = [
  { value: "1,200+", label: "Verified Suppliers", sub: "Vetted & ETA-certified" },
  { value: "30%", label: "Avg Cost Savings", sub: "Across all categories" },
  { value: "48hr", label: "Delivery Guarantee", sub: "Nationwide Egypt" },
  { value: "80%", label: "Less Admin Work", sub: "Automated workflows" },
  { value: "100%", label: "ETA Compliant", sub: "Full e-invoicing" },
  { value: "50+", label: "Product Categories", sub: "All hospitality needs" },
];

const TRUSTED_BY = [
  "Pickalbatros",
  "Hilton",
  "Marriott",
  "Accor",
  "Four Seasons",
  "InterContinental",
  "Steigenberger",
  "Sunrise Resorts",
];

const CAPABILITIES = [
  {
    icon: Plug,
    title: "Easy System Integration",
    desc: "Plug into your existing PMS, ERP or POS in minutes. Pre-built connectors. No IT team required.",
  },
  {
    icon: Receipt,
    title: "ETA e-Invoicing Platform",
    desc: "Fully compliant with Egyptian Tax Authority. Automated e-invoice generation, signing and submission module.",
  },
  {
    icon: Bot,
    title: "AI-Powered Sourcing",
    desc: "Smart demand forecasting and automated reordering trained on hospitality data. Four seasons of optimization.",
  },
  {
    icon: Store,
    title: "Procurement Hub",
    desc: "50+ hospitality categories, 1,200+ verified suppliers — linens, F&B, electronics and more in one seamless platform.",
  },
  {
    icon: Banknote,
    title: "Invoice Factoring",
    desc: "Unlock cash flow with invoice factoring. Suppliers get paid early; hotels keep their net-30/60 payment terms.",
  },
  {
    icon: TrendingUp,
    title: "Spend Analytics",
    desc: "Real-time dashboards and procurement intelligence across all properties. Track, analyze, optimize.",
  },
];

const STEPS = [
  {
    num: "01",
    icon: UserPlus,
    title: "Create Your Account",
    desc: "Sign up as a hotel or supplier. Get verified and onboarded in under 24 hours.",
  },
  {
    num: "02",
    icon: Search,
    title: "Source & Compare",
    desc: "Browse products, compare supplier prices, and let AI recommend the best matches.",
  },
  {
    num: "03",
    icon: ClipboardList,
    title: "Place Orders",
    desc: "Order with guaranteed pricing, automated ETA e-invoicing, and secure escrow payments.",
  },
  {
    num: "04",
    icon: Package,
    title: "Receive in 48 Hours",
    desc: "Track deliveries in real-time anywhere in Egypt with our nationwide compliance network.",
  },
];

export default async function HomePage() {
  const cms = await getCmsPage("home");
  return (
    <main className="home-main min-h-screen bg-[#050505]">
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          HERO SECTION — Full bleed carousel
          ═══════════════════════════════════════════ */}
      <section className="home-hero relative min-h-screen flex items-center">
        <HeroCarousel />

        {/* Hero content overlay */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-[100px] pb-20 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="home-hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B0000]/90 text-white text-[11px] font-semibold uppercase tracking-[0.15em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              AI-Powered Platform
            </div>

            {/* Headline */}
            <h1 className="home-hero-h1 text-[42px] md:text-[64px] font-bold text-white leading-[1.05] tracking-[-0.02em]">
              {cms?.heroTitle || "Egypt's First AI-Powered Hospitality Procurement Hub"}
            </h1>

            {/* Subtitle */}
            <p className="home-hero-p mt-5 text-[16px] md:text-[18px] text-white/60 leading-relaxed max-w-lg">
              {cms?.heroDescription || "The Intelligent Procurement Platform for Egyptian Hospitality. Cut costs by up to 30%, 48-hour delivery, Guaranteed payments. Full ETA compliance."}
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
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-[14px] font-medium rounded-lg hover:bg-white/5 transition-colors"
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
      <section className="home-stats-section relative z-10 -mt-16 mx-auto max-w-6xl px-6">
        <div className="home-stats bg-[#0f0f0f] border border-white/[0.06] rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="home-stats-value text-[28px] md:text-[32px] font-bold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="home-stats-label mt-1 text-[11px] font-medium text-[#8B0000] uppercase tracking-wide">
                  {stat.label}
                </div>
                <div className="home-stats-sub text-[11px] text-white/30 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUSTED BY
          ═══════════════════════════════════════════ */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="home-trusted text-[12px] font-medium text-white/30 uppercase tracking-[0.15em]">
            Trusted by{" "}
            <span className="text-white/50">
              {TRUSTED_BY.join(", ")}
            </span>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PLATFORM CAPABILITIES
          ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="home-section-label text-[11px] font-semibold text-[#8B0000] uppercase tracking-[0.2em] mb-3">
              Platform Capabilities
            </p>
            <h2 className="home-section-heading text-[32px] md:text-[40px] font-bold text-white tracking-tight">
              Everything Your Hotel Needs.
              <br />
              <span className="text-white/40">In One Platform.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="home-card group p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.06] hover:border-white/[0.12] transition-all"
              >
                <div className="home-card-icon-bg w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4 group-hover:bg-[#8B0000]/10 group-hover:border-[#8B0000]/20 transition-all">
                  <cap.icon className="home-card-icon w-5 h-5 text-[#8B0000]" />
                </div>
                <h3 className="home-card-title text-[16px] font-semibold text-white mb-2">{cap.title}</h3>
                <p className="home-card-desc text-[13px] text-white/40 leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/[0.04] home-section-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="home-section-label text-[11px] font-semibold text-[#8B0000] uppercase tracking-[0.2em] mb-3">
              How It Works
            </p>
            <h2 className="home-section-heading text-[32px] md:text-[40px] font-bold text-white tracking-tight">
              From Sign-Up to Delivery
              <br />
              <span className="text-white/40">in 4 Simple Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                <div className="home-step-card p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.06] h-full">
                  <div className="home-step-num text-[48px] font-bold text-white/[0.06] leading-none mb-4">
                    {step.num}
                  </div>
                  <div className="home-step-icon-bg w-10 h-10 rounded-xl bg-[#8B0000]/10 flex items-center justify-center mb-4">
                    <step.icon className="home-step-icon w-5 h-5 text-[#8B0000]" />
                  </div>
                  <h3 className="home-step-title text-[16px] font-semibold text-white mb-2">{step.title}</h3>
                  <p className="home-step-desc text-[13px] text-white/40 leading-relaxed">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="home-step-line hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-white/[0.08]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="home-cta relative overflow-hidden rounded-3xl bg-[#0f0f0f] border border-white/[0.06] p-10 md:p-16 text-center">
            {/* Background glow */}
            <div className="home-cta-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B0000]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="home-cta-h2 text-[32px] md:text-[44px] font-bold text-white tracking-tight">
                {cms?.ctaTitle || "Ready to Transform Your Hotel's Procurement?"}
              </h2>
              <p className="home-cta-p mt-4 text-[15px] text-white/40 max-w-xl mx-auto">
                {cms?.ctaDescription || "Join hundreds of hotels and suppliers already benefiting from smarter, faster, more transparent procurement across Egypt."}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="home-cta-btn-primary inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#6B0000] text-white text-[14px] font-semibold rounded-lg transition-colors"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/register"
                  className="home-cta-btn-ghost inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-[14px] font-medium rounded-lg hover:bg-white/5 transition-colors"
                >
                  Book a Demo
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[12px] text-white/30">
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
