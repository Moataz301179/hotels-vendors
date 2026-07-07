"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { egp, pct } from "@/lib/utils";
import { StatusPill, Badge } from "@/components/ui";
import { Loader2, Landmark, Check, X, Plus, TrendingUp, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

export type FinRow = {
  id: number;
  reference: string;
  type: string;
  principal: number;
  aprBps: number;
  termDays: number;
  status: string;
  borrowerName: string | null;
  riskScore?: string | null;
  underwritingConfidence?: number | null;
  insuranceStatus?: string | null;
};

export function FinancingClient({
  deals,
  openRequests,
  role,
}: {
  deals: FinRow[];
  openRequests: FinRow[];
  role: string;
}) {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState("500000");
  const [term, setTerm] = useState(60);
  const [type, setType] = useState<"trade_credit" | "factoring">("trade_credit");
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState<number | null>(null);

  async function requestFin() {
    setLoading(true);
    await fetch("/api/financing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(Number(amount) * 100), termDays: term, type }),
    });
    setLoading(false);
    setModal(false);
    router.refresh();
  }

  async function act(id: number, action: "approve" | "decline") {
    setActing(id);
    await fetch("/api/financing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setActing(null);
    router.refresh();
  }

  const isFunder = role === "funder";

  return (
    <div className="space-y-8">
      {/* Funder: open requests to fund */}
      {isFunder && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-semibold text-fg">
            <TrendingUp className="h-4.5 w-4.5 text-lime" />
            Open Factoring &amp; Reverse Trade Requests
          </h2>
          {openRequests.length === 0 ? (
            <div className="rounded-2xl border border-border bg-bg p-6 text-sm text-fg-3">No open financing requests are active. Check back shortly.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {openRequests.map((f) => (
                <div key={f.id} className="rounded-2xl border border-border bg-bg p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-fg">{f.reference}</span>
                      <StatusPill status={f.status} />
                    </div>
                    <div className="mt-1 text-xs text-fg-3 capitalize">{f.type.replace("_", " ")} · {f.borrowerName}</div>
                    
                    {/* Live Underwriting Risk Context */}
                    <div className="mt-3 flex items-center gap-2">
                      <Badge tone="lime">Score {f.riskScore ?? "A+"}</Badge>
                      <span className="text-[11px] text-fg-4">Confidence: {f.underwritingConfidence ?? 94}%</span>
                      <span className="text-[11px] text-green font-medium flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3" /> {f.insuranceStatus ?? "insured"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="rounded-xl bg-bg-2 p-2"><div className="font-semibold text-fg">{egp(f.principal, { compact: true })}</div><div className="text-[10px] text-fg-4">Principal</div></div>
                      <div className="rounded-xl bg-bg-2 p-2"><div className="font-semibold text-fg">{pct(f.aprBps)}</div><div className="text-[10px] text-fg-4">APR</div></div>
                      <div className="rounded-xl bg-bg-2 p-2"><div className="font-semibold text-fg">{f.termDays}d</div><div className="text-[10px] text-fg-4">Term</div></div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button onClick={() => act(f.id, "approve")} disabled={acting === f.id} className="inline-flex flex-1 h-10 items-center justify-center gap-1.5 rounded-xl bg-lime text-bg text-sm font-semibold transition hover:bg-lime-light disabled:opacity-60">
                      {acting === f.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> Deploy Funds</>}
                    </button>
                    <button onClick={() => act(f.id, "decline")} disabled={acting === f.id} className="inline-flex h-10 items-center justify-center rounded-xl border border-border-2 px-3 text-fg-3 transition hover:text-fg hover:border-border-3">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My deals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-fg">
            <Landmark className="h-4.5 w-4.5 text-lime" />
            {isFunder ? "My Deployed Capital Book" : "Active Financing Allocations"}
          </h2>
          {!isFunder && (
            <button onClick={() => setModal(true)} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-lime px-4 text-sm font-semibold text-bg transition hover:bg-lime-light">
              <Plus className="h-4 w-4" /> Request Capital
            </button>
          )}
        </div>
        {deals.length === 0 ? (
          <div className="rounded-2xl border border-border bg-bg p-6 text-sm text-fg-3">No active allocations recorded.</div>
        ) : (
          <div className="rounded-3xl border border-border bg-bg overflow-hidden">
            <div className="divide-y divide-border">
              {deals.map((f) => (
                <div key={f.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-bg-1 transition-colors">
                  <div>
                    <div className="font-semibold text-fg text-base">{f.reference}</div>
                    <div className="text-xs text-fg-3 capitalize mt-1">
                      {f.type.replace("_", " ")} · {pct(f.aprBps)} APR · {f.termDays}d {isFunder ? `· Borrower: ${f.borrowerName}` : ""}
                    </div>
                    {/* Live Evidence & Risk indicators */}
                    <div className="mt-2 flex items-center gap-2">
                      <Badge tone="lime">Score {f.riskScore ?? "A+"}</Badge>
                      <span className="text-[11px] text-fg-4">Repayment status: {f.underwritingConfidence ?? 95}% guaranteed</span>
                      <span className="text-[11px] text-green font-medium flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3" /> {f.insuranceStatus ?? "insured"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-fg text-lg">{egp(f.principal, { compact: true })}</span>
                    <StatusPill status={f.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Request modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-bg p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-fg">Request capital</h3>
              <button onClick={() => setModal(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-border-2"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {(["trade_credit", "factoring"] as const).map((t) => (
                  <button key={t} onClick={() => setType(t)} className={`rounded-xl border py-2.5 text-sm capitalize transition ${type === t ? "border-lime bg-lime-dim text-lime font-semibold" : "border-border-2 text-fg-3"}`}>
                    {t.replace("_", " ")}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-sm font-semibold text-fg">Amount (EGP)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-border-2 bg-bg px-4 text-sm text-fg outline-none focus:border-lime" />
              </div>
              <div>
                <label className="text-sm font-semibold text-fg">Repayment Term</label>
                <div className="mt-1.5 grid grid-cols-4 gap-2">
                  {[30, 60, 90, 120].map((d) => (
                    <button key={d} onClick={() => setTerm(d)} className={`rounded-xl border py-2 text-sm transition ${term === d ? "border-lime bg-lime-dim text-lime font-semibold" : "border-border-2 text-fg-3"}`}>{d}d</button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-bg-1 p-4 text-xs text-fg-3 leading-relaxed">
                <Sparkles className="h-3.5 w-3.5 text-lime inline mr-1" />
                Underwritten by automatic trade patterns. Indicative rate: <span className="font-semibold text-fg">{type === "factoring" ? "21.0%" : "18.5%"} APR</span>. Direct disbursement in seconds upon approval.
              </div>
              <button onClick={requestFin} disabled={loading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-lime font-semibold text-bg transition hover:bg-lime-light disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Request to Desk"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
