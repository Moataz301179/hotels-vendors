import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Target, Shield, Globe, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About — HotelsVendors | HotelsVendors",
  description: "Egypt's B2B procurement operating system for hospitality. Built for coastal hotels, powered by AI, compliant by design.",
};

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(132,204,22,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">About</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-white">
            Built for Egypt.<br /><span className="text-gradient-lime">Designed for Scale.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl leading-relaxed">
            HotelsVendors is the B2B procurement operating system that connects Egyptian hotels, suppliers, funders, and carriers on one AI-powered, ETA-compliant platform.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Eye size={24} className="mb-4" style={{ color: "#84cc16" }} />
              <h2 className="text-[20px] font-medium text-white mb-4">Our Vision</h2>
              <p className="text-[14px] text-white/40 leading-relaxed mb-4">
                Egypt&apos;s hospitality sector is a $12B industry fragmented across thousands of manual procurement processes. Paper invoices. 180-day payment cycles. Zero visibility.
              </p>
              <p className="text-[14px] text-white/40 leading-relaxed">
                We exist to change that. HotelsVendors replaces the entire procurement stack — from demand prediction to settlement — with one platform that thinks ahead, enforces compliance, and optimizes cashflow.
              </p>
            </div>
            <div>
              <Target size={24} className="mb-4" style={{ color: "#84cc16" }} />
              <h2 className="text-[20px] font-medium text-white mb-4">Our Focus</h2>
              <p className="text-[14px] text-white/40 leading-relaxed mb-4">
                We serve coastal hotels in Sharm El-Sheikh and Hurghada first, then Cairo, Alexandria, and the North Coast. These are 100-500 room resorts with multiple F&B outlets, pools, spas, and water sports — properties where procurement complexity is highest.
              </p>
              <p className="text-[14px] text-white/40 leading-relaxed">
                Our target customers are local branded hotel chains — Stella Di Mare, Sunrise, Jaz, Baron — not just international 5-star brands.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-8 text-center">What Drives Us</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "Compliance First", desc: "ETA e-invoicing, FRA anti-fraud, and cryptographic audit trails are built in — not bolted on.", color: "#84cc16" },
              { icon: Globe, title: "Egypt-Focused", desc: "Built for Egyptian supply chains, payment cycles, and regulatory requirements. Not a generic global platform.", color: "#22C55E" },
              { icon: Zap, title: "AI-Native", desc: "Demand forecasting, anomaly detection, and autonomous agents are core — not features.", color: "#3B82F6" },
              { icon: Target, title: "Hospitality-Only", desc: "We don't serve every industry. We serve hospitality better than anyone else.", color: "#D4A843" },
            ].map((v) => (
              <div key={v.title} className="rounded-xl p-6 text-center" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <v.icon size={24} className="mx-auto mb-3" style={{ color: v.color }} />
                <h3 className="text-[14px] font-medium text-white mb-2">{v.title}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[24px] font-medium mb-4 text-white">Want to Learn More?</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">We&apos;re always looking for partners who share our vision for Egyptian hospitality.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.2)]" style={{ backgroundColor: "#84cc16", color: "#000000" }}>
              Get Started <ArrowRight size={14} />
            </Link>
            <Link href="/solutions" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Explore Solutions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
