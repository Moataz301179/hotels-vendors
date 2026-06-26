import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Target, Shield, Globe, Zap, MapPin, Building2, Banknote, Users } from "lucide-react";

function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  );
}
function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  );
}
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = {
  title: "About HotelsVendors — Founded by Moataz, 2023 | Egypt's Hospitality Fintech Infrastructure",
  description: "HotelsVendors was founded by Moataz in 2023 to bridge Egypt's hospitality procurement gap using existing fintech infrastructure. Built for Sharm El-Sheikh and Hurghada resorts.",
  keywords: ["B2B hospitality procurement Egypt", "hotelsvendors founder", "Egypt fintech hospitality", "Moataz hotelsvendors", "ETA e-invoicing compliance", "hospitality vendor marketplace"],
  openGraph: {
    title: "About HotelsVendors — Founded by Moataz, 2023",
    description: "Egypt's B2B hospitality procurement platform. Founded in 2023, built to utilize Egypt's fintech infrastructure for hotel supply chains.",
    type: "website",
  },
};

const socialLinks = [
  { icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/hotelsvendors", color: "#1877F2" },
  { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/hotelsvendors", color: "#E4405F" },
];

export default function AboutPage() {
  return (
    <main className="marketing-main" style={{ backgroundColor: "var(--background)", color: "var(--text-primary)", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
      <MarketingNav />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-muted uppercase tracking-[0.15em] mb-3 block">About</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-primary">
            Born in 2023.<br />Built for Egypt&apos;s<br />Hospitality Infrastructure.
          </h1>
          <p className="text-[15px] text-muted max-w-2xl leading-relaxed">
            HotelsVendors was founded by <strong className="text-secondary">Moataz</strong> in 2023 with a clear mission: bridge the procurement gap in Egypt&apos;s hospitality sector by leveraging the country&apos;s growing fintech infrastructure — ETA e-invoicing, embedded factoring, and digital payment rails — into one unified B2B platform.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 marketing-section">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="label-upper mb-4 block">Founder</span>
              <h2 className="text-[28px] font-medium text-primary mb-4">Moataz</h2>
              <p className="text-[14px] text-muted leading-relaxed mb-4">
                A former auditor at EY, Deloitte, and KPMG, Moataz spent years inside the financial infrastructure of Egyptian enterprises. He saw firsthand how hospitality procurement — especially in coastal resorts — was fragmented, manual, and disconnected from the fintech tools that Egypt was rapidly building.
              </p>
              <p className="text-[14px] text-muted leading-relaxed mb-4">
                In 2023, he founded HotelsVendors under <strong className="text-secondary">Restaurants for E-Marketing</strong> (Tax ID: 704226146) to build the technical orchestration layer that connects hotels, suppliers, funders, and logistics providers — using Egypt&apos;s existing fintech rails rather than reinventing them.
              </p>
              <p className="text-[14px] text-muted leading-relaxed">
                The company operates as a <strong className="text-secondary">technical data orchestrator</strong> — licensed for digital marketing, not cash custody or factoring. HotelsVendors plugs into licensed financial institutions for factoring and payment processing, providing the AI-powered procurement and compliance layer on top.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-4 mt-6">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-all hover:scale-105"
                    style={{ backgroundColor: s.color + "15", color: s.color, border: `1px solid ${s.color}30` }}
                  >
                    <s.icon size={14} />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="surface-card p-8">
              <div className="space-y-5">
                {[
                  { label: "Founded", value: "2023" },
                  { label: "Legal Entity", value: "Restaurants for E-Marketing" },
                  { label: "Tax ID", value: "704226146" },
                  { label: "Commercial Registry", value: "105300900196948" },
                  { label: "License", value: "Digital Marketing" },
                  { label: "Role", value: "Technical Data Orchestrator" },
                  { label: "Headquarters", value: "Egypt" },
                  { label: "Sector", value: "Hospitality B2B Procurement" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-subtle last:border-0">
                    <span className="text-[12px] text-muted">{item.label}</span>
                    <span className="text-[13px] text-secondary font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y marketing-section-alt" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: MapPin, label: "Egypt-First", desc: "صُمم لسلاسل الإمداد المحلية" },
              { icon: Building2, label: "Hospitality-Only", desc: "ليس سوقًا عامًا" },
              { icon: Shield, label: "ETA Compliant", desc: "متوافق مع الفوترة الإلكترونية" },
              { icon: Banknote, label: "Embedded Finance", desc: "التمويل المدمج من اليوم الأول" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <b.icon size={16} style={{ color: "var(--accent-base)" }} />
                <div>
                  <p className="text-[11px] font-medium text-secondary">{b.label}</p>
                  <p className="text-[9px] text-muted">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Focus */}
      <section className="py-16 marketing-section">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <Eye size={24} className="mb-4" style={{ color: "var(--accent-base)" }} />
              <h2 className="text-[20px] font-medium text-primary mb-4">The Market Gap</h2>
              <p className="text-[14px] text-muted leading-relaxed mb-4">
                Egypt&apos;s hospitality sector is fragmented across thousands of manual procurement processes. Paper invoices. Extended payment cycles. Zero visibility into spend. Coastal resorts in Sharm El-Sheikh and Hurghada rely on suppliers primarily based in Cairo, with logistics costs significantly impacting every order.
              </p>
              <p className="text-[14px] text-muted leading-relaxed">
                The ETA e-invoicing mandate created a digital layer, but no one built the orchestration platform on top of it. HotelsVendors fills that gap: the AI-powered procurement OS that uses Egypt&apos;s fintech infrastructure as its foundation.
              </p>
            </div>
            <div>
              <Target size={24} className="mb-4" style={{ color: "var(--accent-base)" }} />
              <h2 className="text-[20px] font-medium text-primary mb-4">Our Focus</h2>
              <p className="text-[14px] text-muted leading-relaxed mb-4">
                We serve coastal hotels in Sharm El-Sheikh and Hurghada first, then Cairo, Alexandria, and the North Coast. These are 100-500 room resorts with multiple F&B outlets, pools, spas, and water sports. Properties where procurement complexity is highest.
              </p>
              <p className="text-[14px] text-muted leading-relaxed">
                Our target customers are local branded hotel chains (Stella Di Mare, Sunrise, Jaz, Baron), not just international 5-star brands. These groups operate 5-30 properties and need portfolio-level procurement control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 marketing-section-alt">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="label-upper mb-8 text-center">What Drives Us</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "Compliance First", titleAr: "الامتثال أولاً", desc: "ETA e-invoicing, FRA anti-fraud, and cryptographic audit trails are built in — not bolted on.", color: "var(--accent-base)" },
              { icon: Globe, title: "Egypt-Focused", titleAr: "تركيز مصري", desc: "Built for Egyptian supply chains, payment cycles, and regulatory requirements.", color: "var(--success)" },
              { icon: Zap, title: "AI-Native", titleAr: "ذكاء اصطناعي أصلي", desc: "Demand forecasting, anomaly detection, and autonomous agents are core architecture.", color: "var(--info)" },
              { icon: Target, title: "Hospitality-Only", titleAr: "ضيافة فقط", desc: "We do not serve every industry. We serve hospitality better than anyone else.", color: "var(--warning)" },
            ].map((v) => (
              <div key={v.title} className="surface-card p-6 text-center transition-all">
                <v.icon size={24} className="mx-auto mb-3" style={{ color: v.color }} />
                <h3 className="text-[14px] font-medium text-primary mb-1">{v.title}</h3>
                <p className="text-[10px] text-muted mb-2" dir="rtl">{v.titleAr}</p>
                <p className="text-[12px] text-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 marketing-section">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Users size={28} className="mx-auto mb-6" style={{ color: "var(--accent-base)" }} />
          <h2 className="text-[24px] font-medium mb-4 text-primary">Want to Learn More?</h2>
          <p className="text-[13px] text-muted mb-8 max-w-lg mx-auto">We&apos;re always looking for partners who share our vision for Egyptian hospitality.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register" className="cta-glow inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all" style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text)" }}>
              Get Started <ArrowRight size={14} />
            </Link>
            <Link href="/solutions" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-surface-hover" style={{ border: "1px solid var(--border-visible)", color: "var(--text-secondary)" }}>
              Explore Solutions
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
