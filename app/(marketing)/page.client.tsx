"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import {
  FileText,
  CheckCircle2,
  Truck,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
  Package,
  MapPin,
  Building2,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   SCROLL ANIMATION HOOK
   ────────────────────────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".animate-on-scroll");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ──────────────────────────────────────────────────────────────
   CHECK SVG
   ────────────────────────────────────────────────────────────── */
function Check({ color = "#39ff7e" }: { color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M20 6 9 17l-5-5" /></svg>
  );
}

/* ──────────────────────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────────────────────── */
export default function MarketingPage() {
  useScrollReveal();
  const [layer, setLayer] = useState<"hv" | "invo">("hv");
  const [tab, setTab] = useState<"hotel" | "vendor" | "chat">("hotel");

  return (
    <main className="min-h-screen bg-[#0c0c12] text-white font-sans">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-[160px] pointer-events-none" style={{ background: "#39ff7e", opacity: 0.06 }} />
        <div className="absolute bottom-1/4 right-[20%] w-60 h-60 rounded-full blur-[130px] pointer-events-none" style={{ background: "#c455ff", opacity: 0.05 }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs tracking-wider uppercase mb-6 border animate-fade-in" style={{ borderColor: "#c455ff55", background: "#c455ff12", color: "#c455ff" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
            Egypt &amp; MENA&apos;s First &middot; AI-Native B2B Hotel Procurement Platform
          </div>

          <h1 className="text-4xl md:text-6xl tracking-[0.15em] text-white text-balance leading-[1.1] mb-5 uppercase animate-fade-in-up font-semibold">
            Hotels Vendors
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-3 tracking-wide animate-fade-in-up animation-delay-100">
            The Intelligent Procurement Network — <span className="text-white/65">Hotels, Vendors &amp; Capital Connected.</span>
          </p>

          <p className="text-sm md:text-base text-white/55 max-w-2xl mx-auto mb-8 text-balance leading-relaxed animate-fade-in-up animation-delay-200">
            For the first time in Egypt and the broader MENA region, hotels and their entire supply chain operate inside one unified, AI-governed platform. <span style={{ color: "#39ff7e" }}>HotelsVendors</span> orchestrates procurement, payments, compliance, and financing — while <span style={{ color: "#ff7e1a" }}>INVO</span>, its vendor marketplace sub-layer, aggregates supplier networks via API. Both platforms are free to join. We earn only when value is exchanged.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8 text-xs animate-fade-in-up animation-delay-300">
            <span className="px-3 py-1 rounded-full border" style={{ borderColor: "#39ff7e55", color: "#39ff7e", background: "#39ff7e10" }}>ETA Compliant</span>
            <span className="px-3 py-1 rounded-full border" style={{ borderColor: "#ff7e1a55", color: "#ff7e1a", background: "#ff7e1a10" }}>FRA Registered</span>
            <span className="px-3 py-1 rounded-full border" style={{ borderColor: "#c455ff55", color: "#c455ff", background: "#c455ff10" }}>ISO 27001</span>
            <span className="px-3 py-1 rounded-full border" style={{ borderColor: "#39ff7e55", color: "#39ff7e", background: "#39ff7e10" }}>Free to Start</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up animation-delay-400">
            <Link href="/sandbox" className="text-sm px-7 py-3 font-semibold cursor-pointer rounded-md inline-flex items-center gap-2 bg-[#39ff7e] text-[#07090f]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
              Explore the Sandbox Demo
            </Link>
            <Link href="/sandbox" className="text-sm px-7 py-3 font-semibold cursor-pointer rounded-md border inline-flex items-center gap-2 bg-transparent" style={{ borderColor: "#c455ff55", color: "#c455ff" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
              Talk to the AI Agent
            </Link>
          </div>

          <div className="mt-16 flex justify-center animate-fade-in">
            <a href="#how" className="flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors cursor-pointer">
              <span className="text-xs tracking-widest uppercase">Discover</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce"><path d="m6 9 6 6 6-6" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="relative py-12 border-y animate-on-scroll" style={{ borderColor: "#39ff7e22" }}>
        <div className="relative max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-2xl md:text-3xl mb-1 font-medium" style={{ color: "#39ff7e" }}>Free</div>
            <div className="text-xs text-white/40 leading-snug">To Start — No Subscription</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl mb-1 font-medium" style={{ color: "#ff7e1a" }}>1%</div>
            <div className="text-xs text-white/40 leading-snug">On Bank Transfers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl mb-1 font-medium" style={{ color: "#c455ff" }}>1.5–3%</div>
            <div className="text-xs text-white/40 leading-snug">On Factoring Services</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl mb-1 font-medium" style={{ color: "#39ff7e" }}>48h</div>
            <div className="text-xs text-white/40 leading-snug">Reverse Factoring Payout</div>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how" className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 animate-on-scroll">
          <span className="text-xs tracking-widest uppercase" style={{ color: "#39ff7e" }}>How It Works</span>
          <h2 className="text-3xl md:text-4xl mt-3 mb-3 text-white font-medium">Start Free. Transact Smart.</h2>
          <p className="text-white/45 text-base max-w-2xl mx-auto text-balance">No subscription. No setup cost. Our AI agents guide you from registration to your first compliant transaction.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-5 stagger-children">
          {[
            { num: "01", color: "#39ff7e", title: "Hotels Join Free", desc: "Register your property group on HotelsVendors. Our AI agent guides you through ETA-compliant onboarding in minutes — no paperwork." },
            { num: "02", color: "#ff7e1a", title: "Discover on INVO", desc: "Browse INVO — our vendor marketplace aggregated via API and plugin integrations from global supply networks. Find, compare, and order." },
            { num: "03", color: "#c455ff", title: "Checkout & Pay", desc: "HotelsVendors handles checkout, multi-currency payments, and bank transfers. AI agents forecast your spend and flag compliance gaps." },
            { num: "04", color: "#39ff7e", title: "Suppliers Get Paid Fast", desc: "Vendors request reverse factoring. Our swarm agents validate, authorise, and disburse within 48 hours — fully compliant with FRA." },
          ].map((s) => (
            <div key={s.num} className="animate-on-scroll">
              <div
                className="neon-card relative rounded-2xl border bg-[#12121a] p-5 h-full flex flex-col"
                style={{ borderColor: `${s.color}33` }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 18px 2px ${s.color}30, inset 0 0 20px 0px ${s.color}08`; e.currentTarget.style.borderColor = `${s.color}88`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${s.color}33`; }}
              >
                <div className="text-3xl mb-3 opacity-15 font-semibold" style={{ color: s.color }}>{s.num}</div>
                <div className="text-sm mb-2 font-medium" style={{ color: s.color }}>{s.title}</div>
                <p className="text-white/45 text-xs leading-relaxed flex-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ SANDBOX CAROUSEL ═══════════ */}
      <SandboxCarousel />

      {/* ═══════════ DUAL LAYERS ═══════════ */}
      <section id="invo" className="py-24 border-y" style={{ borderColor: "#c455ff18" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 animate-on-scroll">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#c455ff" }}>Dual-Layer Architecture</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4 text-white">Two Platforms. One Network.</h2>
            <p className="text-white/45 text-lg max-w-2xl mx-auto text-balance">Each layer has its own workspace, user base, and purpose — connected by AI agents and shared settlement infrastructure.</p>
          </div>

          {/* Layer switcher */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex border rounded-xl p-1 gap-1 bg-[#0c0c12]" style={{ borderColor: "#39ff7e33" }}>
              <button onClick={() => setLayer("hv")} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer" style={{ background: layer === "hv" ? "#39ff7e" : "transparent", color: layer === "hv" ? "#07090f" : "rgba(160,160,176,1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /></svg>
                HotelsVendors
              </button>
              <button onClick={() => setLayer("invo")} className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer" style={{ background: layer === "invo" ? "#ff7e1a" : "transparent", color: layer === "invo" ? "#07090f" : "rgba(160,160,176,1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                INVO
              </button>
            </div>
          </div>

          {/* HotelsVendors Layer */}
          {layer === "hv" && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold tracking-widest uppercase mb-4" style={{ borderColor: "#39ff7e44", color: "#39ff7e", background: "#39ff7e10" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /></svg>
                  Hotel Layer
                </div>
                <h3 className="text-3xl font-extrabold mb-4 text-white">The Checkout &amp; Payments Brain</h3>
                <p className="text-white/45 leading-relaxed mb-6">HotelsVendors is the hotel-facing workspace. It aggregates procurement, forecasts spending, processes payments via integrated gateways, and gives access to factoring and compliance services — all powered by AI swarm agents.</p>
                <ul className="flex flex-col gap-3">
                  {["AI-powered spend forecasting and budget alerts", "Multi-gateway checkout (cards, SWIFT, local banks)", "Reverse factoring requests with automated authorisation", "ETA & FRA compliance engine built-in", "Swarm agents handle documentation at every workflow stage"].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-white"><Check color="#39ff7e" />{t}</li>
                  ))}
                </ul>
                <Link href="/marketplace" className="mt-8 font-semibold gap-2 cursor-pointer rounded-md text-sm px-6 py-2.5 inline-flex items-center bg-[#39ff7e] text-[#07090f]">
                  Explore HotelsVendors <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
              </div>
              <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: "#39ff7e33", boxShadow: "0 0 40px 2px #39ff7e18" }}>
                <img src="https://images.unsplash.com/photo-1646645409452-866ad2fb64e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Hotel procurement dashboard showing AI-powered spend forecasting and vendor management" className="w-full h-72 object-cover opacity-70" width={1080} height={400} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl border backdrop-blur-sm" style={{ borderColor: "#39ff7e44", background: "rgba(7,9,15,0.75)" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: "#39ff7e" }}>app.hotelsvendors.com/hotel/dashboard</div>
                  <div className="text-sm font-semibold text-white">Hotel Procurement Hub — AI-Powered</div>
                </div>
              </div>
            </div>
          )}

          {/* INVO Layer */}
          {layer === "invo" && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold tracking-widest uppercase mb-4" style={{ borderColor: "#ff7e1a44", color: "#ff7e1a", background: "#ff7e1a10" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                  Vendor Marketplace Layer
                </div>
                <h3 className="text-3xl font-extrabold mb-4 text-white">The B2B Procurement Marketplace</h3>
                <p className="text-white/45 leading-relaxed mb-6">INVO is the vendor-facing sub-layer — a smart marketplace aggregated from partner networks via APIs and plugins. Suppliers list their catalogs, hotels discover and order, and every transaction flows up to HotelsVendors for settlement.</p>
                <ul className="flex flex-col gap-3">
                  {["Plug-and-play integration with existing supplier marketplaces", "AI chatbot helps hotels find the right vendor instantly", "Vendor onboarding in under 24 hours", "ISO-certified data security and fraud protection", "All invoicing is ETA-compliant by default"].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-white"><Check color="#ff7e1a" />{t}</li>
                  ))}
                </ul>
                <Link href="/marketplace" className="mt-8 font-semibold gap-2 cursor-pointer rounded-md text-sm px-6 py-2.5 inline-flex items-center bg-[#ff7e1a] text-[#07090f]">
                  Explore INVO <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
              </div>
              <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: "#ff7e1a33", boxShadow: "0 0 40px 2px #ff7e1a18" }}>
                <img src="https://images.unsplash.com/photo-1690935986319-c11e6cae84f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="INVO vendor marketplace showing supplier catalog aggregation and hotel buyer ordering" className="w-full h-72 object-cover opacity-70" width={1080} height={400} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl border backdrop-blur-sm" style={{ borderColor: "#ff7e1a44", background: "rgba(7,9,15,0.75)" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: "#ff7e1a" }}>app.hotelsvendors.com/invo/marketplace</div>
                  <div className="text-sm font-semibold text-white">INVO Vendor Marketplace — Live</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ AI AGENTS ═══════════ */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 animate-on-scroll">
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#ff7e1a" }}>AI-Powered</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4 text-white">Swarm Agents Handle the Complexity</h2>
          <p className="text-white/45 text-lg max-w-2xl mx-auto text-balance">You focus on hospitality. Our AI swarm handles compliance, documentation, vendor matching, spend forecasting, and factoring workflows — automatically.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 stagger-children">
          {[
            { color: "#39ff7e", title: "Onboarding Agent", desc: "Guides hotels and vendors through ETA registration, document collection, and sandbox exploration — conversationally." },
            { color: "#c455ff", title: "Spend Forecast Agent", desc: "Analyses historical orders and market data to predict future procurement costs and flag budget overruns before they happen." },
            { color: "#ff7e1a", title: "Compliance Swarm", desc: "A cluster of specialised agents that audit every transaction against ETA and FRA standards, generating required documentation automatically." },
            { color: "#39ff7e", title: "Factoring Workflow Agent", desc: "Orchestrates reverse factoring end-to-end — vendor request, hotel approval, FRA validation, and bank disbursement in 48 hours." },
            { color: "#c455ff", title: "AI Procurement Chatbot", desc: "Hotels describe what they need in plain language. The chatbot searches INVO, compares vendors, and generates a ready-to-approve order." },
            { color: "#ff7e1a", title: "Integration Agent", desc: "Connects to external marketplace APIs and plugins automatically, mapping vendor catalogs into INVO's unified product structure." },
          ].map((a) => (
            <div key={a.title} className="animate-on-scroll">
              <div
                className="neon-card rounded-2xl border bg-[#12121a] p-5 h-full"
                style={{ borderColor: `${a.color}33` }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 18px 2px ${a.color}30, inset 0 0 20px 0px ${a.color}08`; e.currentTarget.style.borderColor = `${a.color}88`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${a.color}33`; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border" style={{ background: `${a.color}15`, borderColor: `${a.color}40`, color: a.color }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
                </div>
                <div className="font-semibold text-sm mb-2 text-white">{a.title}</div>
                <p className="text-white/45 text-xs leading-relaxed">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ DEMO SANDBOX ═══════════ */}
      <section className="py-20 border-y" style={{ borderColor: "#39ff7e18" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10 animate-on-scroll">
            <span className="text-xs tracking-widest uppercase" style={{ color: "#39ff7e" }}>Sandbox Demo</span>
            <h2 className="text-3xl md:text-4xl mt-3 mb-3 text-white font-medium">Explore Before You Commit</h2>
            <p className="text-white/45 text-sm max-w-xl mx-auto">No account needed. Experience the hotel dashboard, vendor marketplace, and AI procurement chatbot — all sandboxed and safe.</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8 flex-wrap gap-2">
            {([
              { key: "hotel" as const, label: "Hotel Dashboard", color: "#39ff7e" },
              { key: "vendor" as const, label: "INVO Marketplace", color: "#ff7e1a" },
              { key: "chat" as const, label: "AI Chatbot", color: "#c455ff" },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border"
                style={{
                  background: tab === t.key ? t.color : "transparent",
                  color: tab === t.key ? "#07090f" : "rgba(160,160,176,1)",
                  borderColor: tab === t.key ? t.color : `${t.color}33`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Hotel Dashboard Tab */}
          {tab === "hotel" && (
            <div className="rounded-2xl border overflow-hidden bg-[#0c0c12]" style={{ borderColor: "#39ff7e44", boxShadow: "0 0 40px 2px #39ff7e14" }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#12121a]/60">
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#febc2e" }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#39ff7e" }} />
                <div className="flex-1 mx-4 bg-[#0c0c12]/50 rounded px-3 py-1 text-xs text-white/45 border border-white/[0.06]/50">app.hotelsvendors.com/hotels/dashboard</div>
              </div>
              <div className="p-6 min-h-[440px]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-lg text-white">Meridian Hotels — Procurement Hub</h3>
                    <p className="text-white/45 text-sm">3 properties · AI Spend Forecast: <span style={{ color: "#39ff7e" }}>↓ 8% vs last quarter</span></p>
                  </div>
                  <button className="text-sm px-4 py-2 font-semibold cursor-pointer rounded-md inline-flex items-center gap-1 bg-[#39ff7e] text-[#07090f]">AI Assist</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Active Orders", value: "34", color: "#39ff7e", sub: "+8%" },
                    { label: "Monthly Spend", value: "$182K", color: "#ff7e1a", sub: "Forecast: $168K" },
                    { label: "Vendor Network", value: "47", color: "#c455ff", sub: "via INVO" },
                    { label: "Factoring Requests", value: "6", color: "#39ff7e", sub: "2 pending 48h" },
                  ].map((c) => (
                    <div key={c.label} className="rounded-xl border bg-[#12121a] p-4" style={{ borderColor: `${c.color}33` }}>
                      <div className="text-xs text-white/45 mb-1">{c.label}</div>
                      <div className="text-2xl font-semibold text-white">{c.value}</div>
                      <div className="text-xs mt-1" style={{ color: c.color }}>{c.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border bg-[#12121a] overflow-hidden" style={{ borderColor: "#39ff7e22" }}>
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">Recent Orders — ETA Compliant</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: "#39ff7e44", color: "#39ff7e" }}>All verified</span>
                  </div>
                  {[
                    { vendor: "Luxe Linen Co.", item: "Egyptian Cotton Sheets × 200", price: "$14,400", status: "Delivered", color: "#39ff7e" },
                    { vendor: "ProClean Supplies", item: "Eco Amenity Kits × 500", price: "$3,250", status: "In Transit", color: "#ff7e1a" },
                    { vendor: "GourmetSource", item: "Premium Coffee Blend × 50kg", price: "$2,100", status: "Factoring Active", color: "#c455ff" },
                  ].map((o, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i < 2 ? "border-b border-white/[0.04]" : ""}`}>
                      <div><div className="font-medium text-white">{o.vendor}</div><div className="text-white/45 text-xs">{o.item}</div></div>
                      <div className="text-right"><div className="font-semibold text-white">{o.price}</div><div className="text-xs" style={{ color: o.color }}>{o.status}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vendor Tab */}
          {tab === "vendor" && (
            <div className="rounded-2xl border overflow-hidden bg-[#0c0c12]" style={{ borderColor: "#ff7e1a44", boxShadow: "0 0 40px 2px #ff7e1a14" }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#12121a]/60">
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#febc2e" }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#39ff7e" }} />
                <div className="flex-1 mx-4 bg-[#0c0c12]/50 rounded px-3 py-1 text-xs text-white/45 border border-white/[0.06]/50">app.hotelsvendors.com/invo/marketplace</div>
              </div>
              <div className="p-6 min-h-[440px]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-lg text-white">INVO Marketplace — Vendor Portal</h3>
                    <p className="text-white/45 text-sm">Aggregated from 14 partner networks · <span style={{ color: "#ff7e1a" }}>340 active hotel buyers</span></p>
                  </div>
                  <button className="text-sm px-4 py-2 font-semibold cursor-pointer rounded-md bg-[#ff7e1a] text-[#07090f]">+ List Products</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Hotel Buyers", value: "340", color: "#ff7e1a" },
                    { label: "MRR", value: "$94K", color: "#39ff7e" },
                    { label: "Avg. Order", value: "$2.8K", color: "#c455ff" },
                    { label: "Reorder Rate", value: "74%", color: "#ff7e1a" },
                  ].map((c) => (
                    <div key={c.label} className="rounded-xl border bg-[#12121a] p-4" style={{ borderColor: `${c.color}33` }}>
                      <div className="text-xs text-white/45 mb-1">{c.label}</div>
                      <div className="text-2xl font-semibold text-white">{c.value}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border bg-[#12121a] overflow-hidden" style={{ borderColor: "#ff7e1a22" }}>
                  <div className="px-4 py-3 border-b border-white/[0.06] font-semibold text-sm text-white">Top Products · Reverse Factoring Available</div>
                  {[
                    { name: "Egyptian Cotton Sheets (King)", units: "840 units sold", revenue: "$120K", badge: true },
                    { name: "Microfibre Duvet Set", units: "620 units sold", revenue: "$74K", badge: false },
                    { name: "Pool Towel Bundle (12pk)", units: "380 units sold", revenue: "$34K", badge: true },
                  ].map((p, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i < 2 ? "border-b border-white/[0.04]" : ""}`}>
                      <div><div className="font-medium text-white">{p.name}</div><div className="text-white/45 text-xs">{p.units}</div></div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold" style={{ color: "#39ff7e" }}>{p.revenue}</span>
                        {p.badge && <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: "#ff7e1a55", color: "#ff7e1a" }}>⚡ 48h</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {tab === "chat" && (
            <div className="rounded-2xl border overflow-hidden bg-[#0c0c12]" style={{ borderColor: "#c455ff44", boxShadow: "0 0 40px 2px #c455ff14" }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#12121a]/60">
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#febc2e" }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#39ff7e" }} />
                <div className="flex-1 mx-4 bg-[#0c0c12]/50 rounded px-3 py-1 text-xs text-white/45 border border-white/[0.06]/50">app.hotelsvendors.com/ai-agent</div>
              </div>
              <div className="p-6 min-h-[440px] flex flex-col">
                <div className="flex items-center gap-3 mb-6 p-3 rounded-xl border" style={{ borderColor: "#c455ff33", background: "#c455ff08" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#c455ff20", color: "#c455ff" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">HV AI Procurement Agent</div>
                    <div className="text-xs text-white/45">ETA-aware · INVO-connected · Always on</div>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: "#39ff7e" }} />
                </div>
                <div className="flex-1 flex flex-col gap-4 overflow-auto mb-4">
                  <div className="flex justify-start">
                    <div className="max-w-xs rounded-2xl rounded-tl-none p-3 text-sm text-white" style={{ background: "#c455ff18", border: "1px solid #c455ff33" }}>
                      Hello! I&apos;m your AI procurement agent. I can help you find vendors on INVO, check ETA compliance, forecast your spend, or initiate a reverse factoring request. What do you need today?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-xs rounded-2xl rounded-tr-none p-3 text-sm bg-[#12121a] border border-white/[0.06] text-white">
                      I need 500 units of premium amenity kits for 3 properties under $6,000 total.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-sm rounded-2xl rounded-tl-none p-3 text-sm text-white" style={{ background: "#c455ff18", border: "1px solid #c455ff33" }}>
                      Found <span style={{ color: "#39ff7e" }}>4 verified vendors</span> on INVO matching your criteria. Best match: <span style={{ color: "#ff7e1a" }}>ProClean Supplies</span> — 500 Eco Amenity Kits at $3,250 total (ETA invoice included). Shall I generate a purchase order?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-xs rounded-2xl rounded-tr-none p-3 text-sm bg-[#12121a] border border-white/[0.06] text-white">
                      Yes, and can the supplier request factoring for early payment?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-sm rounded-2xl rounded-tl-none p-3 text-sm text-white" style={{ background: "#c455ff18", border: "1px solid #c455ff33" }}>
                      Absolutely. Once you approve the PO, ProClean can submit a <span style={{ color: "#ff7e1a" }}>reverse factoring request</span>. Our compliance swarm will verify it against FRA standards and disburse in <span style={{ color: "#39ff7e" }}>48 hours</span>. PO is ready — approve now?
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-xl border border-white/[0.06] bg-[#12121a]/50 px-4 py-2.5 text-sm text-white/45">Type your procurement request...</div>
                  <button className="text-sm px-4 py-2 font-semibold cursor-pointer rounded-md bg-[#c455ff] text-[#07090f]">Send</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ FACTORING ═══════════ */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-on-scroll">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#ff7e1a" }}>Reverse Factoring</span>
            <h2 className="text-4xl font-extrabold mt-3 mb-4 text-balance text-white">Suppliers Paid in 48 Hours. No Wait.</h2>
            <p className="text-white/45 text-lg leading-relaxed mb-8">Traditional payment terms of 60–90 days kill supplier cash flow. Our embedded reverse factoring workflow, powered by AI agents and validated at every stage against FRA requirements, lets vendors redeem their money in 48 hours — while hotels keep their standard payment schedule.</p>
            <div className="flex flex-col gap-3 mb-8">
              {[
                { color: "#39ff7e", text: "Vendor submits factoring request" },
                { color: "#ff7e1a", text: "Swarm agents verify invoice & order" },
                { color: "#c455ff", text: "Hotel approves digitally via portal" },
                { color: "#39ff7e", text: "FRA compliance check automated" },
                { color: "#ff7e1a", text: "Funds disbursed in 48 hours" },
              ].map((s) => (
                <div key={s.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border shrink-0 text-xs font-semibold" style={{ borderColor: `${s.color}55`, color: s.color, background: `${s.color}10` }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </div>
                  <div className="text-sm text-white">{s.text}</div>
                </div>
              ))}
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "#ff7e1a" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              1.5–3% fee only on factoring — no hidden charges
            </div>
          </div>
          <div className="flex flex-col gap-4 animate-on-scroll">
            <div
              className="neon-card rounded-2xl border bg-[#12121a] p-5"
              style={{ borderColor: "#ff7e1a33" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 18px 2px #ff7e1a30, inset 0 0 20px 0px #ff7e1a08"; e.currentTarget.style.borderColor = "#ff7e1a88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#ff7e1a33"; }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-white/45 mb-1">Factoring Request #F-2847</div>
                  <div className="font-semibold text-white">Luxe Linen Co.</div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: "#39ff7e20", color: "#39ff7e" }}>Active</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="rounded-lg p-2 bg-[#0c0c12]/60">
                  <div className="text-xl font-semibold" style={{ color: "#ff7e1a" }}>$14.4K</div>
                  <div className="text-xs text-white/45">Invoice Value</div>
                </div>
                <div className="rounded-lg p-2 bg-[#0c0c12]/60">
                  <div className="text-xl font-semibold" style={{ color: "#39ff7e" }}>$13.9K</div>
                  <div className="text-xs text-white/45">Disbursed</div>
                </div>
                <div className="rounded-lg p-2 bg-[#0c0c12]/60">
                  <div className="text-xl font-semibold" style={{ color: "#c455ff" }}>38h</div>
                  <div className="text-xs text-white/45">Time to Pay</div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {["Invoice verified by compliance agent", "Hotel approval received", "FRA validation complete", "Funds disbursed"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-xs text-white"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#39ff7e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 6 9 17l-5-5" /></svg>{t}</div>
                ))}
              </div>
            </div>
            <div
              className="neon-card rounded-2xl border bg-[#12121a] p-5"
              style={{ borderColor: "#c455ff33" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 18px 2px #c455ff30, inset 0 0 20px 0px #c455ff08"; e.currentTarget.style.borderColor = "#c455ff88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#c455ff33"; }}
            >
              <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#c455ff" }}>Pricing Transparency</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3" style={{ borderColor: "#39ff7e33" }}>
                  <div className="text-xl font-semibold" style={{ color: "#39ff7e" }}>1%</div>
                  <div className="text-xs text-white/45 mt-0.5">Direct bank transfer fee</div>
                </div>
                <div className="rounded-lg border p-3" style={{ borderColor: "#ff7e1a33" }}>
                  <div className="text-xl font-semibold" style={{ color: "#ff7e1a" }}>1.5–3%</div>
                  <div className="text-xs text-white/45 mt-0.5">Factoring service fee</div>
                </div>
              </div>
              <p className="text-xs text-white/45 mt-3">No subscription. No setup fee. You only pay when you transact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ COMPLIANCE ═══════════ */}
      <section className="py-24 border-y" style={{ borderColor: "#c455ff18" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 animate-on-scroll">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#c455ff" }}>Security &amp; Compliance</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4 text-white">Built for Egypt&apos;s Regulated Market</h2>
            <p className="text-white/45 text-lg max-w-2xl mx-auto text-balance">HotelsVendors and INVO are fully compliant with Egypt&apos;s Electronic Transaction Authority (ETA) and Financial Regulatory Authority (FRA) standards. Every transaction, invoice, and factoring request is automatically audited.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-12 stagger-children">
            {[
              { color: "#39ff7e", label: "ETA Compliant" },
              { color: "#ff7e1a", label: "FRA Registered" },
              { color: "#c455ff", label: "ISO 27001" },
              { color: "#39ff7e", label: "PCI-DSS Partners" },
              { color: "#ff7e1a", label: "AML / KYC" },
              { color: "#c455ff", label: "GDPR Aligned" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm animate-on-scroll" style={{ borderColor: `${b.color}55`, color: b.color, background: `${b.color}10` }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                {b.label}
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div
              className="neon-card rounded-2xl border bg-[#12121a] p-5"
              style={{ borderColor: "#39ff7e33" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 18px 2px #39ff7e30, inset 0 0 20px 0px #39ff7e08"; e.currentTarget.style.borderColor = "#39ff7e88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#39ff7e33"; }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center border" style={{ background: "#39ff7e15", borderColor: "#39ff7e40", color: "#39ff7e" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
                </div>
                <div className="font-semibold text-white">ETA Compliance Engine</div>
              </div>
              <p className="text-sm text-white/45 leading-relaxed">Every invoice issued through INVO is automatically structured to meet Egypt&apos;s ETA electronic invoicing standard. No manual submission required — our agents handle it end-to-end.</p>
            </div>
            <div
              className="neon-card rounded-2xl border bg-[#12121a] p-5"
              style={{ borderColor: "#ff7e1a33" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 18px 2px #ff7e1a30, inset 0 0 20px 0px #ff7e1a08"; e.currentTarget.style.borderColor = "#ff7e1a88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#ff7e1a33"; }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center border" style={{ background: "#ff7e1a15", borderColor: "#ff7e1a40", color: "#ff7e1a" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <div className="font-semibold text-white">FRA Financial Standards</div>
              </div>
              <p className="text-sm text-white/45 leading-relaxed">All factoring and reverse factoring operations are conducted within the FRA regulatory framework. Automated KYC, AML screening, and transaction monitoring are embedded in every workflow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 animate-on-scroll">
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#39ff7e" }}>Early Access Voices</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-3 text-white">What Our Beta Users Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 stagger-children">
          {[
            { color: "#39ff7e", quote: "The AI chatbot on INVO saved my team 3 hours a day. We just describe what we need and get a ready-to-approve order instantly.", name: "Sophia Müller", role: "Head of Procurement, Meridian Hotels", initials: "SM" },
            { color: "#ff7e1a", quote: "Reverse factoring changed our cash flow completely. 48 hours is real — we tested it on day one. No more waiting 90-day payment terms.", name: "Carlos Reyes", role: "CEO, Luxe Linen Co.", initials: "CR" },
            { color: "#c455ff", quote: "ETA compliance used to be a nightmare. The swarm agents generate every required document automatically. Zero manual overhead.", name: "Aisha Nakamura", role: "Finance Director, Skyline Resorts", initials: "AN" },
          ].map((t) => (
            <div key={t.name} className="animate-on-scroll">
              <div
                className="neon-card rounded-2xl border bg-[#12121a] p-5 h-full flex flex-col"
                style={{ borderColor: `${t.color}33` }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 18px 2px ${t.color}30, inset 0 0 20px 0px ${t.color}08`; e.currentTarget.style.borderColor = `${t.color}88`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${t.color}33`; }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={t.color} stroke={t.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  ))}
                </div>
                <p className="text-sm text-white/45 leading-relaxed flex-1 mb-5">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border" style={{ background: `${t.color}15`, borderColor: `${t.color}44`, color: t.color }}>{t.initials}</div>
                  <div><div className="font-semibold text-sm text-white">{t.name}</div><div className="text-xs text-white/45">{t.role}</div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section className="py-24 border-y" style={{ borderColor: "#39ff7e18" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14 animate-on-scroll">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#39ff7e" }}>Transparent Pricing</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4 text-white">Pay Only When You Transact</h2>
            <p className="text-white/45 text-lg">No subscriptions. No lock-in. We grow only when you grow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {[
              { color: "#39ff7e", badge: "Hotels & Vendors", title: "Platform Access", price: "Free", unit: "Forever", features: ["Full HotelsVendors dashboard", "INVO marketplace access", "AI chatbot & agents", "ETA-compliant invoicing", "Unlimited users & properties"] },
              { color: "#ff7e1a", badge: "All payment types", title: "Bank Transfer", price: "1%", unit: "per transaction", highlight: true, features: ["Multi-currency support", "SWIFT & local bank rails", "Instant confirmation", "Auto-generated receipts", "Full audit trail"] },
              { color: "#c455ff", badge: "Reverse factoring", title: "Factoring Service", price: "1.5–3%", unit: "of invoice value", features: ["48-hour supplier payout", "AI-driven authorisation", "FRA-compliant process", "Zero paperwork", "Joker option — use anytime"] },
            ].map((p) => (
              <div key={p.title} className="animate-on-scroll">
                <div
                  className="neon-card rounded-2xl border bg-[#12121a] p-5 flex flex-col h-full relative"
                  style={{ borderColor: `${p.color}33` }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 18px 2px ${p.color}30, inset 0 0 20px 0px ${p.color}08`; e.currentTarget.style.borderColor = `${p.color}88`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${p.color}33`; }}
                >
                  {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold" style={{ background: "#ff7e1a", color: "#07090f" }}>Most Used</div>}
                  <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: p.color }}>{p.badge}</div>
                  <div className="text-2xl font-semibold mb-1 text-white">{p.title}</div>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-white">{p.price}</span>
                    <span className="text-white/45 pb-1 text-sm">{p.unit}</span>
                  </div>
                  <ul className="flex flex-col gap-2.5 flex-1 mb-7">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 6 9 17l-5-5" /></svg>{f}</li>
                    ))}
                  </ul>
                  <Link href="/register" className="w-full font-semibold cursor-pointer rounded-md text-sm py-2.5 text-center block" style={{ background: p.color, color: "#07090f" }}>Get Started</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(to right, #8B1A1A 1px, transparent 1px), linear-gradient(to bottom, #8B1A1A 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center animate-on-scroll">
          <div className="flex justify-center mb-6"><BrandLogo variant="dark" size="lg" showText={false} /></div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-balance leading-tight text-white">
            The Future of Hotel<br /><span style={{ color: "#8B1A1A" }}>Procurement is Here.</span>
          </h2>
          <p className="text-white/45 text-lg mb-4 max-w-xl mx-auto">Start free today. Explore the sandbox. Let our AI agents guide your onboarding. No commitment, no subscription — just results.</p>
          <p className="text-sm mb-10" style={{ color: "#ff7e1a" }}>First B2B AI-driven procurement platform for the hospitality sector in Egypt and the region.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="font-semibold px-10 py-3 cursor-pointer gap-2 text-base rounded-md inline-flex items-center bg-[#39ff7e] text-[#07090f]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
              Start Free — No Card Needed
            </Link>
            <Link href="/sandbox" className="font-semibold cursor-pointer text-base gap-2 rounded-md border inline-flex items-center px-10 py-3 bg-transparent" style={{ borderColor: "#c455ff55", color: "#c455ff" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
              Book a Demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────
   SANDBOX CAROUSEL — Procurement flow: PO → Execution → Delivery → Payment
   ────────────────────────────────────────────────────────────── */
const STEPS = [
  {
    step: 1,
    title: "Purchase Order",
    subtitle: "Hotel initiates procurement",
    color: "#39ff7e",
    icon: FileText,
    items: [
      { icon: ShoppingCart, text: "Browse supplier catalogs" },
      { icon: Building2, text: "Select items & quantities" },
      { icon: FileText, text: "Submit purchase order" },
    ],
    dashboard: {
      title: "New Purchase Order",
      table: [
        { item: "Premium Detergent (4×5L)", qty: "12 units", price: "EGP 4,200" },
        { item: "Cotton Bath Towels (500gsm)", qty: "200 pcs", price: "EGP 18,000" },
        { item: "Mineral Water (500ml×24)", qty: "50 cases", price: "EGP 3,750" },
      ],
      total: "EGP 25,950",
    },
  },
  {
    step: 2,
    title: "Execution",
    subtitle: "Supplier confirms & processes",
    color: "#ff7e1a",
    icon: CheckCircle2,
    items: [
      { icon: CheckCircle2, text: "Supplier confirms order" },
      { icon: Package, text: "Picks & packs inventory" },
      { icon: FileText, text: "ETA e-invoice generated" },
    ],
    dashboard: {
      title: "Order Confirmed",
      table: [
        { item: "Order #HV-2026-0847", qty: "Status: Processing", price: "ETA UUID: ✓" },
        { item: "Supplier: CleanPro Egypt", qty: "Tier: Gold", price: "ETA Status: Accepted" },
        { item: "ETA Digital Signature", qty: "Verified", price: "Invoice #INV-4821" },
      ],
      total: "Payment guaranteed ✓",
    },
  },
  {
    step: 3,
    title: "Delivery",
    subtitle: "Logistics fulfills & ships",
    color: "#c455ff",
    icon: Truck,
    items: [
      { icon: Truck, text: "Route optimization" },
      { icon: MapPin, text: "Real-time GPS tracking" },
      { icon: CheckCircle2, text: "Proof of delivery" },
    ],
    dashboard: {
      title: "Shipment Tracking",
      table: [
        { item: "Shipment #SHP-1192", qty: "Route: 6th Oct → Hurg", price: "ETA: 2h 15m" },
        { item: "Carrier: SwiftLog Egypt", qty: "Vehicle: Refrigerated", price: "Status: In Transit" },
        { item: "GPS Checkpoint 3/5", qty: "Cairo-Alex Rd.", price: "Temp: 4°C ✓" },
      ],
      total: "On-time delivery 98.2%",
    },
  },
  {
    step: 4,
    title: "Payment",
    subtitle: "Settlement & factoring",
    color: "#64b5f6",
    icon: CreditCard,
    items: [
      { icon: CreditCard, text: "Payment processed" },
      { icon: Building2, text: "Factoring liquidity" },
      { icon: CheckCircle2, text: "Revenue secured" },
    ],
    dashboard: {
      title: "Payment Settlement",
      table: [
        { item: "Invoice #INV-4821", qty: "Amount: EGP 25,950", price: "Status: Settled" },
        { item: "Platform Fee (2.5%)", qty: "EGP 648.75", price: "Deducted" },
        { item: "Factoring Spread", qty: "EGP 389.25", price: "To partner" },
      ],
      total: "Supplier paid: EGP 24,912",
    },
  },
];

export function SandboxCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive((p) => (p + 1) % STEPS.length), 6000);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const go = (dir: number) => {
    setActive((p) => (p + dir + STEPS.length) % STEPS.length);
    resetTimer();
  };

  const step = STEPS[active];

  return (
    <section className="py-20 border-y animate-on-scroll" style={{ borderColor: "#39ff7e18" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-xs tracking-widest uppercase" style={{ color: "#39ff7e" }}>Platform Demo</span>
          <h2 className="text-3xl md:text-4xl mt-3 mb-3 text-white font-medium">See It in Action</h2>
          <p className="text-white/45 text-sm max-w-xl mx-auto">Follow a complete procurement cycle — from order placement to payment settlement.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <React.Fragment key={s.step}>
                {i > 0 && <div className="hidden sm:block w-8 h-px" style={{ background: i <= active ? step.color : "rgba(255,255,255,0.08)" }} />}
                <button
                  onClick={() => { setActive(i); resetTimer(); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    background: i === active ? `${s.color}15` : "transparent",
                    border: i === active ? `1px solid ${s.color}33` : "1px solid transparent",
                    color: i === active ? s.color : "rgba(255,255,255,0.3)",
                  }}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{s.title}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Main card */}
        <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: `${step.color}44`, boxShadow: `0 0 50px 4px ${step.color}10` }}>
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#12121a]/80">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: step.color }} />
            <div className="flex-1 mx-4 bg-[#0c0c12]/50 rounded px-3 py-1 text-xs text-white/30 border border-white/[0.06]/50">
              app.hotelsvendors.com — Step {step.step}: {step.title}
            </div>
          </div>

          {/* Content */}
          <div className="bg-[#0c0c12] p-6 sm:p-8">
            <div className="grid sm:grid-cols-[1fr_1.5fr] gap-6">
              {/* Left: step details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${step.color}15`, border: `1px solid ${step.color}33` }}>
                    <step.icon size={20} style={{ color: step.color }} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-[15px]">Step {step.step}: {step.title}</h3>
                    <p className="text-white/40 text-[12px]">{step.subtitle}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {step.items.map((item, j) => {
                    const Icon = item.icon;
                    return (
                      <div key={j} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <Icon size={14} style={{ color: step.color }} className="shrink-0" />
                        <span className="text-white/70 text-[13px]">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: mock dashboard */}
              <div className="rounded-xl border border-white/[0.06] bg-[#12121a]/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: step.color }} />
                  <span className="text-white/60 text-[12px] font-medium">{step.dashboard.title}</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {step.dashboard.table.map((row, j) => (
                    <div key={j} className="flex items-center justify-between px-4 py-3">
                      <span className="text-white/70 text-[12px]">{row.item}</span>
                      <span className="text-white/40 text-[12px]">{row.qty}</span>
                      <span className="text-[12px] font-medium" style={{ color: step.color }}>{row.price}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-white/30 text-[11px] uppercase tracking-wider">Summary</span>
                  <span className="text-[13px] font-semibold" style={{ color: step.color }}>{step.dashboard.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav arrows */}
          <button onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#12121a]/80 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all cursor-pointer backdrop-blur-sm">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#12121a]/80 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all cursor-pointer backdrop-blur-sm">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); resetTimer(); }}
              className="w-2 h-2 rounded-full transition-all cursor-pointer"
              style={{
                background: i === active ? s.color : "rgba(255,255,255,0.1)",
                boxShadow: i === active ? `0 0 8px ${s.color}44` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
