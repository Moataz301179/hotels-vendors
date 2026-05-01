"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, CheckCircle2, XCircle, Clock, Package, Plus } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  vatAmount: number;
  createdAt: string;
  hotel?: { name: string };
  supplier?: { name: string };
}

const STATUS_BADGE: Record<string, string> = {
  DRAFT: "bg-slate-500/10 text-slate-400",
  PENDING_APPROVAL: "bg-amber-500/10 text-amber-400",
  APPROVED: "bg-blue-500/10 text-blue-400",
  REJECTED: "bg-red-500/10 text-red-400",
  CONFIRMED: "bg-emerald-500/10 text-emerald-400",
  IN_TRANSIT: "bg-cyan-500/10 text-cyan-400",
  DELIVERED: "bg-emerald-500/10 text-emerald-400",
  DISPUTED: "bg-red-500/10 text-red-400",
  CANCELLED: "bg-slate-500/10 text-slate-400",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/orders?limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setOrders(d.data);
      });
  }, []);

  const filtered = orders.filter((o) => {
    const m =
      search === "" ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.hotel?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.supplier?.name?.toLowerCase().includes(search.toLowerCase());
    const s = statusFilter === "ALL" || o.status === statusFilter;
    return m && s;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">All Orders</h1>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-foreground-muted">{filtered.length} orders</span>
          <Link
            href="/orders/new"
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-brand-600 hover:bg-brand-700 text-white transition-colors"
          >
            <Plus className="w-3 h-3" /> New Order
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-6 pr-2 py-[3px] text-[11px] rounded-md bg-surface border border-border-subtle focus:border-brand-500/50 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-[11px] rounded-md bg-surface border border-border-subtle px-1.5 py-[3px] focus:border-brand-500/50 focus:outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING_APPROVAL">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="DELIVERED">Delivered</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border-subtle text-foreground-muted bg-surface-raised/50">
              <th className="text-left px-3 py-1.5 font-medium">PO #</th>
              <th className="text-left px-3 py-1.5 font-medium">Hotel</th>
              <th className="text-left px-3 py-1.5 font-medium">Supplier</th>
              <th className="text-right px-3 py-1.5 font-medium">Subtotal</th>
              <th className="text-right px-3 py-1.5 font-medium">VAT</th>
              <th className="text-right px-3 py-1.5 font-medium">Total</th>
              <th className="text-left px-3 py-1.5 font-medium">Status</th>
              <th className="text-left px-3 py-1.5 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-border-subtle/40 hover:bg-surface-raised/40 transition-colors">
                <td className="px-3 py-1.5 font-mono">
                  <Link href={`/orders/${o.id}`} className="text-brand-400 hover:underline">{o.orderNumber}</Link>
                </td>
                <td className="px-3 py-1.5">{o.hotel?.name || "—"}</td>
                <td className="px-3 py-1.5">{o.supplier?.name || "—"}</td>
                <td className="px-3 py-1.5 text-right font-mono">EGP {o.subtotal?.toLocaleString()}</td>
                <td className="px-3 py-1.5 text-right font-mono">EGP {o.vatAmount?.toLocaleString()}</td>
                <td className="px-3 py-1.5 text-right font-mono font-medium">EGP {o.total?.toLocaleString()}</td>
                <td className="px-3 py-1.5">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full text-[9px] font-medium ${STATUS_BADGE[o.status] || ""}`}>
                    {o.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-3 py-1.5 text-foreground-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
