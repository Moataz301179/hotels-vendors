import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Banknote, Clock, Shield, TrendingUp, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Factoring — Reverse Factoring for Hospitality | HotelsVendors",
  description: "Hotel-initiated reverse factoring with competitive bidding among 4+ licensed grantors. Suppliers paid in 24 hours, hotels keep net-60.",
};

export default function FactoringServicePage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Factoring</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-white">
            Suppliers Paid in 24 Hours.<br /><span className="text-gradient-lime">You Keep Net-60.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl leading-relaxed mb-8">
            Hotel-initiated reverse factoring with competitive bidding among 4+ licensed grantors. Non-recourse, bank-direct settlement. Zero balance-sheet liability.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register?role=factoring" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.2)]" style={{ backgroundColor: "#84cc16", color: "#000000" }}>
              Register as Grantor <ArrowRight size={14} />
            </Link>
            <Link href="/platform" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-8 text-center">The Flow</h2>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Invoice Cleared", desc: "Three-way match: PO + ETA UUID + Signed Delivery Note verified automatically.", icon: Check },
              { step: "02", title: "Enter Factoring Pool", desc: "Pre-cleared invoice enters competitive bidding pool visible to all licensed grantors.", icon: TrendingUp },
              { step: "03", title: "Grantors Bid", desc: "4+ licensed grantors compete on rate. Best offer selected automatically.", icon: Banknote },
              { step: "04", title: "Settlement", desc: "Supplier paid in 24hrs. Hotel settles at net-60. Zero recourse risk.", icon: Clock },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "rgba(212,168,67,0.1)" }}>
                  <item.icon size={20} style={{ color: "#D4A843" }} />
                </div>
                <span className="text-[10px] font-medium text-white/25 uppercase tracking-wider">Step {item.step}</span>
                <h3 className="text-[13px] font-medium text-white mt-1 mb-1.5">{item.title}</h3>
                <p className="text-[11px] text-white/30 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-8">Why Hotels Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Banknote, title: "No Balance-Sheet Debt", desc: "Reverse factoring is off-balance-sheet. Your credit rating stays clean while suppliers get early payment." },
              { icon: TrendingUp, title: "Competitive Rates", desc: "4+ grantors bid on every invoice. Market-driven rates ensure you always get the best deal." },
              { icon: Shield, title: "Non-Recourse", desc: "Once settled, the invoice is the grantor's risk. Zero recourse back to your property." },
              { icon: Clock, title: "Net-60+ Preserved", desc: "Your working capital stays liquid. Settle invoices at net-60 or longer while suppliers get paid in 24 hours." },
              { icon: Check, title: "Auto Three-Way Match", desc: "Every invoice is pre-verified: PO + ETA UUID + Signed Delivery Note. No manual reconciliation." },
              { icon: ArrowRight, title: "Bank-Direct Settlement", desc: "Settlement happens directly between grantor and your bank. No intermediary accounts." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl p-6" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <f.icon size={20} className="mb-3" style={{ color: "#D4A843" }} />
                <h3 className="text-[14px] font-medium text-white mb-2">{f.title}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[24px] font-medium mb-4 text-white">Stretch Your Working Capital</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">Join Egyptian hotel groups already using embedded factoring to optimize cashflow.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register?role=hotel" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.2)]" style={{ backgroundColor: "#84cc16", color: "#000000" }}>
              Get Started <ArrowRight size={14} />
            </Link>
            <Link href="/register?role=factoring" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Become a Grantor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
