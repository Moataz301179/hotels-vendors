"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Megaphone,
  ArrowRight,
  Zap,
  Globe,
  MessageSquare,
  Camera,
  Briefcase,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function SocialMediaPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--background)", fontFamily: "var(--font-sans)" }}>
      <MarketingNav />

      {/* Hero */}
      <section className="relative pt-36 pb-20">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-[var(--warning)]/[0.03] rounded-full blur-[150px] pointer-events-none" />
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 text-[11px] font-medium uppercase tracking-[0.15em]">
                <Megaphone className="w-3 h-3" />
                Social Media & Content
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-6 text-[32px] sm:text-[48px] font-medium tracking-[-0.02em] leading-[1.05] text-white"
            >
              The Story of
              <br />
              <span className="text-[var(--warning)]">Smarter Procurement</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-[16px] text-white/40 max-w-xl leading-relaxed"
            >
              HotelsVendors is building the digital infrastructure for Egyptian
              hospitality. Follow our channels for product updates, industry
              insights, and behind-the-scenes content.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#channels"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--warning)] text-black text-[14px] font-medium rounded-xl hover:bg-[var(--accent-light)] transition-colors"
              >
                Follow Our Channels
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="px-6 py-3.5 text-[14px] font-medium text-white/50 border border-white/[0.08] rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                Create Account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brand Pillars */}
      <section className="py-24 border-y border-white/[0.04]">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 text-[11px] font-medium uppercase tracking-[0.15em]">
              Brand Pillars
            </span>
            <h2 className="mt-4 text-[28px] sm:text-[36px] font-medium text-white tracking-[-0.02em]">
              What we stand for
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                title: "Speed",
                desc: "Faster procurement cycles. From manual coordination to automated workflows.",
              },
              {
                icon: Globe,
                title: "Trust",
                desc: "Verified suppliers. ETA-compliant invoicing. Full transparency.",
              },
              {
                icon: Megaphone,
                title: "Local Impact",
                desc: "Built for Egypt. Designed for Egyptian hotels and suppliers.",
              },
            ].map((p, i) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-[var(--background)] border border-white/[0.06] text-center hover:border-white/[0.12] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
                  <p.icon className="w-6 h-6 text-white/50" />
                </div>
                <h3 className="text-[18px] font-medium text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-[14px] text-white/35">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Themes */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 text-[11px] font-medium uppercase tracking-[0.15em]">
              Content
            </span>
            <h2 className="mt-4 text-[28px] sm:text-[36px] font-medium text-white tracking-[-0.02em]">
              What we share
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              {
                icon: Briefcase,
                title: "B2B Insights",
                desc: "Deep dives into procurement trends, supplier networks, and hospitality economics in Egypt.",
              },
              {
                icon: Camera,
                title: "Behind the Scenes",
                desc: "Product development updates, team stories, and the making of HotelsVendors.",
              },
              {
                icon: MessageSquare,
                title: "Community",
                desc: "Hotel and supplier spotlights, success stories, and industry events.",
              },
              {
                icon: Sparkles,
                title: "Product Updates",
                desc: "Feature releases, platform improvements, and roadmap previews.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex gap-4 p-6 rounded-2xl bg-[var(--background)] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <h3 className="text-[15px] font-medium text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-white/35 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Channels */}
      <section
        id="channels"
        className="py-24 border-y border-white/[0.04]"
      >
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 text-[11px] font-medium uppercase tracking-[0.15em]">
              Connect With Us
            </span>
            <h2 className="mt-4 text-[28px] sm:text-[36px] font-medium text-white tracking-[-0.02em]">
              Follow the journey
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              {
                name: "LinkedIn",
                handle: "@hotelsvendors",
                icon: Briefcase,
                desc: "B2B insights, case studies, and industry news.",
                color: "#0A66C2",
                href: "https://www.linkedin.com/company/hotelsvendors",
              },
              {
                name: "Instagram",
                handle: "@hotelsvendors",
                icon: Camera,
                desc: "Behind the scenes, supplier spotlights, and product showcases.",
                color: "#E4405F",
                href: "https://www.instagram.com/hotelsvendors",
              },
              {
                name: "Facebook",
                handle: "@hotelsvendors",
                icon: MessageSquare,
                desc: "Community updates, events, and live Q&As.",
                color: "#1877F2",
                href: "https://www.facebook.com/hotelsvendors",
              },
            ].map((channel, i) => (
              <motion.a
                key={channel.name}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-[var(--background)] border border-white/[0.06] hover:border-white/[0.12] hover:-translate-y-1 transition-all duration-300 block"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: channel.color }}
                  >
                    <channel.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">
                      {channel.name}
                    </h3>
                    <p className="text-[11px] text-white/30">{channel.handle}</p>
                  </div>
                </div>
                <p className="text-[13px] text-white/35 mb-4">{channel.desc}</p>
                <span className="inline-flex items-center gap-1 text-[12px] font-medium text-white/40 group-hover:text-white/60 transition-colors">
                  Follow <ExternalLink className="w-3 h-3" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[28px] sm:text-[40px] font-medium text-white tracking-[-0.02em] leading-tight">
              Be Part of the
              <br />
              <span className="text-[var(--warning)]">Procurement Revolution</span>
            </h2>
            <p className="mt-4 text-[16px] text-white/35 max-w-md mx-auto">
              Whether you are a hotel, supplier, or logistics provider, there is
              a place for you on HotelsVendors.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--warning)] text-black text-[14px] font-medium rounded-xl hover:bg-[var(--accent-light)] transition-colors"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/platform"
                className="px-7 py-3.5 text-[14px] font-medium text-white/50 border border-white/[0.08] rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                Explore Platform
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
