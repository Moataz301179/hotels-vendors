"use client";

import { motion } from "framer-motion";
import { FileCheck, Package, ChevronRight, ClipboardCheck } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { useRouter } from "next/navigation";

interface Grn {
  id: string;
  grnNumber: string;
  status: string;
  orderId: string;
  order: { id: string; orderNumber: string; supplier: { name: string } };
  grnItems: { id: string }[];
  signedAt: string | null;
}

export default function DriverGrnsPage() {
  const router = useRouter();
  const { data, loading } = useApi<{ grns: Grn[] }>(`/api/v1/grns?status=PENDING_VERIFICATION&limit=50`);
  const grns = data?.grns || [];

  return (
    <div className="space-y-4 pt-2">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <FileCheck size={20} style={{ color: "var(--accent-base)" }} />
          Goods Receipt Notes
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Pending sign-offs
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-4 animate-pulse"
              style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="h-4 w-32 rounded mb-2" style={{ background: "var(--border-subtle)" }} />
              <div className="h-3 w-48 rounded" style={{ background: "var(--border-subtle)" }} />
            </div>
          ))}
        </div>
      ) : grns.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <ClipboardCheck size={40} className="mx-auto mb-3 opacity-20" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>No pending GRNs</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>All goods receipts have been verified</p>
        </div>
      ) : (
        <div className="space-y-3">
          {grns.map((grn) => (
            <motion.button
              key={grn.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => router.push(`/grns/${grn.id}`)}
              className="w-full text-left rounded-2xl p-4 transition-colors"
              style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {grn.grnNumber}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Order {grn.order.orderNumber}
                  </p>
                </div>
                <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  <Package size={12} style={{ color: "var(--accent-base)" }} />
                  <span>{grn.order.supplier.name}</span>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: "var(--warning)", color: "#000" }}
                >
                  {grn.grnItems.length} item{grn.grnItems.length !== 1 ? "s" : ""}
                </span>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); router.push(`/grns/${grn.id}`); }}
                className="mt-3 w-full py-2.5 rounded-xl text-xs font-semibold"
                style={{ background: "var(--accent-base)", color: "#000" }}
              >
                Sign Off
              </button>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
