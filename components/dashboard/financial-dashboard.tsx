"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Activity, ShieldCheck, ArrowRight } from "lucide-react";

interface KPIData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

interface LedgerRow {
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

const accent = "#FF6B00";
const surface = "#0A0F1B";
const surfaceAlt = "#0E1421";
const border = "rgba(255,255,255,0.06)";
const borderAlt = "rgba(255,255,255,0.04)";
const textPrimary = "#ffffff";
const textSecondary = "rgba(255,255,255,0.50)";
const textMuted = "rgba(255,255,255,0.25)";
const textFaint = "rgba(255,255,255,0.35)";

const kpis: KPIData[] = [
  { label: "Available Capital", value: "EGP 2,450,000", change: "+12.4%", trend: "up", icon: <DollarSign size={20} /> },
  { label: "Utilized Credit", value: "EGP 1,820,000", change: "+8.2%", trend: "up", icon: <Activity size={20} /> },
  { label: "Real-time Risk Score", value: "82/100", change: "-3 pts", trend: "down", icon: <ShieldCheck size={20} /> },
  { label: "Settlement Rate", value: "94.2%", change: "+1.1%", trend: "up", icon: <TrendingUp size={20} /> },
];

const ledgerData: LedgerRow[] = [
  { id: "1", invoiceId: "INV-2026-00142", hotel: "Stella Di Mare Resort", supplier: "Nile Fresh Foods", amount: 45200, currency: "EGP", status: "paid", date: "2026-06-08", taxStamp: "ETA-UUID: a3f8c2d1-0042", ledgerHash: "0x7f3a...e2b1", riskScore: 92 },
  { id: "2", invoiceId: "INV-2026-00141", hotel: "Jaz Aquamarine", supplier: "Pyramid Linens", amount: 28700, currency: "EGP", status: "pending", date: "2026-06-07", taxStamp: "ETA-UUID: b4e9d3e2-0041", ledgerHash: "0x8a4b...f3c2", riskScore: 78 },
  { id: "3", invoiceId: "INV-2026-00140", hotel: "Sunrise Palace", supplier: "Red Sea Amenities", amount: 61500, currency: "EGP", status: "invoiced", date: "2026-06-06", taxStamp: "ETA-UUID: c5f0e4f3-0040", ledgerHash: "0x9b5c...g4d3", riskScore: 85 },
  { id: "4", invoiceId: "INV-2026-00139", hotel: "Baron Resort Sharm", supplier: "Cairo Kitchen Pro", amount: 128400, currency: "EGP", status: "delivered", date: "2026-06-05", taxStamp: "ETA-UUID: d6a1f5a4-0039", ledgerHash: "0xac6d...h5e4", riskScore: 91 },
  { id: "5", invoiceId: "INV-2026-00138", hotel: "Hurghada Grand", supplier: "Delta Maintenance", amount: 18900, currency: "EGP", status: "overdue", date: "2026-05-28", taxStamp: "ETA-UUID: e7b2a6b5-0038", ledgerHash: "0xbd7e...i6f5", riskScore: 42 },
];

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  paid: { bg: "rgba(34,197,94,0.10)", text: "#22C55E" },
  pending: { bg: "rgba(234,179,8,0.10)", text: "#EAB308" },
  invoiced: { bg: "rgba(99,91,255,0.10)", text: "#635BFF" },
  delivered: { bg: "rgba(56,189,248,0.10)", text: "#38BDF8" },
  overdue: { bg: "rgba(239,68,68,0.10)", text: "#EF4444" },
};

