"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Truck, Landmark, ArrowRight, CheckCircle, Shield, Globe, Zap, Clock } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

const PARTNER_TYPES = [
  {
    slug: "logistics",
    label: "Logistics Partner",
    icon: Truck,
    color: "#06b6d4",
    tagline: "Deliver for Egypt's hotel industry",
    description:
      "Join our shared-route delivery network. Receive consolidated shipment requests from multiple hotels on optimized routes, reduce deadhead miles, and get paid within 48 hours of delivery confirmation.",
    benefits: [
      "Consolidated multi-hotel routes",
      "Real-time dispatch via driver app",
      "48-hour payment settlement",
      "Temperature-controlled cargo tiers",
      "Damage/shortage dispute resolution",
    ],
    requirements: [
      "Commercial registration valid in Egypt",
      "Fleet of 3+ refrigerated vehicles",
      "Cargo insurance minimum EGP 1M",
      "ETA-compliant delivery documentation",
    ],
    cta: "Apply as Logistics Partner",
    href: "/partner/logistics/apply",
  },
  {
    slug: "financial",
    label: "Financial Partner",
    icon: Landmark,
    color: "#f59e0b",
    tagline: "Fund Egypt's hospitality supply chain",
    description:
      "Provide non-recourse invoice factoring and credit facilities to verified suppliers. Access a pipeline of vetted, ETA-compliant receivables from Egypt's hotel sector with full transaction transparency.",
    benefits: [
      "Pre-vetted supplier receivables",
      "ETA-compliant invoice verification",
      "Real-time portfolio dashboard",
      "Automated disbursement triggers",
      "Recourse & dispute management tools",
    ],
    requirements: [
      "Licensed financial institution in Egypt",
      "Minimum EGP 10M factoring capacity",
      "CIB/EFG-equivalent credit risk framework",
      "Integration via REST API or SFTP",
    ],
    cta: "Apply as Financial Partner",
    href: "/partner/financial/apply",
  },
];

const TRUST_SIGNALS = [
  { icon: Shield, label: "Bank-grade KYC", desc: "Every partner verified" },
  { icon: Globe, label: "Nationwide Coverage", desc: "All 27 governorates" },
  { icon: Zap, label: "Fast Onboarding", desc: "Approved in 48 hours" },
  { icon: Clock, label: "Same-day Support", desc: "Dedicated partner success" },
];

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-black">
      <MarketingNav />

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-white/50 uppercase tracking-wider mb-5">
              <Zap size={11} />
              Partner Program
            </div>
            <h1 className="text-[32px] md:text-[42px] font-bold text-white leading-[1.1] tracking-[-0.02em]">
              Partner with Egypt's Hospitality Procurement Network
            </h1>
            <p className="mt-4 text-[14px] md:text-[15px] text-white/35 leading-relaxed">
              We work with licensed logistics providers and regulated financial institutions to serve Egypt's hotel sector. Applications are reviewed within 2 business days.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-y border-white/[0.04] bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_SIGNALS.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <s.icon size={16} className="text-white/30" />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-white/60">{s.label}</p>
                  <p className="text-[11px] text-white/25">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {PARTNER_TYPES.map((partner, i) => (
              <motion.div
                key={partner.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden"
              >
                {/* Header */}
                <div className="px-6 pt-6 pb-5 border-b border-white/[0.04]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${partner.color}15`, border: `1px solid ${partner.color}25` }}>
                      <partner.icon size={20} style={{ color: partner.color }} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold text-white">{partner.label}</h3>
                      <p className="text-[11px] text-white/30">{partner.tagline}</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-white/30 leading-relaxed">{partner.description}</p>
                </div>

                {/* Benefits */}
                <div className="px-6 py-5 border-b border-white/[0.04]">
                  <p className="text-[10px] font-medium text-white/20 uppercase tracking-wider mb-3">What you get</p>
                  <div className="space-y-2">
                    {partner.benefits.map((b) => (
                      <div key={b} className="flex items-center gap-2">
                        <CheckCircle size={12} className="text-emerald-500/60 flex-shrink-0" />
                        <span className="text-[12px] text-white/45">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="px-6 py-5 border-b border-white/[0.04]">
                  <p className="text-[10px] font-medium text-white/20 uppercase tracking-wider mb-3">Requirements</p>
                  <div className="space-y-2">
                    {partner.requirements.map((r) => (
                      <div key={r} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/15 flex-shrink-0" />
                        <span className="text-[12px] text-white/30">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 py-5">
                  <Link
                    href={partner.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all"
                    style={{ background: partner.color, opacity: 0.9 }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.9")}
                  >
                    {partner.cta}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-[11px] text-white/20 uppercase tracking-wider mb-3">Questions?</p>
          <h2 className="text-[20px] md:text-[24px] font-semibold text-white tracking-tight mb-2">
            Not sure which program fits?
          </h2>
          <p className="text-[13px] text-white/30 mb-5">
            Our partnership team reviews every application and will guide you to the right track.
          </p>
          <a
            href="mailto:partners@hotelsvendors.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.08] text-[13px] text-white/50 hover:text-white/80 hover:border-white/[0.12] transition-all"
          >
            partners@hotelsvendors.com
          </a>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
