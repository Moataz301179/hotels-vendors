import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Target, Shield, Globe, Zap, MapPin, Building2, Banknote, Users } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = {
  title: "About HotelsVendors — Egypt's B2B Hospitality Procurement Platform | Restaurants for E-Marketing",
  description: "Egypt's B2B hospitality procurement platform connecting coastal hotels, suppliers, and funders. AI-powered, ETA-compliant, built for Sharm El-Sheikh and Hurghada resorts.",
  keywords: ["B2B hospitality procurement Egypt", "automated factoring lines Cairo", "hotel supply chain management Egypt", "ETA e-invoicing compliance", "hospitality vendor marketplace", "digital invoice Egypt", "coastal hotel suppliers Red Sea", "تجهيزات الفنادق بالجملة", "منصة المشتريات الفندقية مصر", "الفوترة الإلكترونية هيئة الضرائب"],
  openGraph: {
    title: "About HotelsVendors — Egypt's B2B Hospitality Procurement Platform | Restaurants for E-Marketing",
    description: "Egypt's B2B hospitality procurement platform connecting coastal hotels, suppliers, and funders. AI-powered, ETA-compliant, built for Sharm El-Sheikh and Hurghada resorts.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <MarketingNav />
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(132,204,22,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">About</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-white">
            Built for Egypt&apos;s<br />Hospitality Sector.<br /><span className="text-gradient-lime">Not Adapted.<br />Not Localized.<br />Built From Scratch.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl leading-relaxed">
            HotelsVendors is the B2B procurement operating system that connects Egyptian hotels, suppliers, funders, and carriers on one AI-powered, ETA-compliant platform. We did not take a global template and translate it. We started from the Red Sea coast and engineered backward.
          </p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y" style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: "#030303" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: MapPin, label: "Egypt-First", desc: "Designed for local supply chains" },
              { icon: Building2, label: "Hospitality-Only", desc: "Not a generic marketplace" },
              { icon: Shield, label: "Compliance-Native", desc: "ETA + FRA built in" },
              { icon: Banknote, label: "Embedded Finance", desc: "Factoring from day one" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <b.icon size={16} style={{ color: "#84cc16" }} />
                <div>
                  <p className="text-[11px] font-medium text-white/60">{b.label}</p>
                  <p className="text-[9px] text-white/25">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Focus */}
      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <Eye size={24} className="mb-4" style={{ color: "#84cc16" }} />
              <h2 className="text-[20px] font-medium text-white mb-4">The Market Gap</h2>
              <p className="text-[14px] text-white/40 leading-relaxed mb-4">
                Egypt&apos;s hospitality sector is fragmented across thousands of manual procurement processes. Paper invoices. Extended payment cycles. Zero visibility into spend. Coastal resorts in Sharm and Hurghada rely on suppliers primarily based in Cairo, with logistics costs significantly impacting every order.
              </p>
              <p className="text-[14px] text-white/40 leading-relaxed">
                Existing tools are either generic global platforms that ignore ETA compliance, or legacy ERPs with procurement modules built for a different era. There was no Egypt-specific, hospitality-native operating system. Until now.
              </p>
            </div>
            <div>
              <Target size={24} className="mb-4" style={{ color: "#84cc16" }} />
              <h2 className="text-[20px] font-medium text-white mb-4">Our Focus</h2>
              <p className="text-[14px] text-white/40 leading-relaxed mb-4">
                We serve coastal hotels in Sharm El-Sheikh and Hurghada first, then Cairo, Alexandria, and the North Coast. These are 100-500 room resorts with multiple F&B outlets, pools, spas, and water sports — properties where procurement complexity is highest and the pain is most acute.
              </p>
              <p className="text-[14px] text-white/40 leading-relaxed">
                Our target customers are local branded hotel chains — Stella Di Mare, Sunrise, Jaz, Baron — not just international 5-star brands. These groups operate 5-30 properties and need portfolio-level procurement control that no one was building for them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-8 text-center">What Drives Us</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "Compliance First", desc: "ETA e-invoicing, FRA anti-fraud, and cryptographic audit trails are built in — not bolted on as an afterthought.", color: "#84cc16" },
              { icon: Globe, title: "Egypt-Focused", desc: "Built for Egyptian supply chains, payment cycles, and regulatory requirements. Not a generic global platform with Arabic added.", color: "#22C55E" },
              { icon: Zap, title: "AI-Native", desc: "Demand forecasting, anomaly detection, and autonomous agents are core architecture — not features added later.", color: "#3B82F6" },
              { icon: Target, title: "Hospitality-Only", desc: "We do not serve every industry. We serve hospitality better than anyone else. Depth over breadth.", color: "#D4A843" },
            ].map((v) => (
              <div key={v.title} className="rounded-xl p-6 text-center transition-all hover:border-[#84cc16]/20" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <v.icon size={24} className="mx-auto mb-3" style={{ color: v.color }} />
                <h3 className="text-[14px] font-medium text-white mb-2">{v.title}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Traction */}
      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-8 text-center">Early Traction</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto text-center">
            {[
              { value: "6", label: "Governorates Covered" },
              { value: "—", label: "Properties — Coming Soon" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[28px] font-medium mb-1" style={{ color: "#84cc16" }}>{s.value}</p>
                <p className="text-[11px] text-white/30">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[12px] text-white/20 mt-6">Supplier and property counts will be published once onboarding is complete.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Users size={28} className="mx-auto mb-6" style={{ color: "#84cc16" }} />
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
          <MarketingFooter />
    </main>
  );
}
