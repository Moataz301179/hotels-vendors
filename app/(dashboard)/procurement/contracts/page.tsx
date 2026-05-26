"use client";
import { useState } from "react";
import { FileText, Search, Clock, CheckCircle2, AlertTriangle, ChevronRight, Calendar } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
interface Contract { id: string; contractNumber: string; title: string; supplierName: string; hotelName: string; status: string; startDate: string; endDate: string; value: number; currency: string; }
interface ContractsData { contracts: Contract[]; total: number; }
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { ACTIVE: "#22c55e", EXPIRED: "#ef4444", EXPIRING_SOON: "#f59e0b", DRAFT: "#6b7280" };
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors[status] || "#6b7280"}20`, color: colors[status] || "#6b7280" }}>{status.replace(/_/g, " ")}</span>;
}
export default function ProcurementContractsPage() {
  const [search, setSearch] = useState("");
  const { data, loading, error, refetch } = useApi<ContractsData>(`/api/v1/procurement/contracts?search=${encodeURIComponent(search)}`);
  const contracts = data?.contracts || [];
  if (loading) return <div className="p-6 space-y-4" style={{ backgroundColor: "#000000", minHeight: "100vh" }}><div className="h-8 w-48 bg-white/5 rounded animate-pulse" />{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse" />)}</div>;
  if (error) return <div className="p-6" style={{ backgroundColor: "#000000", minHeight: "100vh" }}><div className="p-4 rounded-xl border bg-red-500/10 text-red-300" style={{ borderColor: "rgba(239,68,68,0.2)" }}><AlertTriangle size={20} className="mb-2" /><p className="text-sm">{error}</p><button onClick={refetch} className="mt-3 px-3 py-1.5 rounded-lg text-xs bg-red-500/20 hover:bg-red-500/30 transition-colors">Retry</button></div></div>;
  return (
    <div className="p-6 space-y-4" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-bold text-white">Contracts</h1><p className="text-xs text-white/30 mt-1">{data?.total || 0} contracts</p></div></div>
      <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" /><input type="text" placeholder="Search contracts..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg text-xs text-[#1a1a1a] placeholder:text-[#999999] border outline-none focus:border-[#a3e635]" style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }} /></div>
      <div className="space-y-3">
        {contracts.length === 0 && <div className="p-8 text-center text-xs text-white/20 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.06)" }}>No contracts found</div>}
        {contracts.map((c) => (
          <div key={c.id} className="p-4 rounded-xl border" style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#a3e63520" }}><FileText size={18} style={{ color: "#a3e635" }} /></div>
                <div><div className="text-sm font-medium text-white">{c.title}</div><div className="text-[10px] text-white/30">{c.contractNumber} • {c.supplierName}</div></div>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="flex gap-6 mt-3">
              <div><div className="text-[10px] text-white/20">Value</div><div className="text-xs text-white">{c.value.toLocaleString()} {c.currency}</div></div>
              <div><div className="text-[10px] text-white/20">Start</div><div className="text-xs text-white">{new Date(c.startDate).toLocaleDateString()}</div></div>
              <div><div className="text-[10px] text-white/20">End</div><div className="text-xs text-white">{new Date(c.endDate).toLocaleDateString()}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
