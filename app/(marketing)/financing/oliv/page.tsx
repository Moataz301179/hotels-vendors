import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Shield, CheckCircle2, Banknote, FileText, Landmark, Zap } from "lucide-react";
import { OlivLogo } from "@/components/partners/oliv-logo";

export const metadata: Metadata = {
  title: "Invoice Financing via Oliv | Get Paid in 48 Hours | HotelsVendors",
  description:
    "HotelsVendors partners with Oliv to offer suppliers instant invoice financing. Get approved in minutes, funded in 48 hours. No tech integration needed.",
  keywords: [
    "invoice financing Egypt",
    "SME lending Egypt",
    "Oliv finance",
    "digital factoring Egypt",
    "hotel supplier financing",
    "working capital Egypt",
    "FRA licensed lending",
  ],
  openGraph: {
    title: "Invoice Financing via Oliv | HotelsVendors",
    description: "Get your invoices financed in 48 hours. Powered by Oliv — Egypt's first FRA-licensed digital factoring platform.",
    type: "website",
  },
};

const benefits = [
  {
    icon: Zap,
    title: "Instant Credit Approval",
    desc: "Our credit engine analyzes your business performance in minutes and instantly assigns your available credit.",
    color: "#4A7C59",
  },
  {
    icon: Clock,
    title: "Funded in 48 Hours",
    desc: "From invoice submission to cash in your account — the entire process takes less than 2 days.",
    color: "#39ff7e",
  },
  {
    icon: FileText,
    title: "Paperless Process",
    desc: "Fully digital onboarding with electronic contract signing. No paperwork, no branch visits.",
    color: "#c455ff",
  },
  {
    icon: Banknote,
    title: "Transparent Pricing",
    desc: "Simple pricing with no hidden fees. You see the cost before you commit. No surprises.",
    color: "#ff7e1a",
  },
  {
    icon: Shield,
    title: "FRA Regulated",
    desc: "Oliv holds Egypt's first digital factoring license from the Financial Regulatory Authority. Fully compliant.",
    color: "#64b5f6",
  },
  {
    icon: Landmark,
    title: "No Tech Requirements",
    desc: "No accounting software needed. No API integration. Just submit your invoice and get financed.",
    color: "#4A7C59",
  },
];

const steps = [
  {
    step: "01",
    title: "Complete a Transaction",
    desc: "Fulfill an order on HotelsVendors. Your verified invoice becomes your financing collateral.",
    color: "#39ff7e",
  },
  {
    step: "02",
    title: "Apply via Oliv",
    desc: "Click 'Get Financed' from your order dashboard. Oliv's credit engine evaluates your business in minutes.",
    color: "#ff7e1a",
  },
  {
    step: "03",
    title: "Get Approved",
    desc: "Receive your credit limit instantly. Revolving facility — repay and reborrow as needed.",
    color: "#c455ff",
  },
  {
    step: "04",
    title: "Receive Funds",
    desc: "Cash deposited to your account within 48 hours. Use it for your next procurement cycle.",
    color: "#4A7C59",
  },
];

const faqs = [
  {
    q: "What are the requirements?",
    a: "You must be a legally registered company in Egypt with completed transactions on HotelsVendors.",
  },
  {
    q: "How does repayment work?",
    a: "Oliv collects repayment directly from you — they do not intervene in your buyer relationships. Repay and your credit limit resets for the next cycle.",
  },
  {
    q: "Is there a minimum invoice amount?",
    a: "Contact Oliv for current thresholds. The facility is designed for SME invoices in the Egyptian market.",
  },
  {
    q: "What fees does HotelsVendors charge?",
    a: "HotelsVendors earns a referral fee from Oliv. You pay nothing extra — the financing terms are between you and Oliv.",
  },
];

export default function OlivFinancingPage() {
  return (
    <main style={{ backgroundColor: "#0c0c12", color: "#ffffff", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(74,124,89,0.08) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6" style={{ borderColor: "#4A7C5933", backgroundColor: "#4A7C5910" }}>
            <OlivLogo size="xs" variant="green" />
            <span className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: "#4A7C59" }}>
              Partner Integration
            </span>
          </div>
          <h1 className="text-[clamp(28px,5vw,48px)] font-semibold leading-[1.1] tracking-tight mb-5">
            Get Your Invoices<br />
            <span style={{ color: "#4A7C59" }}>Financed in 48 Hours.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-xl mx-auto leading-relaxed mb-8">
            HotelsVendors partners with Oliv — Egypt&apos;s first FRA-licensed digital factoring platform — to give suppliers instant access to working capital against verified invoices.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="https://oliv.finance/#register" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(74,124,89,0.2)]" style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
              Apply on Oliv <ArrowRight size={14} />
            </a>
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Start Selling on HotelsVendors
            </Link>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-6 border-y" style={{ borderColor: "#4A7C5918" }}>
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-6 text-[12px] text-white/30">
          <span className="flex items-center gap-2"><Shield size={14} style={{ color: "#4A7C59" }} /> FRA Licensed</span>
          <span className="flex items-center gap-2"><Landmark size={14} style={{ color: "#4A7C59" }} /> Suez Canal Bank Backed</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={14} style={{ color: "#4A7C59" }} /> EGP 30M Credit Facility</span>
          <span className="flex items-center gap-2"><Zap size={14} style={{ color: "#4A7C59" }} /> 48-Hour Funding</span>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "#4A7C59" }}>How It Works</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">From Invoice to Cash in 4 Steps</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="rounded-2xl border border-white/[0.06] bg-[#12121a] p-6 hover:border-white/[0.10] transition-all">
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: s.color }}>{s.step}</div>
                <h3 className="text-[15px] font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-y" style={{ borderColor: "#4A7C5918" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "#4A7C59" }}>Why Oliv</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">Built for Egyptian SMEs</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b) => {
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

      {/* Integration note */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "#39ff7e" }}>HotelsVendors + Oliv</span>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-5">Seamless Integration. Zero Disruption.</h2>
          <p className="text-[14px] text-white/40 leading-relaxed mb-8 max-w-xl mx-auto">
            Your verified invoices on HotelsVendors become your financing collateral. No additional paperwork. No separate onboarding. Just click &quot;Get Financed&quot; from your order dashboard.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/[0.06] bg-[#12121a] p-5">
              <div className="text-[24px] font-bold text-white mb-1">0</div>
              <div className="text-[12px] text-white/40">Extra fees from HotelsVendors</div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#12121a] p-5">
              <div className="text-[24px] font-bold mb-1" style={{ color: "#4A7C59" }}>48h</div>
              <div className="text-[12px] text-white/40">Average funding time</div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#12121a] p-5">
              <div className="text-[24px] font-bold mb-1" style={{ color: "#39ff7e" }}>$30M</div>
              <div className="text-[12px] text-white/40">Suez Canal Bank facility</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-y" style={{ borderColor: "#4A7C5918" }}>
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-white text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
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
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Ready to Finance Your Invoices?</h2>
          <p className="text-[14px] text-white/40 mb-8 max-w-md mx-auto">
            Start transacting on HotelsVendors, then apply for Oliv financing. It&apos;s that simple.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="https://oliv.finance/#register" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(74,124,89,0.25)]" style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
              <OlivLogo size="xs" variant="dark" />
              Apply Now <ArrowRight size={14} />
            </a>
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Join HotelsVendors
            </Link>
          </div>
          <p className="text-[11px] text-white/20 mt-6">
            Powered by Oliv Finance — Egypt&apos;s first FRA-licensed digital factoring platform.
          </p>
        </div>
      </section>
    </main>
  );
}
