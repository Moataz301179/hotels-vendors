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
    <main className="bg-[#F8FAFC] text-[#0F172A] min-h-screen pt-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24">
        <Reveal>
          <header className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#64748B] mb-6">Integrations</p>
            <h1 className="text-[40px] md:text-[64px] font-semibold leading-[1.02] tracking-[-0.05em]">
              ERP Integrations
            </h1>
            <p className="mt-8 text-[15px] leading-[1.7] text-[#475569] max-w-[60ch]">
              Bi-directional synchronisation with the systems hotels already run: SAP, Odoo,
              Oracle Opera PMS, and local Egyptian accounting packages.
            </p>
          </header>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#F1F5F9] border border-[#E2E8F0]">
          {CONNECTORS.map((e, i) => (
            <Reveal key={e.name} delay={i * 0.06} className="bg-[#F8FAFC]">
              <div className="px-7 py-10 hover:bg-[#F1F5F9] transition-colors h-full">
                <h3 className="text-[16px] font-semibold tracking-[-0.02em]">{e.name}</h3>
                <p className="text-[12px] text-[#64748B] mt-1.5">{e.what}</p>
                <span className="inline-block font-mono text-[10px] tracking-[0.12em] mt-5 px-2 py-1 border border-[#CBD5E1] text-[#2563EB]">
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
