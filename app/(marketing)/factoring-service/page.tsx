import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Clock,
  Shield,
  TrendingUp,
  FileCheck,
  BarChart3,
  Users,
  Store,
  Building2,
  Sparkles,
  Zap,
  Award,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingPage } from "@/components/layout/marketing-page";

export const metadata: Metadata = {
  title: "Payme — Invoice Financing Marketplace for Hospitality | HotelsVendors",
  description:
    "Payme is an invoice financing marketplace, not a lender. Suppliers upload ETA-compliant invoices, FRA-licensed funders bid, AI scorecards automate underwriting. Approval in 24 hours.",
  keywords: [
    "invoice financing Egypt",
    "factoring marketplace",
    "supplier early payment",
    "ETA e-invoicing",
    "hospitality invoice financing",
    "Payme",
    "reverse factoring Egypt",
    "AI invoice scoring",
    "FRA licensed factoring",
    "hotel supplier payment",
  ],
  openGraph: {
    title: "Payme — Invoice Financing Marketplace for Hospitality | HotelsVendors",
    description:
      "Suppliers upload ETA-compliant invoices, FRA-licensed funders bid, AI scorecards automate underwriting. Approval in 24 hours.",
    type: "website",
  },
};

const steps = [
  {
    step: "01",
    title: "Upload Invoice",
    desc: "Supplier uploads an ETA-compliant invoice. Three-way match — PO + ETA UUID + delivery note — verified automatically.",
    icon: FileCheck,
  },
  {
    step: "02",
    title: "AI Scorecard",
    desc: "AI agents generate a compliance & risk scorecard — hotel creditworthiness, repayment velocity, invoice authenticity. Zero manual underwriting.",
    icon: BarChart3,
  },
  {
    step: "03",
    title: "Funders Bid",
    desc: "FRA-licensed funders review scored invoices and place competitive bids. Best rate wins. Transparent market-driven pricing.",
    icon: TrendingUp,
  },
  {
    step: "04",
    title: "Get Paid in 24h",
    desc: "Supplier receives early payment within 24 hours of bid acceptance. Hotel settles at net-60. HotelsVendors collects a facilitation fee — never interest.",
    icon: Clock,
  },
];

const supplierBenefits = [
  { icon: Zap, title: "Get Paid in 24 Hours", desc: "No more waiting 60–90 days for hotel payment. Upload your ETA-compliant invoice and get funded within a day." },
  { icon: Shield, title: "No Recourse to You", desc: "Once a funder accepts your invoice, the risk transfers. You keep the money regardless of hotel payment." },
  { icon: BarChart3, title: "AI-Powered Underwriting", desc: "Automated scorecards mean no manual paperwork, no bank queues. Approval decisions in minutes, not weeks." },
  { icon: Store, title: "Stay in Control", desc: "You choose which invoices to submit and which bid to accept. Multiple funders compete for your invoices." },
];

const funderBenefits = [
  { icon: FileCheck, title: "Pre-Vetted Invoice Pool", desc: "Every invoice is ETA-verified, three-way matched, and AI-scored before you see it. Zero paper promises." },
  { icon: BarChart3, title: "AI Compliance Scorecards", desc: "Automated risk scoring on every invoice — hotel credit history, repayment velocity, sector concentration." },
  { icon: TrendingUp, title: "EGP 132B Market — 77.8% YoY", desc: "Egypt's factoring market reached EGP 132.2 billion in 2025, growing 77.8% year over year." },
  { icon: Shield, title: "ETA-Verified Authenticity", desc: "Every invoice cleared by the Egyptian Tax Authority in real time. Fraud risk near zero." },
  { icon: Banknote, title: "Competitive Bidding Engine", desc: "Full visibility into competing rates. Bid on assets you've already scored digitally." },
  { icon: Award, title: "Hospitality Focus", desc: "Dedicated pool of hotel invoices — predictable cash flows, established counterparties." },
];

const hotelBenefits = [
  { icon: Clock, title: "Extended Payment Terms", desc: "Suppliers get early payment through Payme, so you can negotiate net-60 or net-90 without squeezing their cash flow." },
  { icon: FileCheck, title: "Automated Invoice Verification", desc: "Every invoice flowing through your procurement hits ETA compliance automatically. No manual checks." },
  { icon: Shield, title: "Supplier Relationship Strength", desc: "When suppliers get paid fast, they prioritize your orders. Better terms, better service." },
];

const partners = [
  { name: "Oliv", desc: "FRA-licensed factoring" },
  { name: "PaySupp", desc: "Supply chain finance" },
  { name: "CIFC", desc: "Industrial finance" },
  { name: "CIB", desc: "Commercial bank" },
  { name: "QNB", desc: "Factoring division" },
  { name: "NBE", desc: "National bank" },
];

