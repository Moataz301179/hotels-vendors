import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Quote,
  Briefcase,
  Star,
  ShieldCheck,
  Building2,
  Target,
  Lightbulb,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About — Hotels Vendors | Built by an Auditor, for the Hospitality Industry",
    description:
      "Founded by a professional auditor who saw what others missed. Hotels Vendors is Egypt's first AI-powered procurement operating system — not just a marketplace, but a complete digital compliance and cashflow management platform.",
  };
}

const TIMELINE = [
  {
    year: "2024",
    title: "The Audit That Changed Everything",
    desc: "During a routine audit of a major hotel group, our founder observed procurement teams managing millions in EGP through WhatsApp messages and fragmented Excel sheets. The audit trail was incomplete. The cashflow was invisible. The compliance risk was unquantifiable.",
  },
  {
    year: "2025",
    title: "Architecture & MVP",
    desc: "Leveraging deep audit expertise in internal controls and best-practice frameworks, the platform was architected from first principles: every transaction traceable, every approval enforceable, every cost optimizable.",
  },
  {
    year: "2026",
    title: "AI & Ecosystem Expansion",
    desc: "Embedded artificial intelligence across sourcing, demand forecasting, and cashflow optimization. Launched shared-route logistics and non-recourse invoice factoring. Active network spans 52+ hotel properties and 100+ verified suppliers.",
  },
  {
    year: "2027",
    title: "National Infrastructure",
    desc: "Targeting complete coverage across Egypt's hospitality corridors: Cairo, Alexandria, Red Sea, South Sinai, and Upper Egypt — with AI-driven procurement intelligence becoming the industry standard.",
  },
];

const VALUES = [
  {
    icon: Target,
    title: "Audit-Grade Discipline",
    desc: "Every workflow designed with the rigor of a Big 4 audit. Tamper-proof authority matrices, immutable transaction logs, and zero-tolerance compliance enforcement — not as afterthoughts, but as the foundation.",
  },
  {
    icon: Lightbulb,
    title: "Systems Over Transactions",
    desc: "We don't connect buyers and sellers and walk away. We provide the operating system that governs every procurement decision — from requisition to payment — with intelligence that improves with every transaction.",
  },
  {
    icon: Building2,
    title: "Cashflow Intelligence",
    desc: "Procurement is not just about buying. It's about when you pay, how you pay, and how you optimize working capital. Our AI identifies savings no spreadsheet ever could.",
  },
  {
    icon: ShieldCheck,
    title: "Native Compliance",
    desc: "ETA e-invoicing is not a plugin — it is woven into the fabric of the platform. Every invoice is born compliant. Every submission is audit-ready from day one.",
  },
];

const STATS = [
  { value: "$21.5B", label: "Addressable Market", sub: "Egyptian hospitality 2026" },
  { value: "52+", label: "Hotel Properties", sub: "Across Egypt" },
  { value: "100+", label: "Verified Suppliers", sub: "Vetted & ETA-certified" },
  { value: "180+", label: "Product Categories", sub: "Hospitality SKUs" },
];

