"use client";

import { useState } from "react";
import { Package, Search, Filter, Eye, Truck, CheckCircle2, Clock } from "lucide-react";
import { StatusBadge } from "@/components/invo/status-badge";
import { KPICard } from "@/components/invo/kpi-card";

const mockOrders = [
  { id: "PO-2026-001", supplier: "Cairo Fresh Foods", items: 12, total: 42500, status: "delivered", created_at: "2026-07-15", delivered_at: "2026-07-19" },
  { id: "PO-2026-002", supplier: "CleanPro Egypt", items: 5, total: 18750, status: "shipped", created_at: "2026-07-20", delivered_at: null },
  { id: "PO-2026-003", supplier: "Nile Hospitality Supplies", items: 28, total: 85000, status: "ordered", created_at: "2026-07-23", delivered_at: null },
  { id: "PO-2026-004", supplier: "Delta Linens Co.", items: 8, total: 31200, status: "pending_approval", created_at: "2026-07-25", delivered_at: null },
  { id: "PO-2026-005", supplier: "HotelTech Solutions", items: 3, total: 156000, status: "draft", created_at: "2026-07-26", delivered_at: null },
  { id: "PO-2026-006", supplier: "Cairo Fresh Foods", items: 7, total: 9800, status: "approved", created_at: "2026-07-26", delivered_at: null },
];

function formatEGP(amount: number) {
  return new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(amount);
}

export default function HotelOrdersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = mockOrders.filter((o) => {
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.supplier.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Purchase Orders</h1>
        <p className="mt-1 text-[13px] text-white/35">Track orders from creation to delivery. Authority Matrix approvals enforced.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <KpiCard label="Total Orders" value="6" change="+2 this week" changeType="positive" icon={Package} />
        <KpiCard label="In Transit" value="1" change="PO-2026-002" icon={Truck} iconColor="#64b5f6" />
        <KpiCard label="Pending Approval" value="1" change="Awaiting manager" changeType="neutral" icon={Clock} iconColor="#ff7e1a" />
        <KpiCard label="Delivered" value="1" change="This month" changeType="positive" icon={CheckCircle2} iconColor="#39ff7e" />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="h-4 w-4 flex-shrink-0 text-white/25" />
          {["all", "draft", "pending_approval", "approved", "ordered", "shipped", "delivered"].map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-all capitalize ${filter === f ? "bg-white/10 text-white border border-white/15" : "bg-white/[0.03] text-white/35 border border-transparent hover:bg-white/[0.05]"}`}>
              {f === "all" ? "All" : f.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
          <Search className="h-4 w-4 text-white/25" />
          <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-[13px] text-white placeholder-white/25 outline-none w-48" />
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="table-scroll-wrapper">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Supplier</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider text-center">Items</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider text-right">Total</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Created</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider">Delivered</th>
                <th className="px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="data-table-row">
                  <td className="px-5 py-4"><span className="text-[13px] font-medium text-white">{o.id}</span></td>
                  <td className="px-5 py-4 text-[13px] text-white/60">{o.supplier}</td>
                  <td className="px-5 py-4 text-[13px] text-white/60 text-center">{o.items}</td>
                  <td className="px-5 py-4 text-[13px] text-white text-right font-mono font-medium">{formatEGP(o.total)}</td>
                  <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-4 text-[12px] text-white/35">{o.created_at}</td>
                  <td className="px-5 py-4 text-[12px] text-white/35">{o.delivered_at || "—"}</td>
                  <td className="px-5 py-4 text-right"><button type="button" className="p-1.5 rounded-md hover:bg-white/[0.05] text-white/25 hover:text-white transition-colors" title="View"><Eye className="h-3.5 w-3.5" /></button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="px-5 py-12 text-center text-[13px] text-white/20">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
