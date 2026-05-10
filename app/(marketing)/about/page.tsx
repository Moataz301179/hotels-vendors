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
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { getCmsPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getCmsPage("about");
  return {
    title: cms?.metaTitle || "About Us — Hotels Vendors | Digital Procurement Hub",
    description:
      cms?.metaDescription ||
      "Hotels Vendors is Egypt's first AI-powered digital procurement hub for hospitality. $21.5B market, 7.12% CAGR. Built by hospitality professionals, for hospitality professionals.",
  };
}

const STATS = [
  { value: "$21.5B", label: "Addressable Market", sub: "Egyptian hospitality 2026" },
  { value: "7.12%", label: "CAGR", sub: "Annual growth rate" },
  { value: "1,200+", label: "Verified Suppliers", sub: "Vetted & ETA-certified" },
  { value: "450+", label: "Hotel Buyers", sub: "Properties nationwide" },
  { value: "48hr", label: "Delivery Guarantee", sub: "Nationwide Egypt" },
  { value: "100%", label: "ETA Compliant", sub: "Full e-invoicing" },
];

const TIMELINE = [
  {
    year: "2024",
    title: "Platform Conceived",
    desc: "Moataz Abdel Ghani identified the procurement chaos in Egyptian hospitality and architected the Hotels Vendors platform from the ground up.",
  },
  {
    year: "2025",
    title: "MVP & Pilot Program",
    desc: "Launched core procurement engine with 50+ product categories, ETA e-invoicing integration, and onboarded first 50 hotel properties.",
  },
  {
    year: "2026",
    title: "AI-Powered Expansion",
    desc: "Introduced AI sourcing, embedded factoring, and shared-route logistics. Scaled to 1,200+ suppliers and 450+ hotel buyers.",
  },
  {
    year: "2027",
    title: "National Scale",
    desc: "Targeting full coverage of Egypt's hospitality corridors: Cairo, Alexandria, Red Sea, South Sinai, and Upper Egypt.",
  },
];

const TEAM = [
  {
    initials: "MAG",
    name: "Moataz Abdel Ghani",
    role: "Founder & CEO",
    bio: "Former Big 4 consultant with deep expertise in hospitality risk management and procurement governance.",
  },
  {
    initials: "CTO",
    name: "Chief Technology Officer",
    role: "Engineering Lead",
    bio: "15+ years building fintech and B2B marketplace platforms at scale.",
  },
  {
    initials: "CPO",
    name: "Chief Product Officer",
    role: "Product Strategy",
    bio: "Hospitality operations veteran shaping product-market fit for Egyptian hotel groups.",
  },
  {
    initials: "COO",
    name: "Chief Operating Officer",
    role: "Operations & Growth",
    bio: "Supply chain expert driving supplier acquisition and logistics network expansion.",
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
    title: "Institutional-Grade Trust",
    desc: "Every workflow and compliance check reflects Big 4 rigor. We handle millions in EGP transactions with zero tolerance for errors.",
  },
  {
    title: "Speed Without Sacrifice",
    desc: "Procurement admin cut by 80%. From days to minutes — without compromising approval chains or audit trails.",
  },
  {
    title: "Local First",
    desc: "Built for Egyptian hospitality. Native ETA integration. Local supplier networks. Arabic-ready. Egypt-focused.",
  },
  {
    title: "Transparent Pricing",
    desc: "No hidden fees. Fixed supplier pricing. Clear transaction fees. No bidding wars, no surprises.",
  },
];

