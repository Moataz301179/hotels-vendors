"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { egp, pct } from "@/lib/utils";
import { computePgo } from "@/lib/economics";
import { Badge, StatusPill } from "@/components/ui";
import { Loader2, ShieldCheck, Building2, Boxes, Landmark, ArrowRight, CheckCircle2, FileSignature, Handshake, Coins } from "lucide-react";

export type GuaranteeRow = {
  id: number;
  reference: string;
  instrument: string;
  faceValue: number;
  supplierDiscountBps: number | null;
  hotelFeeBps: number | null;
  funderSpreadBps: number | null;
  platformMarginBps: number | null;
  termDays: number | null;
  status: string;
  complianceScore: number | null;
  hotelName: string | null;
  supplierName: string | null;
  funderName: string | null;
};

const stepOrder = ["draft", "under_review", "funder_pending", "issued", "claimed", "settled"];
const stepLabels: Record<string, string> = {
  draft: "Requested", under_review: "HV Assurance", funder_pending: "Funder review", issued: "Guarantee issued", claimed: "Supplier paid", settled: "Settled",
};

export function GuaranteesClient({ rows, role }: { rows: GuaranteeRow[]; role: string }) {
  const router = useRouter();
  const [acting, setActing] = useState<number | null>(null);

  async function act(id: number, action: string) {
    setActing(id);
    await fetch("/api/guarantees", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setActing(null);
    router.refresh();
  }

  function nextAction(g: GuaranteeRow): { label: string; action: string } | null {
    if (role === "platform" && g.status === "under_review") return { label: "Pass assurance review", action: "review" };
    if (role === "hotel" && g.status === "under_review") return { label: "Pass assurance (demo)", action: "review" };
    if (role === "funder" && g.status === "funder_pending") return { label: "Issue guarantee", action: "issue" };
    if (role === "hotel" && g.status === "funder_pending") return { label: "Issue (demo funder)", action: "issue" };
    if (role === "supplier" && g.status === "issued") return { label: "Ship & claim payment", action: "claim" };
    if (role === "hotel" && g.status === "issued") return { label: "Confirm GRN & release (demo)", action: "claim" };
    if (role === "hotel" && g.status === "claimed") return { label: "Settle at term end", action: "settle" };
    return null;
  }

  return (
    <div className="space-y-4">
      {rows.length === 0 && (
        <div className="rounded-3xl border border-border bg-bg-1 p-10 text-center text-fg-3">
          No payment guarantees yet. They are created from the marketplace checkout when a hotel selects a guaranteed term.
        </div>
      )}
      {rows.map((g) => {
        const pgo = computePgo({
          faceValue: g.faceValue,
          termDays: g.termDays ?? 60,
          supplierDiscountBps: g.supplierDiscountBps ?? 300,
          hotelFeeBps: g.hotelFeeBps ?? 150,
          funderSpreadBps: g.funderSpreadBps ?? 1800,
          platformMarginBps: g.platformMarginBps ?? 120,
        });
        const stepIdx = stepOrder.indexOf(g.status);
        const na = nextAction(g);

        return (
          <div key={g.id} className="rounded-3xl border border-border bg-bg-1 overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FileSignature className="h-4 w-4 text-gold" />
                  <span className="font-semibold">{g.reference}</span>
                  <Badge tone="gold">{g.instrument}</Badge>
                  <StatusPill status={g.status} />
                </div>
                <p className="mt-1 text-xs text-fg-3">
                  {g.hotelName} → {g.supplierName} {g.funderName ? `· funded by ${g.funderName}` : "· awaiting funder"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">{egp(g.faceValue)}</div>
                <div className="text-xs text-fg-4">Net-{g.termDays} · assurance {g.complianceScore ?? 0}/100</div>
              </div>
            </div>

            {/* Lifecycle stepper */}
            <div className="flex items-center gap-1 overflow-x-auto px-5 py-4 border-b border-border">
              {stepOrder.map((s, i) => {
                const done = stepIdx >= i;
                const current = stepIdx === i;
                return (
                  <div key={s} className="flex items-center shrink-0">
                    <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${current ? "bg-lime text-bg" : done ? "bg-lime-dim text-lime" : "bg-bg-2 text-fg-4"}`}>
                      {done && !current ? <CheckCircle2 className="h-3 w-3" /> : <span className={`h-1.5 w-1.5 rounded-full ${current ? "bg-bg" : "bg-fg-4"}`} />}
                      {stepLabels[s]}
                    </div>
                    {i < stepOrder.length - 1 && <ArrowRight className="h-3 w-3 mx-0.5 text-fg-4" />}
                  </div>
                );
              })}
            </div>

            {/* Win-win economics grid */}
            <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-bg-1 p-4">
                <div className="flex items-center gap-1.5 text-xs text-fg-4"><Boxes className="h-3.5 w-3.5 text-lime" /> Supplier gets</div>
                <div className="mt-1.5 text-lg font-semibold text-green">{egp(pgo.supplierEarlyPay, { compact: true })}</div>
                <div className="text-[11px] text-fg-4">now, not in {g.termDays}d · discount {pct(g.supplierDiscountBps ?? 0)}</div>
              </div>
              <div className="bg-bg-1 p-4">
                <div className="flex items-center gap-1.5 text-xs text-fg-4"><Building2 className="h-3.5 w-3.5 text-lime" /> Hotel repays</div>
                <div className="mt-1.5 text-lg font-semibold">{egp(pgo.hotelRepayment, { compact: true })}</div>
                <div className="text-[11px] text-fg-4">at Net-{g.termDays} · {pgo.effectiveAprPct}% eff. APR</div>
              </div>
              <div className="bg-bg-1 p-4">
                <div className="flex items-center gap-1.5 text-xs text-fg-4"><Landmark className="h-3.5 w-3.5 text-gold" /> Funder yield</div>
                <div className="mt-1.5 text-lg font-semibold text-gold">{egp(pgo.funderYield, { compact: true })}</div>
                <div className="text-[11px] text-fg-4">on {egp(pgo.funderDeployed, { compact: true })} · {pct(g.funderSpreadBps ?? 0)} APR</div>
              </div>
              <div className="bg-bg-1 p-4">
                <div className="flex items-center gap-1.5 text-xs text-fg-4"><Coins className="h-3.5 w-3.5 text-lime" /> HV margin</div>
                <div className="mt-1.5 text-lg font-semibold text-lime">{egp(pgo.platformMargin, { compact: true })}</div>
                <div className="text-[11px] text-fg-4">assurance + orchestration</div>
              </div>
            </div>

            {na && (
              <div className="flex items-center justify-between gap-3 border-t border-border p-4 bg-bg-2/50">
                <span className="flex items-center gap-2 text-xs text-fg-3">
                  <Handshake className="h-4 w-4 text-lime" />
                  {pgo.everyoneWins ? "Win-win verified across all parties" : "Review economics"}
                </span>
                <button onClick={() => act(g.id, na.action)} disabled={acting === g.id} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-lime px-4 text-sm font-semibold text-bg hover:bg-lime-light disabled:opacity-50">
                  {acting === g.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{na.label} <ArrowRight className="h-3.5 w-3.5" /></>}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
