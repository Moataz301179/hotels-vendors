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
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { BrandLogo } from "@/components/layout/brand-logo";

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
    <main className="bg-[#0a0a0a] min-h-screen">
      <MarketingNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#022349]/10 border border-[#022349]/20 text-[11px] font-semibold text-[#022349] tracking-widest uppercase">
                <Megaphone className="w-3 h-3" />
                Marketing Hub
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-6 text-[48px] sm:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] text-white"
            >
              The Story of
              <br />
              <span className="text-[#022349]">Smarter Procurement</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-[18px] text-white/50 max-w-xl leading-[1.7]"
            >
              Hotels Vendors is building the digital infrastructure for Egyptian
              hospitality. Follow our journey, join the conversation, and see how
              technology is reshaping B2B supply chains.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="group px-6 py-3.5 text-[14px] font-medium bg-[#022349] text-white hover:bg-[#01305e] rounded-lg transition-colors flex items-center gap-2"
              >
                Join the Platform
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#channels"
                className="px-6 py-3.5 text-[14px] font-medium text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
              >
                Follow Our Channels
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brand Pillars */}
      <section className="py-20 border-y border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#022349]/10 border border-[#022349]/20 text-[11px] font-semibold text-[#022349] tracking-widest uppercase">
              Brand Pillars
            </span>
            <h2 className="mt-4 text-[36px] sm:text-[44px] font-bold text-white tracking-[-0.02em]">
              What we stand for
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                title: "Speed",
                desc: "Procurement admin cut by 80%. From days to minutes.",
              },
              {
                icon: Globe,
                title: "Trust",
                desc: "Millions in EGP transactions. Verified suppliers. Full compliance.",
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
                className="p-8 rounded-2xl border border-white/[0.08] bg-[#0a0a0a] text-center hover:border-white/[0.12] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-white">
                  <p.icon className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] font-semibold text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-[14px] text-white/50">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Themes */}
      <section className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#022349]/10 border border-[#022349]/20 text-[11px] font-semibold text-[#022349] tracking-widest uppercase">
              Content
            </span>
            <h2 className="mt-4 text-[36px] sm:text-[44px] font-bold text-white tracking-[-0.02em]">
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
                desc: "Product development updates, team stories, and the making of Hotels Vendors.",
              },
              {
                icon: MessageSquare,
                title: "Community",
                desc: "Hotel and supplier spotlights, success stories, and industry events.",
              },
              {
                icon: Zap,
                title: "Product Updates",
                desc: "New features, platform improvements, and roadmap previews.",
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
                <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-white/[0.08] flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
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

      {/* Social Channels */}
      <section
        id="channels"
        className="py-28 border-y border-white/[0.06] bg-white/[0.02]"
      >
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#022349]/10 border border-[#022349]/20 text-[11px] font-semibold text-[#022349] tracking-widest uppercase">
              Connect With Us
            </span>
            <h2 className="mt-4 text-[36px] sm:text-[44px] font-bold text-white tracking-[-0.02em]">
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
              },
              {
                name: "Instagram",
                handle: "@hotelsvendors",
                icon: Camera,
                desc: "Behind the scenes, supplier spotlights, and product showcases.",
                color: "#E4405F",
              },
              {
                name: "Facebook",
                handle: "@hotelsvendors",
                icon: MessageSquare,
                desc: "Community updates, events, and live Q&As.",
                color: "#1877F2",
              },
            ].map((channel, i) => (
              <motion.div
                key={channel.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl border border-white/[0.08] bg-[#0a0a0a] hover:border-black/[0.12] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: channel.color }}
                  >
                    <channel.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {channel.name}
                    </h3>
                    <p className="text-[11px] text-white/40">{channel.handle}</p>
                  </div>
                </div>
                <p className="text-[13px] text-white/50 mb-4">{channel.desc}</p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-[#022349] hover:text-[#b91c1c] transition-colors"
                >
                  Follow <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
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
              Be part of the{" "}
              <span className="text-[#022349]">procurement revolution</span>
            </h2>
            <p className="mt-4 text-[17px] text-white/50 max-w-md mx-auto">
              Whether you are a hotel, supplier, or logistics provider — there is
              a place for you on Hotels Vendors.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="group px-7 py-3.5 text-[14px] font-medium bg-[#022349] text-white hover:bg-[#01305e] rounded-lg transition-colors flex items-center gap-2"
              >
                Get Started
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
