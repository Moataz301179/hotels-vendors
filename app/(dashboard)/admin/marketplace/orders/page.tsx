"use client";

import { useState } from "react";
import { ClipboardList, Search, ChevronLeft, ChevronRight, ShieldCheck, X, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "@/lib/hooks/use-api";

interface OrderRecord {
  id: string;
  orderNumber: string;
  status: string;
  paymentGuaranteed: boolean;
  subtotal: number;
  vat: number;
  total: number;
  hotelName: string;
  supplierName: string;
  itemCount: number;
  createdAt: string;
}

interface OrdersData {
  orders: OrderRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  APPROVED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  CONFIRMED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  IN_TRANSIT: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  DELIVERED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
  DISPUTED: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", "20");
  if (statusFilter) queryParams.set("status", statusFilter);

  const { data, loading, error } = useApi<OrdersData>(`/api/v1/admin/orders?${queryParams.toString()}`);
  const orders = data?.orders || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen">
      <div className="border-b border-white/[0.06]">
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-base/15 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-accent-base" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold tracking-tight text-white">Order Oversight</h1>
              <p className="text-[13px] text-white/40">Cross-tenant order management and monitoring</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-5">
        {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">{error}</div>}

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-10 px-3 rounded-lg text-sm text-white/60 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-accent-base/40"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="rounded-xl bg-[#0f0f0f] border border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto table-scroll-wrapper">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Order</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Hotel</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Supplier</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading && <tr><td colSpan={6} className="px-5 py-12 text-center text-white/30">Loading orders...</td></tr>}
                {!loading && orders.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-white/30">No orders found</td></tr>}
                {orders.map((o, i) => (
                  <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-white">{o.orderNumber}</p>
                      <p className="text-[11px] text-white/30">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-white/60">{o.hotelName}</td>
                    <td className="px-5 py-3.5 text-[13px] text-white/60">{o.supplierName}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase border ${STATUS_STYLES[o.status] || "bg-white/5 text-white/40 border-white/10"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-white">EGP {(o.total / 1000).toFixed(1)}K</td>
                    <td className="px-5 py-3.5">
                      {o.paymentGuaranteed ? (
                        <span className="inline-flex items-center gap-1 text-[13px] text-emerald-400">
                          <ShieldCheck className="w-3 h-3" /> Guaranteed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[13px] text-amber-400">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] text-white/30">Page {page} of {pagination.totalPages}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-white/40 hover:text-white disabled:opacity-30" aria-label="Previous page"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages} className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-white/40 hover:text-white disabled:opacity-30" aria-label="Next page"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
