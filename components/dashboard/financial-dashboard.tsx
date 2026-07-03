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

function StatusTag({ status }: { status: LedgerRow["status"] }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    paid: { bg: "#e6f9ed", text: "#0a7d2b" },
    pending: { bg: "#fff7e0", text: "#a16200" },
    invoiced: { bg: "#ededff", text: "#4338ca" },
    delivered: { bg: "#e0f2fe", text: "#0369a1" },
    overdue: { bg: "#fde8eb", text: "#b0102a" },
  };
  const c = colorMap[status] || colorMap.pending;
  return (
    <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", padding: "3px 8px", borderRadius: 4, backgroundColor: c.bg, color: c.text }}>
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
          <div key={kpi.label} style={{ backgroundColor: "#fff", border: "1px solid #e3e8ee", borderRadius: 8, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8898aa" }}>{kpi.label}</span>
              <span style={{ color: "#635bff" }}>{kpi.icon}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#1a1f36", marginBottom: 8 }}>{kpi.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {kpi.trend === "up" ? <TrendingUp size={14} style={{ color: "#00d924" }} /> : <TrendingDown size={14} style={{ color: "#df1b41" }} />}
              <span style={{ fontSize: 12, fontWeight: 500, color: kpi.trend === "up" ? "#00d924" : "#df1b41" }}>{kpi.change}</span>
              <span style={{ fontSize: 12, color: "#8898aa" }}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Ledger Table */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #e3e8ee", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e3e8ee" }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1a1f36", margin: 0 }}>Transactions Ledger</h2>
            <p style={{ fontSize: 12, color: "#8898aa", margin: "4px 0 0 0" }}>{filtered.length} transactions</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: 13, padding: "8px 12px", border: "1px solid #e3e8ee", borderRadius: 6, outline: "none", width: 220, color: "#1a1f36", backgroundColor: "#f7f8fa" }}
            />
            <button style={{ fontSize: 13, fontWeight: 500, padding: "8px 16px", backgroundColor: "#635bff", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              New Invoice <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ backgroundColor: "#f7f8fa" }}>
              {["Invoice", "Hotel", "Supplier", "Amount", "Status", "Date", "Risk"].map((h, i) => (
                <th key={h} style={{ padding: "12px 20px", textAlign: i === 3 ? "right" : i === 4 || i === 6 ? "center" : "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#525f7f", borderBottom: "1px solid #e3e8ee" }}>
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid #e3e8ee", backgroundColor: "#f7f8fa" }}>
          <span style={{ fontSize: 12, color: "#8898aa" }}>Showing {start + 1}-{Math.min(start + pageSize, filtered.length)} of {filtered.length}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ fontSize: 12, padding: "6px 12px", border: "1px solid #e3e8ee", borderRadius: 6, backgroundColor: page === 1 ? "#f7f8fa" : "#fff", color: page === 1 ? "#c1c9d2" : "#1a1f36", cursor: page === 1 ? "not-allowed" : "pointer" }}>Previous</button>
            <button onClick={() => setPage((p) => p + 1)} disabled={start + pageSize >= filtered.length} style={{ fontSize: 12, padding: "6px 12px", border: "1px solid #e3e8ee", borderRadius: 6, backgroundColor: start + pageSize >= filtered.length ? "#f7f8fa" : "#fff", color: start + pageSize >= filtered.length ? "#c1c9d2" : "#1a1f36", cursor: start + pageSize >= filtered.length ? "not-allowed" : "pointer" }}>Next</button>
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
      <tr onClick={() => setExpanded(!expanded)} style={{ cursor: "pointer", borderBottom: "1px solid #f0f2f5" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9ff")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
        <td style={{ padding: "14px 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#635bff", fontWeight: 500 }}>{row.invoiceId}</td>
        <td style={{ padding: "14px 20px", color: "#1a1f36" }}>{row.hotel}</td>
        <td style={{ padding: "14px 20px", color: "#525f7f" }}>{row.supplier}</td>
        <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 600, color: "#1a1f36" }}>{row.amount.toLocaleString("en-EG")} {row.currency}</td>
        <td style={{ padding: "14px 20px", textAlign: "center" }}><StatusTag status={row.status} /></td>
        <td style={{ padding: "14px 20px", color: "#525f7f" }}>{row.date}</td>
        <td style={{ padding: "14px 20px", textAlign: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: row.riskScore >= 80 ? "#00d924" : row.riskScore >= 60 ? "#ff9b00" : "#df1b41" }}>{row.riskScore}</span>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} style={{ padding: 20, backgroundColor: "#f8f9ff", borderBottom: "1px solid #e3e8ee" }}>
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
    <div style={{ padding: "14px 16px", backgroundColor: "#fff", border: "1px solid #e3e8ee", borderRadius: 6 }}>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8898aa", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1f36", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#8898aa" }}>{sublabel}</div>
    </div>
  );
}
