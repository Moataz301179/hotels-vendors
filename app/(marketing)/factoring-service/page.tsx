import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, Building2, Percent, Clock, Banknote, Hotel, Store, LogIn } from "lucide-react";

export const metadata: Metadata = {
  title: "Factoring — Reverse Factoring for Hospitality | HotelsVendors",
  description: "Hotel-initiated reverse factoring with competitive bidding among 4+ licensed grantors.",
};

const grantors = [
  { name: "OLIV", rate: "1.5%/mo", limit: "EGP 500K", status: "Active", features: ["API Connected", "Fast Approval"] },
  { name: "ValU", rate: "1.8%/mo", limit: "EGP 300K", status: "Active", features: ["Digital-First", "Instant Decision"] },
  { name: "CIB Factoring", rate: "1.2%/mo", limit: "EGP 1M", status: "Active", features: ["Highest Limits", "Corporate Banking"] },
  { name: "Fawry", rate: "2.1%/mo", limit: "EGP 100K", status: "Active", features: ["Wide Network", "Quick Setup"] },
];

const comparison = [
  { feature: "Monthly Rate", oliv: "1.5%", valu: "1.8%", cib: "1.2%", fawry: "2.1%" },
  { feature: "Credit Limit", oliv: "EGP 500K", valu: "EGP 300K", cib: "EGP 1M", fawry: "EGP 100K" },
  { feature: "API Integration", oliv: true, valu: false, cib: true, fawry: true },
  { feature: "Approval Time", oliv: "24hrs", valu: "48hrs", cib: "72hrs", fawry: "24hrs" },
  { feature: "Digital Signing", oliv: true, valu: true, cib: true, fawry: false },
  { feature: "Min. Invoice", oliv: "EGP 5K", valu: "EGP 3K", cib: "EGP 10K", fawry: "EGP 2K" },
];

export default function FactoringPage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Embedded Factoring</span>
          <h1 className="text-[clamp(28px,4vw,48px)] font-bold leading-[1.1] mb-5 text-white">Reverse Factoring for Hospitality</h1>
          <p className="text-[13px] text-white/40 max-w-2xl">Hotel-initiated reverse factoring with competitive bidding among 4+ licensed grantors. Suppliers paid in 24-48 hours. Hotels maintain net-30/60 terms.</p>
        </div>
      </section>
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: <Building2 size={18} />, title: "Hotel Initiates", desc: "Starts factoring from approved invoice" },
              { icon: <Banknote size={18} />, title: "Grantors Bid", desc: "4+ licensed grantors submit offers" },
              { icon: <Percent size={18} />, title: "Hotel Selects", desc: "Chooses best rate and terms" },
              { icon: <Clock size={18} />, title: "Supplier Paid", desc: "Payment in 24-48 hours" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-5 text-center" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>{s.icon}</div>
                <h3 className="text-[13px] font-bold mb-1 text-white">{s.title}</h3>
                <p className="text-[11px] text-white/40">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Partners</span>
          <h2 className="text-[20px] font-bold mb-8 text-white">Licensed Grantors</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {grantors.map((g, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[15px] text-white">{g.name}</h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22C55E" }}>{g.status}</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-[12px]"><span className="text-white/25">Rate</span><span className="font-medium text-white/70">{g.rate}</span></div>
                  <div className="flex justify-between text-[12px]"><span className="text-white/25">Limit</span><span className="font-medium text-white/70">{g.limit}</span></div>
                </div>
                <div className="space-y-1">
                  {g.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-1.5 text-[11px] text-white/25"><Check size={11} style={{ color: "#39FF14" }} />{f}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Compare</span>
          <h2 className="text-[20px] font-bold mb-8 text-white">Grantor Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr className="text-white/25" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th className="pb-3 font-medium text-left">Feature</th>
                  <th className="pb-3 font-medium text-left">OLIV</th>
                  <th className="pb-3 font-medium text-left">ValU</th>
                  <th className="pb-3 font-medium text-left">CIB</th>
                  <th className="pb-3 font-medium text-left">Fawry</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="py-3 font-medium text-white">{row.feature}</td>
                    {["oliv", "valu", "cib", "fawry"].map((k) => (
                      <td key={k} className="py-3">
                        {typeof (row as any)[k] === "boolean"
                          ? (row as any)[k] ? <Check size={14} style={{ color: "#22C55E" }} /> : <X size={14} style={{ color: "rgba(239,68,68,0.4)" }} />
                          : <span className="text-white/40">{(row as any)[k]}</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="py-20" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[22px] font-bold mb-2 text-white">Get Started with Factoring</h2>
          <p className="text-[12px] text-white/25 mb-8">Choose your role to access embedded reverse factoring</p>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Hotel, title: "I am a Hotel", desc: "Initiate reverse factoring, pay suppliers in 24-48hrs, keep net-30/60 terms.", color: "#3B82F6", border: "rgba(59,130,246,0.2)" },
              { icon: Store, title: "I am a Supplier", desc: "Get paid early through hotel-initiated factoring. No application needed.", color: "#EAB308", border: "rgba(234,179,8,0.2)" },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ backgroundColor: "#0a0a0a", border: `1px solid ${card.border}` }}>
                <div className="flex items-center gap-2 mb-3"><card.icon size={18} style={{ color: card.color }} /><h3 className="text-[14px] font-bold text-white">{card.title}</h3></div>
                <p className="text-[11px] text-white/40 mb-4">{card.desc}</p>
                <div className="flex gap-2">
                  <Link href="/register" className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold rounded-xl flex-1 justify-center" style={{ backgroundColor: "#39FF14", color: "#000000" }}>Register</Link>
                  <Link href="/login" className="inline-flex items-center justify-center px-3 py-2 rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.1)" }}><LogIn size={12} style={{ color: "rgba(255,255,255,0.5)" }} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
