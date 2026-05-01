"use client";

import { useState, useEffect } from "react";
import { Calculator, CheckCircle2, AlertCircle, Download } from "lucide-react";

interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  sourceType: string;
  sourceId: string;
  description: string;
  lines: string;
  totalDebit: number;
  totalCredit: number;
  status: string;
  hotel?: { name: string };
}

export default function AccountingPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/accounting")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setEntries(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalPosted = entries.filter((e) => e.status === "POSTED").reduce((s, e) => s + e.totalDebit, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-xs text-foreground-muted">
        <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading ledger...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Accounting Ledger</h1>
          <p className="text-[11px] text-foreground-muted">Auto-posted entries from orders & invoices</p>
        </div>
        <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md border border-border-subtle hover:border-brand-500/50 transition-colors">
          <Download className="w-3 h-3" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: "Posted Entries", value: entries.filter((e) => e.status === "POSTED").length, icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> },
          { label: "Draft", value: entries.filter((e) => e.status === "DRAFT").length, icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> },
          { label: "Total Value", value: `EGP ${totalPosted.toLocaleString()}`, icon: <Calculator className="w-3.5 h-3.5 text-blue-400" /> },
          { label: "Reversed", value: entries.filter((e) => e.status === "REVERSED").length, icon: <AlertCircle className="w-3.5 h-3.5 text-red-400" /> },
        ].map((k) => (
          <div key={k.label} className="rounded-md border border-border-subtle bg-surface p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] uppercase tracking-wider text-foreground-muted font-medium">{k.label}</span>
              {k.icon}
            </div>
            <div className="text-sm font-semibold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border-subtle text-foreground-muted bg-surface-raised/50">
              <th className="text-left px-3 py-1.5 font-medium">Entry #</th>
              <th className="text-left px-3 py-1.5 font-medium">Date</th>
              <th className="text-left px-3 py-1.5 font-medium">Type</th>
              <th className="text-left px-3 py-1.5 font-medium">Description</th>
              <th className="text-left px-3 py-1.5 font-medium">Debit</th>
              <th className="text-left px-3 py-1.5 font-medium">Credit</th>
              <th className="text-right px-3 py-1.5 font-medium">Amount</th>
              <th className="text-left px-3 py-1.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-foreground-muted">No accounting entries yet. Entries are auto-generated when orders are approved and invoices are paid.</td>
              </tr>
            ) : (
              entries.map((e) => {
                let lines: { accountCode: string; accountName: string; debit: number; credit: number }[] = [];
                try { lines = JSON.parse(e.lines); } catch {}
                const debitLine = lines.find((l) => l.debit > 0);
                const creditLine = lines.find((l) => l.credit > 0);
                return (
                  <tr key={e.id} className="border-b border-border-subtle/40 hover:bg-surface-raised/40 transition-colors">
                    <td className="px-3 py-1.5 font-mono">{e.entryNumber}</td>
                    <td className="px-3 py-1.5 text-foreground-muted">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="px-3 py-1.5">
                      <span className="text-[9px] px-1.5 py-[1px] rounded-full bg-surface border border-border-subtle">{e.sourceType}</span>
                    </td>
                    <td className="px-3 py-1.5">{e.description}</td>
                    <td className="px-3 py-1.5 text-foreground-muted">{debitLine?.accountCode} {debitLine?.accountName}</td>
                    <td className="px-3 py-1.5 text-foreground-muted">{creditLine?.accountCode} {creditLine?.accountName}</td>
                    <td className="px-3 py-1.5 text-right font-mono">EGP {e.totalDebit.toLocaleString()}</td>
                    <td className="px-3 py-1.5">
                      <span className={`text-[9px] px-1.5 py-[1px] rounded-full ${e.status === "POSTED" ? "bg-emerald-500/10 text-emerald-400" : e.status === "REVERSED" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>{e.status}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
