import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Shield, Zap, Building2, Users, CreditCard, Wallet, BarChart3, Truck, Landmark, RefreshCw, MapPin, Phone, Mail, Globe, AlertCircle, Package, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Join as Hotel — Onboarding Wizard | HotelsVendors",
  description: "Step-by-step hotel onboarding: Register → Connect ETA Token → Set Up Oliv Financing → Start Procuring. Net-60 terms, EGP 10M+ credit facility.",
  openGraph: {
    title: "Join HotelsVendors — Hotel Onboarding Wizard",
    description: "Register, connect ETA, set up Oliv financing, start procuring. Net-60 terms.",
    type: "website",
  },
};

const ONBOARDING_STEPS = [
  {
    step: "1",
    title: "Register Account",
    desc: "Create your HotelsVendors account with basic business details.",
    icon: Building2,
    color: "#39ff7e",
    fields: ["Full Name", "Email", "Password", "Tax ID", "City", "Governorate"],
  },
  {
    step: "2",
    title: "Complete Hotel Profile",
    desc: "Add your property details, number of rooms, and management company.",
    icon: Users,
    color: "#c455ff",
    fields: ["Hotel Name", "Property Type", "Number of Rooms", "Management Company", "Contact Person"],
  },
  {
    step: "3",
    title: "Connect ETA Token",
    desc: "Link your Egyptian Tax Authority token for compliant invoicing.",
    icon: Shield,
    color: "#64b5f6",
    fields: ["ETA Registration Number", "Tax Card Number", "Digital Signature"],
  },
  {
    step: "4",
    title: "Set Up Oliv Financing",
    desc: "Choose factoring or reverse factoring. Connect to Oliv for Net-60 terms.",
    icon: Landmark,
    color: "#4A7C59",
    fields: ["Company Name", "Commercial Register", "Bank Details", "Financing Preference"],
  },
];

const BENEFITS = [
  { icon: Clock, title: "Net-60 Payment Terms", desc: "Pay Oliv at Net-60 instead of Net-15/30 to suppliers.", color: "#4A7C59" },
  { icon: Shield, title: "Supplier Priority", desc: "Suppliers get paid instantly. They prioritize your orders.", color: "#39ff7e" },
  { icon: Users, title: "One Monthly Payment", desc: "Single wire to Oliv covers all financed invoices.", color: "#c455ff" },
  { icon: Building2, title: "Multi-Property Support", desc: "Centralized procurement across all properties.", color: "#ff7e1a" },
  { icon: Package, title: "10,000+ Products", desc: "Browse fixed-price catalog from 500+ verified suppliers.", color: "#64b5f6" },
  { icon: FileText, title: "ETA Compliant", desc: "Every invoice digitally signed and ETA-submitted.", color: "#4A7C59" },
];

export default function HotelJoinPage() {
  return (
    <main style={{ backgroundColor: "#0c0c12", color: "#ffffff", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(74,124,89,0.08) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6" style={{ borderColor: "#4A7C5933", backgroundColor: "#4A7C5910" }}>
            <Landmark size={12} style={{ color: "#4A7C59" }} />
            <span className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: "#4A7C59" }}>
              Hotel Onboarding
            </span>
          </div>
          <h1 className="text-[clamp(30px,5vw,52px)] font-semibold leading-[1.05] tracking-tight mb-5">
            Onboard Your Hotel<br />
            <span style={{ color: "#4A7C59" }}>in 4 Simple Steps</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl mx-auto leading-relaxed">
            Register, connect your ETA token, set up Oliv financing, and start procuring.
            Net-60 terms. EGP 10M+ credit facility. 500+ suppliers.
          </p>
        </div>
      </section>

      {/* Steps Overview */}
      <section className="py-12 border-y" style={{ borderColor: "#4A7C5918" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-4 gap-4">
            {ONBOARDING_STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="rounded-xl border bg-[#12121a] p-5 text-center hover:border-white/[0.10] transition-all" style={{ borderColor: `${s.color}22` }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}33` }}>
                    <Icon size={20} style={{ color: s.color }} />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: s.color }}>Step {s.step}</div>
                  <h3 className="text-[13px] font-semibold text-white">{s.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Step Details */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-8">
            {ONBOARDING_STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="rounded-2xl border bg-[#12121a] p-8 hover:border-white/[0.10] transition-all" style={{ borderColor: `${s.color}22` }}>
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}33` }}>
                      <Icon size={24} style={{ color: s.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: s.color }}>Step {s.step}</span>
                      </div>
                      <h3 className="text-[18px] font-semibold text-white mb-2">{s.title}</h3>
                      <p className="text-[14px] text-white/40 leading-relaxed mb-4">{s.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {s.fields.map((f) => (
                          <span key={f} className="px-3 py-1.5 rounded-lg text-[11px] font-medium" style={{ backgroundColor: `${s.color}10`, color: `${s.color}`, border: `1px solid ${s.color}22` }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-y" style={{ borderColor: "#4A7C5918" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "#4A7C59" }}>What You Get</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">After Onboarding</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="rounded-2xl border border-white/[0.06] bg-[#12121a] p-6 hover:border-white/[0.10] transition-all">
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

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Ready to Start?</h2>
          <p className="text-[14px] text-white/40 mb-8 max-w-md mx-auto">
            Create your account in 2 minutes. Connect your ETA token. Set up Oliv financing.
            Start procuring with Net-60 terms.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register?type=hotel" className="inline-flex items-center gap-2 px-8 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(74,124,89,0.25)]" style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
              Create Hotel Account <ArrowRight size={14} />
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