export default async function AboutPage() {
  const cms = await getCmsPage("about");
  return (
    <main className="min-h-screen bg-[#050505]">
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          HERO — Mission
          ═══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e11d48]/10 border border-[#e11d48]/20 text-[#e11d48] text-[11px] font-semibold uppercase tracking-[0.15em] mb-6">
              <Target className="w-3 h-3" />
              Our Mission
            </div>
            <h1 className="text-[42px] md:text-[64px] font-bold text-white leading-[1.05] tracking-[-0.02em]">
              {cms?.heroTitle || "Built by hospitality professionals, for hospitality professionals."}
            </h1>
            <p className="mt-6 text-[16px] md:text-[18px] text-white/50 leading-relaxed max-w-xl">
              {cms?.heroDescription || "Rooted in Egypt. Engineered for scale. We are replacing WhatsApp and Excel with one intelligent procurement platform that cuts costs, guarantees compliance, and accelerates growth for every stakeholder."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#e11d48] hover:bg-[#be123c] text-white text-[14px] font-semibold rounded-lg transition-colors"
              >
                Join the Platform
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-[14px] font-medium rounded-lg hover:bg-white/5 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <div className="bg-[#0f0f0f] border border-white/[0.06] rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[28px] md:text-[32px] font-bold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] font-medium text-[#e11d48] uppercase tracking-wide">
                  {stat.label}
                </div>
                <div className="text-[11px] text-white/30 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TIMELINE / MILESTONES
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#e11d48] uppercase tracking-[0.2em] mb-3">
              Our Journey
            </p>
            <h2 className="text-[32px] md:text-[40px] font-bold text-white tracking-tight">
              Milestones & Timeline
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/[0.08] md:-translate-x-px" />

            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* dot */}
                  <div className="absolute left-4 md:left-1/2 top-0 w-2 h-2 rounded-full bg-[#e11d48] -translate-x-1/2 mt-2" />

                  {/* content */}
                  <div className="ml-10 md:ml-0 md:w-1/2 md:text-right">
                    <div
                      className={`p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.06] ${
                        i % 2 === 0 ? "md:mr-8" : "md:ml-8 md:text-left"
                      }`}
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e11d48]/10 text-[#e11d48] text-[11px] font-semibold uppercase tracking-wider mb-3">
                        <Clock className="w-3 h-3" />
                        {item.year}
                      </div>
                      <h3 className="text-[16px] font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[13px] text-white/40 leading-relaxed">
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
          TEAM / LEADERSHIP
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#e11d48] uppercase tracking-[0.2em] mb-3">
              Leadership
            </p>
            <h2 className="text-[32px] md:text-[40px] font-bold text-white tracking-tight">
              Meet the Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="group p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.06] hover:border-white/[0.12] transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4 text-white/30 text-[11px] font-bold tracking-widest group-hover:bg-[#e11d48]/10 group-hover:border-[#e11d48]/20 group-hover:text-[#e11d48] transition-all">
                  {member.initials}
                </div>
                <h3 className="text-[16px] font-semibold text-white mb-0.5">
                  {member.name}
                </h3>
                <p className="text-[11px] font-medium text-[#e11d48] uppercase tracking-wide mb-3">
                  {member.role}
                </p>
                <p className="text-[13px] text-white/40 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          VALUES
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#e11d48] uppercase tracking-[0.2em] mb-3">
              What Drives Us
            </p>
            <h2 className="text-[32px] md:text-[40px] font-bold text-white tracking-tight">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {VALUES.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-6 rounded-2xl border border-white/[0.06] bg-[#0f0f0f]"
              >
                <CheckCircle2 className="w-5 h-5 text-[#e11d48] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[15px] font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-white/40 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PARTNERS / TRUST BADGES
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold text-[#e11d48] uppercase tracking-[0.2em] mb-3">
              Trusted By
            </p>
            <h2 className="text-[24px] md:text-[32px] font-bold text-white tracking-tight">
              Partners & Industry Leaders
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {PARTNERS.map((partner) => (
              <span
                key={partner}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f0f0f] border border-white/[0.06] text-[13px] text-white/50 hover:border-white/[0.12] transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-white/30" />
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#0f0f0f] border border-white/[0.06] p-10 md:p-16 text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e11d48]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-[32px] md:text-[44px] font-bold text-white tracking-tight">
                {cms?.ctaTitle || "Ready to Transform Your Procurement?"}
              </h2>
              <p className="mt-4 text-[15px] text-white/40 max-w-xl mx-auto">
                {cms?.ctaDescription || "Join hundreds of hotels and suppliers already benefiting from smarter, faster, more transparent procurement across Egypt."}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#e11d48] hover:bg-[#be123c] text-white text-[14px] font-semibold rounded-lg transition-colors"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-[14px] font-medium rounded-lg hover:bg-white/5 transition-colors"
                >
                  Back to Home
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
