"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Megaphone, ArrowRight, Zap, Globe, MessageSquare, Camera, Briefcase,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

export default function SocialMediaPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-[var(--background)] pt-[72px]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-500)]/8 rounded-full blur-[150px]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 w-full">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 text-[11px] font-semibold text-[var(--accent-400)] tracking-widest uppercase">
                <Megaphone className="w-3 h-3" />
                Marketing Hub
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              <span className="text-[var(--foreground)]">The Story of</span>
              <br />
              <span className="text-[var(--accent-400)]">Smarter Procurement</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-lg text-[var(--foreground-secondary)] max-w-xl leading-relaxed">
              Hotels Vendors is building the digital infrastructure for Egyptian hospitality.
              Follow our journey, join the conversation, and see how technology is reshaping B2B supply chains.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/register" className="px-7 py-3.5 text-sm font-semibold rounded-xl bg-[var(--accent-500)] text-white hover:bg-[var(--accent-600)] transition-all hover:-translate-y-0.5 flex items-center gap-2">
                Join the Platform <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#channels" className="px-7 py-3.5 text-sm font-semibold rounded-xl border border-[var(--border-default)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] hover:border-[var(--border-strong)] transition-all hover:-translate-y-0.5">
                Follow Our Channels
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brand Pillars */}
      <section className="py-20 bg-[var(--surface)] border-y border-[var(--border-default)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 text-[11px] font-semibold text-[var(--accent-400)] tracking-widest uppercase">
              Brand Pillars
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[var(--foreground)]">
              What we stand for
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Speed", desc: "Procurement admin cut by 80%. From days to minutes." },
              { icon: Globe, title: "Trust", desc: "Millions in EGP transactions. Verified suppliers. Full compliance." },
              { icon: Megaphone, title: "Local Impact", desc: "Built for Egypt. Designed for Egyptian hotels and suppliers." },
            ].map((p, i) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-[var(--border-default)] bg-[var(--background)]/60 backdrop-blur-md text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 flex items-center justify-center mx-auto mb-4 text-[var(--accent-400)]">
                  <p.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">{p.title}</h3>
                <p className="mt-2 text-sm text-[var(--foreground-secondary)]">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Channels */}
      <section id="channels" className="py-20 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 text-[11px] font-semibold text-[var(--accent-400)] tracking-widest uppercase">
              Connect With Us
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[var(--foreground)]">
              Follow the journey
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "LinkedIn", handle: "@hotelsvendors", icon: Briefcase, desc: "B2B insights, case studies, and industry news." },
              { name: "Instagram", handle: "@hotelsvendors", icon: Camera, desc: "Behind the scenes, supplier spotlights, and product showcases." },
              { name: "Facebook", handle: "@hotelsvendors", icon: MessageSquare, desc: "Community updates, events, and live Q&As." },
            ].map((channel, i) => (
              <motion.div
                key={channel.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)]/60 backdrop-blur-md hover:border-[var(--border-strong)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-500)]/10 flex items-center justify-center text-[var(--accent-400)]">
                    <channel.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">{channel.name}</h3>
                    <p className="text-[11px] text-[var(--foreground-muted)]">{channel.handle}</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--foreground-secondary)]">{channel.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--surface)] border-t border-[var(--border-default)]">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[var(--foreground)]">
            Be part of the <span className="text-[var(--accent-400)]">procurement revolution</span>
          </h2>
          <p className="mt-4 text-[var(--foreground-secondary)] max-w-xl mx-auto">
            Whether you are a hotel, supplier, or logistics provider — there is a place for you on Hotels Vendors.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="px-7 py-3.5 text-sm font-semibold rounded-xl bg-[var(--accent-500)] text-white hover:bg-[var(--accent-600)] transition-all hover:-translate-y-0.5">
              Get Started
            </Link>
            <Link href="/catalog" className="px-7 py-3.5 text-sm font-semibold rounded-xl border border-[var(--border-default)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] hover:border-[var(--border-strong)] transition-all hover:-translate-y-0.5">
              Explore Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--background)] border-t border-[var(--border-default)] py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-[var(--surface-raised)] border border-[var(--border-default)]">
              <Image src="/logo-transparent.png" alt="" fill className="object-contain p-0.5" />
            </div>
            <span className="text-sm font-bold text-[var(--foreground)]">Hotels Vendors</span>
          </div>
          <p className="text-[11px] text-[var(--foreground-muted)]">© 2026 Hotels Vendors. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
