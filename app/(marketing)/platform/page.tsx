import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, FileText, Truck, CreditCard, BrainCircuit, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Platform — Four Pillars of Procurement Intelligence | HotelsVendors",
  description: "AI demand forecasting, ETA e-invoicing, shared-route logistics, and embedded factoring.",
};

const pillars = [
  { icon: BarChart3, num: "Pillar 01", title: "AI Demand Forecasting", color: "#39FF14", bg: "rgba(57,255,20,0.1)", desc: "14-day demand prediction engine analyzing occupancy rates, local events, seasonality patterns, and historical consumption. 94% accuracy with continuous learning.", features: ["14-day rolling predictions", "Occupancy + event + seasonality analysis", "Signal-to-PO automation", "Continuous learning"], metric: { value: "94%", label: "Accuracy" } },
  { icon: FileText, num: "Pillar 02", title: "ETA E-Invoicing V2", color: "#22C55E", bg: "rgba(34,197,94,0.1)", desc: "Native Egyptian Tax Authority integration ensures every invoice meets Phase 1 & 2 compliance. RSA 2048-bit digital signing and UUID-based tracking.", features: ["RSA-2048 digital signing", "UUID-based invoice tracking", "Real-time ETA portal submission", "Penalty prevention by default"], metric: { value: "0", label: "Penalties" } },
  { icon: Truck, num: "Pillar 03", title: "Shared-Route Logistics", color: "#3B82F6", bg: "rgba(59,130,246,0.1)", desc: "Intelligent route consolidation across 6 governorates reduces logistics costs by up to 40%. AI-driven load matching ensures optimal capacity.", features: ["40% cost reduction", "Multi-governorate coverage", "Real-time GPS tracking", "Multi-temperature zones"], metric: { value: "40%", label: "Savings" } },
  { icon: CreditCard, num: "Pillar 04", title: "Embedded Factoring", color: "#EAB308", bg: "rgba(234,179,8,0.1)", desc: "Hotel-initiated reverse factoring with 4+ licensed grantors. Suppliers paid in 24-48 hours while hotels maintain net-30/60 terms.", features: ["4+ licensed grantors", "24-48hr supplier payment", "Net-30/60 preserved", "Zero default risk"], metric: { value: "24h", label: "Settlement" } },
];

export default function PlatformPage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(57,255,20,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Platform Overview</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-bold leading-[1.05] tracking-tight mb-5 text-white">
            Four Pillars of<br /><span className="text-gradient-lime">Procurement Intelligence</span>
          </h1>
          <p className="text-[14px] text-white/40 max-w-2xl leading-relaxed mb-6">A dual-layer architecture — INVO handles the &quot;what&quot; and &quot;how&quot; of procurement, while HotelsVendors handles the &quot;when&quot; and &quot;who pays&quot;.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.2)]" style={{ backgroundColor: "#39FF14", color: "#000000" }}>Get Started <ArrowRight size={14} /></Link>
            <Link href="/invo" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>Developer Docs <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6 space-y-6">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="grid lg:grid-cols-4 gap-0">
                <div className="lg:col-span-3 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}><p.icon size={22} style={{ color: "rgba(255,255,255,0.4)" }} /></div>
                    <div>
                      <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">{p.num}</span>
                      <h2 className="text-[18px] font-bold text-white">{p.title}</h2>
                    </div>
                  </div>
                  <p className="text-[13px] text-white/40 leading-relaxed mb-5 max-w-xl">{p.desc}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {p.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 p-2.5 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-[11px] text-white/40">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 flex flex-col items-center justify-center min-h-[140px]" style={{ backgroundColor: p.bg }}>
                  <p className="text-[36px] font-bold" style={{ color: p.color }}>{p.metric.value}</p>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider mt-1">{p.metric.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-20" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2 block">System Architecture</span>
            <h2 className="text-[26px] font-bold text-white">Dual-Entity Design</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { icon: BrainCircuit, title: "INVO — Operations Engine", desc: "Supplier-facing procurement marketplace. Handles the what and how.", items: [{ icon: BarChart3, label: "AI Demand Forecasting" }, { icon: FileText, label: "ETA E-Invoicing V2" }, { icon: Truck, label: "Shared-Route Logistics" }], color: "#D4A843", bg: "rgba(212,168,67,0.1)" },
              { icon: Shield, title: "HotelsVendors — Finance Hub", desc: "Hotel-facing financial coordinator. Handles the when and who pays.", items: [{ icon: CreditCard, label: "Embedded Reverse Factoring" }, { icon: FileText, label: "Wallet & Credit Lines" }, { icon: BrainCircuit, label: "Cost Control AI" }], color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
            ].map((layer) => (
              <div key={layer.title} className="rounded-2xl p-7" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: layer.bg }}><layer.icon size={20} style={{ color: layer.color }} /></div>
                <h3 className="text-[16px] font-bold mb-2 text-white">{layer.title}</h3>
                <p className="text-[12px] text-white/40 mb-5">{layer.desc}</p>
                <ul className="space-y-2.5">
                  {layer.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-[12px] text-white/40"><item.icon size={14} style={{ color: "rgba(255,255,255,0.2)" }} />{item.label}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[24px] font-bold mb-4 text-white">Ready to Transform Your Procurement?</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">Join Egypt&apos;s leading hotel groups already running on HotelsVendors infrastructure.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.2)]" style={{ backgroundColor: "#39FF14", color: "#000000" }}>Start Free Trial <ArrowRight size={14} /></Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>View Pricing</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
