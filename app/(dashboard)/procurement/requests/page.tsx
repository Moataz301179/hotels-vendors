"use client";
import { useState } from "react";
import { ClipboardList, Search, Plus, Clock, CheckCircle2, XCircle, AlertTriangle, ChevronRight } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
interface Request { id: string; requestNumber: string; title: string; status: string; total: number; currency: string; requesterName: string; hotelName: string; createdAt: string; }
interface RequestsData { requests: Request[]; total: number; }
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { PENDING_APPROVAL: "#f59e0b", APPROVED: "#22c55e", REJECTED: "#ef4444", DRAFT: "#6b7280", FULFILLED: "#3b82f6" };
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors[status] || "#6b7280"}20`, color: colors[status] || "#6b7280" }}>{status.replace(/_/g, " ")}</span>;
}
export default function ProcurementRequestsPage() {
  const [search, setSearch] = useState("");
  const { data, loading, error, refetch } = useApi<RequestsData>(`/api/v1/procurement/requests?search=${encodeURIComponent(search)}`);
  const requests = data?.requests || [];
  if (loading) return <div className="p-6 space-y-4" style={{ backgroundColor: "#000000", minHeight: "100vh" }}><div className="h-8 w-48 bg-white/5 rounded animate-pulse" />{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />)}</div>;
  if (error) return <div className="p-6" style={{ backgroundColor: "#000000", minHeight: "100vh" }}><div className="p-4 rounded-xl border bg-red-500/10 text-red-300" style={{ borderColor: "rgba(239,68,68,0.2)" }}><AlertTriangle size={20} className="mb-2" /><p className="text-sm">{error}</p><button onClick={refetch} className="mt-3 px-3 py-1.5 rounded-lg text-xs bg-red-500/20 hover:bg-red-500/30 transition-colors">Retry</button></div></div>;
  return (
    <div className="p-6 space-y-4" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-bold text-white">Procurement Requests</h1><p className="text-xs text-white/30 mt-1">{data?.total || 0} requests</p></div></div>
      <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" /><input type="text" placeholder="Search requests..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg text-xs text-[#1a1a1a] placeholder:text-[#999999] border outline-none focus:border-[#a3e635]" style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }} /></div>
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}>
        <table className="w-full text-sm"><thead><tr className="text-left text-[10px] text-white/30 uppercase tracking-wider border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}><th className="px-4 py-3 font-medium">Request</th><th className="px-4 py-3 font-medium">Hotel</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-4 py-3 font-medium">Date</th></tr></thead>
          <tbody>{requests.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-xs text-white/20">No requests found</td></tr>}
            {requests.map((r) => (
              <tr key={r.id} className="border-b transition-colors hover:bg-white/[0.02]" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3"><div className="text-xs font-medium text-white">{r.requestNumber}</div><div className="text-[10px] text-white/20">{r.title}</div></td>
                <td className="px-4 py-3 text-xs text-white/50">{r.hotelName}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-xs text-white">{r.total.toLocaleString()} {r.currency}</td>
                <td className="px-4 py-3 text-xs text-white/30">{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
