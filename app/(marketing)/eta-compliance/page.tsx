"use client";

import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";

const FEATURES = [
  {
    n: "01",
    t: "Automatic payload validation",
    d: "Every fulfilled order is formatted into the ETA document schema and verified before submission — no manual rekeying, no rejected batches.",
  },
  {
    n: "02",
    t: "Real-time submission",
    d: "Invoices are submitted to the Egyptian Tax Authority the moment they are issued, with UUID and digital signature handled by the platform.",
  },
  {
    n: "03",
    t: "Scannable e-Waybill QR",
    d: "Each shipment carries its official e-Waybill QR code, generated from the accepted ETA document — ready for transport inspection.",
  },
];

export default function ETAPage() {
  return (
    <main className="bg-[#0A0A0A] text-[#FAFAFA] min-h-screen pt-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24">
        <Reveal>
          <header className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#737373] mb-6">Regulatory</p>
            <h1 className="text-[40px] md:text-[64px] font-semibold leading-[1.02] tracking-[-0.05em]">
              ETA Compliance Sentinel
            </h1>
            <p className="mt-8 text-[15px] leading-[1.7] text-[#A3A3A3] max-w-[60ch]">
              Automatic Egyptian Tax Authority e-invoicing validation. Every fulfilled order is
              formatted, verified, and submitted as an official ETA payload with a scannable
              e-Waybill QR code.
            </p>
          </header>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 border border-[#262626]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#737373] border-b border-[#262626] bg-[#0F0F0F]">
                  <th className="text-left px-6 py-4 font-normal">Document</th>
                  <th className="text-left px-6 py-4 font-normal">Type</th>
                  <th className="text-right px-6 py-4 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="px-6 py-14 text-center">
                    <p className="text-[#A3A3A3]">No ETA documents yet — clears when invoices are submitted.</p>
                    <p className="text-[12px] text-[#737373] mt-2">
                      Submitted invoices will appear here with their ETA verification status.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
