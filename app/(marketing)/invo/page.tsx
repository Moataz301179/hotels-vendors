import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  ShieldCheck,
  Clock,
  TrendingUp,
  FileCheck,
  Check,
  Zap,
  Receipt,
  Building2,
  Search,
  Package,
  Layers,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { InvoNav } from "@/components/invo/invo-nav";
import { InvoFooter } from "@/components/invo/invo-footer";

export const metadata: Metadata = {
  title: "INVO — Supplier Marketplace & Growth Platform",
  description:
    "List your products on Egypt's largest hospitality procurement network. Monthly subscription plans for verified suppliers. Featured listings, analytics, and ETA-compliant invoicing.",
};

const FEATURES = [
  {
    icon: Package,
    title: "Product Catalog",
    desc: "List your products and reach every hotel on the network. Fixed-price listings with volume tiers and bulk discounts.",
  },
  {
    icon: TrendingUp,
    title: "Featured Listings",
    desc: "Promote your best products with featured placement. Get seen first by procurement managers across Egypt's top hotels.",
  },
  {
    icon: BarChart3,
    title: "Supplier Analytics",
    desc: "Track product views, inquiries, and conversion rates. Data-driven insights to optimize your catalog performance.",
  },
  {
    icon: FileCheck,
    title: "ETA Compliance Built-In",
    desc: "Every invoice digitally signed and submitted to the Egyptian Tax Authority automatically. Zero manual work from your side.",
  },
];

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Choose Your Plan",
    desc: "Pick a tier that fits your business — Starter (free), Professional, or Enterprise. No commission, just a flat monthly fee.",
  },
  {
    num: "02",
    title: "List Your Products",
    desc: "Upload your catalog with images, specs, and pricing. Your products go live to every hotel on the network instantly.",
  },
  {
    num: "03",
    title: "Get Discovered",
    desc: "Procurement managers browse, search, and order from your catalog. Featured listings get priority placement.",
  },
  {
    num: "04",
    title: "Grow Your Reach",
    desc: "Track performance, optimize listings, and upgrade your plan as you scale. Egypt's hospitality market at your fingertips.",
  },
];

