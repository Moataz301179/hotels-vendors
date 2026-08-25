"use client";

import Link from "next/link";
import { Landmark, Calculator, ShieldCheck, Wallet } from "lucide-react";

/* Financing hub — Bold Typography: dark canvas, vermillion accent, radius 0.
   Neutral "liquidity partners" language. No Oliv references. */

const PILLARS = [
  {
    icon: Landmark,
    title: "48h Invoice Factoring",
    desc: "Suppliers cash out on delivery. Non-recourse, FRA-regulated, verified against GRN before funding.",
  },
  {
    icon: Wallet,
    title: "Credit Lines up to EGP 10M",
    desc: "Revolving facilities through our liquidity partners. Apply from your dashboard, tracked end to end.",
  },
  {
    icon: Calculator,
    title: "Yield & Discount Calculator",
    desc: "Model discount rates and margin impact before accepting any factoring offer.",
  },
  {
    icon: ShieldCheck,
    title: "FRA Regulatory Shield",
    desc: "Non-duplication registry checks and auditable e-factoring records on every transaction.",
  },
];

const STEPS = [
  { n: "01", t: "Deliver", d: "Complete the order. GRN verified by QR cross-check at the hotel dock." },
  { n: "02", t: "Invoice", d: "Invoice generated automatically, submitted to ETA, digitally signed." },
  { n: "03", t: "Fund", d: "Liquidity partner purchases the verified invoice. Supplier paid in 48 hours." },
  { n: "04", t: "Settle", d: "Hotel settles at net-60. Platform fee deducted before partner settlement." },
];

export default function FinancingPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] text-[#FAFAFA]">
      <style>{`
        .fin-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: #737373; }
        .fin-link { position: relative; color: #FF3D00; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; font-size: 13px; }
        .fin-link::after { content: ""; position: absolute; left: 0; bottom: -4px; height: 2px; width: 100%; background: #FF3D00; transition: transform .15s cubic-bezier(.25,0,0,1); transform-origin: left; }
        .fin-link:hover::after { transform: scaleX(1.1); }
        @media (prefers-reduced-motion: reduce) { .fin-link::after { transition: none; } }
      `}</style>

      {/* HERO */}
      <section className="mx-auto max-w-[1200px] px-6 md:px-12 pt-32 md:pt-40 pb-16 md:pb-20">
        <p className="fin-label mb-6">Financing and liquidity</p>
        <h1 className="text-[40px] md:text-[64px] font-semibold leading-[1.02] tracking-[-0.05em] max-w-[16ch]">
          Cash flow that moves at the speed of <span className="text-[#FF3D00]">hospitality.</span>
        </h1>
        <p className="mt-8 text-[16px] leading-[1.65] text-[#A3A3A3] max-w-[56ch]">
          Whatever your bottleneck: inventory, cash, or payments. One integrated system
          takes fintech to execution. Credit lines up to EGP 10M, factoring facilities,
          and instant action on every verified invoice.
        </p>
        <div className="mt-10">
          <Link href="/register" className="fin-link">Start financing</Link>
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-t border-[#262626]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24">
          <div className="grid sm:grid-cols-2 gap-px bg-[#262626] border border-[#262626]">
            {PILLARS.map((p) => (
              <div key={p.title} className="bg-[#0A0A0A] p-8 md:p-10 hover:bg-[#111111] transition-colors duration-150">
                <p.icon size={24} strokeWidth={1.5} className="text-[#FF3D00]" />
                <h2 className="mt-5 text-[20px] font-semibold tracking-[-0.02em]">{p.title}</h2>
                <p className="mt-3 text-[14px] leading-[1.65] text-[#A3A3A3]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT RUNS */}
      <section className="border-t border-[#262626] bg-[#0F0F0F]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24">
          <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.04em] leading-[1.05]">
            Order to cash, on one rail.
          </h2>
          <div className="mt-12 space-y-px bg-[#262626] border border-[#262626]">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-[#0F0F0F] px-8 py-6 flex flex-col sm:flex-row gap-2 sm:gap-6 items-baseline">
                <span className="font-mono text-[13px] text-[#FF3D00]">{s.n}</span>
                <span className="text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap">{s.t}</span>
                <span className="text-[13.5px] leading-[1.6] text-[#A3A3A3]">{s.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLIANCE STRIP */}
      <section className="border-t border-[#262626]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-12">
          <div className="flex flex-wrap gap-x-12 gap-y-4 items-center">
            <span className="fin-label">ETA e-invoicing native</span>
            <span className="fin-label">FRA-regulated partners</span>
            <span className="fin-label">Non-recourse only</span>
            <span className="fin-label">Idempotent settlement</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#262626]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-20 md:py-28 text-center">
          <h2 className="text-[32px] md:text-[52px] font-semibold tracking-[-0.05em] leading-[1.05]">
            Your invoices are already <span className="text-[#FF3D00]">capital.</span>
          </h2>
          <p className="mt-6 text-[15px] text-[#A3A3A3] max-w-[50ch] mx-auto leading-relaxed">
            Register, deliver, and let the platform turn verified invoices into working capital.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            <Link href="/register" className="fin-link">Create an account</Link>
            <Link href="/factoring-service" className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#FAFAFA] hover:text-[#FF3D00] transition-colors">
              Explore factoring
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
