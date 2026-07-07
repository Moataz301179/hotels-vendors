"use client";

import { useState } from "react";
import { egp, shortDate } from "@/lib/utils";
import { StatusPill, Badge } from "@/components/ui";
import { ClipboardCheck, CheckCircle2, AlertTriangle, Upload, Eye, Camera, RefreshCw, X } from "lucide-react";

export type OrderGRNRow = {
  id: number;
  reference: string;
  status: string;
  total: number;
  items: unknown;
  createdAt: Date;
  supplierName: string;
  grnStatus: string | null;
  grnVarianceBps: number | null;
  grnNotes: string | null;
  grnPhotoUrl?: string | null;
};

export function GRNClient({ initialRows }: { initialRows: OrderGRNRow[] }) {
  const [rows, setRows] = useState<OrderGRNRow[]>(initialRows);
  const [active, setActive] = useState<OrderGRNRow | null>(null);
  const [acceptedQty, setAcceptedQty] = useState(10);
  const [orderedQty, setOrderedQty] = useState(10);
  const [notes, setNotes] = useState("");
  const [photoUploaded, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function openAudit(o: OrderGRNRow) {
    setActive(o);
    const itemsList = (o.items ?? []) as { qty?: number }[];
    const firstQty = itemsList[0]?.qty ?? 10;
    setOrderedQty(firstQty);
    setAcceptedQty(firstQty);
    setNotes(o.grnNotes ?? "");
    setPhotoUrl(o.grnPhotoUrl ?? null);
  }

  function simulateUpload() {
    setUploading(true);
    setTimeout(() => {
      setPhotoUrl("https://images.pexels.com/photos/4487363/pexels-photo-4487363.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=400");
      setUploading(false);
    }, 1500);
  }

  function saveGRN() {
    if (!active) return;
    const diff = orderedQty - acceptedQty;
    const varianceBps = Math.round((diff / orderedQty) * 10000);

    const updated = rows.map((r) => {
      if (r.id === active.id) {
        return {
          ...r,
          grnStatus: "fully_received",
          grnVarianceBps: varianceBps,
          grnNotes: notes || "Checked and received on-site.",
          grnPhotoUrl: photoUploaded,
          status: "delivered",
        };
      }
      return r;
    });

    setRows(updated);
    setActive(null);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-bg-1 p-5">
          <div className="text-xs text-fg-4 uppercase tracking-wider">Awaiting GRN Desk</div>
          <div className="mt-1 text-2xl font-semibold text-fg">{rows.filter((r) => r.status === "in_transit").length} in queue</div>
        </div>
        <div className="rounded-2xl border border-border bg-bg-1 p-5">
          <div className="text-xs text-fg-4 uppercase tracking-wider">Accepted quality ceiling</div>
          <div className="mt-1 text-2xl font-semibold text-fg">&le; 2.50% variance</div>
        </div>
        <div className="rounded-2xl border border-border bg-bg-1 p-5">
          <div className="text-xs text-fg-4 uppercase tracking-wider">Release trigger</div>
          <div className="mt-1 text-2xl font-semibold text-fg">Three-Way Matching</div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-bg-1 overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold text-fg">Receiving dock queue</h2>
          <p className="text-xs text-fg-3 mt-1">Select any active or incoming delivery to inspect, calculate variances, upload photographic evidence, and approve GRN.</p>
        </div>
        <div className="divide-y divide-border">
          {rows.map((o) => {
            const hasGrn = o.grnStatus && o.grnStatus !== "not_received";
            const variance = hasGrn ? `${((o.grnVarianceBps ?? 0) / 100).toFixed(2)}%` : "Pending audit";
            return (
              <div key={o.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_130px_130px_170px] lg:items-center hover:bg-bg-2 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-fg">{o.reference}</span>
                    <StatusPill status={o.status} />
                  </div>
                  <div className="mt-1 text-xs text-fg-3">
                    Supplier: {o.supplierName} · Ordered on {shortDate(o.createdAt)} · {egp(o.total, { compact: true })}
                  </div>
                </div>
                <Badge tone={hasGrn ? "success" : "warning"}>
                  {hasGrn ? "GRN Approved" : "Awaiting Audit"}
                </Badge>
                <div className="text-xs text-fg-3">
                  Variance: <span className="font-semibold text-fg">{variance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAudit(o)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-lime px-3 text-xs font-semibold text-bg transition hover:bg-lime-light"
                  >
                    <Camera className="h-3.5 w-3.5" /> Inspect Dock
                  </button>
                </div>
              </div>
            );
          })}
          {rows.length === 0 && (
            <div className="p-8 text-center text-fg-4">
              <ClipboardCheck className="mx-auto mb-3 h-8 w-8 animate-pulse text-fg-4" />
              No GRN queue records found.
            </div>
          )}
        </div>
      </div>

      {/* Inspect Drawer */}
      {active && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setActive(null)} />
          <div className="relative h-full w-full max-w-md overflow-y-auto border-l border-border bg-bg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-fg">Dock Quality Audit: {active.reference}</h2>
              <button onClick={() => setActive(null)} className="grid h-9 w-9 place-items-center rounded-xl border border-border-2"><X className="h-4 w-4" /></button>
            </div>

            <div className="rounded-2xl border border-border bg-bg-1 p-4 text-xs text-fg-3">
              Weigh, count and scan arrivals. Discrepancies generate a variance report that must fall within funder parameters before automatic payout release.
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-fg">Discrepancy calculator</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-fg-4 uppercase">Ordered Quantity</label>
                  <input
                    type="number"
                    disabled
                    value={orderedQty}
                    className="mt-1 h-10 w-full rounded-lg border border-border bg-bg-2 px-3 text-sm text-fg-4 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs text-fg-4 uppercase">Accepted Quantity</label>
                  <input
                    type="number"
                    value={acceptedQty}
                    onChange={(e) => setAcceptedQty(Math.max(0, Number(e.target.value)))}
                    className="mt-1 h-10 w-full rounded-lg border border-border bg-bg px-3 text-sm text-fg outline-none focus:border-lime"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs bg-bg-1 p-3 rounded-xl border border-border">
                <span className="text-fg-3">Calculated Variance:</span>
                <span className={`font-semibold ${orderedQty - acceptedQty > 0 ? "text-yellow" : "text-green"}`}>
                  {(((orderedQty - acceptedQty) / orderedQty) * 100).toFixed(2)}% Discrepancy
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-fg">Photo Evidence Capture</label>
              <div className="rounded-2xl border border-dashed border-border bg-bg-1 p-6 text-center">
                {photoUploaded ? (
                  <div className="space-y-3">
                    <img src={photoUploaded} alt="Captured evidence" className="mx-auto rounded-xl max-h-32 object-cover" />
                    <button
                      onClick={() => setPhotoUrl(null)}
                      className="inline-flex items-center gap-1.5 text-xs text-red hover:underline"
                    >
                      Remove photo
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={simulateUpload}
                    disabled={uploading}
                    className="inline-flex flex-col items-center gap-2 text-xs text-fg-3 hover:text-fg"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="h-6 w-6 animate-spin text-lime" />
                        <span>Processing image tags...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-lime" />
                        <span>Simulate photographic capture</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-fg">Auditor inspection notes</label>
              <textarea
                placeholder="Describe quality state, temperature logs, or package condition..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-20 rounded-xl border border-border bg-bg p-3 text-sm outline-none focus:border-lime"
              />
            </div>

            <button
              onClick={saveGRN}
              className="h-11 w-full rounded-xl bg-lime font-semibold text-bg text-sm transition hover:bg-lime-light flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" /> Save Inspection &amp; Lock Evidence
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
