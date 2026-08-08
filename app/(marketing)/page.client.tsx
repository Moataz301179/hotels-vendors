"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HotelSuppliesCarousel } from "@/components/marketing/hotel-supplies-carousel";
import { useTranslation } from "@/lib/i18n/hooks/use-translation";
import {
  FileText, CheckCircle2, ShoppingCart, Package, Smartphone, Monitor,
  ArrowRight, Shield, Zap, Landmark, Bot, Sparkles,
  LineChart, ClipboardCheck, RefreshCw,
} from "lucide-react";

/* ── Count-Up Animation ── */
function useCountUp(end: number, duration?: number) {
  const d = duration || 1600;
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / d, 1);
          setValue(Math.round((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, d]);
  return { value, ref };
}

function StatCounter({ end, suffix, label, sub }: { end: number; suffix?: string; label: string; sub?: string }) {
  const { value, ref } = useCountUp(end);
  return (
    <div className="text-center" ref={ref}>
      <div className="text-xl md:text-2xl font-bold text-slate-900 tabular-nums">
        {value}{suffix || "+"}
      </div>
      <div className="text-[10px] text-slate-500 mt-0.5 font-medium uppercase tracking-wide">{label}</div>
      {sub && <div className="text-[9px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

/* ── Agent icon picker (simple string → lucide mapping) ── */
function AgentIcon({ id }: { id: string }) {
  const map: Record<string, React.ElementType> = {
    marketpulse: LineChart,
    dynamicdeal: Zap,
    dockinspector: Package,
    cashflowagent: Landmark,
    qualityspec: ClipboardCheck,
    complianceguard: Shield,
    resilienceroute: RefreshCw,
  };
  const Icon = map[id] || Bot;
  return <Icon size={14} />;
}

/* ── Main Page ── */
export default function MarketingPage() {
  const { t } = useTranslation("homepage");

  return (
    <main id="main-content" className="bg-slate-50">

      {/* ═══════════════ SECTION 1 — HERO (Flat Solid Light) ═══════════════ */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-16 lg:pt-28 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* LEFT COLUMN */}
            <div className="space-y-5">
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-emerald-300 bg-emerald-50 text-emerald-800 text-[11px] font-semibold tracking-wide">
                <Sparkles size={12} />
                ETA Verified &amp; FRA Regulated Platform
              </div>

              {/* Headline */}
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                AI-Powered B2B<br />Hotel Procurement
              </h1>

              <p className="text-sm lg:text-base text-slate-600 max-w-lg leading-relaxed">
                Hotels manage RFQs, approvals, and ETA compliance from the Web.
                Suppliers scan, fulfill, and cash-out from INVO Mobile.
                One real-time data layer, zero friction.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-3">
                <a href="/register"
                  className="inline-flex items-center gap-2 px-6 py-2.5 font-semibold rounded-md text-white text-sm bg-slate-900 hover:bg-slate-800 transition-colors">
                  Get Started Free
                  <ArrowRight size={15} />
                </a>
                <a href="/sandbox"
                  className="inline-flex items-center gap-2 px-6 py-2.5 font-semibold rounded-md text-sm text-slate-700 border border-slate-300 bg-white hover:bg-slate-100 transition-colors">
                  Explore Sandbox
                </a>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-200">
                <StatCounter end={1247} label="Hotels" />
                <StatCounter end={3892} label="Suppliers" />
                <StatCounter end={847} suffix="M" label="GMV" />
                <StatCounter end={48} suffix="h" label="Payout" />
              </div>
            </div>

            {/* RIGHT COLUMN — Compact Dashboard Card */}
            <div>
              <div className="rounded-md border border-slate-200 bg-white">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-slate-100">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <span className="flex-1 text-center text-[10px] text-slate-400 font-mono">
                    app.hotelsvendors.com — Live Dashboard
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Live PO feed */}
                  <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 bg-slate-50">
                    <div>
                      <div className="text-[11px] text-slate-500">Meridian Cairo · Order #HV-9921</div>
                      <div className="text-xs font-semibold text-slate-900 mt-0.5">Egyptian Cotton Sheets × 200</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded border border-emerald-300 bg-emerald-50 text-emerald-800 font-medium">
                      ETA Verified
                    </span>
                  </div>

                  {/* Metric grid 2x2 */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {([
                      { label: "Monthly Spend", val: "EGP 182K", trend: "↓8%", color: "#059669" },
                      { label: "Active Orders", val: "34", trend: "↑12%", color: "#2563eb" },
                      { label: "Vendors", val: "47", trend: "via INVO", color: "#7c3aed" },
                      { label: "Factoring", val: "6 active", trend: "2 pending", color: "#d97706" },
                    ] as const).map((c) => (
                      <div key={c.label} className="rounded border border-slate-200 bg-white p-2.5">
                        <div className="text-[10px] text-slate-400">{c.label}</div>
                        <div className="text-sm font-bold text-slate-900 mt-0.5">{c.val}</div>
                        <div className="text-[10px] mt-0.5 font-medium" style={{ color: c.color }}>{c.trend}</div>
                      </div>
                    ))}
                  </div>

                  {/* 48h Factoring widget */}
                  <div className="rounded border border-emerald-300 bg-emerald-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded border border-emerald-300 bg-emerald-100 flex items-center justify-center">
                          <Landmark size={13} className="text-emerald-700" />
                        </div>
                        <div>
                          <div className="text-[11px] text-slate-800 font-semibold">Request 48h Factoring Cash-Out</div>
                          <div className="text-[10px] text-slate-500">Invoice INV-2847 · EGP 14,400</div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded border border-emerald-300 bg-emerald-100 text-emerald-800 font-medium">
                        2.1% fee · Net EGP 14,098
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Partner strip */}
              <div className="flex items-center gap-3 mt-3 px-1">
                <span className="text-[10px] text-slate-400 tracking-wider uppercase">Partner Ecosystem</span>
                <img src="/oliv-logo-white.png" alt="Oliv" className="h-4 w-auto opacity-50" />
                <span className="text-[10px] text-slate-300">·</span>
                <span className="text-[10px] text-slate-400">Paymob · InstaPay · Fawry</span>
              </div>
            </div>
          </div>
        </div>

        <HotelSuppliesCarousel />
      </section>

      {/* ═══════════════ SANDBOX DEMO ═══════════════ */}
      <SandboxDemo t={t} />

      {/* ═══════════════ SECTION 2 — CATEGORY GRID (Flat Solid) ═══════════════ */}
      <section className="py-14 max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-[11px] tracking-widest uppercase text-blue-600 font-semibold">Every Category. One Platform.</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-2 text-slate-900">Source Everything Your Hotel Needs</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            From premium linens to commercial kitchen equipment — source everything through verified suppliers on INVO.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            { name: "Premium Linens", price: "From EGP 450", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop" },
            { name: "Bathroom Amenities", price: "From EGP 35/set", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop" },
            { name: "Kitchen Equipment", price: "From EGP 2,100", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" },
            { name: "Cleaning Supplies", price: "From EGP 80/L", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop" },
            { name: "Guest Room Furniture", price: "From EGP 3,500", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop" },
            { name: "HVAC & Engineering", price: "From EGP 15,000", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop" },
            { name: "Hotel Bedding", price: "From EGP 1,200", img: "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?w=400&h=300&fit=crop" },
            { name: "Pool & Spa Supplies", price: "From EGP 550", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop" },
          ] as const).map((c) => (
            <div key={c.name} className="group">
              <div className="rounded border border-slate-200 bg-white overflow-hidden hover:border-slate-300 transition-colors">
                <div className="h-32 relative overflow-hidden bg-slate-100">
                  <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{c.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ SECTION 3 — HOW IT WORKS (4-Step Flat) ═══════════════ */}
      <section className="py-14 border-t border-slate-200 max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-[11px] tracking-widest uppercase text-blue-600 font-semibold">How It Works</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-2 text-slate-900">Start Free. Transact Smart.</h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            No subscription. No setup cost. AI agents guide you from registration to your first compliant transaction.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-3">
          {([
            { step: "01", title: "Hotels Join Free", desc: "Register your property group. AI agents guide you through ETA-compliant onboarding in minutes." },
            { step: "02", title: "Discover on INVO", desc: "Browse INVO — our vendor marketplace. Compare, order, and track everything from one dashboard." },
            { step: "03", title: "Suppliers Fulfill via Mobile", desc: "Orders appear instantly on INVO Mobile. Suppliers scan, pack, and deliver — all from their phone." },
            { step: "04", title: "Finance & Get Paid Fast", desc: "Need working capital? Factor invoices via Oliv. Hotel pays later. Supplier gets paid in 48h." },
          ] as const).map((s) => (
            <div key={s.step} className="rounded border border-slate-200 bg-white p-4">
              <div className="text-2xl font-bold text-slate-200 mb-2">{s.step}</div>
              <div className="text-sm font-semibold text-slate-900 mb-1.5">{s.title}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ SECTION 4 — AI SWARM AGENTS (7 Agents Flat) ═══════════════ */}
      <section className="py-14 border-t border-slate-200 max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-[11px] tracking-widest uppercase text-blue-600 font-semibold">AI-Powered</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-2 text-slate-900">Swarm Agents Handle the Complexity</h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            You focus on hospitality. Our AI swarm handles compliance, documentation, vendor matching, spend forecasting, and factoring — automatically.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {([
            { id: "marketpulse", name: "MarketPulse", desc: "Real-time market intelligence. Tracks supplier pricing, availability, and demand signals across the INVO network." },
            { id: "dynamicdeal", name: "DynamicDeal", desc: "Auto-negotiates bulk pricing and terms. Scores suppliers on TCP (Total Cost of Procurement)." },
            { id: "dockinspector", name: "DockInspector", desc: "Verifies deliveries against POs. OCR scans GRNs and flags discrepancies before acceptance." },
            { id: "cashflowagent", name: "CashFlowAgent", desc: "Orchestrates reverse factoring end-to-end — request, approval, FRA validation, 48h disbursement." },
            { id: "qualityspec", name: "QualitySpec", desc: "Maintains product quality standards. Cross-references specs against order requirements automatically." },
            { id: "complianceguard", name: "ComplianceGuard", desc: "Audits every transaction against ETA and FRA standards. Generates required regulatory documentation." },
            { id: "resilienceroute", name: "ResilienceRoute", desc: "Multi-supplier fallback routing. If primary supplier fails, auto-routes to verified alternatives." },
          ] as const).map((a) => (
            <div key={a.id} className="rounded border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded border border-slate-300 bg-slate-100 flex items-center justify-center text-slate-700">
                  <AgentIcon id={a.id} />
                </div>
                <div className="text-sm font-semibold text-slate-900">{a.name}</div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>

        {/* Embedded CLI Terminal */}
        <div className="mt-6 rounded border border-slate-700 bg-slate-900 p-3 font-mono text-[11px] text-emerald-400 leading-relaxed overflow-x-auto">
          <span className="text-slate-500">$</span> swarm status<br />
          <span className="text-emerald-300">✓</span> MarketPulse <span className="text-slate-500">— scanning 3,892 suppliers</span><br />
          <span className="text-emerald-300">✓</span> DynamicDeal <span className="text-slate-500">— 12 active negotiations</span><br />
          <span className="text-emerald-300">✓</span> ComplianceGuard <span className="text-slate-500">— ETA audit trail: clean</span><br />
          <span className="text-emerald-300">✓</span> CashFlowAgent <span className="text-slate-500">— 6 factoring requests active</span><br />
          <span className="text-slate-500">$</span> <span className="animate-pulse">▌</span>
        </div>
      </section>

      {/* ═══════════════ SECTION 5 — PLATFORM ENGINE (Comparison Matrix Flat) ═══════════════ */}
      <section className="py-14 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] tracking-widest uppercase text-blue-600 font-semibold">Platform Engine</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-2 text-slate-900">Web Controls · Mobile Executes</h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              Hotels manage procurement from the desktop. Suppliers fulfill from their phone. One real-time data layer connects them.
            </p>
          </div>

          {/* Dual-layer comparison */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Web Controls */}
            <div className="rounded border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded border border-slate-300 bg-white flex items-center justify-center text-slate-700">
                  <Monitor size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">HotelsVendors Web</div>
                  <div className="text-[10px] text-slate-500">Desktop procurement dashboard</div>
                </div>
              </div>
              <div className="space-y-2">
                {([
                  { label: "RFQ Engine", desc: "Create and manage request-for-quote workflows" },
                  { label: "Authority Matrix", desc: "Multi-level approval chains, role-based" },
                  { label: "ETA Compliance", desc: "Auto-generated e-invoices, audit trail" },
                  { label: "Spend Analytics", desc: "Real-time dashboards, forecasting" },
                  { label: "Supplier Management", desc: "Onboard, rate, manage supplier relationships" },
                ] as const).map((f) => (
                  <div key={f.label} className="flex items-start gap-2 p-2 rounded border border-slate-200 bg-white">
                    <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{f.label}</div>
                      <div className="text-[10px] text-slate-500">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INVO Mobile */}
            <div className="rounded border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded border border-slate-300 bg-white flex items-center justify-center text-slate-700">
                  <Smartphone size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">INVO Mobile</div>
                  <div className="text-[10px] text-slate-500">Supplier mobile app</div>
                </div>
              </div>
              <div className="space-y-2">
                {([
                  { label: "Scan-to-Request", desc: "OCR invoice scanning, instant RFQ response" },
                  { label: "GRN Capture", desc: "Photo-based goods-received-note upload" },
                  { label: "Oliv Factoring", desc: "48h cash-out, FRA-compliant, no paperwork" },
                  { label: "Push Notifications", desc: "New orders, approvals, payment confirmations" },
                  { label: "Inventory Sync", desc: "Real-time stock levels, auto-replenishment" },
                ] as const).map((f) => (
                  <div key={f.label} className="flex items-start gap-2 p-2 rounded border border-slate-200 bg-white">
                    <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{f.label}</div>
                      <div className="text-[10px] text-slate-500">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platform capabilities */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* AI Catalog Ingestion */}
            <div className="rounded border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded border border-slate-300 bg-slate-100 flex items-center justify-center text-slate-700">
                  <FileText size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">AI Catalog Ingestion Pipeline</div>
                  <div className="text-[10px] text-slate-500">Supplier Excel/CSV → LLM Enrichment → Marketplace</div>
                </div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 p-2.5 mb-3 font-mono text-[10px] text-slate-600 leading-relaxed">
                <span className="text-slate-400">$</span> npx tsx scripts/import-catalog.ts --file <span className="text-blue-600">supplier-pricelist.xlsx</span> --supplier-id luxe-linen<br />
                <span className="text-emerald-600">✓</span> Parsed 1,247 rows · <span className="text-blue-600">✓</span> AI enriched 1,203 products · <span className="text-amber-600">⚠</span> 44 flagged for review<br />
                <span className="text-emerald-600">✓</span> Imported to marketplace · SKUs generated · Descriptions written · Pricing optimized
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Excel/CSV/PDF Parser", "LLM Column Mapping", "SKU Auto-Generation", "Bulk DB Insert", "Sync Workers"].map((f) => (
                  <span key={f} className="text-[10px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600">{f}</span>
                ))}
              </div>
            </div>

            {/* Hybrid Pricing Engine */}
            <div className="rounded border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded border border-slate-300 bg-slate-100 flex items-center justify-center text-slate-700">
                  <ShoppingCart size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Hybrid Pricing Engine</div>
                  <div className="text-[10px] text-slate-500">FIXED checkout · RFQ threshold · Auto-negotiation</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <div className="rounded border border-slate-200 bg-slate-50 p-2.5">
                  <div className="text-[11px] font-semibold text-emerald-700">FIXED Mode</div>
                  <div className="text-[10px] text-slate-500 mt-1">Standard items · Instant checkout · Add to Cart</div>
                  <div className="text-xs mt-1.5 font-mono text-blue-600">EGP 72/unit</div>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 p-2.5">
                  <div className="text-[11px] font-semibold text-amber-700">RFQ Mode</div>
                  <div className="text-[10px] text-slate-500 mt-1">Bulk orders · Quantity threshold · Auto-quote</div>
                  <div className="text-xs mt-1.5 font-mono text-amber-600">Request Quote →</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Order Forwarding", "Supplier Webhook", "cXML/Email Dispatch", "Taager API", "Auto RFQ to Suppliers"].map((f) => (
                  <span key={f} className="text-[10px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 6 — PRICING (Flat Solid Cards) ═══════════════ */}
      <section className="py-14 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] tracking-widest uppercase text-blue-600 font-semibold">Transparent Pricing</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-2 text-slate-900">Pay Only When You Transact</h2>
            <p className="text-slate-600 text-sm">No subscriptions. No lock-in. We grow only when you grow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {([
              { badge: "Hotels & Vendors", title: "Platform Access", price: "Free", period: "Forever", features: ["Full HotelsVendors dashboard", "INVO marketplace access", "AI chatbot & agents", "ETA-compliant invoicing", "Unlimited users & properties"], cta: "Get Started", accent: false },
              { badge: "All payment types", title: "Bank Transfer", price: "1%", period: "per transaction", features: ["Multi-currency support", "SWIFT & local bank rails", "Instant confirmation", "Auto-generated receipts", "Full audit trail"], cta: "Get Started", accent: true },
              { badge: "Reverse factoring", title: "Factoring Service", price: "1.5–3%", period: "of invoice value", features: ["48-hour supplier payout", "AI-driven authorisation", "FRA-compliant process", "Zero paperwork", "Joker option — use anytime"], cta: "Get Started", accent: false },
            ] as const).map((p) => (
              <div key={p.title} className={"rounded border bg-white flex flex-col relative " + (p.accent ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200")}>
                {p.accent && (
                  <div className="rounded-t py-1.5 px-3 text-center text-[10px] font-semibold text-white bg-blue-600">
                    Most Used
                  </div>
                )}
                <div className={"p-4 flex flex-col flex-1 " + (p.accent ? "" : "pt-4")}>
                  <div className="text-[10px] tracking-widest uppercase text-blue-600 font-semibold mb-2">{p.badge}</div>
                  <div className="text-lg font-bold text-slate-900 mb-1">{p.title}</div>
                  <div className="flex items-end gap-1 mb-4">
                    <span className="text-3xl font-extrabold text-slate-900">{p.price}</span>
                    <span className="text-slate-500 pb-1 text-xs">{p.period}</span>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1 mb-5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="/register"
                    className={"w-full font-semibold rounded-md text-sm py-2.5 text-center block transition-colors " + (p.accent ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-900 text-white hover:bg-slate-800")}>
                    {p.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 7 — OLIV QR (Flat Solid) ═══════════════ */}
      <section className="py-14 border-t border-slate-200">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="text-[11px] tracking-widest uppercase text-emerald-600 font-semibold">Partner Financing</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-3 text-slate-900">Get Instant Cash Flow via Oliv</h2>
          <p className="text-slate-600 text-sm mb-7">
            Scan the QR code or tap below. Your referral code CHV000 is included automatically. Get paid in 48 hours.
          </p>
          <div className="flex flex-col items-center gap-5">
            <div className="w-44 h-44 rounded border border-slate-200 bg-white p-2">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fwww.hotelsvendors.com%2Foliv%2Freferral"
                alt="Scan for Oliv" className="w-full h-full" />
            </div>
            <div className="flex gap-3">
              <a href="/api/v1/oliv/click"
                className="px-6 py-2.5 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
                Apply via Oliv
              </a>
              <Link href="/financing/oliv"
                className="px-6 py-2.5 rounded-md text-sm font-medium text-emerald-700 border border-emerald-300 bg-white hover:bg-emerald-50 transition-colors">
                Learn More
              </Link>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Code CHV000 · FRA Licensed · 48h Funding</p>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 8 — FOOTER / FINAL CTA (Flat Solid) ═══════════════ */}
      <section className="py-14 bg-slate-100 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
            The Future of Hotel<br />Procurement is Here.
          </h2>
          <p className="text-slate-600 text-sm mb-8 max-w-xl mx-auto">
            Start free today. Explore the sandbox. Let our AI agents guide your onboarding. No commitment, no subscription — just results.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/register"
              className="font-semibold px-8 py-2.5 rounded-md text-sm inline-flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 transition-colors">
              Start Free — No Credit Card
            </a>
            <a href="/sandbox"
              className="font-semibold px-8 py-2.5 rounded-md text-sm inline-flex items-center justify-center gap-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors">
              Explore Sandbox
            </a>
          </div>

          {/* Compact footer links */}
          <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <div className="text-[11px] font-semibold text-slate-900 mb-2">Product</div>
              <div className="space-y-1.5">
                {["Dashboard", "INVO Marketplace", "Sandbox", "Pricing", "Changelog"].map((l) => (
                  <div key={l} className="text-[11px] text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-900 mb-2">Solutions</div>
              <div className="space-y-1.5">
                {["Hotels", "Suppliers", "Factoring", "Shipping", "Enterprise"].map((l) => (
                  <div key={l} className="text-[11px] text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-900 mb-2">Company</div>
              <div className="space-y-1.5">
                {["About", "Blog", "Careers", "Contact", "Press"].map((l) => (
                  <div key={l} className="text-[11px] text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-900 mb-2">Legal</div>
              <div className="space-y-1.5">
                {["Privacy", "Terms", "Security", "ETA Compliance", "FRA License"].map((l) => (
                  <div key={l} className="text-[11px] text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">{l}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <img src="/oliv-logo-white.png" alt="Oliv" className="h-3.5 w-auto opacity-60" />
              <span>·</span>
              <span>Paymob · InstaPay · Fawry</span>
            </div>
            <div className="text-[10px] text-slate-400">
              © {new Date().getFullYear()} HotelsVendors. ETA Verified · FRA Regulated.
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

/* ═════════════════════════════════════════════════════════════
   SANDBOX DEMO COMPONENT — Flat solid dual-layer dashboard preview
   ═════════════════════════════════════════════════════════════ */
function SandboxDemo({ t }: { t: (key: string) => string }) {
  const [tab, setTab] = useState<"hotel" | "vendor" | "chat">("hotel");

  return (
    <section className="py-14 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <span className="text-[11px] tracking-widest uppercase text-blue-600 font-semibold">Sandbox Demo</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-2 text-slate-900">Explore Before You Commit</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">No account needed. See the dual-layer platform in action — web dashboard + mobile app.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-4 gap-1.5">
          {([
            { key: "hotel" as const, label: "Web Dashboard" },
            { key: "vendor" as const, label: "INVO Mobile" },
            { key: "chat" as const, label: "AI Assistant" },
          ] as const).map((tb) => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className={"px-4 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer border " + (tab === tb.key ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}>
              {tb.label}
            </button>
          ))}
        </div>

        {/* Hotel Dashboard Tab */}
        {tab === "hotel" && (
          <div className="rounded border border-slate-200 bg-white overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-slate-100">
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="flex-1 text-center text-[10px] text-slate-400 font-mono">app.hotelsvendors.com — Meridian Hotels · 3 Properties</span>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-slate-900">Meridian Hotels — Procurement Hub</h3>
                  <p className="text-xs text-slate-500">3 properties · AI Spend Forecast: <span className="text-blue-600 font-medium">↓ 8% vs last quarter</span></p>
                </div>
                <button className="text-xs px-3 py-1.5 font-semibold rounded bg-slate-900 text-white">AI Assist</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {([
                  { label: "Active Orders", value: "34", sub: "+8%", color: "#2563eb" },
                  { label: "Monthly Spend", value: "EGP 182K", sub: "Forecast: EGP 168K", color: "#d97706" },
                  { label: "Vendor Network", value: "47", sub: "via INVO", color: "#7c3aed" },
                  { label: "Factoring Requests", value: "6", sub: "2 pending 48h", color: "#059669" },
                ] as const).map((c) => (
                  <div key={c.label} className="rounded border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] text-slate-500 mb-0.5">{c.label}</div>
                    <div className="text-lg font-bold text-slate-900">{c.value}</div>
                    <div className="text-[10px] mt-0.5 font-medium" style={{ color: c.color }}>{c.sub}</div>
                  </div>
                ))}
              </div>
              <div className="rounded border border-slate-200 bg-white overflow-hidden">
                <div className="px-3 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Recent Orders — ETA Compliant</span>
                  <span className="text-[10px] px-2 py-0.5 rounded border border-emerald-300 bg-emerald-50 text-emerald-800">All verified</span>
                </div>
                {([
                  { vendor: "Luxe Linen Co.", item: "Egyptian Cotton Sheets × 200", price: "EGP 14,400", status: "Delivered", color: "#059669" },
                  { vendor: "ProClean Supplies", item: "Eco Amenity Kits × 500", price: "EGP 3,250", status: "In Transit", color: "#d97706" },
                  { vendor: "GourmetSource", item: "Premium Coffee Blend × 50kg", price: "EGP 2,100", status: "Factoring Active", color: "#7c3aed" },
                ] as const).map((o, i) => (
                  <div key={i} className={"flex items-center justify-between px-3 py-2.5 text-xs " + (i < 2 ? "border-b border-slate-100" : "")}>
                    <div><div className="font-medium text-slate-900">{o.vendor}</div><div className="text-slate-500 text-[10px]">{o.item}</div></div>
                    <div className="text-right"><div className="font-semibold text-slate-900">{o.price}</div><div className="text-[10px] font-medium" style={{ color: o.color }}>{o.status}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vendor Mobile Tab */}
        {tab === "vendor" && (
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 rounded border border-slate-200 bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-slate-100">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="flex-1 text-center text-[10px] text-slate-400 font-mono">INVO Mobile · Supplier Dashboard</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-slate-900">Luxe Linen Co. — Vendor Central</h3>
                    <p className="text-xs text-slate-500">340 hotel buyers · <span className="text-amber-600 font-medium">12 active orders</span></p>
                  </div>
                  <button className="text-xs px-3 py-1.5 font-semibold rounded bg-slate-900 text-white">Scan Invoice</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {([
                    { label: "Hotel Buyers", value: "340", color: "#d97706" },
                    { label: "MRR", value: "EGP 94K", color: "#2563eb" },
                    { label: "Avg. Order", value: "EGP 2.8K", color: "#7c3aed" },
                    { label: "Reorder Rate", value: "74%", color: "#059669" },
                  ] as const).map((c) => (
                    <div key={c.label} className="rounded border border-slate-200 bg-slate-50 p-3">
                      <div className="text-[10px] text-slate-500 mb-0.5">{c.label}</div>
                      <div className="text-lg font-bold text-slate-900">{c.value}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["Scan Invoice", "New Order #2847", "Housekeeping", "Factor Invoice"].map((f) => (
                    <div key={f} className="rounded border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600">{f}</div>
                  ))}
                </div>
              </div>
            </div>
            {/* Mobile phone frame */}
            <div className="hidden md:block w-44 shrink-0">
              <div className="rounded-2xl border-2 border-slate-300 bg-white p-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-[9px] text-center text-slate-400 mb-2 font-medium">INVO Mobile</div>
                  <div className="space-y-1.5">
                    {["3 New Orders", "Factor EGP 14.4K", "Browse INVO", "Scan Invoice"].map((s) => (
                      <div key={s} className="rounded border border-slate-200 bg-white p-1.5 text-[8px] text-slate-600">{s}</div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 text-center">
                    <div className="w-9 h-9 mx-auto rounded border border-slate-200 bg-white p-0.5">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=36x36&data=https%3A%2F%2Fwww.hotelsvendors.com%2Foliv%2Freferral" alt="QR" className="w-full h-full" />
                    </div>
                    <div className="text-[7px] text-slate-400 mt-1">Scan · CHV000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Chat Tab */}
        {tab === "chat" && (
          <div className="rounded border border-slate-200 bg-white overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-slate-100">
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="flex-1 text-center text-[10px] text-slate-400 font-mono">AI Procurement Assistant</span>
            </div>
            <div className="p-5 min-h-[280px]">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded border border-slate-200 bg-slate-900 flex items-center justify-center shrink-0 text-[10px] font-semibold text-white">AI</div>
                  <div className="rounded rounded-tl-sm border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 max-w-sm">
                    I can help you find suppliers, create RFQs, and track orders. What do you need for your hotel today?
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="rounded rounded-tr-sm p-2.5 text-xs text-white max-w-sm bg-blue-600">
                    I need 200 sets of Egyptian cotton bedsheets, 400 thread count, delivered to Sharm El-Sheikh by next week.
                  </div>
                  <div className="w-7 h-7 rounded border border-slate-200 bg-white flex items-center justify-center shrink-0 text-[10px] font-semibold text-slate-600">GM</div>
                </div>
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded border border-slate-200 bg-slate-900 flex items-center justify-center shrink-0 text-[10px] font-semibold text-white">AI</div>
                  <div className="rounded rounded-tl-sm border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 max-w-sm">
                    Found 3 verified suppliers on INVO. <strong className="text-blue-600">Luxe Linen Co.</strong> — EGP 72/unit, delivers in 3 days, 4.8★ rating. Would you like me to create an RFQ?
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}