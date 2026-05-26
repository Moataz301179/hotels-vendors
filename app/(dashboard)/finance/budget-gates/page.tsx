"use client";
import { useState } from "react";
import { PiggyBank, TrendingUp, AlertTriangle, ChevronRight, Plus } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
interface BudgetGate { id: string; name: string; totalBudget: number; spentAmount: number; reservedAmount: number; status: string; periodStart: string; periodEnd: string; }
interface BudgetData { gates: BudgetGate[]; totalBudget: number; totalSpent: number; }
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { ACTIVE: "#22c55e", WARNING: "#f59e0b", EXHAUSTED: "#ef4444", DRAFT: "#6b7280" };
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors[status] || "#6b7280"}20`, color: colors[status] || "#6b7280" }}>{status}</span>;
}
export default function FinanceBudgetGatesPage() {
  const { data, loading, error, refetch } = useApi<BudgetData>("/api/v1/finance/budget-gates");
  const gates = data?.gates || [];
  if (loading) return <div className="p-6 space-y-4" style={{ backgroundColor: "#000000", minHeight: "100vh" }}><div className="h-8 w-48 bg-white/5 rounded animate-pulse" />{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-lg animate-pulse" />)}</div>;
  if (error) return <div className="p-6" style={{ backgroundColor: "#000000", minHeight: "100vh" }}><div className="p-4 rounded-xl border bg-red-500/10 text-red-300" style={{ borderColor: "rgba(239,68,68,0.2)" }}><AlertTriangle size={20} className="mb-2" /><p className="text-sm">{error}</p><button onClick={refetch} className="mt-3 px-3 py-1.5 rounded-lg text-xs bg-red-500/20 hover:bg-red-500/30 transition-colors">Retry</button></div></div>;
  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-bold text-white">Budget Gates</h1><p className="text-xs text-white/30 mt-1">{gates.length} gates • EGP {(data?.totalBudget || 0).toLocaleString()} total</p></div></div>
      <div className="space-y-3">
        {gates.length === 0 && <div className="p-8 text-center text-xs text-white/20 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.06)" }}>No budget gates</div>}
        {gates.map((g) => {
          const pct = g.totalBudget > 0 ? ((g.spentAmount + g.reservedAmount) / g.totalBudget) * 100 : 0;
          return (
            <div key={g.id} className="p-4 rounded-xl border" style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between"><div className="text-sm font-medium text-white">{g.name}</div><StatusBadge status={g.status} /></div>
              <div className="mt-3"><div className="w-full h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}><div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%`, backgroundColor: pct > 90 ? "#ef4444" : pct > 70 ? "#f59e0b" : "#22c55e" }} /></div></div>
              <div className="flex gap-6 mt-2">
                <div><div className="text-[10px] text-white/20">Budget</div><div className="text-xs text-white">EGP {g.totalBudget.toLocaleString()}</div></div>
                <div><div className="text-[10px] text-white/20">Spent</div><div className="text-xs text-white">EGP {g.spentAmount.toLocaleString()}</div></div>
                <div><div className="text-[10px] text-white/20">Remaining</div><div className="text-xs text-white">EGP {(g.totalBudget - g.spentAmount - g.reservedAmount).toLocaleString()}</div></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
