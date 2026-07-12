import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Shield, Zap, Landmark, RefreshCw, Building2, Users, TrendingUp, CreditCard, Wallet, BarChart3, Truck } from "lucide-react";
import { OlivLogo } from "@/components/partners/oliv-logo";
import { BrandLogo } from "@/components/layout/brand-logo";

export const metadata: Metadata = {
  title: "Join as Hotel — Net-60 Terms, Instant Supplier Payments | HotelsVendors",
  description: "Extend payment terms to Net-60 via Oliv financing. Suppliers paid instantly. You pay once monthly. Authority Matrix governance. ETA compliant.",
  openGraph: {
    title: "Join HotelsVendors as Hotel — Net-60 Terms, Zero AP Hassle",
    description: "Consolidated monthly payment. Suppliers prioritize your orders. Full ETA/FRA compliance.",
    type: "website",
  },
};

const BENEFITS = [
  { icon: Clock, title: "Net-60 Payment Terms", desc: "Pay Oliv at Net-60 instead of Net-15/30 to suppliers. Preserve working capital for operations.", color: "#39ff7e" },
  { icon: Shield, title: "Supplier Priority & Loyalty", desc: "Suppliers get paid instantly via Oliv. They prioritize your orders — better fill rates, better pricing, faster delivery.", color: "#4A7C59" },
  { icon: Users, title: "One Consolidated Monthly Payment", desc: "Single wire to Oliv covers all financed invoices. Simplified AP. Auto-reconciled to PO level.", color: "#c455ff" },
  { icon: Building2, title: "Zero Balance Sheet Impact", desc: "Financing is off-balance-sheet. Oliv takes the credit risk. Your debt ratios stay clean.", color: "#ff7e1a" },
  { icon: BarChart3, title: "Full Spend Visibility", desc: "Real-time dashboard: PO → Delivery → Invoice → Financing → Payment. Authority Matrix governs approvals.", color: "#64b5f6" },
  { icon: Landmark, title: "ETA & FRA Compliant", desc: "Every invoice ETA-validated. Digital signatures. Audit-ready trail for Egyptian Tax Authority.", color: "#4A7C59" },
];

const FLOW = [
  { step: "01", title: "Multi-Property Ordering", desc: "Centralized catalog for all properties. Budget controls per outlet. Authority Matrix routes approvals.", icon: Building2, color: "#39ff7e" },
  { step: "02", title: "Suppliers Deliver & ETA Invoices", desc: "Shared logistics optimizes coastal routes. Three-way match auto-generates ETA-compliant invoices.", icon: Truck, color: "#ff7e1a" },
  { step: "03", title: "Oliv Finances Suppliers (Optional)", desc: "Suppliers click 'Get Financed' → paid in 48h. You don't change a thing — your terms stay Net-60.", icon: Zap, color: "#4A7C59" },
  { step: "04", title: "Monthly Settlement to Oliv", desc: "One payment covers all financed invoices. Auto-reconciliation. Revolving credit resets for next cycle.", icon: CreditCard, color: "#64b5f6" },
];

const METRICS = [
  { label: "Payment Terms", value: "Net-60", icon: Clock, color: "#4A7C59" },
  { label: "Consolidated Payments", value: "1 / Month", icon: CreditCard, color: "#39ff7e" },
  { label: "Supplier Fill Rate", value: "+23%", icon: TrendingUp, color: "#c455ff" },
  { label: "AP Workload", value: "-60%", icon: Wallet, color: "#ff7e1a" },
  { label: "ETA Compliance", value: "100%", icon: Shield, color: "#64b5f6" },
  { label: "Oliv Credit Facility", value: "EGP 10M+", icon: Landmark, color: "#4A7C59" },
];

const FAQ = [
  { q: "Does this change our existing supplier contracts?", a: "No. Your contracts with suppliers remain unchanged. Oliv is an optional financing layer — suppliers choose whether to use it. Your payment obligation stays Net-60 to Oliv." },
  { q: "What if a supplier doesn't want financing?", a: "They get paid on your normal terms. Oliv financing is supplier-initiated and optional. You still benefit from the platform's ordering, logistics, and ETA compliance." },
  { q: "How does Authority Matrix work with financing?", a: "PO approvals follow your existing Authority Matrix rules. Financing happens after invoice validation — it doesn't affect the approval chain." },
  { q: "Is this Shariah-compliant?", a: "Oliv offers Shariah-compliant financing structures. Discuss with their team during onboarding for your specific requirements." },
];

