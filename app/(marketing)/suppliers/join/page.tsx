import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Shield, Zap, Landmark, RefreshCw, ExternalLink, Factory, Truck, CreditCard, Users, TrendingUp } from "lucide-react";
import { OlivLogo } from "@/components/partners/oliv-logo";
import { BrandLogo } from "@/components/layout/brand-logo";

export const metadata: Metadata = {
  title: "Join as Supplier — Get Paid in 48h with Oliv Financing | HotelsVendors",
  description: "List your hospitality products, reach 480+ hotels, get instant invoice financing up to EGP 10M. Paperless onboarding, zero recourse risk.",
  openGraph: {
    title: "Join HotelsVendors as Supplier — Get Paid in 48h",
    description: "Instant financing on verified invoices. Up to EGP 10M. Zero paperwork.",
    type: "website",
  },
};

const BENEFITS = [
  { icon: Zap, title: "Get Paid in 48 Hours", desc: "Oliv finances your verified invoices instantly. No waiting for hotel payment cycles.", color: "#39ff7e" },
  { icon: Shield, title: "Zero Recourse Risk", desc: "Oliv collects from the hotel. You have zero liability if the hotel delays payment.", color: "#4A7C59" },
  { icon: RefreshCw, title: "Unlimited Invoice Volume", desc: "Credit engine processes any number of invoices. Revolving facility grows with you.", color: "#c455ff" },
  { icon: ExternalLink, title: "No Tech Integration", desc: "Works through HotelsVendors dashboard. One click to apply. No API needed.", color: "#ff7e1a" },
  { icon: Factory, title: "Coastal Hotel Demand", desc: "Access 480+ hotels in Sharm El-Sheikh, Hurghada, Cairo, Alexandria. High-velocity orders.", color: "#64b5f6" },
  { icon: Landmark, title: "FRA Regulated & Backed", desc: "Oliv holds Egypt's first digital factoring license. Suez Canal Bank EGP 30M facility.", color: "#4A7C59" },
];

const FLOW = [
  { step: "01", title: "List Your Products", desc: "Upload SKUs, set fixed prices & stock. No bidding — you control pricing.", icon: Factory, color: "#ff7e1a" },
  { step: "02", title: "Receive Orders", desc: "Hotels place POs via Authority Matrix. Auto-routed to you. One-click accept.", icon: Truck, color: "#c455ff" },
  { step: "03", title: "Deliver & Auto-Invoice", desc: "Shared logistics delivers. ETA e-invoice generated & validated automatically.", icon: CreditCard, color: "#4A7C59" },
  { step: "04", title: "Get Financed (Optional)", desc: "Click 'Get Financed' → Oliv approves in minutes → Cash in 48h.", icon: Zap, color: "#39ff7e" },
];

const FAQ = [
  { q: "What are the fees?", a: "HotelsVendors: 1.5–2.5% transaction fee.5% transaction fee on GMV. Oliv financing fee is separate and transparent — you see the exact cost before accepting." },
  { q: "Do I need to integrate my ERP?", a: "No. Everything happens in the HotelsVendors supplier dashboard. Order management, delivery tracking, invoice financing — all in one place." },
  { q: "What if the hotel doesn't pay Oliv?", a: "That's Oliv's risk, not yours. Non-recourse financing means zero liability to supplier. Oliv handles collections." },
  { q: "How do I get started?", a: "Register as a supplier → complete onboarding (tax ID, commercial register) → list products → start receiving orders. Can apply for Oliv financing after first verified invoice." },
];

