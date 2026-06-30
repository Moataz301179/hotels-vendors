import { Shield, CheckCircle2, FileCheck, ArrowRight, Building2, Truck, DollarSign, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "ETA E-Invoicing Compliance for Hotels Egypt 2026 | HotelsVendors",
  description:
    "Free ETA invoice verification for Egyptian hotels. Validate supplier invoices against the Egyptian Tax Authority. Avoid penalties of EGP 20,000 + EGP 1,000/day. No system migration needed.",
  keywords: [
    "ETA e-invoicing Egypt",
    "ETA compliance hotels",
    "فاتورة إلكترونية فنادق مصر",
    "Egypt tax authority invoice verification",
    "hotel procurement compliance Egypt",
    "ETA penalties 2026",
  ],
  openGraph: {
    title: "ETA Compliance for Hotels Egypt — Free Invoice Verification",
    description:
      "Validate every supplier invoice against ETA automatically. Avoid EGP 20,000 penalties. No new system. No migration.",
  },
};

export default function EtaCompliancePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-black pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>Free — No Credit Card Required</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
            ETA E-Invoicing Compliance
            <br />
            <span className="text-emerald-400">for Egyptian Hotels</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mb-8">
            Every supplier invoice&nbsp;— automatically verified against the Egyptian Tax Authority.
            No system migration. No new suppliers. No risk of EGP&nbsp;20,000&nbsp;+&nbsp;EGP&nbsp;1,000/day penalties.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-xl transition-all"
            >
              Start Free Compliance Check
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl transition-all"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-4">The ETA Mandate Is Already in Full Enforcement</h2>
        <p className="text-white/60 text-lg mb-12 max-w-3xl">
          Since January 2026, all VAT-registered businesses with revenue over EGP 250K must issue
          ETA-compliant e-invoices. Hotels and their suppliers are included. Non-compliance carries
          escalating penalties.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: AlertTriangle,
              title: "EGP 20,000 Fine",
              desc: "Immediate penalty for non-registration. Plus EGP 1,000 for every day of delay.",
            },
            {
              icon: FileCheck,
              title: "Input VAT Disallowed",
              desc: "Supplier invoices that aren't ETA-compliant? You lose the VAT deduction. Pure cost.",
            },
            {
              icon: XCircle,
              title: "Invoice Suspension",
              desc: "Repeat offenders can have their invoicing capability suspended by ETA.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="border border-white/10 rounded-xl p-6 hover:border-emerald-500/30 transition-colors"
            >
              <item.icon className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-white/10">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Supplier Shares Invoice",
              desc: "Your supplier sends you the ETA invoice UUID or public URL — just like they do today.",
              icon: FileCheck,
            },
            {
              step: "02",
              title: "We Verify with ETA",
              desc: "Our platform checks the invoice against ETA servers. Status, amount, tax IDs — all verified automatically.",
              icon: Shield,
            },
            {
              step: "03",
              title: "You See Compliance Status",
              desc: "Dashboard shows which invoices are valid, which need attention. Real-time. No manual work.",
              icon: CheckCircle2,
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="text-emerald-400 text-sm font-mono mb-4">{item.step}</div>
              <item.icon className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-white/10">
        <h2 className="text-3xl font-bold mb-12 text-center">More Than Just Compliance</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Building2, title: "Digital Procurement", desc: "POs, invoices, approvals — all in one place. Your existing suppliers." },
            { icon: Truck, title: "AI Inventory", desc: "Auto-reorder based on occupancy. Never run out of critical supplies." },
            { icon: DollarSign, title: "Supplier Early Pay", desc: "Your suppliers get paid early. You keep your payment terms." },
            { icon: AlertTriangle, title: "Dispute Management", desc: "Returns, credit notes, discrepancies — tracked and resolved." },
          ].map((item) => (
            <div key={item.title} className="border border-white/10 rounded-xl p-6">
              <item.icon className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-white/10 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Suppliers Stay Your Suppliers</h2>
        <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
          We don&#39;t force you into a marketplace. We digitize the relationships you already have.
          Your suppliers get invited, onboard in 5 minutes, and keep working the way they do.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-xl transition-all"
        >
          Start Free — No Credit Card
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-white/30 text-sm">
        HotelsVendors — Procurement orchestration for Egyptian hotels.
      </footer>
    </main>
  );
}