function StatusTag({ status }: { status: LedgerRow["status"] }) {
  const c = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, backgroundColor: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

export function FinancialDashboard() {
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPI Tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{ backgroundColor: surface, border: `1px solid ${border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: textMuted }}>{kpi.label}</span>
              <span style={{ color: accent }}>{kpi.icon}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: textPrimary, marginBottom: 8 }}>{kpi.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {kpi.trend === "up" ? <TrendingUp size={14} style={{ color: "#22C55E" }} /> : <TrendingDown size={14} style={{ color: "#EF4444" }} />}
              <span style={{ fontSize: 12, fontWeight: 500, color: kpi.trend === "up" ? "#22C55E" : "#EF4444" }}>{kpi.change}</span>
              <span style={{ fontSize: 12, color: textMuted }}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Ledger Table */}
      <div style={{ backgroundColor: surface, border: `1px solid ${border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${border}` }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: textPrimary, margin: 0 }}>Transactions Ledger</h2>
            <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0 0" }}>{filtered.length} transactions</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: 13, padding: "8px 12px", border: `1px solid ${border}`, borderRadius: 6, outline: "none", width: 220, color: textPrimary, backgroundColor: surfaceAlt }}
            />
            <button style={{ fontSize: 13, fontWeight: 500, padding: "8px 16px", backgroundColor: accent, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              New Invoice <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ backgroundColor: surfaceAlt }}>
              {["Invoice", "Hotel", "Supplier", "Amount", "Status", "Date", "Risk"].map((h, i) => (
                <th key={h} style={{ padding: "12px 20px", textAlign: i === 3 ? "right" : i === 4 || i === 6 ? "center" : "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: textFaint, borderBottom: `1px solid ${border}` }}>
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: `1px solid ${border}`, backgroundColor: surfaceAlt }}>
          <span style={{ fontSize: 12, color: textMuted }}>Showing {start + 1}-{Math.min(start + pageSize, filtered.length)} of {filtered.length}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ fontSize: 12, padding: "6px 12px", border: `1px solid ${border}`, borderRadius: 6, backgroundColor: page === 1 ? surfaceAlt : surface, color: page === 1 ? textMuted : textPrimary, cursor: page === 1 ? "not-allowed" : "pointer" }}>Previous</button>
            <button onClick={() => setPage((p) => p + 1)} disabled={start + pageSize >= filtered.length} style={{ fontSize: 12, padding: "6px 12px", border: `1px solid ${border}`, borderRadius: 6, backgroundColor: start + pageSize >= filtered.length ? surfaceAlt : surface, color: start + pageSize >= filtered.length ? textMuted : textPrimary, cursor: start + pageSize >= filtered.length ? "not-allowed" : "pointer" }}>Next</button>
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
      <tr onClick={() => setExpanded(!expanded)} style={{ cursor: "pointer", borderBottom: `1px solid ${borderAlt}` }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
        <td style={{ padding: "14px 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: accent, fontWeight: 500 }}>{row.invoiceId}</td>
        <td style={{ padding: "14px 20px", color: textPrimary }}>{row.hotel}</td>
        <td style={{ padding: "14px 20px", color: textSecondary }}>{row.supplier}</td>
        <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 600, color: textPrimary }}>{row.amount.toLocaleString("en-EG")} {row.currency}</td>
        <td style={{ padding: "14px 20px", textAlign: "center" }}><StatusTag status={row.status} /></td>
        <td style={{ padding: "14px 20px", color: textSecondary }}>{row.date}</td>
        <td style={{ padding: "14px 20px", textAlign: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: row.riskScore >= 80 ? "#22C55E" : row.riskScore >= 60 ? accent : "#EF4444" }}>{row.riskScore}</span>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} style={{ padding: 20, backgroundColor: surfaceAlt, borderBottom: `1px solid ${border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <MetadataCard label="Digital Tax Stamp" value={row.taxStamp} sublabel="ETA UUID validated" />
              <MetadataCard label="Ledger Hash" value={row.ledgerHash} sublabel="SHA-256 cryptographic proof" />
              <MetadataCard label="Transaction Score" value={`${row.riskScore}/100`} sublabel={row.riskScore >= 80 ? "Low risk — approved" : row.riskScore >= 60 ? "Medium risk — monitoring" : "High risk — review required"} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function MetadataCard({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
  return (
    <div style={{ padding: "14px 16px", backgroundColor: surface, border: `1px solid ${border}`, borderRadius: 6 }}>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: textMuted, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: textMuted }}>{sublabel}</div>
    </div>
  );
}