export default function FactoringServicePage() {
  return (
    <MarketingPage>
      <MarketingNav />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: "var(--accent-base)" }}>
            <Sparkles size={12} />
            Payme — Invoice Financing Marketplace
          </span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5">
            <span className="text-gradient-accent">Not a Lender.</span><br />
            A Marketplace Where Funders<br />
            Compete for Your Invoices.
          </h1>
          <p className="text-[15px] text-secondary max-w-2xl leading-relaxed mb-8">
            Payme connects suppliers with FRA-licensed factoring companies through an AI-powered
            marketplace. Upload your ETA-compliant invoice, get scored automatically, and let
            multiple funders bid for your paper. You get paid in 24 hours. HotelsVendors facilitates
            — we never hold capital, never charge interest, and never take recourse.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register?role=supplier&product=payme" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--accent-base)] text-[var(--accent-text)] text-sm font-semibold rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5">
              Register as Supplier <ArrowRight size={14} />
            </Link>
            <Link href="/register?role=funder" className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--border-visible)] text-[var(--foreground-secondary)] text-sm font-medium rounded-xl transition-all duration-200 hover:border-[var(--accent-base)] hover:text-[var(--foreground)]">
              Register as Funder
            </Link>
          </div>
          <p className="text-[10px] mt-5 max-w-xl" style={{ color: "var(--text-muted)", opacity: 0.8 }}>
            HotelsVendors operates strictly as a technical data orchestrator. Zero liability
            for counterparty collection defaults. Not a licensed financial institution.
          </p>
        </div>
      </section>

      {/* Stats / Trust Bar */}
      <section className="py-10 border-y" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "EGP 132B", label: "Egypt Factoring Market (2025)" },
              { value: "77.8%", label: "YoY Market Growth" },
              { value: "24h", label: "Funding Approval" },
              { value: "100%", label: "Digital — No Paper" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[22px] font-semibold" style={{ color: "var(--accent-base)" }}>{s.value}</p>
                <p className="text-[11px] text-secondary mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="label-upper mb-3 text-center">How Payme Works</h2>
          <p className="text-[13px] text-secondary text-center max-w-lg mx-auto mb-10">
            Four steps from invoice upload to early payment. No bank visits, no paperwork.
          </p>
          <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "var(--accent-muted)" }}>
                  <item.icon size={20} style={{ color: "var(--accent-base)" }} />
                </div>
                <span className="label-upper">Step {item.step}</span>
                <h3 className="text-[13px] font-medium mt-1 mb-1.5">{item.title}</h3>
                <p className="text-[11px] text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Suppliers */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: "var(--accent-base)" }}>
                <Store size={12} />
                For Suppliers
              </span>
              <h2 className="text-[28px] font-medium leading-[1.1] tracking-tight mb-4">
                Stop Waiting 60 Days.<br />
                <span className="text-gradient-accent">Get Paid Tomorrow.</span>
              </h2>
              <p className="text-[13px] text-secondary leading-relaxed mb-6">
                Your ETA-compliant invoices are verified assets. Upload them to Payme, and our
                AI agents score them automatically. FRA-licensed funders compete to give you
                the best rate. You pick the offer and get paid within 24 hours.
              </p>
              <Link href="/register?role=supplier&product=payme" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-base)] text-[var(--accent-text)] text-sm font-semibold rounded-xl transition-all duration-200 hover:opacity-90">
                Start as Supplier <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid gap-3">
              {supplierBenefits.map((b) => (
                <div key={b.title} className="surface-card p-4 flex items-start gap-3 transition-all">
                  <b.icon size={18} className="mt-0.5 shrink-0" style={{ color: "var(--accent-base)" }} />
                  <div>
                    <h3 className="text-[13px] font-medium mb-0.5">{b.title}</h3>
                    <p className="text-[11px] text-muted leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Funders */}
      <section className="py-20" style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 grid gap-3">
              {funderBenefits.map((b) => (
                <div key={b.title} className="surface-card p-4 flex items-start gap-3 transition-all">
                  <b.icon size={18} className="mt-0.5 shrink-0" style={{ color: "var(--accent-base)" }} />
                  <div>
                    <h3 className="text-[13px] font-medium mb-0.5">{b.title}</h3>
                    <p className="text-[11px] text-muted leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-1 md:order-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: "var(--accent-base)" }}>
                <Building2 size={12} />
                For Funders
              </span>
              <h2 className="text-[28px] font-medium leading-[1.1] tracking-tight mb-4">
                Vetted Invoices.<br />
                <span className="text-gradient-accent">Zero Underwriting Overhead.</span>
              </h2>
              <p className="text-[13px] text-secondary leading-relaxed mb-6">
                Every invoice on Payme has passed ETA clearance, three-way matching, and AI
                compliance scoring before you see it. Bid on pre-verified assets with full
                transparency. Egypt&apos;s factoring market grew 77.8% to EGP 132.2 billion
                in 2025 — hospitality invoices are the highest-quality paper in the stack.
              </p>
              <Link href="/register?role=funder" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-base)] text-[var(--accent-text)] text-sm font-semibold rounded-xl transition-all duration-200 hover:opacity-90">
                Register as Funder <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Hotels */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: "var(--accent-base)" }}>
                <Building2 size={12} />
                For Hotels
              </span>
              <h2 className="text-[28px] font-medium leading-[1.1] tracking-tight mb-4">
                Stronger Supplier<br />
                <span className="text-gradient-accent">Relationships. Better Terms.</span>
              </h2>
              <p className="text-[13px] text-secondary leading-relaxed mb-6">
                When your suppliers get paid early through Payme, you can negotiate extended
                payment terms without straining their cash flow. Automated invoice verification
                means every purchase is ETA-compliant by default.
              </p>
              <Link href="/register?role=hotel" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-base)] text-[var(--accent-text)] text-sm font-semibold rounded-xl transition-all duration-200 hover:opacity-90">
                Register Your Hotel <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid gap-3">
              {hotelBenefits.map((b) => (
                <div key={b.title} className="surface-card p-4 flex items-start gap-3 transition-all">
                  <b.icon size={18} className="mt-0.5 shrink-0" style={{ color: "var(--accent-base)" }} />
                  <div>
                    <h3 className="text-[13px] font-medium mb-0.5">{b.title}</h3>
                    <p className="text-[11px] text-muted leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20" style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="label-upper mb-3">Backed by FRA-Licensed Partners</h2>
          <p className="text-[13px] text-secondary max-w-lg mx-auto mb-10">
            Payme connects you to established financial institutions regulated by the Financial
            Regulatory Authority. We facilitate — they fund.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {partners.map((p) => (
              <div key={p.name} className="surface-card p-5 text-center transition-all">
                <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--accent-base)" }}>{p.name}</p>
                <p className="text-[10px] text-muted leading-tight">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="surface-card p-8 md:p-12 text-center max-w-3xl mx-auto">
            <BarChart3 size={28} className="mx-auto mb-4" style={{ color: "var(--accent-base)" }} />
            <h2 className="text-[22px] font-medium mb-3">Egypt&apos;s Factoring Market Is Booming</h2>
            <p className="text-[13px] text-secondary leading-relaxed mb-6 max-w-lg mx-auto">
              The FRA-regulated factoring market reached EGP 132.2 billion in 2025 — up
              77.8% year over year. With the second phase of digital factoring launching
              in 2026, hospitality invoices represent the next wave of high-quality
              receivables. Payme positions you at the center of that wave.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div>
                <p className="text-[20px] font-semibold" style={{ color: "var(--accent-base)" }}>EGP 132B</p>
                <p className="text-[10px] text-muted">Market Volume (2025)</p>
              </div>
              <div>
                <p className="text-[20px] font-semibold" style={{ color: "var(--accent-base)" }}>77.8%</p>
                <p className="text-[10px] text-muted">YoY Growth</p>
              </div>
              <div>
                <p className="text-[20px] font-semibold" style={{ color: "var(--accent-base)" }}>FRA</p>
                <p className="text-[10px] text-muted">Regulated Market</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Users size={28} className="mx-auto mb-6" style={{ color: "var(--accent-base)" }} />
          <h2 className="text-[24px] font-medium mb-4">Join Egypt&apos;s Invoice Financing Marketplace</h2>
          <p className="text-[13px] text-secondary mb-8 max-w-lg mx-auto">
            Whether you&apos;re a supplier waiting on payment, a funder looking for vetted
            receivables, or a hotel strengthening your supply chain — Payme is built for you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register?role=supplier&product=payme" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--accent-base)] text-[var(--accent-text)] text-sm font-semibold rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5">
              Register as Supplier <ArrowRight size={14} />
            </Link>
            <Link href="/register?role=funder" className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--border-visible)] text-[var(--foreground-secondary)] text-sm font-medium rounded-xl transition-all duration-200 hover:border-[var(--accent-base)] hover:text-[var(--foreground)]">
              Register as Funder
            </Link>
            <Link href="/register?role=hotel" className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--border-visible)] text-[var(--foreground-secondary)] text-sm font-medium rounded-xl transition-all duration-200 hover:border-[var(--accent-base)] hover:text-[var(--foreground)]">
              Register Your Hotel
            </Link>
          </div>
          <p className="text-[10px] mt-6 max-w-md mx-auto" style={{ color: "var(--text-muted)", opacity: 0.8 }}>
            HotelsVendors operates strictly as a technical data orchestrator. Zero liability
            for counterparty collection defaults. Not a licensed financial institution.
          </p>
        </div>
      </section>

      <MarketingFooter />
    </MarketingPage>
  );
}
