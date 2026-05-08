import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  ShoppingCart,
  Truck,
  Landmark,
  FileCheck,
  ShieldCheck,
  BrainCircuit,
  UtensilsCrossed,
  Bath,
  Shirt,
  Wrench,
  BedDouble,
  Monitor,
  CheckCircle2,
  Star,
  Clock,
  TrendingDown,
  BarChart3,
  Zap,
  Lock,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { OurClientsSection } from "@/components/marketing/our-clients";

export const metadata: Metadata = {
  title: "Hotels Vendors — Digital Procurement Hub for Egyptian Hospitality",
  description:
    "The intelligent procurement platform for Egyptian hospitality. Connect hotels, suppliers, logistics, and finance in one ETA-compliant ecosystem.",
};

const STATS = [
  { value: "10,000+", label: "SKUs", sub: "Hospitality-specific taxonomy" },
  { value: "1,200+", label: "Verified Suppliers", sub: "Across industrial clusters" },
  { value: "2.4B EGP", label: "Annual GMV", sub: "Processed through the platform" },
  { value: "48h", label: "Delivery", sub: "To Red Sea and North Coast" },
];

const CATEGORIES = [
  {
    icon: UtensilsCrossed,
    name: "Food & Beverage",
    count: "240+ products",
    description: "Dry goods, fresh produce, beverages, and specialty ingredients from 6th of October and 10th of Ramadan industrial zones.",
    suppliers: "Al-Waha, Delta Fresh, Nile Packers",
  },
  {
    icon: Bath,
    name: "Housekeeping",
    count: "180+ products",
    description: "Industrial cleaning chemicals, equipment, and consumables. ISO 9001-certified suppliers only.",
    suppliers: "CleanMax, HygienePro, Sparkle Egypt",
  },
  {
    icon: Shirt,
    name: "Linens & Textiles",
    count: "120+ products",
    description: "Egyptian long-staple cotton, terry towels, bed sheets, and uniform fabrics direct from Mahalla and Damietta mills.",
    suppliers: "Cotton House, Textile One, LinenCo",
  },
  {
    icon: Wrench,
    name: "Engineering & Maintenance",
    count: "200+ products",
    description: "Pool chemicals, HVAC filters, electrical supplies, and tools. Capital equipment with installation support.",
    suppliers: "EngiPro, PowerFlow, AquaTech",
  },
  {
    icon: BedDouble,
    name: "Room Amenities",
    count: "150+ products",
    description: "Toiletries, guestroom accessories, minibar items, and welcome gifts. Custom white-label branding available.",
    suppliers: "GuestCare, Amenities Plus, LuxePack",
  },
  {
    icon: Monitor,
    name: "IT & Technology",
    count: "90+ products",
    description: "POS hardware, Wi-Fi infrastructure, smart room systems, and hospitality cybersecurity solutions.",
    suppliers: "TechHub, SmartHotel, NetSecure",
  },
];

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Sourcing",
    description: "Demand forecasting, price benchmarking, and reorder alerts trained on Egyptian hospitality seasonality patterns.",
  },
  {
    icon: TrendingDown,
    title: "30% Cost Reduction",
    description: "Fixed-price catalog governance eliminates price volatility. Bulk consolidation and shared logistics reduce freight by 35%.",
  },
  {
    icon: Clock,
    title: "48-Hour Delivery",
    description: "Multi-hotel load consolidation to coastal clusters. Temperature-controlled fleet with real-time GPS tracking.",
  },
  {
    icon: Landmark,
    title: "Non-Recourse Factoring",
    description: "Suppliers receive payment in 24 hours. Hotels retain standard terms. Zero default risk for suppliers.",
  },
  {
    icon: FileCheck,
    title: "Real-Time ETA E-Invoicing",
    description: "Every invoice automatically submitted to the Egyptian Tax Authority with digital signature and UUID validation.",
  },
  {
    icon: ShieldCheck,
    title: "Authority Matrix Governance",
    description: "Database-driven multi-level approval chains. EGP 25K → Manager. EGP 100K → Controller. EGP 500K+ → dual admin.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Discover",
    description: "Browse 10,000+ SKUs across six hospitality categories. Filter by supplier tier, industrial zone, and stock status.",
  },
  {
    number: "02",
    title: "Order",
    description: "Build purchase orders with automatic Authority Matrix routing. Payment guarantee and embedded factoring at checkout.",
  },
  {
    number: "03",
    title: "Fulfill",
    description: "Track delivery via shared-route manifest. Confirm receipt, auto-generate ETA invoice, reconcile in one flow.",
  },
];

