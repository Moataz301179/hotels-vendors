"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Plus, ChevronRight, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { usePost } from "@/lib/hooks/use-api";

interface ReturnItem {
  id: string;
  quantity: number;
  reason: string;
  status: string;
  orderItem: { product: { name: string; sku: string } };
}

interface ReturnRequest {
  id: string;
  returnNumber: string;
  status: string;
  reason: string;
  totalReturnAmount: number;
  createdAt: string;
  order: { id: string; orderNumber: string };
  items: ReturnItem[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING_SUPPLIER_RESPONSE: "text-amber-400 bg-amber-400/10",
  SUPPLIER_ACCEPTED: "text-emerald-400 bg-emerald-400/10",
  SUPPLIER_REJECTED: "text-red-400 bg-red-400/10",
  PARTIALLY_ACCEPTED: "text-blue-400 bg-blue-400/10",
  UNDER_INVESTIGATION: "text-purple-400 bg-purple-400/10",
  ESCALATED_TO_ADMIN: "text-orange-400 bg-orange-400/10",
  RESOLVED: "text-emerald-400 bg-emerald-400/10",
  CANCELLED: "text-white/40 bg-white/5",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING_SUPPLIER_RESPONSE: "Pending",
  SUPPLIER_ACCEPTED: "Accepted",
  SUPPLIER_REJECTED: "Rejected",
  PARTIALLY_ACCEPTED: "Partial",
  UNDER_INVESTIGATION: "Investigating",
  ESCALATED_TO_ADMIN: "Escalated",
  RESOLVED: "Resolved",
  CANCELLED: "Cancelled",
};

export default function ReturnsPage() {
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const { data, loading, refetch } = useApi<{ returns: ReturnRequest[]; pagination: { total: number } }>(
    "/api/v1/returns?limit=50"
  );
  const returns = data?.returns || [];

  const getReturnStatusIcon = (status: string) => {
    if (status === "RESOLVED" || status === "SUPPLIER_ACCEPTED") return <CheckCircle size={14} />;
    if (status === "SUPPLIER_REJECTED" || status === "CANCELLED") return <XCircle size={14} />;
    if (status === "ESCALATED_TO_ADMIN") return <AlertTriangle size={14} />;
    return <Clock size={14} />;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <RotateCcw size={20} className="text-amber-400" />
            Returns
          </h1>
          <p className="text-xs text-white/40 mt-0.5">Manage return requests for delivered orders</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-base text-white text-sm font-semibold hover:bg-amber-400 transition-colors">
          <Plus size={14} /> New Return
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 animate-pulse">
              <div className="h-4 w-32 bg-white/10 rounded mb-2" />
              <div className="h-3 w-48 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      ) : returns.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-12 text-center">
          <RotateCcw size={40} className="text-white/15 mx-auto mb-3" />
          <p className="text-sm text-white/40">No return requests yet</p>
          <p className="text-xs text-white/25 mt-1">Returns can be created from delivered orders</p>
        </div>
      ) : (
        <div className="space-y-2">
          {returns.map((ret) => (
            <motion.div
              key={ret.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 cursor-pointer hover:bg-white/[0.04] transition-colors"
              onClick={() => setSelectedReturn(ret)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{ret.returnNumber}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[ret.status] || "text-white/40 bg-white/5"}`}>
                      {getReturnStatusIcon(ret.status)}
                      {STATUS_LABELS[ret.status] || ret.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/30">
                    <span>Order: {ret.order.orderNumber}</span>
                    <span>{ret.items.length} item{ret.items.length > 1 ? "s" : ""}</span>
                    <span>{new Date(ret.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-white">{Number(ret.totalReturnAmount).toFixed(0)} EGP</span>
                  <ChevronRight size={16} className="text-white/20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedReturn(null)}>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/[0.08] bg-[#0F1320] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{selectedReturn.returnNumber}</h2>
              <button onClick={() => setSelectedReturn(null)} className="text-white/40 hover:text-white text-sm">Close</button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selectedReturn.status]}`}>
                {getReturnStatusIcon(selectedReturn.status)}
                {STATUS_LABELS[selectedReturn.status]}
              </span>
              <span className="text-xs text-white/30">Reason: {selectedReturn.reason}</span>
            </div>

            <div className="space-y-2 mb-4">
              {selectedReturn.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.orderItem.product.name}</p>
                    <p className="text-xs text-white/30">Qty: {item.quantity} &middot; {item.reason}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    item.status === "APPROVED" ? "text-emerald-400 bg-emerald-400/10" :
                    item.status === "REJECTED" ? "text-red-400 bg-red-400/10" :
                    "text-amber-400 bg-amber-400/10"
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-xs text-white/40">Total Return Amount</span>
              <span className="text-base font-bold text-white">{Number(selectedReturn.totalReturnAmount).toFixed(2)} EGP</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
