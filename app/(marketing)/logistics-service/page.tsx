import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Truck, MapPin, Clock, TrendingDown, Shield, Thermometer } from "lucide-react";

export const metadata: Metadata = {
  title: "Logistics — Shared-Route Delivery for Hospitality | HotelsVendors",
  description: "AI-driven route consolidation across 6 Egyptian governorates. Up to 40% cost reduction via multi-supplier load matching.",
};

const governorates = [
  { name: "Sharm El-Sheikh", type: "Coastal Hub", color: "#39FF14" },
  { name: "Hurghada", type: "Red Sea", color: "#22C55E" },
  { name: "Cairo", type: "Central Hub", color: "#3B82F6" },
  { name: "Alexandria", type: "Mediterranean", color: "#D4A843" },
  { name: "Marsa Alam", type: "Red Sea South", color: "#A855F7" },
  { name: "North Coast", type: "Seasonal", color: "#EF4444" },
];

export default function LogisticsServicePage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Logistics</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-white">
            40% Lower Logistics Costs.<br /><span className="text-gradient-lime">48-Hour Delivery.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl leading-relaxed mb-8">
            AI-driven shared-route consolidation across 6 Egyptian governorates. Multi-supplier load matching, cold-chain capability, and real-time GPS tracking.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register?role=shipping" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.2)]" style={{ backgroundColor: "#39FF14", color: "#000000" }}>
              Register as Carrier <ArrowRight size={14} />
            </Link>
            <Link href="/platform" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-8 text-center">Coverage Map</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {governorates.map((g) => (
              <div key={g.name} className="rounded-xl p-4 text-center" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <MapPin size={16} className="mx-auto mb-2" style={{ color: g.color }} />
                <p className="text-[12px] font-medium text-white">{g.name}</p>
                <p className="text-[10px] text-white/25">{g.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-8">Why Our Logistics Win</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: TrendingDown, title: "40% Cost Reduction", desc: "Shared-route consolidation means trucks run full, not half-empty. AI matches multi-supplier loads to minimize empty miles.", color: "#39FF14" },
              { icon: Clock, title: "48-Hour Guarantee", desc: "From order confirmation to delivery at your receiving dock. SLA-backed with automatic compensation for delays.", color: "#3B82F6" },
              { icon: Thermometer, title: "Cold-Chain Ready", desc: "Temperature-controlled vehicles for F&B, pharmaceuticals, and perishables. Real-time temperature monitoring.", color: "#22C55E" },
              { icon: Truck, title: "Multi-Supplier Loads", desc: "One truck, multiple suppliers, single delivery point. Reduces your receiving overhead and dock congestion.", color: "#D4A843" },
              { icon: MapPin, title: "Real-Time GPS", desc: "Track every shipment from pickup to delivery. Automated ETA updates sent to your procurement team.", color: "#A855F7" },
              { icon: Shield, title: "Insured & Bonded", desc: "All carriers are vetted, insured, and bonded. Claims processed within 48 hours.", color: "#EF4444" },
            ].map((f) => (
              <div key={f.title} className="rounded-xl p-6" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <f.icon size={20} className="mb-3" style={{ color: f.color }} />
                <h3 className="text-[14px] font-medium text-white mb-2">{f.title}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[24px] font-medium mb-4 text-white">Need Reliable Hotel Delivery?</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">Whether you&apos;re a hotel needing deliveries or a carrier looking for volume, we&apos;ve got you covered.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register?role=hotel" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.2)]" style={{ backgroundColor: "#39FF14", color: "#000000" }}>
              Register Hotel <ArrowRight size={14} />
            </Link>
            <Link href="/register?role=shipping" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Register Carrier
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