export default function SupplierJoinPage() {
  return (
    <main style={{ backgroundColor: "#0c0c12", color: "#ffffff", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(74,124,89,0.08) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6" style={{ borderColor: "#4A7C5933", backgroundColor: "#4A7C5910" }}>
            <OlivLogo size="xs" variant="green" />
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
            Access 480+ hotels. And when the invoice is verified — <strong>Oliv finances it instantly</strong>. 
            Up to <strong>EGP 10M</strong>. Zero paperwork. Zero recourse risk.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register?type=supplier" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(74,124,89,0.25)]" style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
              <OlivLogo size="xs" variant="dark" />
              Join as Supplier <ArrowRight size={14} />
            </Link>
            <Link href="/financing/oliv" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              How Financing Works
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y" style={{ borderColor: "#4A7C5918" }}>
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-6 text-[12px] text-white/30">
          <span className="flex items-center gap-2"><Landmark size={14} style={{ color: "#4A7C59" }} /> FRA Licensed Digital Factoring</span>
          <span className="flex items-center gap-2"><Shield size={14} style={{ color: "#4A7C59" }} /> Suez Canal Bank EGP 30M Facility</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={14} style={{ color: "#4A7C59" }} /> 48-Hour Funding SLA</span>
          <span className="flex items-center gap-2"><Zap size={14} style={{ color: "#4A7C59" }} /> Non-Recourse by Design</span>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "#4A7C59" }}>How It Works</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">From Listing to Cash in 4 Steps</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FLOW.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.step} className="relative rounded-2xl border bg-[#12121a] p-6 hover:border-white/[0.10] transition-all" style={{ borderColor: `${f.color}22` }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${f.color}15`, border: `1px solid ${f.color}33` }}>
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: f.color }}>{f.step}</div>
                  <h3 className="text-[15px] font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-[13px] text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 border-y" style={{ borderColor: "#4A7C5918" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "#4A7C59" }}>Why Suppliers Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">Built for Egyptian Hospitality Suppliers</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="rounded-2xl border border-white/[0.06] bg-[#12121a] p-6 hover:border-white/[0.10] transition-all group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${b.color}12`, border: `1px solid ${b.color}22` }}>
                    <Icon size={18} style={{ color: b.color }} />
                  </div>
                  <h3 className="text-[14px] font-semibold text-white mb-2">{b.title}</h3>
                  <p className="text-[13px] text-white/40 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Financing Deep Dive */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl border p-8 md:p-12 text-center" style={{ borderColor: "#4A7C5922", backgroundColor: "#4A7C5906" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4" style={{ borderColor: "#4A7C5933", backgroundColor: "#4A7C5910" }}>
              <OlivLogo size="xs" variant="green" />
              <span className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: "#4A7C59" }}>Oliv Invoice Financing</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-5">The Credit Engine That Scales With You</h2>
            <p className="text-[14px] text-white/40 max-w-xl mx-auto mb-8 leading-relaxed">
              Unlike traditional factoring, Oliv&apos;s credit engine evaluates your business performance — not just individual invoices. 
              One approval unlocks a <strong>revolving facility up to EGP 10M</strong> that handles any invoice volume.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="rounded-xl border border-white/[0.06] bg-[#12121a] p-5">
                <div className="text-[24px] font-bold mb-1" style={{ color: "#4A7C59" }}>10M+</div>
                <div className="text-[12px] text-white/40">Max Pre-Approval</div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#12121a] p-5">
                <div className="text-[24px] font-bold mb-1" style={{ color: "#39ff7e" }}>48h</div>
                <div className="text-[12px] text-white/40">Funding Speed</div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#12121a] p-5">
                <div className="text-[24px] font-bold mb-1" style={{ color: "#c455ff" }}>∞</div>
                <div className="text-[12px] text-white/40">Invoice Volume</div>
              </div>
            </div>
            <Link href="/financing/oliv" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(74,124,89,0.2)]" style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
              <OlivLogo size="xs" variant="dark" />
              See Full Financing Details <ArrowRight size={14} />
            </Link>
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
            Join 500+ suppliers already transacting on HotelsVendors. List your products today, 
            unlock Oliv financing on your first verified invoice.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register?type=supplier" className="inline-flex items-center gap-2 px-8 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(74,124,89,0.25)]" style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
              <OlivLogo size="xs" variant="dark" />
              Start Selling <ArrowRight size={14} />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}