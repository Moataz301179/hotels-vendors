"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FadeIn, SectionLabel, TiltCard } from "../ui/motion";

function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-8"
      style={{ background: "rgba(5,5,5,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <Link href="/front-end" className="flex items-center gap-3 no-underline text-white">
        {/* Horse SVG logo — no background */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M8 26L9.5 22L11 17L10 14L12 9L15 7L17 5L19 4L20 6L18 8L19 9L24 8L23 11L19 12L18 15L20 22L22 26" stroke="#8cff2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="22" cy="10" r="1" fill="#8cff2e" />
        </svg>
        <span className="font-bold text-[16px] tracking-tight">
          Hotels<span className="text-[#8cff2e]">Vendors</span>
        </span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <a href="#platform" className="text-[14px] font-medium text-white/65 hover:text-white transition-colors no-underline">Platform</a>
        <a href="#hotels" className="text-[14px] font-medium text-white/65 hover:text-white transition-colors no-underline">For Hotels</a>
        <a href="#suppliers" className="text-[14px] font-medium text-white/65 hover:text-white transition-colors no-underline">For Suppliers</a>
        <a href="#pricing" className="text-[14px] font-medium text-white/65 hover:text-white transition-colors no-underline">Pricing</a>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-[13px] font-semibold text-white px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-all no-underline">
          Sign In
        </Link>
        <Link href="/register" className="text-[13px] font-bold text-[#050505] px-5 py-2 rounded-lg bg-[#8cff2e] hover:bg-[#a0ff4a] transition-all no-underline">
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
}

export function HeroSection() {
  return (
    <section className="relative pt-40 pb-24 px-8 overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(140,255,46,0.04) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[10%] left-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.03) 0%, transparent 70%)" }} />

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-semibold border" style={{ background: "rgba(140,255,46,0.12)", borderColor: "rgba(140,255,46,0.2)", color: "#8cff2e" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8cff2e] animate-pulse" />
              B2B PROCUREMENT · EGYPT
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-[56px] font-black leading-[1.05] tracking-[-0.04em] mt-6 mb-6">
              Control Your Hotel&apos;s Supply Chain<br />
              <span className="text-[#8cff2e]">Before It Controls You.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-[18px] leading-relaxed max-w-[480px] mb-10" style={{ color: "rgba(255,255,255,0.65)" }}>
              From F&B to capital equipment — track every dirham, automate every order, and get AI demand forecasting that prevents waste before it happens.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/register" className="text-[15px] font-bold text-[#050505] px-8 py-3.5 rounded-xl bg-[#8cff2e] hover:bg-[#a0ff4a] transition-all no-underline">
                Start Free — No Credit Card
              </Link>
              <a href="#how-it-works" className="text-[15px] font-semibold text-white px-8 py-3.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all no-underline">
                Watch How It Works
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-wrap items-center gap-6 text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: "rgba(255,255,255,0.45)" }}>
              <span>TRUSTED BY HOTELS ACROSS EGYPT</span>
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#8cff2e]" />5-STAR</span>
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#8cff2e]" />BOUTIQUE</span>
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#8cff2e]" />RESORT</span>
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#8cff2e]" />BUSINESS</span>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} className="hidden lg:flex justify-center">
          <TiltCard>
            <div
              className="rounded-2xl p-8 w-full max-w-[460px]"
              style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "-20px 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(140,255,46,0.05)" }}
            >
              <div className="flex justify-between pb-5 mb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div className="text-[28px] font-extrabold tracking-[-0.03em] text-[#8cff2e]">EGP 180K</div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.06em] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>Annual Waste Saved</div>
                </div>
                <div>
                  <div className="text-[28px] font-extrabold tracking-[-0.03em] text-[#8cff2e]">~20%</div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.06em] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>Spoilage Reduced</div>
                </div>
              </div>
              <div className="flex items-end gap-[6px] h-[60px] mt-2">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{ opacity: i === 5 ? 1 : 0.15, background: "#8cff2e" }}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-5 text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                <span>Projected</span>
                <span className="font-semibold text-[#8cff2e]">Actual ↑ 12%</span>
              </div>
            </div>
          </TiltCard>
        </FadeIn>
      </div>
    </section>
  );
}