const PLANS = [
  {
    tier: "Starter",
    price: "0",
    period: "/mo",
    desc: "For suppliers starting out on the network",
    features: [
      "Up to 10 products",
      "50 orders/month",
      "2 user accounts",
      "Basic analytics",
      "Email support",
      "Standard placement",
    ],
    cta: "Get Started Free",
    featured: false,
  },
  {
    tier: "Professional",
    price: "2,500",
    period: "/mo",
    desc: "For active suppliers scaling their reach",
    features: [
      "Up to 100 products",
      "Unlimited orders",
      "10 user accounts",
      "Featured listings",
      "Priority support",
      "Advanced analytics",
      "API access",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    tier: "Enterprise",
    price: "8,000",
    period: "/mo",
    desc: "For established suppliers with high volume",
    features: [
      "Unlimited products",
      "Unlimited orders",
      "Unlimited users",
      "Featured listings",
      "Dedicated account manager",
      "Custom branding",
      "API access",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

const CATEGORIES = [
  { name: "F&B", desc: "Food, beverages & kitchen supplies", count: "2,400+" },
  { name: "Consumables", desc: "Cleaning chemicals & disposables", count: "1,800+" },
  { name: "Guest Supplies", desc: "Amenities & room accessories", count: "1,200+" },
  { name: "FF&E", desc: "Furniture, fixtures & equipment", count: "900+" },
  { name: "Services", desc: "Maintenance, laundry & more", count: "400+" },
];

export default function InvoMarketplacePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <InvoNav />

      {/* ═══ HERO WITH SEARCH ═══ */}
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-24 overflow-hidden hero-glow-gold">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-[#D4A843]/[0.04] rounded-full blur-[150px] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(212,168,67,0.15)] bg-[rgba(212,168,67,0.04)] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse" />
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#D4A843]">
                INVO Marketplace Engine
              </span>
            </div>

            <h1 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-tight text-white font-medium">
              List Your Products.
              <span className="block text-[#D4A843">Reach Every Hotel.</span>
            </h1>

            <p className="mt-6 text-[16px] text-white/45 leading-relaxed max-w-xl">
              INVO is the supplier marketplace engine for Egypt&apos;s largest hospitality
              procurement network. List your catalog, choose a subscription plan, and
              start selling to hotels across the Red Sea corridor.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#D4A843] text-black text-[15px] font-medium rounded-xl hover:bg-[#e0b856] transition-all hover:shadow-[0_0_30px_rgba(212,168,67,0.2)]"
              >
                List Your Products
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center gap-2 px-6 py-4 text-[14px] font-medium text-white/50 border border-white/[0.08] rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                View Plans
              </Link>
            </div>

            {/* Quick search */}
            <div className="mt-10 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  placeholder="Search products, categories, suppliers..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-[14px] text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#D4A843]/30 transition-colors"
                />
              </div>
              <div className="flex items-center gap-3 mt-3 text-[12px] text-white/25">
                <span>Popular:</span>
                {["Bed Linen", "Olive Oil", "Cleaning Supplies", "Towels"].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] cursor-pointer hover:text-white/40 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORY BROWSING ═══ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-xl mb-12">
            <p className="label-upper mb-4">Browse by Category</p>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white">
              Everything your hotel needs,
              <br />
              <span className="text-[#D4A843]">organized for you.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/marketplace?category=${cat.name.toLowerCase()}`}
                className="surface-card p-6 hover-lift text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-[rgba(212,168,67,0.08)] border border-[rgba(212,168,67,0.12)] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5 text-[#D4A843]" />
                </div>
                <h3 className="text-[15px] text-white mb-1 font-medium">{cat.name}</h3>
                <p className="text-[12px] text-white/30 mb-2">{cat.desc}</p>
                <span className="text-[11px] text-[#D4A843]/60">{cat.count} products</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══ FEATURES ═══ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-xl mb-12">
            <p className="label-upper mb-4">Why INVO</p>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white">
              The marketplace engine for
              <br />
              <span className="text-[#D4A843]">Egyptian hospitality.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="surface-card p-7 hover-lift group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4A843]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex items-start gap-5">
                  <div className="w-11 h-11 rounded-xl bg-[rgba(212,168,67,0.08)] border border-[rgba(212,168,67,0.12)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <f.icon className="w-5 h-5 text-[#D4A843]" />
                  </div>
                  <div>
                    <h3 className="text-[17px] text-white mb-2 tracking-tight font-medium">{f.title}</h3>
                    <p className="text-[14px] text-white/40 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══ SUBSCRIPTION PLANS COMPARISON ═══ */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="label-upper mb-4">Pricing</p>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white">
              Simple, transparent plans.
              <br />
              <span className="text-[#D4A843">No hidden fees.</span>
            </h2>
            <p className="mt-4 text-[15px] text-white/35 max-w-lg mx-auto">
              Flat monthly subscription. No commission on sales. Upgrade or cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {PLANS.map((p) => (
              <div
                key={p.tier}
                className={`surface-card p-7 flex flex-col hover-lift ${
                  p.featured ? "border-[rgba(212,168,67,0.3)] ring-1 ring-[rgba(212,168,67,0.15)]" : ""
                }`}
              >
                {p.featured && (
                  <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#D4A843] mb-3">
                    Most Popular
                  </div>
                )}
                <h3 className="text-[18px] text-white tracking-tight font-medium">{p.tier}</h3>
                <div className="mt-4 mb-1">
                  <span className="text-[36px] text-white tracking-tight font-medium">
                    {p.price === "0" ? "Free" : `EGP ${p.price}`}
                  </span>
                  <span className="text-[14px] text-white/30">{p.period}</span>
                </div>
                <p className="text-[13px] text-white/30 mb-6">{p.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-[13px] text-white/50">
                      <Check className="w-4 h-4 text-[#D4A843] shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.tier === "Enterprise" ? "/contact" : "/register"}
                  className={`block text-center py-3 rounded-xl text-[14px] font-medium transition-all ${
                    p.featured
                      ? "bg-[#D4A843] text-black hover:bg-[#e0b856] hover:shadow-[0_0_30px_rgba(212,168,67,0.2)]"
                      : "border border-white/[0.08] text-white/50 hover:bg-white/[0.04]"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-[16px] text-white font-medium mb-6 text-center">Plan Comparison</h3>
            <div className="surface-card overflow-hidden">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-3.5 px-4 text-white/40 font-medium">Feature</th>
                    <th className="text-center py-3.5 px-4 text-white/60 font-medium">Starter</th>
                    <th className="text-center py-3.5 px-4 text-[#D4A843] font-medium">Professional</th>
                    <th className="text-center py-3.5 px-4 text-white/60 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Monthly Price", values: ["Free", "EGP 2,500", "EGP 8,000"] },
                    { label: "Products", values: ["10 max", "100 max", "Unlimited"] },
                    { label: "Orders/month", values: ["50", "Unlimited", "Unlimited"] },
                    { label: "User accounts", values: ["2", "10", "Unlimited"] },
                    { label: "Featured listings", values: ["—", "✓", "✓"] },
                    { label: "Advanced analytics", values: ["—", "✓", "✓"] },
                    { label: "API access", values: ["—", "✓", "✓"] },
                    { label: "Custom branding", values: ["—", "—", "✓"] },
                    { label: "Dedicated manager", values: ["—", "—", "✓"] },
                    { label: "SLA guarantee", values: ["—", "—", "✓"] },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-white/[0.04]">
                      <td className="py-3 px-4 text-white/60">{row.label}</td>
                      {row.values.map((v, i) => (
                        <td key={i} className={`text-center py-3 px-4 ${
                          v === "✓" ? "text-[#D4A843]" : v === "—" ? "text-white/20" : "text-white/40"
                        }`}>
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══ CTA — List Your Products ═══ */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white font-medium">
            Ready to list your products?
            <br />
            <span className="text-[#D4A843">Start free. Upgrade when you grow.</span>
          </h2>
          <p className="mt-5 text-[16px] text-white/35 leading-relaxed mb-10 max-w-lg mx-auto">
            Join hundreds of verified suppliers on Egypt&apos;s fastest-growing hospitality
            procurement network. No commission. No hidden fees.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4A843] text-black text-[15px] font-medium rounded-xl hover:bg-[#e0b856] transition-all hover:shadow-[0_0_30px_rgba(212,168,67,0.2)]"
            >
              List Your Products
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-4 text-[14px] font-medium text-white/40 border border-white/[0.08] rounded-xl hover:bg-white/[0.04] transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

      <InvoFooter />
    </div>
  );
}
