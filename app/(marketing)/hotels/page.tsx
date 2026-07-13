import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap, Building2, CreditCard, FileText, Users, TrendingUp, Package, Truck, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Hotels — B2B Procurement Platform | HotelsVendors",
  description: "Streamline hotel procurement. Access 500+ suppliers, fixed pricing, ETA-compliant invoicing, and Oliv factoring. Built for Egyptian hospitality.",
  openGraph: {
    title: "Hotels — B2B Procurement Platform | HotelsVendors",
    description: "Streamline hotel procurement. Access 500+ suppliers, fixed pricing, and ETA-compliant invoicing.",
    type: "website",
  },
};

const HOTEL_FEATURES = [
  {
    icon: Package,
    title: "Fixed-Price Catalog",
    desc: "Browse 10,000+ hospitality products with transparent, fixed pricing. No bidding wars. No hidden fees.",
    color: "#39ff7e",
  },
  {
    icon: FileText,
    title: "ETA-Compliant Invoicing",
    desc: "Every invoice is automatically submitted to the Egyptian Tax Authority. Zero manual work.",
    color: "#c455ff",
  },
  {
    icon: CreditCard,
    title: "Net-60 Payment Terms",
    desc: "Oliv finances your purchases. You get Net-60 terms while suppliers get paid in 48 hours.",
    color: "#ff7e1a",
  },
  {
    icon: Truck,
    title: "Shared-Route Logistics",
    desc: "Consolidate deliveries across properties. Cut logistics costs by up to 40%.",
    color: "#64b5f6",
  },
  {
    icon: Shield,
    title: "Authority Matrix",
    desc: "Multi-level approval chains based on order value, hotel hierarchy, and supplier tiers.",
    color: "#39ff7e",
  },
  {
    icon: Users,
    title: "Multi-Property Management",
    desc: "Manage procurement across all your properties from a single dashboard.",
    color: "#c455ff",
  },
];

const STATS = [
  { value: "500+", label: "Verified Suppliers", color: "#39ff7e" },
  { value: "10,000+", label: "Products Available", color: "#ff7e1a" },
  { value: "48h", label: "Supplier Payment", color: "#4A7C59" },
  { value: "40%", label: "Cost Savings", color: "#c455ff" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Browse & Order", desc: "Search the catalog, compare prices, and place purchase orders directly from your dashboard.", color: "#39ff7e" },
  { step: "2", title: "Track & Receive", desc: "Monitor order status in real-time. Confirm delivery and verify invoices automatically.", color: "#ff7e1a" },
  { step: "3", title: "Pay Later", desc: "Oliv finances the invoice. You pay in 60 days. Suppliers get paid in 48 hours.", color: "#4A7C59" },
];

export default function HotelsPage() {
  return (
    <main style={{ backgroundColor: "#0c0c12", color: "#ffffff", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(57,255,126,0.06) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6" style={{ borderColor: "#39ff7e22", backgroundColor: "#39ff7e08" }}>
            <Building2 size={12} style={{ color: "#39ff7e" }} />
            <span className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: "#39ff7e" }}>
              For Hotels & Property Groups
            </span>
          </div>
          <h1 className="text-[clamp(30px,5vw,52px)] font-semibold leading-[1.05] tracking-tight mb-5">
            Procurement That<br />
            <span style={{ color: "#39ff7e" }}>Pays for Itself</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl mx-auto leading-relaxed mb-8">
            Access 500+ verified suppliers, fixed pricing, and Net-60 payment terms.
            Every invoice is ETA-compliant. Every delivery is tracked. Every dollar is optimized.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register?type=hotel" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,126,0.25)]" style={{ backgroundColor: "#39ff7e", color: "#07090f" }}>
              Start Procuring <ArrowRight size={14} />
            </Link>
            <Link href="/marketplace" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-[28px] font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[12px] text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "#39ff7e" }}>Why Hotels Choose Us</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Built for Egyptian Hospitality</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOTEL_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl border border-white/[0.06] bg-[#12121a] p-6 hover:border-white/[0.10] transition-all group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${f.color}12`, border: `1px solid ${f.color}22` }}>
                    <Icon size={18} style={{ color: f.color }} />
                  </div>
                  <h3 className="text-[14px] font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-[13px] text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "#39ff7e" }}>How It Works</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">From Order to Payment in 3 Steps</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="relative rounded-2xl border bg-[#12121a] p-6" style={{ borderColor: `${s.color}22` }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-[18px] font-bold" style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}33`, color: s.color }}>
                  {s.step}
                </div>
                <h3 className="text-[15px] font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Ready to Transform Your Procurement?</h2>
          <p className="text-[14px] text-white/40 mb-8 max-w-md mx-auto">
            Join hotels already saving 40% on procurement costs. List your properties today,
            start ordering tomorrow.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register?type=hotel" className="inline-flex items-center gap-2 px-8 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,126,0.25)]" style={{ backgroundColor: "#39ff7e", color: "#07090f" }}>
              Start Procuring <ArrowRight size={14} />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
