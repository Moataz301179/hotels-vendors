"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Activity, ShieldCheck, ArrowRight } from "lucide-react";

export interface KPIData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

export interface LedgerRow {
  id: string;
  invoiceId: string;
  hotel: string;
  supplier: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "invoiced" | "delivered" | "overdue";
  date: string;
  taxStamp: string;
  ledgerHash: string;
  riskScore: number;
}

const STATUS_STYLES: Record<LedgerRow["status"], { bg: string; text: string }> = {
  paid: { bg: "bg-success/10", text: "text-success" },
  pending: { bg: "bg-warning/10", text: "text-warning" },
  invoiced: { bg: "bg-info/10", text: "text-info" },
  delivered: { bg: "bg-info/10", text: "text-info" },
  overdue: { bg: "bg-error/10", text: "text-error" },
};

function StatusTag({ status }: { status: LedgerRow["status"] }) {
  const c = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`status-pill ${c.bg} ${c.text} border-current/20`}>
      {status}
    </span>
  );
}

export function FinancialDashboard({
  kpis,
  ledgerData,
  onNewInvoice,
}: {
  kpis: KPIData[];
  ledgerData: LedgerRow[];
  onNewInvoice?: () => void;
}) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 5;

  const filtered = ledgerData.filter(
    (row) =>
      row.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.hotel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card-outlined p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="label-upper">{kpi.label}</span>
              <span className="text-accent-base">{kpi.icon}</span>
            </div>
            <div className="metric-value text-2xl text-foreground tracking-tight">{kpi.value}</div>
            <div className="flex items-center gap-1.5 mt-2">
              {kpi.trend === "up" ? (
                <TrendingUp size={12} className="text-success" />
              ) : (
                <TrendingDown size={12} className="text-error" />
              )}
              <span className={`text-xs font-medium ${kpi.trend === "up" ? "text-success" : "text-error"}`}>
                {kpi.change}
              </span>
              <span className="text-xs text-foreground-muted">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card-outlined overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <div>
            <h2 className="text-base font-semibold text-foreground m-0">Transactions Ledger</h2>
            <p className="text-xs text-foreground-muted mt-1">{filtered.length} transactions</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="surface-input w-56 text-sm"
            />
            <button
              onClick={onNewInvoice}
              className="cta-glow inline-flex items-center gap-2 px-4 py-2 bg-accent-base text-accent-text text-sm font-medium rounded-sm hover:bg-accent-light transition-colors"
            >
              New Invoice <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-raised">
              {["Invoice", "Hotel", "Supplier", "Amount", "Status", "Date", "Risk"].map((h, i) => (
                <th
                  key={h}
                  className={`label-upper px-5 py-3 border-b border-border-subtle ${
                    i === 3 ? "text-right" : i === 4 || i === 6 ? "text-center" : "text-left"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <LedgerRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-5 py-3 border-t border-border-subtle bg-surface-raised">
          <span className="text-xs text-foreground-muted">
            Showing {start + 1}–{Math.min(start + pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs border border-border-subtle rounded-sm bg-surface text-foreground-secondary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {totalPages > 1 && (
              <span className="px-3 py-1.5 text-xs text-foreground-muted">
                {page} / {totalPages}
              </span>
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs border border-border-subtle rounded-sm bg-surface text-foreground-secondary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LedgerRow({ row }: { row: LedgerRow }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer border-b border-border-invisible hover:bg-surface-hover transition-colors"
      >
        <td className="px-5 py-3.5 font-mono text-sm text-accent-base font-medium">{row.invoiceId}</td>
        <td className="px-5 py-3.5 text-foreground">{row.hotel}</td>
        <td className="px-5 py-3.5 text-foreground-secondary">{row.supplier}</td>
        <td className="px-5 py-3.5 text-right font-medium text-foreground metric-value">
          {row.amount.toLocaleString("en-EG")} {row.currency}
        </td>
        <td className="px-5 py-3.5 text-center"><StatusTag status={row.status} /></td>
        <td className="px-5 py-3.5 text-foreground-secondary">{row.date}</td>
        <td className="px-5 py-3.5 text-center">
          <span
            className={`text-sm font-semibold ${
              row.riskScore >= 80 ? "text-success" : row.riskScore >= 60 ? "text-accent-base" : "text-error"
            }`}
          >
            {row.riskScore}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} className="px-5 py-5 bg-surface-raised border-b border-border-subtle">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetadataCard label="Digital Tax Stamp" value={row.taxStamp} sublabel="ETA UUID validated" />
              <MetadataCard label="Ledger Hash" value={row.ledgerHash} sublabel="SHA-256 cryptographic proof" />
              <MetadataCard
                label="Transaction Score"
                value={`${row.riskScore}/100`}
                sublabel={row.riskScore >= 80 ? "Low risk — approved" : row.riskScore >= 60 ? "Medium risk — monitoring" : "High risk — review required"}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function MetadataCard({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
  return (
    <div className="p-4 bg-surface border border-border-subtle rounded-sm">
      <div className="label-upper mb-2">{label}</div>
      <div className="text-sm font-medium text-foreground font-mono mb-1 break-all">{value}</div>
      <div className="text-xs text-foreground-muted">{sublabel}</div>
    </div>
  );
}
