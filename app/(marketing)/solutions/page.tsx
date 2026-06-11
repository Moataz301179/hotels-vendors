import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Store, Landmark, Truck, BrainCircuit, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions — By Stakeholder | HotelsVendors",
  description: "Tailored procurement solutions for hotels, suppliers, factoring companies, and logistics providers in Egyptian hospitality.",
};

const solutions = [
  {
    icon: Building2,
    title: "For Hotels & Resorts",
    desc: "AI-automated procurement, budget blockades, ETA compliance, and net-60 factoring — all from one dashboard. Built for Egyptian hospitality groups managing 100-500 room properties.",
    features: ["AI demand forecasting", "Budget blockades", "Multi-property control", "Net-60 factoring", "48-hour delivery"],
    href: "/register?role=hotel",
    cta: "Register Hotel",
    color: "#84cc16",
  },
  {
    icon: Store,
    title: "For Suppliers & Vendors",
    desc: "Get discovered by Egypt's largest hotel groups. Upload catalogs, receive POs, issue ETA-compliant invoices, and get paid in 24 hours via embedded factoring.",
    features: ["Catalog management", "PO notifications", "ETA invoicing", "24hr payment", "Analytics dashboard"],
    href: "/become-supplier",
    cta: "Become a Supplier",
    color: "#22C55E",
  },
  {
    icon: Landmark,
    title: "For Factoring Companies",
    desc: "Access a curated pool of pre-verified hospitality invoices. Competitive bidding, non-recourse settlement, and bank-direct payment flows.",
    features: ["Pre-verified invoices", "Competitive bidding", "Non-recourse", "Bank-direct settlement", "Risk scoring"],
    href: "/register?role=factoring",
    cta: "Register Grantor",
    color: "#D4A843",
  },
  {
    icon: Truck,
    title: "For Logistics Providers",
    desc: "Fill your trucks with consolidated multi-supplier loads. Shared-route optimization, guaranteed volume, and on-time payment.",
    features: ["Load consolidation", "Route optimization", "Guaranteed volume", "On-time payment", "GPS tracking"],
    href: "/register?role=shipping",
    cta: "Register Carrier",
    color: "#3B82F6",
  },
];

export default function SolutionsPage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(132,204,22,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Solutions</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-white">
            One Platform.<br /><span className="text-gradient-lime">Four Stakeholders.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re a hotel procurement manager, a supplier, a funder, or a carrier — HotelsVendors has a tailored workflow for you.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6 space-y-6">
          {solutions.map((s) => (
            <div key={s.title} className="rounded-2xl p-8" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + "15" }}>
                      <s.icon size={20} style={{ color: s.color }} />
                    </div>
                    <h2 className="text-[20px] font-medium text-white">{s.title}</h2>
                  </div>
                  <p className="text-[14px] text-white/40 leading-relaxed mb-5 max-w-xl">{s.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.features.map((f) => (
                      <span key={f} className="px-3 py-1.5 rounded-lg text-[11px] font-medium" style={{ backgroundColor: s.color + "10", color: s.color }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center lg:justify-end">
                  <Link href={s.href} className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.2)]" style={{ backgroundColor: "#84cc16", color: "#000000" }}>
                    {s.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <BrainCircuit size={32} className="mx-auto mb-6" style={{ color: "#84cc16" }} />
          <h2 className="text-[24px] font-medium mb-4 text-white">The Full Picture</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-xl mx-auto">
            All four stakeholders connect on one platform. Hotels order, suppliers fulfill, funders finance, and carriers deliver — with AI orchestrating every step.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Building2, label: "Hotels", color: "#84cc16" },
              { icon: Store, label: "Suppliers", color: "#22C55E" },
              { icon: Landmark, label: "Funders", color: "#D4A843" },
              { icon: Truck, label: "Carriers", color: "#3B82F6" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-4" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <item.icon size={20} className="mx-auto mb-2" style={{ color: item.color }} />
                <p className="text-[12px] font-medium text-white/60">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <ShieldCheck size={32} className="mx-auto mb-6" style={{ color: "#84cc16" }} />
          <h2 className="text-[24px] font-medium mb-4 text-white">ETA Compliant. FRA Secure.</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">Every transaction on HotelsVendors meets Egyptian Tax Authority e-invoicing requirements and FRA anti-fraud standards.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.2)]" style={{ backgroundColor: "#84cc16", color: "#000000" }}>
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
