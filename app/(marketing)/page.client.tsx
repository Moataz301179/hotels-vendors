"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HovinDevice } from "@/components/marketing/hovin-device";

const ACCENT = "#FF3D00";

interface LiveCounts { products: number | null; suppliers: number | null; }

function useLiveCounts(): LiveCounts {
  const [counts, setCounts] = useState<LiveCounts>({ products: null, suppliers: null });
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [p, s] = await Promise.all([
          fetch("/api/v1/products?limit=1").then((r) => r.json()),
          fetch("/api/v1/suppliers?limit=1").then((r) => r.json()),
        ]);
        if (!active) return;
        setCounts({
          products: p.success && p.data ? (p.data.pagination?.total ?? null) : null,
          suppliers: s.success && s.data ? (s.data.pagination?.total ?? null) : null,
        });
      } catch { if (active) setCounts({ products: null, suppliers: null }); }
    })();
    return () => { active = false; };
  }, []);
  return counts;
}

export default function MarketingPage() {
  const { products, suppliers } = useLiveCounts();
  const hasLive = (products !== null && products > 0) || (suppliers !== null && suppliers > 0);

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] text-[#FAFAFA] antialiased">
      <style>{`
        .hv-link { position: relative; color: #FF3D00; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; font-size: 13px; }
        .hv-link::after { content: ""; position: absolute; left: 0; bottom: -4px; height: 2px; width: 100%;
          background: ${ACCENT}; transform: scaleX(1); transform-origin: left; transition: transform .15s cubic-bezier(.25,0,0,1); }
        .hv-link:hover::after { transform: scaleX(1.1); }
        .hv-btn-outline { display: inline-flex; align-items: center; border: 1px solid #FAFAFA;
          color: #FAFAFA; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; font-size: 13px;
          padding: 14px 28px; transition: all .15s cubic-bezier(.25,0,0,1); }
        .hv-btn-outline:hover { background: #FAFAFA; color: #0A0A0A; }
        .hv-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .18em;
          text-transform: uppercase; color: #737373; }
        .hv-fade { animation: hvFade .6s cubic-bezier(.25,0,0,1); }
        @keyframes hvFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .hv-fade { animation: none; } .hv-link::after { transition: none; } }
      `}</style>

      {/* HERO — asymmetric split */}
      <section className="mx-auto max-w-[1200px] px-6 md:px-12 pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="grid md:grid-cols-[7fr_5fr] gap-10 md:gap-16 items-center">
          <div>
            <p className="hv-label mb-6">Egypt&apos;s B2B hospitality procurement and fintech platform</p>
            <h1 className="font-semibold text-[44px] leading-[1.02] md:text-[72px] md:leading-[0.98] tracking-[-0.05em]">
              Procurement,<br />
              <span className="text-[#FF3D00]">financed.</span><br />
              Compliance, built in.
            </h1>
            <p className="mt-8 text-[17px] leading-[1.6] text-[#A3A3A3] max-w-[52ch]">
              The operating system for hotel procurement in Egypt. AI-powered sourcing,
              fixed-price suppliers, embedded factoring, and ETA e-invoicing on every transaction.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <Link href="/marketplace" className="hv-link">Browse the marketplace</Link>
              <Link href="/register" className="hv-btn-outline">Create an account</Link>
            </div>

            <div className="mt-14 pt-8 border-t border-[#262626] flex gap-12">
              {hasLive ? (
                <>
                  {products !== null && products > 0 && (
                    <div>
                      <div className="font-mono text-[28px] font-semibold tracking-tight">{products}</div>
                      <div className="hv-label mt-1">Products live</div>
                    </div>
                  )}
                  {suppliers !== null && suppliers > 0 && (
                    <div>
                      <div className="font-mono text-[28px] font-semibold tracking-tight">{suppliers}</div>
                      <div className="hv-label mt-1">Suppliers live</div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[13px] text-[#737373] max-w-[46ch] leading-relaxed">
                  Early access. The catalog grows as verified suppliers list inventory. No inflated numbers.
                </p>
              )}
            </div>
          </div>

          <HovinDevice />
        </div>
      </section>

      {/* FOUR PILLARS */}
      <section className="border-t border-[#262626]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-20 md:py-28">
          <h2 className="text-[32px] md:text-[44px] font-semibold tracking-[-0.04em] leading-[1.05] max-w-[20ch]">
            Four pillars. One transaction rail.
          </h2>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#262626] border border-[#262626]">
            {[
              { n: "01", t: "Hotels buy", d: "Compare fixed prices across vetted suppliers. Par-level alerts and consumption forecasts do the reordering for you." },
              { n: "02", t: "Suppliers sell", d: "List inventory at fixed prices. Reach hotel groups no sales team could cold-call. Get paid in 48 hours." },
              { n: "03", t: "Logistics delivers", d: "Shared-route fulfillment across Cairo, Giza and the coast. One truck, five hotels, POD-verified drops." },
              { n: "04", t: "Factoring pays", d: "Non-recourse liquidity against ETA-validated invoices. Suppliers funded in days, hotels settle at net-60." },
            ].map((p) => (
              <div key={p.n} className="bg-[#0A0A0A] p-8 hover:bg-[#111111] transition-colors duration-150">
                <div className="font-mono text-[13px] text-[#FF3D00] tracking-wider">{p.n}</div>
                <div className="mt-4 text-[18px] font-semibold tracking-[-0.02em]">{p.t}</div>
                <p className="mt-3 text-[13.5px] leading-[1.65] text-[#A3A3A3]">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENTIC INTELLIGENCE */}
      <section className="border-t border-[#262626] bg-[#0F0F0F]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-20 md:py-28 grid md:grid-cols-[5fr_7fr] gap-12 items-center">
          <div>
            <h2 className="text-[32px] md:text-[44px] font-semibold tracking-[-0.04em] leading-[1.05]">
              The brain that<br />orders before<br /><span className="text-[#FF3D00]">you run out.</span>
            </h2>
          </div>
          <div className="space-y-px bg-[#262626] border border-[#262626]">
            {[
              ["Reorder alerts", "Stock vs. par level, adjusted for occupancy and season. Critical items surface before the shelf empties."],
              ["Buy-ahead watch", "Price drops on long-shelf-life items flagged as stocking opportunities, with the math shown."],
              ["Supplier ranking", "On-time percent, fill rate, price index from your real receiving history. Grades you can negotiate with."],
              ["Cost-mix advisor", "For F&B directors: the cheapest compliant mix across suppliers, surfaced to your dashboard."],
            ].map(([t, d]) => (
              <div key={t} className="bg-[#0F0F0F] px-8 py-6 flex flex-col sm:flex-row gap-2 sm:gap-6 items-baseline">
                <span className="text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap">{t}</span>
                <span className="text-[13.5px] leading-[1.6] text-[#A3A3A3]">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ERP INTEGRATION */}
      <section className="border-t border-[#262626]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-20 md:py-28">
          <div className="grid md:grid-cols-[7fr_5fr] gap-12 items-center">
            <div>
              <h2 className="text-[32px] md:text-[44px] font-semibold tracking-[-0.04em] leading-[1.05] max-w-[18ch]">
                Plugs into the systems you already run.
              </h2>
              <p className="mt-6 text-[15px] leading-[1.65] text-[#A3A3A3] max-w-[56ch]">
                REST APIs and webhooks sync orders, invoices, and inventory with SAP, Oracle,
                Opera PMS, and local ERP stacks. ETA e-invoicing submits in real time with
                signed UUIDs and a dead-letter queue for retries.
              </p>
              <div className="mt-8">
                <Link href="/erp-integrations" className="hv-link">Integration docs</Link>
              </div>
            </div>
            <div className="border border-[#262626] p-8 font-mono text-[12.5px] leading-[2] text-[#A3A3A3]">
              <div><span className="text-[#FF3D00]">POST</span> /api/v1/orders</div>
              <div><span className="text-[#FF3D00]">POST</span> /api/v1/invoices/submit_eta</div>
              <div><span className="text-[#FF3D00]">GET</span> /api/v1/procurement/insights</div>
              <div><span className="text-[#FF3D00]">POST</span> /api/webhooks/inventory/[provider]</div>
              <div className="pt-3 mt-3 border-t border-[#262626] text-[#737373]">Idempotent. Tenant-scoped. Audit-logged.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="border-t border-[#262626] bg-[#0F0F0F]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-20 md:py-28">
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-12">
            <h2 className="text-[32px] md:text-[44px] font-semibold tracking-[-0.04em]">Transaction fees</h2>
            <span className="hv-label">Per completed order</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-px bg-[#262626] border border-[#262626]">
            {[
              { t: "Starter", v: "2.5%", d: "For hotels starting platform procurement" },
              { t: "Professional", v: "2.0%", d: "Most popular. Full governance suite included", featured: true },
              { t: "Enterprise", v: "1.5%", d: "Volume pricing for hotel groups" },
            ].map((p) => (
              <div key={p.t} className={`bg-[#0F0F0F] p-8 relative ${p.featured ? "border-t-2 border-[#FF3D00]" : ""}`}>
                {p.featured && (
                  <span className="absolute -top-3 left-8 bg-[#FF3D00] text-[#0A0A0A] text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1">
                    Popular
                  </span>
                )}
                <div className="hv-label">{p.t}</div>
                <div className="mt-4 font-mono text-[40px] font-semibold tracking-tight">{p.v}</div>
                <p className="mt-2 text-[13px] text-[#A3A3A3] leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[12px] text-[#737373]">
            Fees are deducted before partner settlement. Always. Approved structure, no surprises.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-[#262626]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-24 md:py-36 text-center">
          <h2 className="text-[40px] md:text-[64px] font-semibold tracking-[-0.05em] leading-[1.02]">
            Move with the technology,<br />
            <span className="text-[#FF3D00]">or get left behind by the gap.</span>
          </h2>
          <p className="mt-8 text-[15px] text-[#A3A3A3] max-w-[52ch] mx-auto leading-relaxed">
            Egyptian hospitality is a $21.5B market growing at 7% a year.
            The procurement layer that runs it is being built now.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <Link href="/register" className="hv-link">Create your account</Link>
            <Link href="/marketplace" className="hv-btn-outline">Browse marketplace</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
