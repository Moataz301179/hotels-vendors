"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle2, Clock } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  etaStatus: string;
  total: number;
  subtotal: number;
  vatAmount: number;
  issueDate: string;
  hotel?: { name: string };
  supplier?: { name: string };
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/invoices?limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setInvoices(d.data);
      });
  }, []);

  const filtered = invoices.filter(
    (i) =>
      search === "" ||
      i.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      i.hotel?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">Invoices</h1>
        <span className="text-[11px] text-foreground-muted">{filtered.length} invoices</span>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-foreground-muted" />
        <input
          type="text"
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-6 pr-2 py-[3px] text-[11px] rounded-md bg-surface border border-border-subtle focus:border-brand-500/50 focus:outline-none"
        />
      </div>
      <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border-subtle text-foreground-muted bg-surface-raised/50">
              <th className="text-left px-3 py-1.5 font-medium">Invoice #</th>
              <th className="text-left px-3 py-1.5 font-medium">Hotel</th>
              <th className="text-left px-3 py-1.5 font-medium">Supplier</th>
              <th className="text-right px-3 py-1.5 font-medium">Total</th>
              <th className="text-left px-3 py-1.5 font-medium">ETA Status</th>
              <th className="text-left px-3 py-1.5 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id} className="border-b border-border-subtle/40 hover:bg-surface-raised/40 transition-colors">
                <td className="px-3 py-1.5 font-mono">{i.invoiceNumber}</td>
                <td className="px-3 py-1.5">{i.hotel?.name || "—"}</td>
                <td className="px-3 py-1.5">{i.supplier?.name || "—"}</td>
                <td className="px-3 py-1.5 text-right font-mono">EGP {i.total?.toLocaleString()}</td>
                <td className="px-3 py-1.5">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full text-[9px] font-medium ${i.etaStatus === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                    {i.etaStatus === "ACCEPTED" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                    {i.etaStatus}
                  </span>
                </td>
                <td className="px-3 py-1.5 text-foreground-muted">{new Date(i.issueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
