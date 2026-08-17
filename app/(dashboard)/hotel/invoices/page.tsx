"use client";

import { useState } from "react";
import { FileText, Download, Filter, Search, Eye, Send, AlertCircle, FileCheck, Building2 } from "lucide-react";
import { StatusBadge } from "@/components/invo/status-badge";
import { KPICard } from "@/components/invo/kpi-card";

const mockInvoices = [
  { id: "INV-2026-001", supplier: "Cairo Fresh Foods", hotel: "The Nile Palace", amount: 42500, vat: 6800, total: 49300, status: "paid", eta_status: "submitted", issued_at: "2026-07-20", due_at: "2026-08-19", items: 12 },
  { id: "INV-2026-002", supplier: "CleanPro Egypt", hotel: "The Nile Palace", amount: 18750, vat: 3000, total: 21750, status: "invoiced", eta_status: "submitted", issued_at: "2026-07-22", due_at: "2026-08-21", items: 5 },
  { id: "INV-2026-003", supplier: "Nile Hospitality Supplies", hotel: "The Nile Palace", amount: 85000, vat: 13600, total: 98600, status: "pending_approval", eta_status: "not_submitted", issued_at: "2026-07-25", due_at: "2026-08-24", items: 28 },
  { id: "INV-2026-004", supplier: "Delta Linens Co.", hotel: "The Nile Palace", amount: 31200, vat: 4992, total: 36192, status: "delivered", eta_status: "failed", issued_at: "2026-07-18", due_at: "2026-08-17", items: 8 },
  { id: "INV-2026-005", supplier: "HotelTech Solutions", hotel: "The Nile Palace", amount: 156000, vat: 24960, total: 180960, status: "draft", eta_status: "not_submitted", issued_at: "2026-07-26", due_at: "2026-08-25", items: 3 },
];

function formatEGP(amount: number) {
  return new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(amount);
}

export default function HotelInvoicesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = mockInvoices.filter((inv) => {
    const matchSearch = !search || inv.id.toLowerCase().includes(search.toLowerCase()) || inv.supplier.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || inv.status === filter || inv.eta_status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Invoices & VAT</h1>
        <p className="mt-1 text-[13px] text-white/35">Manage invoices, track ETA e-invoicing status, and view VAT breakdowns.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <KpiCard label="Total Invoiced" value={formatEGP(333450)} change="+12% this month" changeType="positive" icon={FileText} />
        <KpiCard label="VAT Collected" value={formatEGP(53352)} change="16% standard rate" icon={FileCheck} iconColor="#c455ff" />
        <KpiCard label="ETA Submitted" value="3 / 5" change="2 pending" changeType="neutral" icon={Send} iconColor="#39ff7e" />
        <KpiCard label="Overdue" value="0" change="All on track" changeType="positive" icon={AlertCircle} iconColor="#64b5f6" />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="h-4 w-4 flex-shrink-0 text-white/25" />
          {["all", "draft", "invoiced", "paid", "pending_approval", "submitted", "failed"].map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-all capitalize ${filter === f ? "bg-white/10 text-white border border-white/15" : "bg-white/[0.03] text-white/35 border border-transparent hover:bg-white/[0.05]"}`}>
              {f === "all" ? "All" : f.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
          <Search className="h-4 w-4 text-white/25" />
          <input type="text" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-[13px] text-white placeholder-white/25 outline-none w-48" />
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="table-scroll-wrapper">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Invoice</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Supplier</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider text-right">VAT</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider text-right">Total</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">ETA</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="data-table-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-white/20" /><span className="text-[13px] font-medium text-white">{inv.id}</span></div>
                    <p className="text-[11px] text-white/25 mt-0.5">{inv.issued_at} &middot; {inv.items} items</p>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-white/60">{inv.supplier}</td>
                  <td className="px-5 py-4 text-[13px] text-white/60 text-right font-mono">{formatEGP(inv.amount)}</td>
                  <td className="px-5 py-4 text-[13px] text-[#c455ff]/60 text-right font-mono">{formatEGP(inv.vat)}</td>
                  <td className="px-5 py-4 text-[13px] text-white text-right font-mono font-medium">{formatEGP(inv.total)}</td>
                  <td className="px-5 py-4"><StatusBadge status={inv.status} /></td>
                  <td className="px-5 py-4"><StatusBadge status={inv.eta_status} /></td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button type="button" className="p-1.5 rounded-md hover:bg-white/[0.05] text-white/25 hover:text-white transition-colors" title="View"><Eye className="h-3.5 w-3.5" /></button>
                      <button type="button" className="p-1.5 rounded-md hover:bg-white/[0.05] text-white/25 hover:text-white transition-colors" title="Download"><Download className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="px-5 py-12 text-center text-[13px] text-white/20">No invoices found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="text-[15px] font-semibold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>VAT Summary — July 2026</h3>
        <div className="grid gap-6 sm:grid-cols-3">
          <div><p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">Taxable Amount</p><p className="text-[20px] font-semibold text-white">{formatEGP(333450)}</p></div>
          <div><p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">VAT Due (16%)</p><p className="text-[20px] font-semibold text-[#c455ff]">{formatEGP(53352)}</p></div>
          <div><p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">ETA Submission Rate</p><p className="text-[20px] font-semibold text-[#39ff7e]">60%</p><p className="text-[11px] text-white/25 mt-1">3 of 5 invoices submitted</p></div>
        </div>
      </div>
    </div>
  );
}
