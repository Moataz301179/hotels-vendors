import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Target,
  Users,
  TrendingUp,
  Building2,
  ShieldCheck,
  Globe,
  Award,
  CheckCircle2,
  Clock,
  Briefcase,
  Landmark,
  Truck,
  Banknote,
  Zap,
  Eye,
  BarChart3,
  Lightbulb,
  Layers,
  Quote,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { getCmsPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsPage("about");
  return {
    title: cms?.metaTitle || "Our Story — Hotels Vendors | Founded by an Auditor's Vision",
    description:
      cms?.metaDescription ||
      "Founded by a professional auditor who saw what others missed. Hotels Vendors is Egypt's first AI-powered procurement operating system — not just a marketplace, but a complete digital compliance and cashflow management platform built for hospitality.",
  };
}

const STATS = [
  { value: "$21.5B", label: "Addressable Market", sub: "Egyptian hospitality 2026" },
  { value: "7.12%", label: "CAGR", sub: "Annual growth rate" },
  { value: "68", label: "Verified Suppliers", sub: "Vetted & ETA-certified" },
  { value: "52", label: "Hotel Properties", sub: "Across 8 governorates" },
  { value: "180+", label: "Product Categories", sub: "Hospitality SKUs" },
  { value: "100%", label: "ETA Compliant", sub: "Full e-invoicing" },
];

const TIMELINE = [
  {
    year: "2024",
    title: "The Audit That Changed Everything",
    desc: "During a routine audit of a major hotel group, our founder observed procurement teams managing millions in EGP through WhatsApp messages and fragmented Excel sheets. The audit trail was incomplete. The cashflow was invisible. The compliance risk was unquantifiable. The idea for Hotels Vendors was born.",
  },
  {
    year: "2025",
    title: "Architecture & MVP",
    desc: "Leveraging deep audit expertise in internal controls and best-practice frameworks, the platform was architected from first principles: every transaction must be traceable, every approval must be enforceable, every cost must be optimizable. The first procurement module launched with 50+ categories and native ETA integration.",
  },
  {
    year: "2026",
    title: "AI & Ecosystem Expansion",
    desc: "Embedded artificial intelligence across sourcing, demand forecasting, and cashflow optimization. Launched shared-route logistics and non-recourse invoice factoring. Active network spans 52 hotel properties and 68 verified suppliers across Egypt's key hospitality corridors — each with full audit-grade transaction history.",
  },
  {
    year: "2027",
    title: "National Infrastructure",
    desc: "Targeting complete coverage across Egypt's hospitality corridors: Cairo, Alexandria, Red Sea, South Sinai, and Upper Egypt — with AI-driven procurement intelligence becoming the industry standard for Egyptian hotel operations.",
  },
];

const TEAM = [
  {
    initials: "MAG",
    name: "Moataz Abdel Ghani",
    role: "Founder & Chief Executive Officer",
    bio: "Professional auditor with deep expertise in internal controls, risk governance, and hospitality financial operations. Built Hotels Vendors after witnessing firsthand how fragmented procurement was destroying value across Egyptian hotel groups.",
  },
];

const PARTNERS = [
  "Egyptian Tax Authority",
  "Pickalbatros Hotels",
  "Hilton",
  "Marriott",
  "Accor",
  "Four Seasons",
  "InterContinental",
  "Steigenberger",
];

const VALUES = [
  {
    title: "Audit-Grade Discipline",
    desc: "Every workflow is designed with the rigor of a Big 4 audit. Tamper-proof authority matrices, immutable transaction logs, and zero-tolerance compliance enforcement come standard — not as afterthoughts.",
  },
  {
    title: "Systems Over Transactions",
    desc: "We do not connect buyers and sellers and walk away. We provide the operating system that governs every procurement decision — from requisition to payment — with intelligence that improves with every transaction.",
  },
  {
    title: "Cashflow Intelligence",
    desc: "Procurement is not just about buying. It is about when you pay, how you pay, and how you optimize working capital. Our AI identifies savings and cashflow opportunities that no spreadsheet ever could.",
  },
  {
    title: "Native Compliance",
    desc: "ETA e-invoicing is not a plugin or an integration — it is woven into the fabric of the platform. Every invoice is born compliant. Every submission is audit-ready from day one.",
  },
];

