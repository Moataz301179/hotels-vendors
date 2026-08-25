"use client";

import Link from "next/link";
import { FileCheck2, Landmark, Clock, ShieldCheck, ArrowRight } from "lucide-react";

/* Factoring service — Bold Typography.
   CORRECT MODEL (owner-locked):
   • Credit line: activated INSTANTLY once funder onboarding completes
   • Invoice payment: suppliers paid in 48 HOURS (not 24)
   • All settlement/payment flows run SOLELY through the funder per their T&Cs
   • HotelsVendors = smart management layer: agentic cashflow engines, invoice/order/
     fund/credit-line synchronization, integration with the user's accounting +
     payables modules. HV is NOT a bank, holds no funds, offers no bank products.
   • Virtual bank accounts = user-created LEDGERS for cashflow management
     (name them Bank 1/2/3; no IBAN/SWIFT required) — ledger records, not bank accounts.
   • No "competitive bidding" / "grantors bid" claims (no multi-lender marketplace yet). */

const STEPS = [
  { n: "01", t: "Onboard with the funder", d: "Complete KYB with the liquidity partner inside your dashboard. Approval activates your credit line instantly." },
  { n: "02", t: "Credit line active", d: "Your revolving line appears in the wallet the moment onboarding completes. Draw against verified invoices immediately." },
  { n: "03", t: "Invoice verified", d: "Deliver, scan the GRN QR, invoice auto-generates and submits to ETA. Verification is automatic." },
  { n: "04", t: "Paid in 48 hours", d: "The funder pays suppliers within 48 hours of verification, per their terms. Hotels settle at net-60." },
];

const PILLARS = [
  {
    icon: Landmark,
    title: "Funder-run settlement",
    desc: "All payment and settlement flows execute solely through the licensed funder, under their terms and conditions. HotelsVendors never touches or holds funds.",
  },
  {
    icon: FileCheck2,
    title: "Smart cashflow management",
    desc: "Agentic engines synchronize invoices, orders, funds, and your credit line, then direct the workflow into your accounting system and payables module.",
  },
  {
    icon: Clock,
    title: "Instant line, 48h cash",
    desc: "Credit line activates the moment funder onboarding completes. Verified invoices convert to supplier cash in 48 hours.",
  },
  {
    icon: ShieldCheck,
    title: "Non-recourse by design",
    desc: "The funder carries the hotel default risk. Suppliers have zero recourse liability. FRA-regulated partners only.",
  },
];

