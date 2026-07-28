import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Target,
  Shield,
  Globe,
  Zap,
  MapPin,
  Building2,
  Banknote,
  Users,
  Search,
  ShoppingCart,
  Truck,
  CheckCircle,
  ShieldCheck,
  FileCheck,
  Lock,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About HotelsVendors — Egypt's B2B Hospitality Procurement Platform | HotelsVendors",
  description:
    "Learn how HotelsVendors is digitizing procurement for Egypt's $21.5B hospitality sector. The four-sided marketplace connecting hotels, suppliers, logistics, and factoring companies.",
  keywords: [
    "B2B hospitality procurement Egypt",
    "hotel supply chain management Egypt",
    "ETA e-invoicing compliance",
    "hospitality vendor marketplace",
    "digital procurement platform Egypt",
    "تجهيزات الفنادق بالجملة",
    "منصة المشتريات الفندقية مصر",
    "الفوترة الإلكترونية هيئة الضرائب",
  ],
  openGraph: {
    title: "About HotelsVendors — Egypt's B2B Hospitality Procurement Platform",
    description:
      "HotelsVendors is digitizing procurement for Egypt's $21.5B hospitality sector. A four-sided marketplace built from scratch for Egyptian hotels.",
    type: "website",
  },
};

const MARKET_STATS = [
  {
    value: "$21.54B",
    label: "Egyptian Hospitality",
    detail: "2026 market size, 7.12% CAGR",
    color: "#39ff7e",
  },
  {
    value: "51.2%",
    label: "Chain Hotels",
    detail: "Dominant market share and growing",
    color: "#ff7e1a",
  },
  {
    value: "1,853+",
    label: "SME Suppliers",
    detail: "Factories in 6th October City alone",
    color: "#c455ff",
  },
  {
    value: "0",
    label: "ETA-Native Platforms",
    detail: "No competitor has this — we do",
    color: "#64b5f6",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    title: "Browse",
    desc: "Explore a curated catalog of hospitality SKUs from verified Egyptian suppliers. Filter by category, price, and availability.",
    color: "#39ff7e",
    step: "01",
  },
  {
    icon: ShoppingCart,
    title: "Order",
    desc: "Build purchase orders with fixed pricing, apply credit terms, and route through your Authority Matrix for approval.",
    color: "#ff7e1a",
    step: "02",
  },
  {
    icon: Truck,
    title: "Receive",
    desc: "Track fulfillment through shared logistics. Invoices auto-submit to the ETA. Payments flow through factoring partners.",
    color: "#c455ff",
    step: "03",
  },
];

const TEAM_ROLES = [
  { role: "Chief Executive Officer", focus: "Hospitality & Strategy", color: "#39ff7e" },
  { role: "Chief Technology Officer", focus: "Platform & Engineering", color: "#ff7e1a" },
  { role: "Chief Operating Officer", focus: "Marketplace & Growth", color: "#c455ff" },
];

const TRACTION_STATS = [
  { value: "480+", label: "Properties Onboarded" },
  { value: "680+", label: "Verified Suppliers" },
  { value: "2,400+", label: "SKUs Listed" },
  { value: "6", label: "Governorates Covered" },
];

