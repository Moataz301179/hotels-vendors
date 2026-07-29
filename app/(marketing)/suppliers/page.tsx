import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap, Store, CreditCard, Clock, Factory, Truck, Users, TrendingUp, Landmark, RefreshCw, ExternalLink, Package } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl("/suppliers") },
  title: "Suppliers — Sell to Hotels | HotelsVendors",
  description: "List your hospitality products, reach 480+ hotels, get instant invoice financing up to EGP 10M. Paperless onboarding, zero recourse risk.",
  openGraph: {
    title: "Suppliers — Sell to Hotels | HotelsVendors",
    description: "List your hospitality products, reach 480+ hotels, get instant invoice financing.",
    type: "website",
  },
};

const SUPPLIER_FEATURES = [
  {
    icon: Users,
    title: "Access 480+ Hotels",
    desc: "Direct access to hotel buyers across Egypt. No middlemen. No bidding wars.",
    color: "#39ff7e",
  },
  {
    icon: CreditCard,
    title: "Get Paid in 48 Hours",
    desc: "Oliv finances your verified invoices instantly. No waiting for hotel payment cycles.",
    color: "#4A7C59",
  },
  {
    icon: Shield,
    title: "Zero Recourse Risk",
    desc: "Oliv collects from the hotel. You have zero liability if the hotel delays payment.",
    color: "#39ff7e",
  },
  {
    icon: RefreshCw,
    title: "Unlimited Invoice Volume",
    desc: "Credit engine processes any number of invoices. Revolving facility grows with you.",
    color: "#c455ff",
  },
  {
    icon: Package,
    title: "Fixed Pricing Control",
    desc: "Set your own prices. No bidding. No undercutting. You control your margins.",
    color: "#ff7e1a",
  },
  {
    icon: Truck,
    title: "Shared-Route Logistics",
    desc: "Consolidate deliveries across hotels. Cut logistics costs by up to 40%.",
    color: "#64b5f6",
  },
];

const STATS = [
  { value: "480+", label: "Hotel Buyers", color: "#39ff7e" },
  { value: "EGP 10M", label: "Max Credit Line", color: "#4A7C59" },
  { value: "48h", label: "Payment Speed", color: "#ff7e1a" },
  { value: "0%", label: "Recourse Risk", color: "#c455ff" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Register", desc: "Fill in your company details, Tax ID, and product categories. Takes 2 minutes.", color: "#39ff7e" },
  { step: "2", title: "List Products", desc: "Upload SKUs, set fixed prices & stock levels. Start receiving orders immediately.", color: "#ff7e1a" },
  { step: "3", title: "Get Paid", desc: "Fulfill orders, apply for Oliv financing, receive cash in 48 hours.", color: "#4A7C59" },
];

const FAQ = [
  { q: "What are the fees?", a: "HotelsVendors charges 1.5–2.5% transaction fee on completed orders. Oliv financing fee is separate and transparent." },
  { q: "Do I need to integrate my ERP?", a: "No. Everything happens in the HotelsVendors supplier dashboard. Order management, delivery tracking, invoice financing — all in one place." },
  { q: "What if the hotel doesn't pay Oliv?", a: "That's Oliv's risk, not yours. Non-recourse financing means zero liability to the supplier." },
  { q: "What documents do I need?", a: "At registration: Tax ID, City, Governorate. For full onboarding: Commercial Register, company logo, product catalog." },
  { q: "How do I get the EGP 10M credit line?", a: "After your first verified invoice on HotelsVendors, apply for Oliv financing from your dashboard." },
];

export default function SuppliersPage() {
  return (
    <main style={{ backgroundColor: "#0c0c12", color: "#ffffff", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(74,124,89,0.08) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6" style={{ borderColor: "#4A7C5933", backgroundColor: "#4A7C5910" }}>
            <span className="text-[13px] font-semibold" style={{ color: "#4A7C59" }}>oliv</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: "#4A7C59" }}>
              Oliv Partnership Active
            </span>
          </div>
          <h1 className="text-[clamp(30px,5vw,52px)] font-semibold leading-[1.05] tracking-tight mb-5">
            Sell to Hotels.<br />
            <span style={{ color: "#4A7C59" }}>Get Paid in 48 Hours.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl mx-auto leading-relaxed mb-8">
            List your hospitality products on Egypt&apos;s largest B2B procurement platform.
            Access 480+ hotels. And when the invoice is verified — <strong style={{ color: "#4A7C59" }}>Oliv finances it instantly</strong>.
            Up to <strong style={{ color: "#39ff7e" }}>EGP 10M</strong>. Zero paperwork. Zero recourse risk.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register?type=supplier" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(74,124,89,0.25)]" style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
              Start Selling Now <ArrowRight size={14} />
            </Link>
            <Link href="/financing/oliv" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Learn About Oliv Financing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y" style={{ borderColor: "#4A7C5918" }}>
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
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "#4A7C59" }}>Why Suppliers Choose Us</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Built for Egyptian Hospitality Suppliers</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SUPPLIER_FEATURES.map((f) => {
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
      <section className="py-20 border-y" style={{ borderColor: "#4A7C5918" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "#4A7C59" }}>How It Works</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">From Registration to Cash in 48 Hours</h2>
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

      {/* FAQ */}
      <section className="py-20 border-y" style={{ borderColor: "#4A7C5918" }}>
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-white text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-xl border border-white/[0.06] bg-[#12121a] p-5">
                <h3 className="text-[14px] font-semibold text-white mb-2">{f.q}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Ready to Grow Your Hotel Supply Business?</h2>
          <p className="text-[14px] text-white/40 mb-8 max-w-md mx-auto">
            Join suppliers already transacting on HotelsVendors. List your products today,
            unlock Oliv financing on your first verified invoice.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register?type=supplier" className="inline-flex items-center gap-2 px-8 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(74,124,89,0.25)]" style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
              Start Selling Now <ArrowRight size={14} />
            </Link>
            <Link href="/financing/oliv" className="inline-flex items-center gap-2 px-8 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Learn About Oliv Financing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