const METRICS = [
  { value: "200+", label: "Hotels Onboarded" },
  { value: "6", label: "Coastal Clusters" },
  { value: "48h", label: "Avg. Delivery Time" },
  { value: "99.7%", label: "ETA Success Rate" },
];

const PRICING = [
  {
    name: "Starter",
    description: "Independent hotels and boutique properties",
    price: "Free",
    period: "",
    features: ["Up to 3 users", "50 orders/month", "Standard catalog", "Basic reporting", "Email support"],
    cta: "Register Now",
    highlighted: false,
  },
  {
    name: "Professional",
    description: "Mid-size hotel groups (3–15 properties)",
    price: "EGP 4,500",
    period: "/month",
    features: ["Unlimited users & orders", "Priority support (4h SLA)", "Embedded factoring", "Advanced analytics", "API & webhook access", "Authority Matrix config"],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "International chains and large groups",
    price: "Custom",
    period: "",
    features: ["Dedicated account manager", "ERP integrations (Opera, SAP)", "SLA with penalties", "White-label portal", "On-premise option", "Co-selling terms"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const TRUST_LOGOS = [
  "Marriott International",
  "Four Seasons",
  "Hilton",
  "Mövenpick",
  "Steigenberger",
  "Pickalbatros",
  "Sunrise Resorts",
  "Baron Group",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <MarketingNav />

      {/* ─── HERO ─── Dark Premium */}
      <section className="relative bg-[#0a0a12] pt-[88px] pb-16 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Text */}
            <div>
              <p className="text-[11px] font-semibold text-[#8B0A1E] tracking-[0.18em] uppercase mb-4">
                Digital Procurement Infrastructure
              </p>
              <h1 className="text-[30px] md:text-[36px] lg:text-[40px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
                The Intelligent Procurement Platform for{" "}
                <span className="text-[#8B0A1E]">Egyptian Hospitality</span>
              </h1>
              <p className="mt-4 text-[15px] text-white/50 leading-[1.7] max-w-lg">
                Connect hotels, suppliers, logistics, and finance in one
                ETA-compliant ecosystem.{" "}
                <span className="text-white/70">
                  Reduce costs, eliminate friction, and guarantee performance.
                </span>
              </p>

              {/* USP pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  { icon: BrainCircuit, label: "AI Sourcing" },
                  { icon: TrendingDown, label: "30% Savings" },
                  { icon: Clock, label: "48h Delivery" },
                  { icon: Landmark, label: "Non-Recourse Factoring" },
                  { icon: FileCheck, label: "ETA E-Invoicing" },
                ].map((usp) => (
                  <span
                    key={usp.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-medium text-white/60"
                  >
                    <usp.icon className="w-3 h-3 text-[#8B0A1E]" />
                    {usp.label}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold bg-white text-[#0a0a12] rounded-lg hover:bg-white/90 transition-colors"
                >
                  Onboard Your Organization
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold border border-white/15 text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  Explore Marketplace
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-8">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[20px] font-bold text-white tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-[11px] text-white/25">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Carousel */}
            <div className="h-[360px] md:h-[420px] lg:h-[480px]">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── Light Gray */}
      <section className="bg-[#f5f5f7] border-y border-black/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="text-center text-[10px] font-semibold text-black/30 uppercase tracking-[0.15em] mb-3">
            Trusted by Egypt&apos;s leading hotel groups
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {TRUST_LOGOS.map((logo) => (
              <span
                key={logo}
                className="text-[12px] font-semibold text-black/20 hover:text-black/45 transition-colors cursor-default"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR CLIENTS ─── Real Hotels */}
      <OurClientsSection />

      {/* ─── CATEGORY DISCOVERY ─── White */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <p className="text-[11px] font-semibold text-[#8B0A1E] tracking-[0.18em] uppercase mb-3">
              Procurement Marketplace
            </p>
            <h2 className="text-[24px] md:text-[28px] font-bold text-black tracking-[-0.02em]">
              Source by Hospitality Category
            </h2>
            <p className="mt-2 text-[14px] text-black/40 max-w-lg">
              Six verticals with verified suppliers from 6th of October, 10th of
              Ramadan, and Damietta industrial clusters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="group p-5 rounded-xl bg-white border border-black/[0.08] hover:border-black/[0.15] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[#8B0A1E]/[0.06] flex items-center justify-center mb-4 group-hover:bg-[#8B0A1E]/[0.10] transition-colors">
                  <cat.icon className="w-5 h-5 text-[#8B0A1E]" />
                </div>
                <h3 className="text-[15px] font-semibold text-black mb-0.5">
                  {cat.name}
                </h3>
                <p className="text-[11px] font-medium text-black/30 mb-3">
                  {cat.count}
                </p>
                <p className="text-[13px] text-black/45 leading-relaxed mb-3">
                  {cat.description}
                </p>
                <p className="text-[11px] text-black/25">
                  Suppliers: {cat.suppliers}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLATFORM FEATURES ─── Dark */}
      <section id="platform" className="py-20 bg-[#0a0a12] border-y border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <p className="text-[11px] font-semibold text-[#8B0A1E] tracking-[0.18em] uppercase mb-3">
              Platform Capabilities
            </p>
            <h2 className="text-[24px] md:text-[28px] font-bold text-white tracking-[-0.02em]">
              Infrastructure, not features
            </h2>
            <p className="mt-2 text-[14px] text-white/35 max-w-lg">
              Every capability is governed, auditable, and tenant-scoped. No
              workarounds. No manual processes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center mb-3">
                  <feature.icon className="w-4 h-4 text-white/50" />
                </div>
                <h3 className="text-[14px] font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-[13px] text-white/30 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── Light Gray */}
      <section className="py-20 bg-[#f5f5f7]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <p className="text-[11px] font-semibold text-[#8B0A1E] tracking-[0.18em] uppercase mb-3">
              Procurement Flow
            </p>
            <h2 className="text-[24px] md:text-[28px] font-bold text-black tracking-[-0.02em]">
              From catalog to delivery in three steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-[1px] bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />

            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <div className="w-20 h-20 rounded-xl bg-white border border-black/[0.08] flex flex-col items-center justify-center mb-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  <span className="text-[9px] font-bold text-[#8B0A1E] tracking-wider">
                    STEP
                  </span>
                  <span className="text-[24px] font-bold text-black leading-none mt-0.5">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-black mb-2">
                  {step.title}
                </h3>
                <p className="text-[13px] text-black/40 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── METRICS BANNER ─── Dark */}
      <section className="py-16 bg-[#0a0a12] border-y border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {METRICS.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-[28px] md:text-[36px] font-bold text-white tracking-tight">
                  {metric.value}
                </p>
                <p className="text-[11px] font-medium text-white/35 uppercase tracking-wider mt-1">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── White */}
      <section id="pricing" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <p className="text-[11px] font-semibold text-[#8B0A1E] tracking-[0.18em] uppercase mb-3">
              Pricing
            </p>
            <h2 className="text-[24px] md:text-[28px] font-bold text-black tracking-[-0.02em]">
              Transparent, usage-based pricing
            </h2>
            <p className="mt-2 text-[14px] text-black/40 max-w-lg">
              No setup fees. Platform fee of 1.5–2.5% per completed order applies
              to all tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {PRICING.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-xl p-5 transition-all duration-300 ${
                  tier.highlighted
                    ? "bg-[#8B0A1E]/[0.04] border-2 border-[#8B0A1E]/25"
                    : "bg-white border border-black/[0.08] hover:border-black/[0.12] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#8B0A1E] text-[10px] font-bold text-white uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <p className="text-[11px] font-semibold text-black/35 uppercase tracking-wider mb-1.5">
                  {tier.name}
                </p>
                <p className="text-[13px] text-black/40 mb-4">
                  {tier.description}
                </p>
                <div className="mb-5">
                  <span className="text-[32px] font-bold text-black tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-[13px] text-black/35">{tier.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-[13px] text-black/50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B0A1E] flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${
                    tier.highlighted
                      ? "bg-[#8B0A1E] text-white hover:bg-[#6B0512]"
                      : "bg-black/[0.03] text-black hover:bg-black/[0.06] border border-black/[0.08]"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-[12px] text-black/25">
            Need a procurement audit?{" "}
            <Link href="/about" className="text-[#8B0A1E] hover:underline">
              Schedule a consultation
            </Link>
          </p>
        </div>
      </section>

      {/* ─── FINAL CTA ─── Dark */}
      <section className="py-20 bg-[#0a0a12] border-y border-white/[0.06]">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-[24px] md:text-[28px] font-bold text-white tracking-[-0.02em] mb-3">
            Ready to replace WhatsApp and Excel?
          </h2>
          <p className="text-[14px] text-white/35 leading-relaxed mb-8 max-w-md mx-auto">
            Join 200+ hotels already operating on structured procurement with
            native ETA compliance. Onboard in under 48 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold bg-white text-[#0a0a12] rounded-lg hover:bg-white/90 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold border border-white/15 text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Speak to an Account Manager
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
