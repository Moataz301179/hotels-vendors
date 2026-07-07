"use client";

import { useState } from "react";
import { egp } from "@/lib/utils";
import { computeEtaSavings, ETA_PRICING, type EtaTier, COMPETITOR_RATE_BPS } from "@/lib/eta-pricing";
import { Badge } from "@/components/ui";
import { Calculator, TrendingDown, Check, Sparkles } from "lucide-react";

const tiers: { id: EtaTier; title: string; price: string }[] = [
  { id: "bundled", title: "Bundled", price: "Free" },
  { id: "saas", title: "Flat SaaS", price: "EGP 299/mo" },
  { id: "payg", title: "Pay-as-you-go", price: "EGP 5 / invoice" },
];

export function EtaCalculator() {
  const [avgValueEgp, setAvgValueEgp] = useState(15000); // EGP
  const [volume, setVolume] = useState(400);
  const [tier, setTier] = useState<EtaTier>("saas");

  const s = computeEtaSavings(avgValueEgp * 100, volume, tier);

  return (
    <div className="rounded-3xl border border-border bg-bg-1 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border p-5">
        <Calculator className="h-4.5 w-4.5 text-lime" />
        <h3 className="font-semibold">ETA savings calculator</h3>
        <Badge tone="lime" className="ml-auto">vs market 1.25%</Badge>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label className="flex justify-between text-sm font-medium">
              <span>Average invoice value</span>
              <span className="text-lime">{egp(avgValueEgp * 100, { compact: true })}</span>
            </label>
            <input type="range" min={500} max={500000} step={500} value={avgValueEgp} onChange={(e) => setAvgValueEgp(Number(e.target.value))} className="mt-2 w-full accent-[var(--lime)]" />
          </div>
          <div>
            <label className="flex justify-between text-sm font-medium">
              <span>Invoices per month</span>
              <span className="text-lime">{volume.toLocaleString()}</span>
            </label>
            <input type="range" min={10} max={5000} step={10} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="mt-2 w-full accent-[var(--lime)]" />
          </div>
          <div>
            <label className="text-sm font-medium">HotelsVendors plan</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {tiers.map((t) => (
                <button key={t.id} onClick={() => setTier(t.id)} className={`rounded-xl border p-3 text-left transition ${tier === t.id ? "border-lime bg-lime-dim" : "border-border-2 hover:border-border-3"}`}>
                  <div className="text-xs font-semibold">{t.title}</div>
                  <div className="mt-0.5 text-[11px] text-fg-3">{t.price}</div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-fg-4">{ETA_PRICING[tier].note}</p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-bg p-4">
              <div className="text-xs text-fg-4">Market cost (1.25%)</div>
              <div className="mt-1 text-lg font-semibold text-red line-through decoration-red/40">{egp(s.competitorMonthlyCost, { compact: true })}<span className="text-xs font-normal">/mo</span></div>
            </div>
            <div className="rounded-2xl border border-lime/30 bg-lime-dim p-4">
              <div className="text-xs text-fg-4">HotelsVendors</div>
              <div className="mt-1 text-lg font-semibold text-lime">{egp(s.ourMonthlyCost, { compact: true })}<span className="text-xs font-normal">/mo</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-bg p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-fg-4"><TrendingDown className="h-3.5 w-3.5 text-lime" /> You save</div>
            <div className="mt-1 text-3xl font-semibold text-lime">{egp(s.annualSaving, { compact: true })}<span className="text-sm font-normal text-fg-3">/yr</span></div>
            <div className="mt-1 text-xs text-fg-3">{s.savingPct}% cheaper · our effective rate ≈ {s.ourEffectiveBps / 100}% of value</div>
          </div>

          <div className="rounded-2xl border border-border bg-bg p-4 space-y-2">
            {[
              "Priced per-invoice or flat — never a % of value",
              "Auto-generated from your INVO orders (zero extra work)",
              "ETA UUID, QR & audit trail included on every order",
            ].map((x) => (
              <div key={x} className="flex items-start gap-2 text-xs text-fg-2"><Check className="h-3.5 w-3.5 text-lime mt-0.5 shrink-0" />{x}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