export default async function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="relative pt-36 pb-24">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-[#8B0000]/[0.03] rounded-full blur-[150px] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 text-[11px] font-medium uppercase tracking-[0.15em] mb-6">
              <Eye className="w-3 h-3" />
              Our Story
            </div>
            <h1 className="text-[32px] md:text-[48px] font-medium text-white leading-[1.1] tracking-[-0.02em]">
              We Don&apos;t Just See
              <br />
              the Market.
              <span className="text-white/30"> We See Through It.</span>
            </h1>
            <p className="mt-6 text-[16px] md:text-[18px] text-white/40 leading-relaxed max-w-xl">
              Founded by a professional auditor who spent years inside the financial machinery of Egyptian hospitality. What we observed was not a lack of suppliers — it was a systemic failure of process, visibility, and control.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#a50000] text-white text-[14px] font-medium rounded-xl transition-colors"
              >
                Join the Platform
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/[0.08] text-white/50 text-[14px] font-medium rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                Explore Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOUNDER'S LETTER
          ═══════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left — Quote */}
            <div className="lg:col-span-4">
              <div className="sticky top-28">
                <Quote className="w-10 h-10 text-white/10 mb-6" />
                <blockquote className="text-[22px] md:text-[26px] font-medium text-white leading-snug tracking-tight">
                  &ldquo;An auditor doesn&apos;t simply check the numbers. An auditor sees the gaps between what is happening and what should be happening. That is exactly what Hotels Vendors does for procurement.&rdquo;
                </blockquote>
                <div className="mt-8">
                  <p className="text-[15px] font-medium text-white">Moataz Abdel Ghani</p>
                  <p className="text-[13px] text-white/30">Founder & Chief Executive Officer</p>
                </div>
              </div>
            </div>

            {/* Right — Narrative */}
            <div className="lg:col-span-8 space-y-10">
              <div>
                <h2 className="text-[22px] md:text-[28px] font-medium text-white tracking-tight mb-4">
                  The Observation
                </h2>
                <p className="text-[15px] text-white/35 leading-relaxed">
                  As a professional auditor, I spent years inside the financial records of Egypt&apos;s largest hospitality groups. I reviewed procurement processes that were supposed to control millions in annual spend. What I found was alarming: purchase orders scattered across WhatsApp threads, supplier invoices reconciled in error-prone Excel files, approval chains that existed on paper but vanished in practice, and cashflow management that was essentially guesswork.
                </p>
                <p className="mt-4 text-[15px] text-white/35 leading-relaxed">
                  The hotels weren&apos;t struggling because they lacked suppliers. They were struggling because they lacked a system. There was no visibility. No enforceable controls. No audit trail. And when the Egyptian Tax Authority introduced mandatory e-invoicing, the gap between where these organizations were and where they needed to be became a chasm.
                </p>
              </div>

              <div>
                <h2 className="text-[22px] md:text-[28px] font-medium text-white tracking-tight mb-4">
                  The Insight
                </h2>
                <p className="text-[15px] text-white/35 leading-relaxed">
                  Every audit engagement reinforced the same pattern: the procurement function — the single largest controllable cost center in any hotel — was operating with tools designed for an era that no longer exists. The B2B marketplaces emerging in Egypt were solving the wrong problem. They were connecting buyers to sellers, but ignoring the fundamental operational and financial infrastructure that makes procurement work at scale.
                </p>
                <p className="mt-4 text-[15px] text-white/35 leading-relaxed">
                  A hotel group doesn&apos;t need another place to browse products. It needs a procurement operating system: enforced approval hierarchies, real-time spend analytics, ETA-compliant invoice generation, integrated logistics, embedded factoring for cashflow optimization, and AI that learns purchasing patterns to predict demand and flag anomalies.
                </p>
              </div>

              <div>
                <h2 className="text-[22px] md:text-[28px] font-medium text-white tracking-tight mb-4">
                  The Build
                </h2>
                <p className="text-[15px] text-white/35 leading-relaxed">
                  Hotels Vendors was architected from first principles by someone who had seen the inside of enough general ledgers to know exactly where value leaks and where controls fail. We built not a marketplace, but a complete digital procurement module — one that enforces best-practice governance by design. Every purchase order flows through an authority matrix that cannot be bypassed. Every invoice is ETA-compliant at the moment of creation.
                </p>
                <p className="mt-4 text-[15px] text-white/35 leading-relaxed">
                  Then we layered artificial intelligence on top — not as a chatbot gimmick, but as an embedded intelligence engine that analyzes historical spend, benchmarks supplier pricing, predicts inventory needs, and autonomously generates procurement recommendations that save time and money.
                </p>
              </div>

              <div>
                <h2 className="text-[22px] md:text-[28px] font-medium text-white tracking-tight mb-4">
                  The Difference
                </h2>
                <p className="text-[15px] text-white/35 leading-relaxed">
                  Other platforms will help you find a supplier. We will transform how your entire organization procures, pays, and optimizes. We see through the transaction to the system beneath it. We see the cashflow implications of every purchase decision. We see the compliance risk before the auditor does — because our founder was that auditor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[26px] md:text-[32px] font-medium text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-[11px] font-medium text-white/40 uppercase tracking-wide">
                  {stat.label}
                </div>
                <div className="text-[11px] text-white/20 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TIMELINE
          ═══════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/[0.04] bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="label-upper mb-4">Our Journey</p>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white">
              Milestones & Timeline
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/[0.06] md:-translate-x-px" />

            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-4 md:left-1/2 top-0 w-2.5 h-2.5 rounded-full bg-[#8B0000] -translate-x-1/2 mt-2 ring-4 ring-black" />

                  <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className={`p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] ${i % 2 === 0 ? "md:mr-8" : "md:ml-8"}`}>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] text-white/60 text-[11px] font-medium uppercase tracking-wider mb-3">
                        <Clock className="w-3 h-3" />
                        {item.year}
                      </div>
                      <h3 className="text-[16px] font-medium text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[13px] text-white/35 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          VALUES
          ═══════════════════════════════════════════ */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="label-upper mb-4">What Drives Us</p>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {VALUES.map((item) => (
              <div
                key={item.title}
                className="flex gap-5 p-7 rounded-2xl border border-white/[0.06] bg-[#0a0a0a] hover:border-white/[0.12] transition-all group"
              >
                <item.icon className="w-6 h-6 text-white/20 shrink-0 mt-0.5 group-hover:text-white/40 transition-colors" />
                <div>
                  <h3 className="text-[15px] font-medium text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-white/35 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="py-24 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/[0.06] p-12 md:p-20 text-center cta-bleed">
            <div className="relative z-10">
              <h2 className="text-[28px] md:text-[40px] font-medium text-white tracking-tight">
                Ready to See
                <br />
                <span className="text-white/30">What We See?</span>
              </h2>
              <p className="mt-5 text-[15px] text-white/35 max-w-lg mx-auto">
                Join the hospitality groups that have replaced procurement chaos with audit-grade control, AI-powered intelligence, and real-time spend visibility.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#8B0000] hover:bg-[#a50000] text-white text-[14px] font-medium rounded-xl transition-colors"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/solutions"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/[0.08] text-white/50 text-[14px] font-medium rounded-xl hover:bg-white/[0.04] transition-colors"
                >
                  Explore Solutions
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
