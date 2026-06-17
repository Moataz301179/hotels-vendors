"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";

const ACCENT = "#0a1628";

export default function PortalPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [etaStatus, setEtaStatus] = useState("ETA Bridge Connected");
  const [ledgerRows, setLedgerRows] = useState([
    {
      id: "#INV-2026-904",
      supplier: "Al-Nasr Meat Distributors",
      amount: "EGP 124,500",
      etaId: "8d94e4bc-446a-49bb-b1da-3f82cb34decf",
      status: "Valid Document" as const,
      statusColor: "emerald" as const,
    },
    {
      id: "#INV-2026-905",
      supplier: "Cairo Linen & Hospitality Textile",
      amount: "EGP 84,200",
      etaId: "3f1a23e4-8822-4ccb-bfa1-e124ef93d8b5",
      status: "Pending Handshake" as const,
      statusColor: "amber" as const,
    },
    {
      id: "#INV-2026-906",
      supplier: "Red Sea Laundry Services",
      amount: "EGP 34,100",
      etaId: "Null (Authentication Failed)",
      status: "Rejected by ETA SDK" as const,
      statusColor: "crimson" as const,
    },
  ]);

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientId) {
      setEtaStatus("Custom Tenant Keys Configured");
    }
    setModalOpen(false);
    setClientId("");
    setClientSecret("");
  };

  const triggerInvoiceGeneration = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    const amount = Math.floor(10000 + Math.random() * 90000);
    const newRow = {
      id: `#INV-2026-${randomId}`,
      supplier: "Suez Canal Catering Co",
      amount: `EGP ${amount.toLocaleString()}`,
      etaId: `e${Math.random().toString(36).substring(2, 10)}-xxxx-4ccb-bfa1-e124ef93d8b5`,
      status: "Valid Document" as const,
      statusColor: "emerald" as const,
    };
    setLedgerRows([newRow, ...ledgerRows]);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-100 text-zinc-900">
      {/* ── Sidebar ── */}
      <aside className="w-full md:w-72 bg-black text-white flex flex-col justify-between shrink-0 border-r border-white/10">
        <div className="p-6">
          {/* Brand Banner */}
          <div className="flex items-center gap-3 mb-10">
            <BrandLogo variant="dark" size="xs" />
          </div>

          <nav className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block mb-3 pl-3">Main Portal</span>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-zinc-900 text-white"
              style={{ borderLeft: `2px solid ${ACCENT}` }}
            >
              <svg className="w-4 h-4" style={{ color: ACCENT }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Invoice Ledger
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-950 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Verified Suppliers
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-950 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9 0v-10a2 2 0 00-2-2h-2a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              Volume Forecasting
            </a>

            <div className="pt-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block mb-3 pl-3">Integrations</span>
              <button onClick={() => setModalOpen(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-950 hover:text-white transition-colors text-left">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                ETA Credentials
              </button>
            </div>
          </nav>
        </div>

        {/* Operator Profile */}
        <div className="p-6 border-t border-white/5 bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: `${ACCENT}20`, border: `1px solid ${ACCENT}30`, color: ACCENT }}
            >
              HR
            </div>
            <div>
              <span className="text-xs font-bold block">Hilton Resort Al-Ahram</span>
              <span className="text-[10px] text-zinc-500 font-semibold block">Commercial Admin Profile</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Dashboard Top Bar */}
        <header className="h-16 border-b border-zinc-200 bg-white px-8 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Operational Invoicing Ledger</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5"
              style={{ backgroundColor: "#10B98115", border: "1px solid #10B98125", color: "#059669" }}
            >
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              {etaStatus}
            </span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-8 space-y-8">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block mb-2">Total Managed Balance</span>
              <span className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900">EGP 1,245,600</span>
            </div>
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block mb-2">Verified Supplier Partners</span>
              <span className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900">42 Suppliers</span>
            </div>
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block mb-2">Pending Submissions</span>
              <span className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900">14 Invoices</span>
            </div>
            <div className="rounded-2xl p-6 shadow-sm"
              style={{ backgroundColor: "#8B000008", border: "1px solid #8B000020" }}
            >
              <span className="text-[10px] uppercase font-bold tracking-widest block mb-2" style={{ color: ACCENT }}>Critical System Alerts</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl lg:text-3xl font-bold tracking-tight" style={{ color: ACCENT }}>3 Errors</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase" style={{ backgroundColor: ACCENT, color: "#ffffff" }}>Requires Action</span>
              </div>
            </div>
          </div>

          {/* Invoice Management Ledger */}
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-50/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">Pending & Signed Invoices</h3>
              <button
                onClick={triggerInvoiceGeneration}
                className="text-xs px-3.5 py-2 rounded-xl transition-all font-semibold w-full sm:w-auto"
                style={{ backgroundColor: ACCENT, color: "#ffffff" }}
              >
                Simulate Automated Invoice Generation
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-600 border-collapse">
                <thead>
                  <tr className="bg-zinc-50/30 text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-200">
                    <th className="px-6 py-4">Invoice Reference</th>
                    <th className="px-6 py-4">Assigned Supplier</th>
                    <th className="px-6 py-4">Statement Balance</th>
                    <th className="px-6 py-4">Government ETA ID</th>
                    <th className="px-6 py-4">Verification State</th>
                    <th className="px-6 py-4 text-right">Ledger Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {ledgerRows.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-zinc-900">{row.id}</td>
                      <td className="px-6 py-4">{row.supplier}</td>
                      <td className="px-6 py-4 font-semibold text-zinc-900">{row.amount}</td>
                      <td className="px-6 py-4 font-mono text-zinc-500">{row.etaId}</td>
                      <td className="px-6 py-4">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                          style={{
                            backgroundColor: row.statusColor === "emerald" ? "#10B98115" : row.statusColor === "amber" ? "#F59E0B15" : `${ACCENT}15`,
                            border: row.statusColor === "emerald" ? "1px solid #10B98125" : row.statusColor === "amber" ? "1px solid #F59E0B25" : `1px solid ${ACCENT}25`,
                            color: row.statusColor === "emerald" ? "#059669" : row.statusColor === "amber" ? "#D97706" : ACCENT,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: row.statusColor === "emerald" ? "#10B981" : row.statusColor === "amber" ? "#F59E0B" : ACCENT,
                            }}
                          />
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {row.statusColor === "crimson" ? (
                          <button onClick={() => { setModalOpen(true); setClientId("eta_fix_attempt_2026_ledger"); }} className="font-bold underline" style={{ color: ACCENT }}>
                            Fix Error
                          </button>
                        ) : (
                          <button className="text-zinc-500 hover:text-zinc-900 font-bold">Inspect</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Back to Marketing Link */}
          <div className="text-center">
            <Link href="/" className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors">
              ← Back to Marketing Site
            </Link>
          </div>
        </div>
      </main>

      {/* ── ETA Credentials Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-zinc-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block mb-1">Secure Multi-Tenant Context</span>
                <h4 className="text-xl font-bold text-zinc-900">ETA Integration Credentials</h4>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 p-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed mb-6">
              To isolate B2B transaction routing, hotels and verified vendors must provide their unique Egyptian Tax Authority application keys. These secrets are securely verified locally and stored strictly in separate isolated environment records.
            </p>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">ERP Client ID (Unique Token String)</label>
                <input
                  type="password"
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="eta_client_id_live_xxxxxxxxx"
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-zinc-800 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">ERP Client Secret</label>
                <input
                  type="password"
                  required
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="••••••••••••••••••••••••••••••••"
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-zinc-800 focus:outline-none transition-colors"
                />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-xs text-amber-700 leading-relaxed">
                <strong>Notice:</strong> All canonicalization procedures and digital signings are processed through local e-seal drivers. Keys reside inside your encrypted database tenant profile.
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider"
                  style={{ backgroundColor: ACCENT, color: "#ffffff" }}
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
