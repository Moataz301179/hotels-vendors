import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, CheckCircle2, TrendingUp, ShieldCheck, Clock, Banknote, BrainCircuit } from "lucide-react";

export const metadata: Metadata = {
  title: "For Hotels — Procurement OS for Egyptian Hospitality | HotelsVendors",
  description: "AI-automated procurement, budget blockades, ETA compliance, and net-60 factoring for Egyptian hotels and resort groups.",
};

const features = [
  { icon: BrainCircuit, title: "AI Demand Forecasting", desc: "14-day forward predictions from occupancy curves, events, and seasonality. Auto-generates POs against your budget ceilings." },
  { icon: ShieldCheck, title: "Budget Blockades", desc: "Pre-occurrence spending limits at property, branch, and department level. No PO without available budget." },
  { icon: Building2, title: "Multi-Property Control", desc: "Manage procurement across your entire portfolio from one dashboard. Per-property catalogs, approvals, and reporting." },
  { icon: Banknote, title: "Net-60+ Factoring", desc: "Stretch working capital without balance-sheet debt. Suppliers paid in 24 hours via competitive bidding." },
  { icon: Clock, title: "48-Hour Delivery", desc: "Shared-route logistics to any Egyptian governorate. Cold-chain capable. Real-time GPS tracking." },
  { icon: TrendingUp, title: "Cost Analytics", desc: "Real-time spend analysis across properties, departments, and vendors. Anomaly detection and savings recommendations." },
];

export default function HotelsPage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(57,255,20,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">For Hotels</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-white">
            Procurement That<br /><span className="text-gradient-lime">Thinks Ahead.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl leading-relaxed mb-8">
            From Sharm El-Sheikh to Alexandria, Egyptian hotel groups use HotelsVendors to automate procurement, enforce budgets, and stretch working capital — all from one platform.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register?role=hotel" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.2)]" style={{ backgroundColor: "#39FF14", color: "#000000" }}>
              Register Your Property <ArrowRight size={14} />
            </Link>
            <Link href="/platform" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Explore Platform
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-8">What You Get</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl p-6" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <f.icon size={20} className="mb-4" style={{ color: "#39FF14" }} />
                <h3 className="text-[14px] font-medium text-white mb-2">{f.title}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            {[
              { value: "40%", label: "Average Procurement Cost Reduction" },
              { value: "24h", label: "Supplier Settlement via Factoring" },
              { value: "6", label: "Governorates with Logistics Coverage" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[32px] font-medium mb-1" style={{ color: "#39FF14" }}>{s.value}</p>
                <p className="text-[11px] text-white/30">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-6">Who We Serve</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { region: "Sharm El-Sheikh", props: "120+ properties", icon: MapPin },
              { region: "Hurghada / Red Sea", props: "95+ properties", icon: MapPin },
              { region: "Cairo / Giza", props: "200+ properties", icon: MapPin },
              { region: "Alexandria / North Coast", props: "65+ properties", icon: MapPin },
            ].map((r) => (
              <div key={r.region} className="rounded-xl p-5 flex items-center gap-3" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <r.icon size={16} style={{ color: "#39FF14" }} />
                <div>
                  <p className="text-[13px] font-medium text-white">{r.region}</p>
                  <p className="text-[11px] text-white/30">{r.props}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[24px] font-medium mb-4 text-white">Ready to Transform Your Procurement?</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">Quick onboarding. No credit card required. Start with a demo property.</p>
          <Link href="/register?role=hotel" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.2)]" style={{ backgroundColor: "#39FF14", color: "#000000" }}>
            Get Started Free <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
