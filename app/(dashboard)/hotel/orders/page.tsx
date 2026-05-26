"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart, Search, Filter, ArrowUpDown,
  Eye, Clock, CheckCircle2, XCircle, AlertTriangle,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  supplierName: string;
  hotelName: string;
  createdAt: string;
  itemCount: number;
}

interface OrdersData {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING_APPROVAL: "#f59e0b",
    APPROVED: "#22c55e",
    REJECTED: "#ef4444",
    DELIVERED: "#3b82f6",
    DRAFT: "#6b7280",
    CONFIRMED: "#a3e635",
    PARTIALLY_DELIVERED: "#06b6d4",
  };
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors[status] || "#6b7280"}20`, color: colors[status] || "#6b7280" }}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export default function HotelOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("pageSize", "20");
  if (statusFilter) queryParams.set("status", statusFilter);
  if (search) queryParams.set("search", search);

  const { data, loading, error, refetch } = useApi<OrdersData>(
    `/api/v1/hotel/orders?${queryParams.toString()}`
  );

  const orders = data?.orders || [];
  const totalPages = Math.ceil((data?.total || 0) / 20);

  if (loading) {
    return (
      <div className="p-6 space-y-4" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
        <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
        <div className="p-4 rounded-xl border bg-red-500/10 text-red-300" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
          <AlertTriangle size={20} className="mb-2" />
          <p className="text-sm">{error}</p>
          <button onClick={refetch} className="mt-3 px-3 py-1.5 rounded-lg text-xs bg-red-500/20 hover:bg-red-500/30 transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Orders</h1>
          <p className="text-xs text-white/30 mt-1">{data?.total || 0} total orders</p>
        </div>
        <a href="/hotel/order" className="px-4 py-2 rounded-lg text-xs text-white transition-opacity hover:opacity-80" style={{ backgroundColor: "#a3e635" }}>
          + New Order
        </a>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-xs text-[#1a1a1a] placeholder:text-[#999999] border outline-none focus:border-[#a3e635]"
            style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}
          />
        </div>
        <select
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value || null)}
          className="px-3 py-2 rounded-lg text-xs text-white border outline-none"
          style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <option value="">All Statuses</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="APPROVED">Approved</option>
          <option value="DELIVERED">Delivered</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] text-white/30 uppercase tracking-wider border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <th className="px-4 py-3 font-medium">Order #</th>
              <th className="px-4 py-3 font-medium">Supplier</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-white/20">No orders found</td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="border-b transition-colors hover:bg-white/[0.02]" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3">
                  <div className="text-xs font-medium text-white">{order.orderNumber}</div>
                </td>
                <td className="px-4 py-3 text-xs text-white/50">{order.supplierName}</td>
                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-4 py-3 text-xs text-white/50">{order.itemCount}</td>
                <td className="px-4 py-3 text-xs text-white">{order.total.toLocaleString()} {order.currency}</td>
                <td className="px-4 py-3 text-xs text-white/30">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <a href={`/hotel/order/${order.id}`} className="text-white/30 hover:text-white transition-colors">
                    <Eye size={16} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg border text-white/30 hover:text-white disabled:opacity-20"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-white/30">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 rounded-lg border text-white/30 hover:text-white disabled:opacity-20"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
