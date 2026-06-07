import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BrainCircuit,
  Receipt,
  Banknote,
  ShieldCheck,
  Store,
  PackageSearch,
  ChevronRight,
  Building2,
  Users,
  Landmark,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "HotelsVendors — Procurement OS for Egyptian Hospitality",
    description:
      "One platform for hotel procurement. AI-powered demand sensing, ETA-compliant invoicing, embedded factoring, and a verified supplier network. Built for Egyptian hospitality.",
  };
}

const STATS = [
  { value: "52", label: "Hotel Properties" },
  { value: "100+", label: "Verified Suppliers" },
  { value: "100%", label: "ETA Compliant" },
  { value: "EGP 86M", label: "Monthly GMV" },
];

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "AI Demand Sensing",
    desc: "Predicts what each outlet needs before stockouts occur. Auto-generates purchase orders.",
  },
  {
    icon: Receipt,
    title: "ETA E-Invoicing",
    desc: "Every invoice digitally signed, UUID-tagged, and submitted to the tax authority. Automatically.",
  },
  {
    icon: Banknote,
    title: "Embedded Factoring",
    desc: "Suppliers get paid in 24 hours. Hotels preserve working capital. Zero default risk via INVO.",
    badge: "INVO",
    badgeColor: "#D4A843",
  },
  {
    icon: ShieldCheck,
    title: "Authority Matrix",
    desc: "Multi-level approval chains enforced at the database layer. No bypass. Full audit trail.",
  },
  {
    icon: Store,
    title: "Verified Suppliers",
    desc: "Every supplier audited for commercial registration, tax compliance, and delivery track record.",
  },
  {
    icon: PackageSearch,
    title: "Procurement Intelligence",
    desc: "Cross-property spend analysis, price benchmarking, and anomaly detection across your network.",
  },
];

const ROLES = [
  {
    icon: Building2,
    title: "Hotel Buyers",
    desc: "Browse catalogs, place orders, track deliveries, manage invoices — all from one dashboard.",
    href: "/register",
    cta: "Start Procuring",
  },
  {
    icon: Users,
    title: "Suppliers",
    desc: "List your catalog, reach 52+ hotels, get paid faster with INVO factoring. Subscribe on INVO →",
    href: "/invo",
    cta: "List on INVO",
    accent: true,
  },
  {
    icon: Landmark,
    title: "Capital Partners",
    desc: "Deploy capital with full visibility into every transaction. Non-recourse factoring with verified hotel cash flows.",
    href: "/register",
    cta: "Partner With Us",
  },
];

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[600px] md:min-h-[680px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80"
            alt="Luxury hotel lobby"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-[120px] pb-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B0000]/90 text-white text-[11px] font-medium uppercase tracking-[0.15em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Now Operating in Egypt
            </div>

            <h1 className="text-[28px] md:text-[44px] font-medium text-white leading-[1.1] tracking-[-0.02em]">
              Procurement Under
              <br />
              One Slate.
            </h1>

            <p className="mt-6 text-[15px] md:text-[17px] text-white/60 leading-relaxed max-w-xl">
              AI-powered demand sensing. ETA-compliant invoicing. Embedded factoring via{" "}
              <Link href="/invo" className="text-[#D4A843] hover:text-[#e0b856] transition-colors">
                INVO
              </Link>
              . A verified supplier network. Everything a hotel procurement team needs — in one platform.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#a50000] text-white text-[14px] font-medium rounded-lg transition-colors"
              >
                Request Platform Access
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/invo"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[rgba(212,168,67,0.3)] text-[#D4A843] text-[14px] font-medium rounded-lg hover:bg-[rgba(212,168,67,0.06)] transition-colors"
              >
                INVO for Suppliers
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 -mt-8 mx-auto max-w-5xl px-6">
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[24px] md:text-[28px] font-medium text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] font-medium text-white/40 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-xl mb-14">
            <p className="label-upper mb-4">Platform Capabilities</p>
            <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight">
              Everything procurement needs.
              <br />
              <span className="text-white/40">Nothing it doesn't.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="surface-card p-6 hover-lift group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(139,0,0,0.1)] border border-[rgba(139,0,0,0.15)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-[15px] text-white tracking-tight">{f.title}</h3>
                      {f.badge && (
                        <span
                          className="text-[9px] font-medium uppercase tracking-[0.1em] px-1.5 py-0.5 rounded"
                          style={{ color: f.badgeColor, border: `1px solid ${f.badgeColor}33` }}
                        >
                          {f.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-white/45 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ROLES */}
      <section id="hotels" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-xl mb-14">
            <p className="label-upper mb-4">Who It's For</p>
            <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight">
              One platform.
              <br />
              <span className="text-white/40">Three roles. Zero friction.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROLES.map((r) => (
              <div key={r.title} className="surface-card p-7 hover-lift">
                <r.icon className={`w-8 h-8 mb-5 ${r.accent ? "text-[#D4A843]" : "text-white/60"}`} />
                <h3 className="text-[17px] text-white mb-2 tracking-tight">{r.title}</h3>
                <p className="text-[13px] text-white/45 leading-relaxed mb-6">{r.desc}</p>
                <Link
                  href={r.href}
                  className={`inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors ${
                    r.accent
                      ? "text-[#D4A843] hover:text-[#e0b856]"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {r.cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/[0.06] p-10 md:p-16 text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B0000]/[0.06] rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-[24px] md:text-[34px] font-medium text-white tracking-tight">
                Ready to consolidate your procurement?
              </h2>
              <p className="mt-4 text-[14px] text-white/45 max-w-lg mx-auto">
                Join 52+ hotel properties that have turned procurement from a cost center
                into a competitive advantage.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#a50000] text-white text-[14px] font-medium rounded-lg transition-colors"
                >
                  Request Platform Access
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/invo"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[rgba(212,168,67,0.25)] text-[#D4A843] text-[14px] font-medium rounded-lg hover:bg-[rgba(212,168,67,0.04)] transition-colors"
                >
                  Explore INVO for Suppliers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