export default async function AboutPage() {
  const cms = await getCmsPage("about");
  return (
    <main className="min-h-screen bg-black">
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          HERO — The Founder's Vision
          ═══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 bg-[#f8f9fa]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B0000]/10 border border-[#8B0000]/20 text-[#8B0000] text-[11px] font-semibold uppercase tracking-[0.15em] mb-6">
              <Eye className="w-3 h-3" />
              Our Story
            </div>
            <h1 className="text-[30px] md:text-[44px] font-bold text-gray-900 leading-[1.1] tracking-[-0.02em]">
              {cms?.heroTitle || "We Do Not Just See the Market. We See Through It."}
            </h1>
            <p className="mt-6 text-[14px] md:text-[16px] text-gray-500 leading-relaxed max-w-xl">
              {cms?.heroDescription || "Founded by a professional auditor who spent years inside the financial machinery of Egyptian hospitality. What we observed was not a lack of suppliers — it was a systemic failure of process, visibility, and control. Hotels Vendors was built to fix what others could not even see."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#6B0000] text-white text-[14px] font-semibold rounded-lg transition-colors"
              >
                Join the Platform
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 text-[14px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Explore the Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOUNDER'S LETTER
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left — Quote */}
            <div className="lg:col-span-4">
              <div className="sticky top-28">
                <Quote className="w-10 h-10 text-[#8B0000] mb-6" />
                <blockquote className="text-[20px] md:text-[24px] font-medium text-white leading-snug tracking-tight">
                  "An auditor does not simply check the numbers. An auditor sees the gaps between what is happening and what should be happening. That is exactly what Hotels Vendors does for procurement."
                </blockquote>
                <div className="mt-6">
                  <p className="text-[15px] font-semibold text-white">Moataz Abdel Ghani</p>
                  <p className="text-[13px] text-[#8B0000]">Founder & Chief Executive Officer</p>
                </div>
              </div>
            </div>

            {/* Right — Narrative */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <h2 className="text-[24px] md:text-[30px] font-bold text-white tracking-tight mb-4">
                  The Observation
                </h2>
                <p className="text-[14px] md:text-[15px] text-gray-400 leading-relaxed">
                  As a professional auditor, I spent years inside the financial records of Egypt's largest hospitality groups. I reviewed procurement processes that were supposed to control millions in annual spend. What I found was alarming: purchase orders scattered across WhatsApp threads, supplier invoices reconciled in error-prone Excel files, approval chains that existed on paper but vanished in practice, and cashflow management that was essentially guesswork.
                </p>
                <p className="mt-4 text-[14px] md:text-[15px] text-gray-400 leading-relaxed">
                  The hotels were not struggling because they lacked suppliers. They were struggling because they lacked a system. There was no visibility. No enforceable controls. No audit trail. And when the Egyptian Tax Authority introduced mandatory e-invoicing, the gap between where these organizations were and where they needed to be became a chasm.
                </p>
              </div>

              <div>
                <h2 className="text-[24px] md:text-[30px] font-bold text-white tracking-tight mb-4">
                  The Insight
                </h2>
                <p className="text-[14px] md:text-[15px] text-gray-400 leading-relaxed">
                  Every audit engagement reinforced the same pattern: the procurement function — the single largest controllable cost center in any hotel — was operating with tools designed for an era that no longer exists. The B2B marketplaces emerging in Egypt were solving the wrong problem. They were connecting buyers to sellers, which is useful, but they were ignoring the fundamental operational and financial infrastructure that makes procurement work at scale.
                </p>
                <p className="mt-4 text-[14px] md:text-[15px] text-gray-400 leading-relaxed">
                  A hotel group does not need another place to browse products. It needs a procurement operating system: enforced approval hierarchies, real-time spend analytics, ETA-compliant invoice generation, integrated logistics, embedded factoring for cashflow optimization, and artificial intelligence that learns purchasing patterns to predict demand, negotiate better terms, and flag anomalies before they become losses.
                </p>
              </div>

              <div>
                <h2 className="text-[24px] md:text-[30px] font-bold text-white tracking-tight mb-4">
                  The Build
                </h2>
                <p className="text-[14px] md:text-[15px] text-gray-400 leading-relaxed">
                  Hotels Vendors was architected from first principles by someone who had seen the inside of enough general ledgers to know exactly where value leaks and where controls fail. We built not a marketplace, but a complete digital procurement module — one that enforces best-practice governance by design, not by policy memo. Every purchase order flows through an authority matrix that cannot be bypassed. Every invoice is ETA-compliant at the moment of creation. Every transaction feeds into a real-time financial intelligence layer that shows exactly where your money is going, when it is going, and how to optimize it.
                </p>
                <p className="mt-4 text-[14px] md:text-[15px] text-gray-400 leading-relaxed">
                  Then we layered artificial intelligence on top. Not as a chatbot gimmick, but as an embedded intelligence engine that analyzes historical spend, benchmarks supplier pricing, predicts inventory needs, and autonomously generates procurement recommendations that save time and money. This is not automation for automation's sake. This is an AI that knows your operation better than any single employee ever could — because it sees every transaction across every property, every day, in real time.
                </p>
              </div>

              <div>
                <h2 className="text-[24px] md:text-[30px] font-bold text-white tracking-tight mb-4">
                  The Difference
                </h2>
                <p className="text-[14px] md:text-[15px] text-gray-400 leading-relaxed">
                  Other platforms will help you find a supplier. We will transform how your entire organization procures, pays, and optimizes. We see through the transaction to the system beneath it. We see the cashflow implications of every purchase decision. We see the compliance risk before the auditor does — because our founder was that auditor.
                </p>
                <p className="mt-4 text-[14px] md:text-[15px] text-gray-400 leading-relaxed">
                  Our goal is not to be the biggest B2B marketplace in Egypt. Our goal is to be the most indispensable operating system for hospitality procurement in the region — a platform that pays for itself not by charging fees, but by generating measurable, audit-verifiable savings in cost, time, and working capital. Every property that joins Hotels Vendors gains a procurement intelligence advantage that compounds with every transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[26px] md:text-[30px] font-bold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] font-medium text-[#8B0000] uppercase tracking-wide">
                  {stat.label}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TIMELINE / MILESTONES
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/10 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#8B0000] uppercase tracking-[0.2em] mb-3">
              Our Journey
            </p>
            <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight">
              Milestones & Timeline
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-px" />

            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* dot */}
                  <div className="absolute left-4 md:left-1/2 top-0 w-2 h-2 rounded-full bg-[#8B0000] -translate-x-1/2 mt-2" />

                  {/* content */}
                  <div className="ml-10 md:ml-0 md:w-1/2 md:text-right">
                    <div
                      className={`p-6 rounded-2xl bg-[#111] border border-white/10 shadow-sm ${
                        i % 2 === 0 ? "md:mr-8" : "md:ml-8 md:text-left"
                      }`}
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B0000]/10 text-[#8B0000] text-[11px] font-semibold uppercase tracking-wider mb-3">
                        <Clock className="w-3 h-3" />
                        {item.year}
                      </div>
                      <h3 className="text-[16px] font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[13px] text-gray-400 leading-relaxed">
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
      <section className="py-20 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#8B0000] uppercase tracking-[0.2em] mb-3">
              What Drives Us
            </p>
            <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {VALUES.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-6 rounded-2xl border border-white/10 bg-[#111] shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-[#8B0000] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[15px] font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TEAM / LEADERSHIP
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/10 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#8B0000] uppercase tracking-[0.2em] mb-3">
              Leadership
            </p>
            <h2 className="text-[28px] md:text-[36px] font-bold text-white tracking-tight">
              Meet the Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="group p-6 rounded-2xl bg-[#111] border border-white/10 hover:border-white/15 transition-all shadow-sm"
              >
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-500 text-[11px] font-bold tracking-widest group-hover:bg-[#8B0000]/10 group-hover:border-[#8B0000]/20 group-hover:text-[#8B0000] transition-all">
                  {member.initials}
                </div>
                <h3 className="text-[16px] font-semibold text-white mb-0.5">
                  {member.name}
                </h3>
                <p className="text-[11px] font-medium text-[#8B0000] uppercase tracking-wide mb-3">
                  {member.role}
                </p>
                <p className="text-[13px] text-gray-400 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PARTNERS / TRUST BADGES
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold text-[#8B0000] uppercase tracking-[0.2em] mb-3">
              Trusted By
            </p>
            <h2 className="text-[22px] md:text-[28px] font-bold text-white tracking-tight">
              Partners & Industry Leaders
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {PARTNERS.map((partner) => (
              <span
                key={partner}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#111] border border-white/10 text-[13px] text-gray-400 hover:border-white/15 transition-colors shadow-sm"
              >
                <Briefcase className="w-3.5 h-3.5 text-gray-600" />
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#111] border border-white/10 p-10 md:p-16 text-center shadow-sm">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B0000]/[0.08] rounded-full blur-[120px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-[28px] md:text-[38px] font-bold text-white tracking-tight">
                {cms?.ctaTitle || "Ready to See What We See?"}
              </h2>
              <p className="mt-4 text-[14px] md:text-[15px] text-gray-400 max-w-xl mx-auto">
                {cms?.ctaDescription || "Join the hospitality groups that have replaced procurement chaos with audit-grade control, AI-powered intelligence, and measurable cost savings."}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#6B0000] text-white text-[14px] font-semibold rounded-lg transition-colors"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-gray-300 text-[14px] font-medium rounded-lg hover:bg-white/5 transition-colors"
                >
                  Browse the Marketplace
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
