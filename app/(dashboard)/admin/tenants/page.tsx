"use client";
import { useState } from "react";
import { Building2, Users, Search, AlertTriangle, ChevronRight } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
interface Tenant { id: string; name: string; slug: string; users: number; hotels: number; suppliers: number; status: string; createdAt: string; }
interface TenantsData { tenants: Tenant[]; total: number; }
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { ACTIVE: "#22c55e", INACTIVE: "#6b7280", SUSPENDED: "#ef4444", TRIAL: "#f59e0b" };
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors[status] || "#6b7280"}20`, color: colors[status] || "#6b7280" }}>{status}</span>;
}
export default function AdminTenantsPage() {
  const [search, setSearch] = useState("");
  const { data, loading, error, refetch } = useApi<TenantsData>(`/api/v1/admin/tenants?search=${encodeURIComponent(search)}`);
  const tenants = data?.tenants || [];
  if (loading) return <div className="p-6 space-y-4" style={{ backgroundColor: "#050508", minHeight: "100vh" }}><div className="h-8 w-48 bg-white/5 rounded animate-pulse" />{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse" />)}</div>;
  if (error) return <div className="p-6" style={{ backgroundColor: "#050508", minHeight: "100vh" }}><div className="p-4 rounded-xl border bg-red-500/10 text-red-300" style={{ borderColor: "rgba(239,68,68,0.2)" }}><AlertTriangle size={20} className="mb-2" /><p className="text-sm">{error}</p><button onClick={refetch} className="mt-3 px-3 py-1.5 rounded-lg text-xs bg-red-500/20 hover:bg-red-500/30 transition-colors">Retry</button></div></div>;
  return (
    <div className="p-6 space-y-4" style={{ backgroundColor: "#050508", minHeight: "100vh" }}>
      <div><h1 className="text-xl font-bold text-white">Tenants</h1><p className="text-xs text-white/30 mt-1">{data?.total || 0} organizations</p></div>
      <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" /><input type="text" placeholder="Search tenants..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg text-xs text-white placeholder:text-white/20 border outline-none focus:border-[#7c3aed]" style={{ backgroundColor: "#0a0a12", borderColor: "rgba(255,255,255,0.06)" }} /></div>
      <div className="space-y-3">
        {tenants.length === 0 && <div className="p-8 text-center text-xs text-white/20 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.06)" }}>No tenants found</div>}
        {tenants.map((t) => (
          <div key={t.id} className="p-4 rounded-xl border flex items-center gap-4" style={{ backgroundColor: "#0a0a12", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#7c3aed20", color: "#7c3aed" }}>{t.name.charAt(0)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2"><span className="text-sm font-medium text-white">{t.name}</span><StatusBadge status={t.status} /></div>
              <div className="flex gap-3 mt-1"><span className="text-[10px] text-white/20">{t.users} users</span><span className="text-[10px] text-white/20">{t.hotels} hotels</span><span className="text-[10px] text-white/20">{t.suppliers} suppliers</span></div>
            </div>
            <ChevronRight size={16} className="text-white/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