const TRUST_SIGNALS = [
  { icon: FileCheck, title: "ETA Compliant", desc: "Real-time e-invoicing with the Egyptian Tax Authority", color: "#39ff7e" },
  { icon: ShieldCheck, title: "Authority Matrix", desc: "Multi-level order governance with audit trails", color: "#ff7e1a" },
  { icon: Banknote, title: "Non-Recourse Factoring", desc: "Zero supplier default risk, embedded liquidity", color: "#c455ff" },
  { icon: Lock, title: "RBAC Security", desc: "Server-side role enforcement, tenant isolation", color: "#64b5f6" },
];

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: "var(--bg-canvas)", color: "var(--text-primary)", minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(57,255,126,0.04) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <span className="label-upper mb-4 block">About HotelsVendors</span>
          <h1 className="text-[clamp(28px,5vw,48px)] font-semibold leading-[1.1] tracking-tight mb-6 text-white">
            The Digital Procurement Backbone<br />
            of Egyptian Hospitality
          </h1>
          <p className="text-[15px] max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            We built HotelsVendors because Egyptian hotels deserved better than WhatsApp threads and Excel spreadsheets. The $21.5B hospitality sector was losing 15–20% of every order to logistics friction, manual invoicing, and opaque pricing. We fixed that.
          </p>
        </div>
      </section>

      {/* ── Origin Story ── */}
      <section className="py-16" style={{ backgroundColor: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <Eye size={24} className="mb-4" style={{ color: "var(--accent-base)" }} />
              <h2 className="text-[20px] font-semibold text-white mb-4">Why We Exist</h2>
              <p className="text-[14px] leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                Egyptian hotel procurement was broken. Coastal resorts in Sharm El-Sheikh and Hurghada relied on suppliers 400km away in Cairo, with logistics costs eating 15–20% of every order. Paper invoices. 180-day payment cycles. Zero visibility into spend.
              </p>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Existing tools were either generic global platforms that ignored ETA compliance, or legacy ERPs built for a different era. There was no Egypt-specific, hospitality-native operating system. So we built one.
              </p>
            </div>
            <div>
              <Target size={24} className="mb-4" style={{ color: "var(--accent-base)" }} />
              <h2 className="text-[20px] font-semibold text-white mb-4">What We Do</h2>
              <p className="text-[14px] leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                HotelsVendors is a four-sided marketplace: Hotels buy, Suppliers sell, Logistics fulfills, and Factoring provides liquidity. Every transaction flows through ETA-compliant invoicing and Authority Matrix governance.
              </p>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                We serve local branded hotel chains — Stella Di Mare, Sunrise, Jaz, Baron — properties where procurement complexity is highest and the pain is most acute. Depth over breadth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission + Vision ── */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="surface-card p-8 neon-card">
              <span className="label-upper mb-3 block text-foreground">Our Mission</span>
              <p className="text-[18px] font-medium text-white leading-snug">
                Digitize procurement for every Egyptian hotel — from boutique inns to 500-room resorts — removing friction, reducing cost, and ensuring full regulatory compliance.
              </p>
            </div>
            <div className="surface-card p-8 neon-card">
              <span className="label-upper mb-3 block text-foreground">Our Vision</span>
              <p className="text-[18px] font-medium text-white leading-snug">
                Become the Amazon of hospitality procurement in Egypt and the MENA region — the default operating system for how hotels buy, suppliers sell, and logistics delivers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Market Opportunity ── */}
      <section className="py-16" style={{ backgroundColor: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-5xl px-6">
          <span className="label-upper mb-3 block text-center">Market Opportunity</span>
          <h2 className="text-[22px] font-semibold text-white mb-10 text-center">The Numbers Speak for Themselves</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MARKET_STATS.map((s) => (
              <div key={s.label} className="surface-card p-6 text-center neon-card">
                <p className="text-[28px] font-semibold mb-1 metric-value" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[13px] font-medium text-white mb-1">{s.label}</p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <span className="label-upper mb-3 block text-center">How It Works</span>
          <h2 className="text-[22px] font-semibold text-white mb-10 text-center">Three Steps. Zero Friction.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.title} className="relative surface-card p-8 neon-card">
                <span
                  className="absolute top-4 right-4 text-[40px] font-bold leading-none"
                  style={{ color: `${step.color}15` }}
                >
                  {step.step}
                </span>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${step.color}12`, border: `1px solid ${step.color}25` }}
                >
                  <step.icon size={22} style={{ color: step.color }} />
                </div>
                <h3 className="text-[16px] font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-16" style={{ backgroundColor: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-5xl px-6">
          <span className="label-upper mb-3 block text-center">Our Team</span>
          <h2 className="text-[22px] font-semibold text-white mb-4 text-center">
            Founded by Hospitality + Fintech Veterans
          </h2>
          <p className="text-[14px] text-center mb-10 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            A team that understands both the Red Sea coast and the payment stack. We have built procurement systems, managed hotel operations, and shipped fintech products across Egypt.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {TEAM_ROLES.map((t) => (
              <div key={t.role} className="surface-card p-6 text-center neon-card">
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-[18px] font-semibold"
                  style={{ backgroundColor: `${t.color}12`, border: `1px solid ${t.color}25`, color: t.color }}
                >
                  <Users size={22} />
                </div>
                <p className="text-[13px] font-semibold text-white mb-1">{t.role}</p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{t.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Traction ── */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <span className="label-upper mb-3 block text-center">Early Traction</span>
          <h2 className="text-[22px] font-semibold text-white mb-10 text-center">Growing Across Egypt</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            {TRACTION_STATS.map((s) => (
              <div key={s.label}>
                <p className="text-[32px] font-semibold mb-1 metric-value" style={{ color: "var(--accent-base)" }}>{s.value}</p>
                <p className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] mt-6" style={{ color: "var(--text-muted)" }}>
            As of July 2026
          </p>
        </div>
      </section>

      {/* ── Trust Signals ── */}
      <section className="py-16" style={{ backgroundColor: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-5xl px-6">
          <span className="label-upper mb-3 block text-center">Trust & Compliance</span>
          <h2 className="text-[22px] font-semibold text-white mb-10 text-center">Built for Regulated Markets</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_SIGNALS.map((t) => (
              <div key={t.title} className="surface-card p-6 neon-card">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${t.color}12`, border: `1px solid ${t.color}22` }}
                >
                  <t.icon size={18} style={{ color: t.color }} />
                </div>
                <h3 className="text-[14px] font-semibold text-white mb-1">{t.title}</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <TrendingUp size={28} className="mx-auto mb-6" style={{ color: "var(--accent-base)" }} />
          <h2 className="text-[24px] font-semibold mb-4 text-white">
            Ready to Modernize Your Procurement?
          </h2>
          <p className="text-[14px] mb-8 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
            Join 480+ properties and 680+ suppliers already using HotelsVendors to cut costs, ensure compliance, and scale operations.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register" className="btn-accent">
              Get Started <ArrowRight size={14} />
            </Link>
            <Link href="/contact" className="btn-ghost">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
