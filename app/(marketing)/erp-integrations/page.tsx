"use client";

import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";

const CONNECTORS = [
  { name: "SAP", what: "BAPI PO creation", dir: "OUT" },
  { name: "Odoo", what: "Purchase order sync", dir: "BOTH" },
  { name: "Oracle Opera", what: "PMS procurement", dir: "OUT" },
  { name: "cXML / Local", what: "eProcurement adapters", dir: "BOTH" },
];

export default function ERPPage() {
  return (
    <main className="bg-[#0A0A0A] text-[#FAFAFA] min-h-screen pt-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24">
        <Reveal>
          <header className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#737373] mb-6">Integrations</p>
            <h1 className="text-[40px] md:text-[64px] font-semibold leading-[1.02] tracking-[-0.05em]">
              ERP Integrations
            </h1>
            <p className="mt-8 text-[15px] leading-[1.7] text-[#A3A3A3] max-w-[60ch]">
              Bi-directional synchronisation with the systems hotels already run: SAP, Odoo,
              Oracle Opera PMS, and local Egyptian accounting packages.
            </p>
          </header>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#262626] border border-[#262626]">
          {CONNECTORS.map((e, i) => (
            <Reveal key={e.name} delay={i * 0.06} className="bg-[#0A0A0A]">
              <div className="px-7 py-10 hover:bg-[#111111] transition-colors h-full">
                <h3 className="text-[16px] font-semibold tracking-[-0.02em]">{e.name}</h3>
                <p className="text-[12px] text-[#737373] mt-1.5">{e.what}</p>
                <span className="inline-block font-mono text-[10px] tracking-[0.12em] mt-5 px-2 py-1 border border-[#404040] text-[#FF3D00]">
                  {e.dir}
                </span>
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