export default function FactoringServicePage() {
  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] text-[#FAFAFA]">
      <style>{`
        .fs-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: #737373; }
        .fs-link { position: relative; color: #FF3D00; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; font-size: 13px; }
        .fs-link::after { content: ""; position: absolute; left: 0; bottom: -4px; height: 2px; width: 100%; background: #FF3D00; transition: transform .15s cubic-bezier(.25,0,0,1); transform-origin: left; }
        .fs-link:hover::after { transform: scaleX(1.1); }
        .fs-outline { display: inline-flex; align-items: center; gap: 8px; border: 1px solid #FAFAFA; color: #FAFAFA;
          font-weight: 600; letter-spacing: .1em; text-transform: uppercase; font-size: 13px; padding: 14px 28px;
          transition: all .15s cubic-bezier(.25,0,0,1); }
        .fs-outline:hover { background: #FAFAFA; color: #0A0A0A; }
        @media (prefers-reduced-motion: reduce) { .fs-link::after { transition: none; } }
      `}</style>

      {/* HERO */}
      <section className="mx-auto max-w-[1200px] px-6 md:px-12 pt-32 md:pt-40 pb-16 md:pb-20">
        <p className="fs-label mb-6">Factoring</p>
        <h1 className="text-[40px] md:text-[64px] font-semibold leading-[1.02] tracking-[-0.05em] max-w-[16ch]">
          Verified invoices. Instant credit line. <span className="text-[#FF3D00]">Paid in 48 hours.</span>
        </h1>
        <p className="mt-8 text-[16px] leading-[1.65] text-[#A3A3A3] max-w-[58ch]">
          Complete funder onboarding and your credit line activates instantly. Every
          verified invoice converts to supplier cash within 48 hours, settled solely by
          the licensed funder under their terms. HotelsVendors provides the smart
          management layer: agentic cashflow engines that synchronize invoices, orders,
          funds, and credit into your accounting and payables.
        </p>
        <div className="mt-10 flex flex-wrap gap-8 items-center">
          <Link href="/register" className="fs-link">Start onboarding</Link>
          <Link href="/financing" className="fs-outline">How financing works <ArrowRight size={14} /></Link>
        </div>
      </section>

      {/* STEPS */}
      <section className="border-t border-[#262626]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24">
          <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.04em] leading-[1.05]">
            From onboarding to cash, on one rail.
          </h2>
          <div className="mt-12 space-y-px bg-[#262626] border border-[#262626]">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-[#0A0A0A] px-8 py-6 flex flex-col sm:flex-row gap-2 sm:gap-6 items-baseline hover:bg-[#111111] transition-colors duration-150">
                <span className="font-mono text-[13px] text-[#FF3D00]">{s.n}</span>
                <span className="text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap">{s.t}</span>
                <span className="text-[13.5px] leading-[1.6] text-[#A3A3A3]">{s.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-t border-[#262626] bg-[#0F0F0F]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24">
          <div className="grid sm:grid-cols-2 gap-px bg-[#262626] border border-[#262626]">
            {PILLARS.map((p) => (
              <div key={p.title} className="bg-[#0F0F0F] p-8 md:p-10 hover:bg-[#111111] transition-colors duration-150">
                <p.icon size={24} strokeWidth={1.5} className="text-[#FF3D00]" />
                <h2 className="mt-5 text-[20px] font-semibold tracking-[-0.02em]">{p.title}</h2>
                <p className="mt-3 text-[14px] leading-[1.65] text-[#A3A3A3]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIRTUAL LEDGER ACCOUNTS */}
      <section className="border-t border-[#262626]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-[7fr_5fr] gap-12 items-center">
          <div>
            <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.04em] leading-[1.05] max-w-[20ch]">
              Virtual ledger accounts for real cashflow control.
            </h2>
            <p className="mt-6 text-[15px] leading-[1.65] text-[#A3A3A3] max-w-[58ch]">
              Create named ledger accounts (Bank 1, Bank 2, Bank 3) in seconds. No IBAN,
              no SWIFT, no bank paperwork. These are cashflow-management ledgers that
              mirror where money actually sits, while the agentic engine keeps invoices,
              orders, funds, and your credit line synchronized with your accounting and
              payables modules.
            </p>
            <div className="mt-8">
              <Link href="/register" className="fs-link">Set up your ledgers</Link>
            </div>
          </div>
          <div className="border border-[#262626] p-8 font-mono text-[12.5px] leading-[2.1] text-[#A3A3A3]">
            <div className="text-[#FAFAFA]">Ledgers</div>
            <div>Bank 1 <span className="text-[#737373]">operating</span></div>
            <div>Bank 2 <span className="text-[#737373]">payroll</span></div>
            <div>Bank 3 <span className="text-[#737373]">capex reserve</span></div>
            <div className="pt-3 mt-3 border-t border-[#262626] text-[#737373]">Credit line: active · synced</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#262626] bg-[#0F0F0F]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-20 md:py-28 text-center">
          <h2 className="text-[36px] md:text-[56px] font-semibold tracking-[-0.05em] leading-[1.02]">
            Your invoices are already <span className="text-[#FF3D00]">capital.</span>
          </h2>
          <p className="mt-6 text-[15px] text-[#A3A3A3] max-w-[50ch] mx-auto leading-relaxed">
            Onboard with the funder once. Every verified invoice after that is 48 hours from cash.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            <Link href="/register" className="fs-link">Create an account</Link>
            <Link href="/financing" className="fs-outline">Explore financing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