export default function HotelJoinPage() {
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
            Procure for All Properties.<br />
            <span style={{ color: "#4A7C59" }}>Pay Once Monthly at Net-60.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl mx-auto leading-relaxed mb-8">
            Centralize multi-property procurement. Suppliers get paid instantly via Oliv. 
            You settle once a month at Net-60. Full ETA compliance. Authority Matrix governance.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register?type=hotel" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(74,124,89,0.25)]" style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
              <OlivLogo size="xs" variant="dark" />
              Join as Hotel <ArrowRight size={14} />
            </Link>
            <Link href="/flow" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              See Complete Flow
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y" style={{ borderColor: "#4A7C5918" }}>
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-6 text-[12px] text-white/30">
          <span className="flex items-center gap-2"><Landmark size={14} style={{ color: "#4A7C59" }} /> FRA Licensed Digital Factoring</span>
          <span className="flex items-center gap-2"><Shield size={14} style={{ color: "#4A7C59" }} /> Suez Canal Bank EGP 30M Facility</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={14} style={{ color: "#4A7C59" }} /> Net-60 Payment Terms</span>
          <span className="flex items-center gap-2"><Zap size={14} style={{ color: "#4A7C59" }} /> Authority Matrix Governance</span>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "#4A7C59" }}>How It Works</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">From Order to Settlement in 4 Steps</h2>
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
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "#4A7C59" }}>Why Hotels Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">Built for Multi-Property Hospitality Groups</h2>
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

      {/* Metrics */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl border p-8 md:p-12 text-center" style={{ borderColor: "#4A7C5922", backgroundColor: "#4A7C5906" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4" style={{ borderColor: "#4A7C5933", backgroundColor: "#4A7C5910" }}>
              <OlivLogo size="xs" variant="green" />
              <span className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: "#4A7C59" }}>Oliv Credit Facility</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-5">The Credit Engine Behind Net-60</h2>
            <p className="text-[14px] text-white/40 max-w-xl mx-auto mb-8 leading-relaxed">
              Oliv&apos;s revolving facility scales with your procurement volume. 
              Up to <strong>EGP 10M+</strong> available. Unlimited invoice count. 
              Your suppliers get paid in 48h — you pay at Net-60.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="rounded-xl border border-white/[0.06] bg-[#12121a] p-5">
                <div className="text-[24px] font-bold mb-1" style={{ color: "#4A7C59" }}>10M+</div>
                <div className="text-[12px] text-white/40">Max Facility</div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#12121a] p-5">
                <div className="text-[24px] font-bold mb-1" style={{ color: "#39ff7e" }}>48h</div>
                <div className="text-[12px] text-white/40">Supplier Funding</div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-[#12121a] p-5">
                <div className="text-[24px] font-bold mb-1" style={{ color: "#c455ff" }}>∞</div>
                <div className="text-[12px] text-white/40">Invoice Volume</div>
              </div>
            </div>
            <Link href="/financing/oliv" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(74,124,89,0.2)]" style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
              <OlivLogo size="xs" variant="dark" />
              View Financing Details <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="py-20 border-y" style={{ borderColor: "#4A7C5918" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Measurable Impact</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {METRICS.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="rounded-xl border border-white/[0.06] bg-[#12121a] p-5 hover:border-white/[0.10] transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${m.color}12`, border: `1px solid ${m.color}22` }}>
                      <Icon size={18} style={{ color: m.color }} />
                    </div>
                    <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">{m.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{m.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
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
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Ready to Transform Your Hotel Procurement?</h2>
          <p className="text-[14px] text-white/40 mb-8 max-w-md mx-auto">
            Join leading hotel groups in Egypt. Centralize ordering. Extend terms. 
            Let Oliv handle supplier financing.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register?type=hotel" className="inline-flex items-center gap-2 px-8 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(74,124,89,0.25)]" style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
              <OlivLogo size="xs" variant="dark" />
              Start Procuring <ArrowRight size={14} />
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