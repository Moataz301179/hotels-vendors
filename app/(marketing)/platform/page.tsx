"use client";

import Link from "next/link";
import { BrainCircuit, FileCheck2, Truck, Users, ArrowRight } from "lucide-react";

/* Platform page — Bold Typography edition. Replaces the old pillar-card page:
   no "Try the Sandbox" (retired), no "Request Enterprise Access" (register is open),
   no repeated icon-per-card pattern. Statement sections + hairline rows. */

const CAPABILITIES = [
  {
    icon: BrainCircuit,
    title: "AI demand forecasting",
    desc: "Occupancy-adjusted reorder alerts, buy-ahead price watch, and supplier grades computed from your real receiving history. The engine orders before the shelf empties.",
  },
  {
    icon: FileCheck2,
    title: "ETA e-invoicing native",
    desc: "Every invoice digitally signed, UUID-tracked, and submitted to the Egyptian Tax Authority in real time. Dead-letter queue catches retries; zero penalty exposure.",
  },
  {
    icon: Truck,
    title: "Shared-route logistics",
    desc: "Route consolidation across Cairo, Giza and the coastal clusters. One truck serves five hotels. POD photo-verified at every stop.",
  },
  {
    icon: Users,
    title: "Governance built in",
    desc: "Multi-level approval chains scaled to order value, dual-signature overrides, and a full audit trail on every mutation. The Authority Matrix is not a document; it is code.",
  },
];

export default function PlatformPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] text-[#FAFAFA]">
      <style>{`
        .pf-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: #737373; }
        .pf-link { position: relative; color: #FF3D00; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; font-size: 13px; }
        .pf-link::after { content: ""; position: absolute; left: 0; bottom: -4px; height: 2px; width: 100%; background: #FF3D00; transition: transform .15s cubic-bezier(.25,0,0,1); transform-origin: left; }
        .pf-link:hover::after { transform: scaleX(1.1); }
        .pf-outline { display: inline-flex; align-items: center; border: 1px solid #FAFAFA; color: #FAFAFA;
          font-weight: 600; letter-spacing: .1em; text-transform: uppercase; font-size: 13px; padding: 14px 28px;
          transition: all .15s cubic-bezier(.25,0,0,1); }
        .pf-outline:hover { background: #FAFAFA; color: #0A0A0A; }
        @media (prefers-reduced-motion: reduce) { .pf-link::after { transition: none; } }
      `}</style>

      {/* HERO */}
      <section className="mx-auto max-w-[1200px] px-6 md:px-12 pt-32 md:pt-40 pb-16 md:pb-20">
        <p className="pf-label mb-6">The platform</p>
        <h1 className="text-[40px] md:text-[64px] font-semibold leading-[1.02] tracking-[-0.05em] max-w-[18ch]">
          Procurement that runs itself, <span className="text-[#FF3D00]">governed</span> to the piaster.
        </h1>
        <p className="mt-8 text-[16px] leading-[1.65] text-[#A3A3A3] max-w-[56ch]">
          HotelsVendors is one transaction rail: AI-sourced demand, fixed-price supply,
          consolidated delivery, embedded finance, and tax-compliant invoicing. Built for
          Egyptian hospitality. Integrated with the systems you already run.
        </p>
        <div className="mt-10 flex flex-wrap gap-8 items-center">
          <Link href="/register" className="pf-link">Create an account</Link>
          <Link href="/marketplace" className="pf-outline">Browse the marketplace</Link>
        </div>
      </section>

      {/* CAPABILITIES — statement rows, no icon-per-card repetition */}
      <section className="border-t border-[#262626]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24">
          <h2 className="text-[32px] md:text-[44px] font-semibold tracking-[-0.04em] leading-[1.05] max-w-[20ch]">
            Four systems. One platform.
          </h2>
          <div className="mt-14 space-y-px bg-[#262626] border border-[#262626]">
            {CAPABILITIES.map((c, i) => (
              <div key={c.title} className="bg-[#0A0A0A] px-8 py-8 grid md:grid-cols-[auto_1fr] gap-5 md:gap-10 items-start hover:bg-[#111111] transition-colors duration-150">
                <span className="font-mono text-[13px] text-[#FF3D00] pt-1">0{i + 1}</span>
                <div>
                  <h3 className="text-[20px] font-semibold tracking-[-0.02em]">{c.title}</h3>
                  <p className="mt-3 text-[14px] leading-[1.7] text-[#A3A3A3] max-w-[70ch]">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATION STRIP */}
      <section className="border-t border-[#262626] bg-[#0F0F0F]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-[7fr_5fr] gap-12 items-center">
          <div>
            <h2 className="text-[28px] md:text-[40px] font-semibold tracking-[-0.04em] leading-[1.05] max-w-[20ch]">
              Enterprise-ready from day one.
            </h2>
            <p className="mt-6 text-[15px] leading-[1.65] text-[#A3A3A3] max-w-[56ch]">
              REST APIs, webhooks, and idempotent settlement connect HotelsVendors to SAP,
              Oracle, Opera PMS, and local ERP stacks. Multi-tenant isolation and row-level
              scoping are enforced at the database layer, not the honor system.
            </p>
            <div className="mt-8">
              <Link href="/erp-integrations" className="pf-link">Integration docs</Link>
            </div>
          </div>
          <div className="border border-[#262626] p-8 font-mono text-[12.5px] leading-[2] text-[#A3A3A3]">
            <div><span className="text-[#FF3D00]">POST</span> /api/v1/orders</div>
            <div><span className="text-[#FF3D00]">GET</span> /api/v1/procurement/insights</div>
            <div><span className="text-[#FF3D00]">POST</span> /api/v1/grn/qr</div>
            <div><span className="text-[#FF3D00]">POST</span> /api/webhooks/inventory/[provider]</div>
            <div className="pt-3 mt-3 border-t border-[#262626] text-[#737373]">220 routes. 110 models. Zero mock data.</div>
          </div>
        </div>
      </section>

      {/* CTA — register is open; no sandbox, no gated enterprise tier */}
      <section className="border-t border-[#262626]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-20 md:py-28 text-center">
          <h2 className="text-[36px] md:text-[56px] font-semibold tracking-[-0.05em] leading-[1.02]">
            Start procurement on the <span className="text-[#FF3D00]">right rails.</span>
          </h2>
          <p className="mt-6 text-[15px] text-[#A3A3A3] max-w-[50ch] mx-auto leading-relaxed">
            Registration takes minutes. The catalog grows as verified suppliers come online.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            <Link href="/register" className="pf-link">Create an account</Link>
            <Link href="/pricing" className="pf-outline">See pricing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
