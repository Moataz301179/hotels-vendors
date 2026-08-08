"use client";

/* HotelsVendors — Landing. Fresh flagship build on the flat token system.
   Dense, real-data-feeling, enterprise procurement tone (Coupa / Ramp / Linear).
   Every CTA targets a REAL route. No glass, no gradients, no hollow cards. */

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AudienceRouter } from "@/components/marketing/audience-router";
import { InteractiveSandbox } from "@/components/marketing/interactive-sandbox";
import { CommandCenter } from "@/components/marketing/command-center";
import {
  ArrowRight, Shield, Landmark, Truck, Store, Hotel, Building2,
  Gavel, FileUp, Calculator, Cpu, CreditCard, CheckCircle2,
  Package, Banknote, TrendingUp, Sparkles,
} from "lucide-react";

/* Explicit 1-to-1 category → image mapping (no reused URLs, no generic fallback). */
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  linen: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80",
  bathroom: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
  kitchen: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
  cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
};

/* ── Count-up for live-feeling metrics ── */
function useCountUp(end: number, duration = 1500) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setV(Math.round((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);
  return { v, ref } as { v: number; ref: React.RefObject<HTMLSpanElement | null> };
}

function Metric({ end, suffix, label }: { end: number; suffix?: string; label: string }) {
  const { v, ref } = useCountUp(end);
  return (
    <div className="border-l border-slate-200 pl-4">
      <div className="text-2xl font-bold text-slate-900 tabular-nums tracking-tight" ref={ref as React.RefObject<HTMLDivElement>}>{v.toLocaleString()}{suffix}</div>
      <div className="text-[11px] text-slate-500 mt-0.5 font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}

/* ── Shell section header ── */
function SectionHeader({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl mb-10">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">{kicker}</div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2 tracking-tight">{title}</h2>
      {sub && <p className="text-slate-600 text-sm mt-2 leading-relaxed">{sub}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      {/* ═════════════ HERO ═════════════ */}
      <section className="border-b border-slate-200 relative overflow-hidden bg-white">
        {/* Core-related background image with a clean readability overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80"
            alt="Elegant hotel lobby"
            className="w-full h-full object-cover opacity-[0.07]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pt-20 pb-16 lg:pt-24 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: value proposition */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
                <Sparkles size={12} />
                ETA Verified &amp; FRA Regulated — Egypt's hospitality procurement infrastructure
              </div>
              <h1 className="mt-5 text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
                Buy smarter.<br />
                <span className="text-blue-600">Get paid in 48h.</span>
              </h1>
              <p className="mt-4 text-slate-600 text-base lg:text-lg max-w-lg leading-relaxed">
                Hotels control procurement, approvals, and ETA compliance from the web.
                Suppliers fulfill and cash out from the INVO app.
                One unified platform, zero friction, AI agents running the complexity.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/register?type=hotel" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 transition-colors">
                  Start free <ArrowRight size={15} />
                </Link>
                <Link href="/sandbox" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 transition-colors">
                  Explore sandbox
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-5 pt-6 border-t border-slate-100">
                <Metric end={1247} label="Hotels" />
                <Metric end={3892} label="Suppliers" />
                <Metric end={847} suffix="M" label="EGP GMV" />
                <Metric end={48} suffix="h" label="Payout" />
              </div>
            </div>

            {/* Right: dense live PO intake panel */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Live Purchase Order</div>
                <span className="text-[11px] text-slate-400 font-mono">#HV-9921 · Meridian Cairo</span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase bg-slate-50">
                    <th className="text-left font-semibold py-2 px-3">SKU</th>
                    <th className="text-left font-semibold py-2 px-3">Item</th>
                    <th className="text-right font-semibold py-2 px-3">Qty</th>
                    <th className="text-right font-semibold py-2 px-3">Total</th>
                    <th className="text-right font-semibold py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { sku: "LIN-001", item: "Egyptian Cotton Sheets 400TC", qty: "200", total: "EGP 14,400", s: "Verified" },
                    { sku: "LIN-042", item: "Bath Towels GSM 500", qty: "350", total: "EGP 15,750", s: "In Transit" },
                    { sku: "AMN-018", item: "Hotel Shampoo 30ml Bulk", qty: "2,000", total: "EGP 7,000", s: "RFQ Active" },
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-[10px] text-slate-400">{r.sku}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{r.item}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-slate-600">{r.qty}</td>
                      <td className="py-2 px-3 text-right tabular-nums font-medium text-slate-900">{r.total}</td>
                      <td className="py-2 px-3 text-right">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                          r.s === "Verified" ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : r.s === "In Transit" ? "bg-blue-50 text-blue-800 border-blue-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"}`}>{r.s}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">PO total · 3 suppliers</span>
                  <span className="font-bold text-slate-900 tabular-nums">EGP 37,150</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Banknote size={12} className="text-emerald-600" />
                    48h factoring ready · FRA compliant
                  </div>
                  <Link href="/factoring-service" className="text-[11px] font-semibold text-emerald-700 hover:underline">Cash out →</Link>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ HOOK STRIP — dual architecture drivers (centered) ═══ */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Building2, title: "HotelsVendors Web OS", d: "Multi-property procurement · approval matrix · budget locks · ETA compliance", cta: "/platform" },
              { icon: Package, title: "INVO Mobile App", d: "Supplier execution · dock camera GRN · 48h Oliv cash-out (CHV000)", cta: "/invo" },
              { icon: Cpu, title: "AI Swarm Agents", d: "Pricing, RFQ auction, dock inspection, factoring, ETA — running 24/7", cta: "/sandbox" },
            ].map((h) => (
              <Link key={h.title} href={h.cta} className="group bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 hover:border-slate-400 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded bg-slate-900 flex items-center justify-center shrink-0">
                  <h.icon size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{h.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{h.d}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════ SMART INTENT ROUTER ═════════════ */}
      <AudienceRouter />

      {/* ═════════════ TRUSTED BY STRIP ═════════════ */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-slate-400">
          <span className="font-semibold uppercase tracking-widest text-[10px]">Compliance &amp; rails</span>
          {["ETA e-Invoicing", "FRA Licensed", "ISO 27001", "PCI-DSS", "InstaPay", "Paymob", "Fawry", "Oliv"].map((b) => (
            <span key={b} className="font-medium text-slate-500">{b}</span>
          ))}
        </div>
      </section>

      {/* ═════════════ CATEGORY GRID ═════════════ */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <SectionHeader
          kicker="Category Hubs"
          title="Everything a hotel buys, in one catalog"
          sub="Dense live SKU catalogs across 8 core hospitality categories, with unit pricing, MOQs, and one-click RFQ."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: "linen", name: "Premium Linens", meta: "High-thread Egyptian cotton hotel bedding", price: "From EGP 450" },
            { key: "bathroom", name: "Bathroom Amenities", meta: "Luxury bathroom vanity & rolled towels", price: "From EGP 35/set" },
            { key: "kitchen", name: "Commercial Kitchen", meta: "Stainless steel hotel restaurant equipment", price: "From EGP 2,100" },
            { key: "cleaning", name: "Cleaning & Chemicals", meta: "Professional housekeeping supplies & sanitizers", price: "From EGP 80/L" },
          ].map((c) => (
            <Link key={c.name} href="/categories" className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-400 hover:shadow-sm transition-all">
              <div className="h-48 w-full overflow-hidden bg-slate-100">
                <img src={CATEGORY_IMAGE_MAP[c.key]} alt={c.name} onError={(e)=>{e.currentTarget.style.display="none";}} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="text-base font-bold text-slate-900">{c.name}</div>
                  <span className="text-xs bg-slate-100 text-slate-800 font-semibold px-2 py-1 rounded">{c.price}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{c.meta}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/categories" className="text-sm font-semibold text-blue-600 hover:underline">Browse all category hubs →</Link>
        </div>
      </section>

      {/* ═════════════ HYBRID RFQ CONTROL PANEL ═════════════ */}
      <section className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                kicker="Hybrid RFQ Engine"
                title="Buy fixed below the threshold. Auction above it."
                sub="Standard items checkout instantly at fixed price. Bulk quantities trigger a multi-vendor auction that returns competitive bids to your screen in minutes."
              />
              <div className="flex flex-col gap-3">
                <Link href="/rfq" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 w-fit">
                  <Gavel size={15} /> Open RFQ engine <ArrowRight size={15} />
                </Link>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[11px] px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">Instant checkout</span>
                  <span className="text-[11px] px-2 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200">Bulk auction</span>
                  <span className="text-[11px] px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">Supplier quotes &lt; 24h</span>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Live auction — Cotton Sheets × 200</div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase bg-slate-50">
                    <th className="text-left font-semibold py-2 px-3">Supplier</th>
                    <th className="text-right font-semibold py-2 px-3">Bid</th>
                    <th className="text-right font-semibold py-2 px-3">Discount</th>
                    <th className="text-right font-semibold py-2 px-3">Delivery</th>
                    <th className="text-right font-semibold py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { s: "Luxe Linen Co.", b: "EGP 63", d: "12%", dl: "5 days" },
                    { s: "NileMills SAE", b: "EGP 66", d: "8%", dl: "3 days" },
                    { s: "DeltaTex", b: "EGP 69", d: "4%", dl: "2 days" },
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-slate-800">{r.s}</td>
                      <td className="py-2 px-3 text-right tabular-nums font-medium text-slate-900">{r.b}</td>
                      <td className="py-2 px-3 text-right"><span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">{r.d}</span></td>
                      <td className="py-2 px-3 text-right text-slate-500">{r.dl}</td>
                      <td className="py-2 px-3 text-right"><Link href="/rfq" className="text-[11px] font-semibold text-blue-600 hover:underline">Accept</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════ AI SWARM ═════════════ */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <SectionHeader
          kicker="AI Swarm"
          title="7 autonomous agents run the complexity"
          sub="Pricing intelligence, RFQ negotiation, dock inspection, factoring, quality substitution, ETA compliance, and route resilience — running 24/7 in the background."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "MarketPulse", d: "FX & commodity inflation guard — flags price anomalies +15%, tracks EGP rate" },
            { name: "DynamicDeal", d: "Swarm group-buying negotiator — runs bulk RFQ auctions to unlock discounts" },
            { name: "DockInspector", d: "INVO Mobile camera scan-to-credit-note — detects damage, issues instant credits" },
            { name: "CashFlowAgent", d: "Oliv 48h factoring & FRA registry engine — dynamic rates, single-instance locks" },
            { name: "QualitySpec", d: "Technical spec & Egyptian import matcher — cheaper local alternatives" },
            { name: "ComplianceGuard", d: "ETA e-invoicing & highway e-Waybill QR generator" },
            { name: "ResilienceRoute", d: "Shared freight pooling & dock-slot booking across resort corridors" },
          ].map((a, i) => (
            <div key={a.name} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="text-amber-700" />
                </div>
                <div className="text-sm font-semibold text-slate-900 flex-1">{a.name}</div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">Agent {i + 1}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{a.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════════ PLATFORM AI CAPABILITIES ═════════════ */}
      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
          <SectionHeader
            kicker="Platform AI Capabilities"
            title="Five AI engines working for your bottom line"
            sub="Beyond order processing — predictive, autonomous engines that prevent stockouts, aggregate buying power, and protect margin against inflation and FX swings."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: "Predictive PMS Demand Engine", d: "Syncs with hotel occupancy to auto-draft POs before stock runs out." },
              { name: "Dynamic Swarm Group Buying", d: "Aggregates demand across regional hotel clusters to unlock 20%+ manufacturer discounts." },
              { name: "INVO Dock Inspector (Vision)", d: "Camera scan-to-GRN that auto-issues instant credit notes for damaged or missing goods." },
              { name: "EGP Inflation & FX Guard", d: "Predictive commodity tracking alerts buyers to lock pricing before market spikes." },
              { name: "Voice-to-PO Concierge", d: "WhatsApp / INVO voice-note parsing converts spoken requests into budgeted line-item POs." },
              { name: "48h Reverse-Factoring Pool", d: "Oliv-powered earliest-payout engine with FRA registry and promo code CHV000." },
            ].map((c, i) => (
              <div key={c.name} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                <div className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold w-fit mb-2">Capability {i + 1}</div>
                <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
          <SectionHeader
            kicker="One platform. Two layers."
            title="Web for control. Mobile for the field."
            sub="Hotels run procurement and approvals on the web portal. Suppliers, carriers, and dock staff operate from the INVO app — the same order flows through both."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center"><Hotel size={15} className="text-slate-600" /></div>
                <span className="text-sm font-semibold text-slate-900">HotelsVendors Web</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /> Spend analytics & AI forecasting</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /> Multi-tier authority matrix approvals</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /> Hybrid checkout: instant vs RFQ auction</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /> ETA e-invoice & e-Waybill compliance</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /> ERP sync — SAP, Odoo, Oracle Opera</li>
              </ul>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center"><Package size={15} className="text-slate-600" /></div>
                <span className="text-sm font-semibold text-slate-900">INVO Mobile</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /> Supplier order inbox & one-tap stock toggles</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /> 48h factoring cash-out (1.5–3%)</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /> Dock ePOD scanner with QR verification</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /> Real-time shipment tracking & live GPS</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-600" /> Carrier driver job queue & e-Waybill</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════ TERMINAL ═════════════ */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <SectionHeader
          kicker="Live system"
          title="Proof, not promises"
          sub="Real execution traces from the autonomous engine — compliance, dispatch, and factoring happening automatically."
        />
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-[11px] leading-relaxed">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" /><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-400 ml-2">hotelsvendors-agent — swarm logs</span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <p><span className="text-slate-500">[onboarding]</span> ETA Tax ID #382-910-112 <span className="text-emerald-400">verified in 42s</span> · FRA <span className="text-emerald-400">cleared</span></p>
            <p><span className="text-slate-500">[catalog]</span> AI ingestion: 1,203 products auto-enriched · 100% tax compliant</p>
            <p><span className="text-slate-500">[dispatch]</span> Mobile push → Order #HV-8812 <span className="text-blue-400">accepted by supplier in 3m</span></p>
            <p><span className="text-slate-500">[compliance]</span> e-Waybill EWB-88K2F9 generated · QR attached · <span className="text-emerald-400">verified</span></p>
            <p><span className="text-slate-500">[factoring]</span> FRA audit passed · EGP 14,400 payout <span className="text-emerald-400">approved in 38h</span></p>
          </div>
        </div>
      </section>

      {/* ═════════════ ENTERPRISE COMMAND CENTER (alternating bg) ═════════════ */}
      <CommandCenter />

      {/* ═════════════ INTERACTIVE SANDBOX ═════════════ */}
      <section className="bg-[#F8FAFC] border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionHeader
            kicker="Try Before You Buy"
            title="Run the platform before you sign up"
            sub="A live, interactive micro-app — simulate approval chains, 48h cash-out, and dock scans with real-time trace."
          />
          <InteractiveSandbox />
        </div>
      </section>

      {/* ═════════════ PRICING ═════════════ */}
      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
          <SectionHeader
            kicker="Pricing"
            title="Free platform. Fee on value."
            sub="No subscription to start. We monetize transactions and liquidity — aligned with your volume."
          />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { n: "Platform Access", v: "EGP 0", d: "Unlimited RFQs, approvals, ETA compliance, marketplace access.", featured: false },
              { n: "Bank Rails", v: "1%", d: "Per successful order via InstaPay, Paymob, Fawry, or bank transfer.", featured: false },
              { n: "48h Factoring", v: "1.5–3%", d: "Dynamic rate on supplier early payouts, FRA-backed, non-recourse.", featured: true },
            ].map((p) => (
              <div key={p.n} className={`bg-slate-50 border rounded-lg p-6 ${p.featured ? "border-slate-900" : "border-slate-200"}`}>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{p.n}</div>
                <div className="text-3xl font-bold text-slate-900 mt-2 tabular-nums">{p.v}</div>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/pricing" className="text-sm font-semibold text-blue-600 hover:underline">Full pricing & terms →</Link>
          </div>
        </div>
      </section>

      {/* ═════════════ FINAL CTA ═════════════ */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Put your procurement on autopilot</h2>
        <p className="text-slate-600 text-sm mt-3 max-w-xl mx-auto">Join Egyptian hotels and 3,000+ suppliers transacting with ETA compliance and 48h liquidity.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/register?type=hotel" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800">
            Create free account <ArrowRight size={15} />
          </Link>
          <Link href="/financing/oliv" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50">
            <Landmark size={15} /> Explore Oliv financing
          </Link>
        </div>

        {/* Onboarding hooks */}
        <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <span className="text-emerald-700 font-bold text-sm">0%</span>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Free forever platform</div>
              <div className="text-xs text-slate-500 mt-0.5">No subscription for hotels &amp; suppliers. Pay only on transaction value.</div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center shrink-0">
              <Landmark size={16} className="text-blue-700" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">CHV000 Activated</div>
              <div className="text-xs text-slate-600 mt-0.5">Suez Canal Bank EGP 10M Facility · referral code CHV000 live on all Oliv actions</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}