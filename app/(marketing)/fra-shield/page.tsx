"use client";

import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";

const FEATURES = [
  {
    n: "01",
    t: "Single-instance lock",
    d: "Each ETA invoice is registered once at the FRA registry — no double financing across any buyer or platform.",
  },
  {
    n: "02",
    t: "Audit trail",
    d: "Every approval, disbursement, and lock is written to an immutable audit log with before/after snapshots.",
  },
  {
    n: "03",
    t: "Multi-buyer visibility",
    d: "Cross-check whether an invoice is already financed elsewhere before a single EGP is disbursed.",
  },
];

export default function FRAShieldPage() {
  return (
    <main className="bg-[#F8FAFC] text-[#0F172A] min-h-screen pt-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24">
        <Reveal>
          <header className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#64748B] mb-6">Compliance</p>
            <h1 className="text-[40px] md:text-[64px] font-semibold leading-[1.02] tracking-[-0.05em]">
              FRA Regulatory Shield
            </h1>
            <p className="mt-8 text-[15px] leading-[1.7] text-[#475569] max-w-[60ch]">
              Automated Financial Regulatory Authority non-duplication checks. Every invoice is
              locked against the FRA electronic factoring registry before a single EGP is disbursed.
            </p>
          </header>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-px bg-[#F1F5F9] border border-[#E2E8F0]">
          {FEATURES.map((f, i) => (
            <Reveal key={f.n} delay={i * 0.08} className="bg-[#F8FAFC]">
              <div className="px-8 py-10 hover:bg-[#F1F5F9] transition-colors h-full">
                <div className="font-mono text-[13px] text-[#2563EB]">{f.n}</div>
                <h3 className="mt-4 text-[18px] font-semibold tracking-[-0.02em]">{f.t}</h3>
                <p className="mt-3 text-[13px] leading-[1.7] text-[#475569]">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-16">
            <Link
              href="/register"
              className="inline-flex items-center px-7 py-3.5 bg-[#2563EB] text-white text-[13px] font-semibold uppercase tracking-[0.1em] hover:bg-slate-100 transition-colors"
            >
              Get started free
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
