import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Truck, MapPin, Clock, Thermometer, Route, Banknote, PackageCheck, BarChart3, Headphones, TrendingDown } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = {
  title: "Coastal Hotel Logistics Egypt | Shared-Route Delivery | HotelsVendors",
  description: "AI-driven shared-route logistics for Egyptian coastal hotels. Multi-supplier load matching, cold-chain capable, 48-hour delivery guarantee across 6 governorates.",
  keywords: ["B2B hospitality procurement Egypt", "hotel logistics Egypt", "shared-route delivery Red Sea", "coastal hotel suppliers", "سلسلة التوريد الفندقية", "لوجستيات الفنادق مصر"],
  openGraph: {
    title: "Coastal Hotel Logistics Egypt | Shared-Route Delivery | HotelsVendors",
    description: "AI-driven shared-route logistics for Egyptian coastal hotels. Multi-supplier load matching, cold-chain capable, 48-hour delivery guarantee.",
    type: "website",
  },
};

const governorates = [
  { name: "Sharm El-Sheikh", properties: "120+ hotels", type: "Coastal Hub", color: "var(--accent-base)" },
  { name: "Hurghada", properties: "95+ hotels", type: "Red Sea", color: "var(--success)" },
  { name: "Dahab", properties: "30+ hotels", type: "Red Sea North", color: "var(--info)" },
  { name: "Marsa Alam", properties: "45+ hotels", type: "South Red Sea", color: "var(--warning)" },
  { name: "Cairo / Giza", properties: "200+ hotels", type: "Central Hub", color: "var(--accent-light)" },
  { name: "Alexandria / North Coast", properties: "65+ hotels", type: "Mediterranean", color: "var(--error)" },
];

const features = [
  {
    icon: TrendingDown,
    title: "Route Consolidation",
    desc: "Our shared-route model means trucks run full, not half-empty. AI matches multi-supplier loads across the Red Sea corridor minimizing empty miles and cutting per-delivery cost by up to 38%.",
  },
  {
    icon: Clock,
    title: "48-Hour Guarantee",
    desc: "From order confirmation to delivery at your receiving dock. SLA-backed with automatic compensation for delays. F&B, linens, amenities, engineering spares — all on the same clock.",
  },
  {
    icon: Thermometer,
    title: "Cold-Chain Ready",
    desc: "Temperature-controlled vehicles for F&B perishables, pharmaceuticals, and cosmetics. Real-time temperature monitoring with automated alerts if a cold box breaches threshold.",
  },
  {
    icon: Route,
    title: "AI Route Optimization",
    desc: "Dynamic route planning across 6 governorates. Multi-supplier load matching minimizes dock congestion and receiving overhead at destination hotels.",
  },
  {
    icon: MapPin,
    title: "Real-Time GPS Tracking",
    desc: "Track every shipment from pickup to delivery on a live map. Automated ETA updates sent to your procurement team. Digital proof of delivery with timestamp and receiver signature.",
  },
  {
    icon: Banknote,
    title: "Fast Carrier Payout",
    desc: "Digital POD triggers automated settlement to carriers after confirmed delivery. No 90-day invoice queues. Payments within 48 hours of delivery confirmation.",
  },
];

const stats = [
  { value: "6", label: "Governorates Covered", sub: "From Cairo to Marsa Alam" },
  { value: "550+", label: "Hotels Served", sub: "Active procurement accounts" },
  { value: "48hr", label: "Delivery SLA", sub: "Sharm, Hurghada, Dahab" },
  { value: "38%", label: "Cost Reduction", sub: "vs. dedicated truck dispatch" },
];

