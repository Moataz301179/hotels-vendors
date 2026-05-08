"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  Globe,
  Award,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { BrandLogo } from "@/components/layout/brand-logo";

export default function AboutPage() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <MarketingNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-[12px] font-medium text-[#022349] tracking-[0.15em] uppercase mb-6">
              About Us
            </p>
            <h1 className="text-[48px] sm:text-[64px] font-bold text-white leading-[1.05] tracking-[-0.03em]">
              Built by hospitality professionals, for hospitality professionals.
            </h1>
            <p className="mt-6 text-[18px] text-white/50 leading-[1.7] max-w-xl">
              Rooted in Egypt. Engineered for scale. We are replacing WhatsApp
              and Excel with one intelligent procurement platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 border-y border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-16 items-start">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/[0.08]">
                <Image
                  src="/moataz-ceo.jpg"
                  alt="Moataz Abdel Ghani — CEO & Founder"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] text-5xl font-bold text-white/25">
                  MAG
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold text-white">
                  Moataz Abdel Ghani
                </p>
                <p className="text-[13px] text-white/40">
                  Founder & Chief Executive Officer
                </p>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="pt-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <Award size={16} className="text-[#022349]" />
                <span className="text-[11px] font-semibold text-[#022349] uppercase tracking-widest">
                  Founder & CEO
                </span>
              </div>

              <p className="text-[16px] text-white/50 leading-[1.7]">
                Hotels Vendors was conceived, architected, and built from the
                ground up by{" "}
                <strong className="text-white">Moataz Abdel Ghani</strong> —
                a management consultant and internal audit professional with deep
                experience across Big 4 firms and multinational corporations.
              </p>

              <p className="mt-4 text-[16px] text-white/50 leading-[1.7]">
                Before founding Hotels Vendors, Moataz spent years inside{" "}
                <strong className="text-white">Ernst & Young (EY)</strong>,{" "}
                <strong className="text-white">Deloitte</strong>, and{" "}
                <strong className="text-white">KPMG</strong> — delivering
                business solutions, risk management frameworks, and internal audit
                programs for Fortune 500 clients and large-scale hospitality groups
                across the Middle East and Africa.
              </p>

              <p className="mt-4 text-[16px] text-white/50 leading-[1.7]">
                That front-line exposure to how hotels actually operate — the
                procurement chaos, the compliance gaps, the cash-flow bottlenecks
                — is what inspired Hotels Vendors. Every feature, every workflow,
                and every governance rule was designed by someone who has sat in
                the auditor&apos;s chair and understands what institutional-grade
                procurement really means.
              </p>

              {/* Big 4 Badges */}
              <div className="mt-8 flex flex-wrap gap-3">
                {["EY — Ernst & Young", "Deloitte", "KPMG"].map((firm) => (
                  <span
                    key={firm}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0a0a0a] border border-white/[0.08] text-[13px] text-white/50"
                  >
                    <Briefcase size={14} className="text-white/40" />
                    {firm}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#022349]/10 border border-[#022349]/20 text-[11px] font-semibold text-[#022349] tracking-widest uppercase">
              Our Mission
            </span>
            <h2 className="mt-4 text-[36px] sm:text-[44px] font-bold text-white tracking-[-0.02em] leading-tight">
              Replace WhatsApp + Excel with one
              <br />
              intelligent platform
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Building2,
                title: "For Hotels",
                desc: "Cut procurement admin by 80%. Get AI-suggested suppliers, automated POs, and real-time ETA compliance — all in one dashboard.",
              },
              {
                icon: ShieldCheck,
                title: "For Suppliers",
                desc: "Access 450+ hotel buyers. Fixed pricing, guaranteed payments via embedded factoring, and shared-route logistics to reduce delivery costs.",
              },
              {
                icon: Globe,
                title: "For Egypt",
                desc: "The first hospitality procurement platform natively integrated with the Egyptian Tax Authority. Built local. Built compliant. Built to scale.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 hover:border-white/[0.12] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-white/[0.08] flex items-center justify-center text-white mb-5">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-[14px] text-white/50 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust stats */}
      <section className="py-20 border-y border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "1,200+", label: "Verified Suppliers" },
              { value: "200+", label: "Hotels Using Us" },
              { value: "48h", label: "Average Delivery" },
              { value: "99.9%", label: "Uptime SLA" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-center"
              >
                <p className="text-[32px] font-bold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[13px] text-white/40 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#022349]/10 border border-[#022349]/20 text-[11px] font-semibold text-[#022349] tracking-widest uppercase">
              Our Values
            </span>
            <h2 className="mt-4 text-[36px] sm:text-[44px] font-bold text-white tracking-[-0.02em] leading-tight">
              What drives us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              {
                title: "Institutional-Grade Trust",
                desc: "Every line of code, every governance rule, and every compliance check reflects Big 4 rigor. We handle millions in EGP transactions.",
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
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex gap-4 p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02]"
              >
                <CheckCircle2 className="w-5 h-5 text-[#022349] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[15px] font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-white/50 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 border-t border-white/[0.06]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative w-14 h-14 mx-auto mb-8">
              <BrandLogo variant="dark" size="xl" className="relative z-10" />
              <div className="absolute inset-0 bg-[#022349]/8 blur-2xl rounded-full" />
            </div>
            <h2 className="text-[36px] sm:text-[48px] font-bold text-white tracking-[-0.03em] leading-tight">
              Built by professionals.
              <br />
              Backed by Big 4 rigor.
            </h2>
            <p className="mt-4 text-[17px] text-white/50 max-w-md mx-auto">
              Join 200+ hotels and 1,200+ suppliers. Setup takes 10 minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="group px-7 py-3.5 text-[14px] font-medium bg-[#022349] text-white hover:bg-[#01305e] rounded-lg transition-colors flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/marketplace"
                className="px-7 py-3.5 text-[14px] font-medium text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
              >
                Explore Catalog
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
