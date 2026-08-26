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
    <main className="bg-[#0A0A0A] text-[#FAFAFA] min-h-screen pt-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24">
        <Reveal>
          <header className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#737373] mb-6">Compliance</p>
            <h1 className="text-[40px] md:text-[64px] font-semibold leading-[1.02] tracking-[-0.05em]">
              FRA Regulatory Shield
            </h1>
            <p className="mt-8 text-[15px] leading-[1.7] text-[#A3A3A3] max-w-[60ch]">
              Automated Financial Regulatory Authority non-duplication checks. Every invoice is
              locked against the FRA electronic factoring registry before a single EGP is disbursed.
            </p>
          </header>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-px bg-[#262626] border border-[#262626]">
          {FEATURES.map((f, i) => (
            <Reveal key={f.n} delay={i * 0.08} className="bg-[#0A0A0A]">
              <div className="px-8 py-10 hover:bg-[#111111] transition-colors h-full">
                <div className="font-mono text-[13px] text-[#FF3D00]">{f.n}</div>
                <h3 className="mt-4 text-[18px] font-semibold tracking-[-0.02em]">{f.t}</h3>
                <p className="mt-3 text-[13px] leading-[1.7] text-[#A3A3A3]">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-16">
            <Link
              href="/register"
              className="inline-flex items-center px-7 py-3.5 bg-[#FAFAFA] text-[#0A0A0A] text-[13px] font-semibold uppercase tracking-[0.1em] hover:bg-white/5 transition-colors"
            >
              Get started free
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