export default function LogisticsServicePage() {
  return (
    <main className="marketing-main" style={{ backgroundColor: "var(--background)", color: "var(--text-primary)", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--accent-muted) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "var(--text-muted)" }}>Shark-Breaker Coastal Logistics</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5" style={{ color: "var(--text-primary)" }}>
            Fill Your Trucks with<br />Consolidated Loads.<br /><span className="text-gradient-accent">Fast Carrier Payouts.<br />Real-Time GPS.</span>
          </h1>
          <p className="text-[15px] max-w-2xl leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
            AI-driven shared-route consolidation across 6 Egyptian governorates. Multi-supplier load matching, cold-chain capability, and real-time GPS. Built for carriers who want guaranteed volume and fast settlement — and hotels who can&apos;t afford stock-outs.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register?sector=procurement" className="cta-glow inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all" style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text)" }}>
              Register as Carrier <ArrowRight size={14} className="cta-arrow" />
            </Link>
            <Link href="/register?sector=logistics" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all" style={{ border: "1px solid var(--border-visible)", color: "var(--text-secondary)", backgroundColor: "var(--bg-surface-1)" }}>
              Restock Your Hotel
            </Link>
            <Link href="/platform" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all" style={{ border: "1px solid var(--border-visible)", color: "var(--text-secondary)", backgroundColor: "var(--bg-surface-1)" }}>
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════ */}
      <section className="py-8 border-y" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[28px] font-medium mb-1" style={{ color: "var(--accent-base)" }}>{s.value}</p>
                <p className="text-[11px] font-medium mb-0.5" style={{ color: "var(--text-primary)" }}>{s.label}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROBLEM — CARRIER PAIN
          ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "var(--text-muted)" }}>The Carrier Problem</span>
            <h2 className="text-[clamp(22px,3vw,32px)] font-medium leading-tight" style={{ color: "var(--text-primary)" }}>
              Empty trucks. Late payments.<br /><span className="text-gradient-accent">That breaks your thin margin.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { title: "Empty backhauls", desc: "Dedicated single-supplier dispatches mean trucks return empty. Every empty km is margin you never see." },
              { title: "90-day payment cycles", desc: "Hotels pay net-60, suppliers pay net-90. As a carrier, you finance the whole chain out of pocket." },
              { title: "No volume visibility", desc: "You can&apos;t plan capacity without knowing next week&apos;s loads. Seasonal spikes catch you with parked trucks." },
            ].map((p) => (
              <div key={p.title} className="surface-card rounded-xl p-6 transition-all">
                <h3 className="text-[14px] font-medium mb-2" style={{ color: "var(--text-primary)" }}>{p.title}</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          COVERAGE MAP
          ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-20" style={{ backgroundColor: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "var(--text-muted)" }}>Coverage Map</span>
            <h2 className="text-[clamp(22px,3vw,32px)] font-medium leading-tight mb-4" style={{ color: "var(--text-primary)" }}>
              6 governorates. 550+ hotels.<br /><span className="text-gradient-accent">From Cairo to Marsa Alam.</span>
            </h2>
            <p className="text-[13px] max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              We operate consolidation hubs in Sharm El-Sheikh, Hurghada, and Cairo — with feeder spokes reaching Dahab, Marsa Alam, Alexandria, and the North Coast.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {governorates.map((g) => (
              <div key={g.name} className="surface-card rounded-xl p-5 text-center transition-all">
                <MapPin size={18} className="mx-auto mb-3" style={{ color: g.color }} />
                <p className="text-[13px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>{g.name}</p>
                <p className="text-[10px] font-medium mb-1" style={{ color: g.color }}>{g.type}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{g.properties}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY CARRIERS CHOOSE HOTELSVENDORS
          ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "var(--text-muted)" }}>Why Carriers Choose Us</span>
            <h2 className="text-[clamp(22px,3vw,32px)] font-medium leading-tight" style={{ color: "var(--text-primary)" }}>
              Load matching. Fast settlement.<br /><span className="text-gradient-accent">GPS visibility end-to-end.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="surface-card rounded-xl p-6 transition-all">
                <f.icon size={20} className="mb-3" style={{ color: "var(--accent-base)" }} />
                <h3 className="text-[14px] font-medium mb-2" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — 4 STEPS
          ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-20" style={{ backgroundColor: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "var(--text-muted)" }}>How It Works</span>
            <h2 className="text-[clamp(22px,3vw,32px)] font-medium leading-tight" style={{ color: "var(--text-primary)" }}>
              From pickup to payout<br /><span className="text-gradient-accent">in four steps.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { step: "01", icon: Truck, title: "Load Matched", desc: "Our AI groups multi-supplier shipments heading to the same corridor. You bid on consolidated loads, not single drops." },
              { step: "02", icon: Route, title: "Route Optimized", desc: "Dynamic route planning across 6 governorates. Dock schedules aligned to minimize receiver wait time." },
              { step: "03", icon: MapPin, title: "Tracked Live", desc: "GPS tracking visible to carriers, hotels, and procurement managers. ETA updates push automatically." },
              { step: "04", icon: Banknote, title: "Paid in 48hr", desc: "Digital POD triggers settlement. No invoices, no 90-day queues. Payment within 48 hours of confirmed delivery." },
            ].map((s) => (
              <div key={s.step} className="surface-card rounded-xl p-6 transition-all">
                <span className="text-[10px] font-mono font-medium mb-3 block" style={{ color: "var(--text-muted)" }}>{s.step}</span>
                <s.icon size={20} className="mb-3" style={{ color: "var(--accent-base)" }} />
                <h3 className="text-[14px] font-medium mb-2" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          COLD-CHAIN & RELIABILITY
          ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "var(--text-muted)" }}>Cold-Chain & Reliability</span>
            <h2 className="text-[clamp(22px,3vw,32px)] font-medium leading-tight" style={{ color: "var(--text-primary)" }}>
              Perishable? Time-critical?<br /><span className="text-gradient-accent">We cover every category.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Thermometer, title: "Cold-Chain F&B", desc: "Temperature-controlled vehicles with 2°C–8°C range. Real-time logger data streams to the platform. Alerts fire if a cold box breaches threshold — before the food spoils." },
              { icon: BarChart3, title: "Volume Forecasting", desc: "Our demand-forecasting engine gives carriers 7-day rolling volume outlooks. Plan capacity before the spikes hit — no more idle trucks in shoulder season." },
              { icon: PackageCheck, title: "ETA-Compliant POD", desc: "Every delivery generates a digitally signed proof of delivery with timestamp, GPS coordinates, and receiver ID. ETA-compliant audit trail for your procurement team." },
            ].map((r) => (
              <div key={r.title} className="surface-card rounded-xl p-6 transition-all">
                <r.icon size={20} className="mb-3" style={{ color: "var(--accent-base)" }} />
                <h3 className="text-[14px] font-medium mb-2" style={{ color: "var(--text-primary)" }}>{r.title}</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <PackageCheck size={28} className="mx-auto mb-6" style={{ color: "var(--accent-base)" }} />
          <h2 className="text-[24px] font-medium mb-4" style={{ color: "var(--text-primary)" }}>Need Reliable Hotel Delivery?</h2>
          <p className="text-[13px] mb-8 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Whether you&apos;re a hotel needing just-in-time restocking, a carrier looking for guaranteed volume, or a supplier consolidating dispatches — we&apos;ve got you covered across 6 governorates.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register?sector=procurement" className="cta-glow inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all" style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text)" }}>
              Register Your Hotel <ArrowRight size={14} className="cta-arrow" />
            </Link>
            <Link href="/register?sector=logistics" className="cta-glow inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all" style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text)" }}>
              Register as Carrier <ArrowRight size={14} className="cta-arrow" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all" style={{ border: "1px solid var(--border-visible)", color: "var(--text-secondary)", backgroundColor: "var(--bg-surface-1)" }}>
              <Headphones size={14} /> Talk to Logistics Team
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST LINE
          ═══════════════════════════════════════════ */}
      <section className="py-10 border-t" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {[
              { label: "48-hour SLA", color: "var(--accent-base)" },
              { label: "Cold-chain compliant", color: "var(--success)" },
              { label: "Digital POD with GPS", color: "var(--info)" },
              { label: "Real-time tracking", color: "var(--accent-base)" },
              { label: "48-hour carrier payout", color: "var(--success)" },
              { label: "6 governorates", color: "var(--info)" },
            ].map((t) => (
              <span key={t.label} className="flex items-center gap-2 text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                <CheckCircleIcon size={12} color={t.color} />
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}

function CheckCircleIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
