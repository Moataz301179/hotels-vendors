"use client";
import { useState } from "react";
import { CreditCard, TrendingUp, Clock, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
interface FactoringReq { id: string; status: string; invoiceNumber: string; partner: string; amount: number; advanceRate: number; disbursedAmount: number; createdAt: string; }
interface FactoringData { requests: FactoringReq[]; total: number; totalDisbursed: number; }
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { PENDING: "#f59e0b", APPROVED: "#22c55e", REJECTED: "#ef4444", DISBURSED: "#3b82f6", COMPLETED: "#a3e635" };
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors[status] || "#6b7280"}20`, color: colors[status] || "#6b7280" }}>{status}</span>;
}
export default function FinanceFactoringPage() {
  const { data, loading, error, refetch } = useApi<FactoringData>("/api/v1/finance/factoring");
  const requests = data?.requests || [];
  if (loading) return <div className="p-6 space-y-4" style={{ backgroundColor: "#000000", minHeight: "100vh" }}><div className="h-8 w-48 bg-white/5 rounded animate-pulse" />{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse" />)}</div>;
  if (error) return <div className="p-6" style={{ backgroundColor: "#000000", minHeight: "100vh" }}><div className="p-4 rounded-xl border bg-red-500/10 text-red-300" style={{ borderColor: "rgba(239,68,68,0.2)" }}><AlertTriangle size={20} className="mb-2" /><p className="text-sm">{error}</p><button onClick={refetch} className="mt-3 px-3 py-1.5 rounded-lg text-xs bg-red-500/20 hover:bg-red-500/30 transition-colors">Retry</button></div></div>;
  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-bold text-white">Factoring</h1><p className="text-xs text-white/30 mt-1">{data?.total || 0} requests • EGP {(data?.totalDisbursed || 0).toLocaleString()} disbursed</p></div></div>
      <div className="space-y-3">
        {requests.length === 0 && <div className="p-8 text-center text-xs text-white/20 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.06)" }}>No factoring requests</div>}
        {requests.map((r) => (
          <div key={r.id} className="p-4 rounded-xl border" style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#a3e63520" }}><CreditCard size={18} style={{ color: "#a3e635" }} /></div>
                <div><div className="text-sm font-medium text-white">{r.invoiceNumber}</div><div className="text-[10px] text-white/30">{r.partner}</div></div>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <div className="flex gap-6 mt-3">
              <div><div className="text-[10px] text-white/20">Amount</div><div className="text-xs text-white">EGP {r.amount.toLocaleString()}</div></div>
              <div><div className="text-[10px] text-white/20">Advance</div><div className="text-xs text-white">{r.advanceRate}%</div></div>
              <div><div className="text-[10px] text-white/20">Disbursed</div><div className="text-xs text-white">EGP {r.disbursedAmount.toLocaleString()}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
