"use client";

import { useState } from "react";
import { Building2, Star, MapPin, ChevronLeft, ChevronRight, Users, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "@/lib/hooks/use-api";

interface HotelRecord {
  id: string;
  name: string;
  phone: string | null;
  city: string | null;
  starRating: number | null;
  chainName: string | null;
  status: string;
  tenantName: string | null;
  orderCount: number;
  userCount: number;
  createdAt: string;
}

interface HotelsData {
  hotels: HotelRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400",
  INACTIVE: "bg-white/5 text-white/40",
  PENDING: "bg-amber-500/10 text-amber-400",
};

export default function AdminHotelsPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useApi<HotelsData>(`/api/v1/admin/hotels?page=${page}&limit=20`);
  const hotels = data?.hotels || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen">
      <div className="border-b border-white/[0.06]">
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e11d48]/15 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#e11d48]" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold tracking-tight text-white">Hotel Management</h1>
              <p className="text-[13px] text-white/40">View and monitor all hotel accounts on the platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-5">
        {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">{error}</div>}

        <div className="rounded-xl bg-[#0f0f0f] border border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Hotel</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Location</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Rating</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Users</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Orders</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading && <tr><td colSpan={6} className="px-5 py-12 text-center text-white/30">Loading hotels...</td></tr>}
                {!loading && hotels.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-white/30">No hotels found</td></tr>}
                {hotels.map((h, i) => (
                  <motion.tr key={h.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-white">{h.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] text-white/60 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {h.city || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {h.starRating ? (
                        <span className="flex items-center gap-0.5">
                          {Array.from({ length: h.starRating }).map((_, j) => (
                            <Star key={j} className="w-3 h-3 text-[#e11d48] fill-[#e11d48]" />
                          ))}
                        </span>
                      ) : <span className="text-[12px] text-white/20">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] text-white/60 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {h.userCount}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] text-white/60 flex items-center gap-1">
                        <Wallet className="w-3 h-3" /> {h.orderCount}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${STATUS_STYLES[h.status] || "bg-white/5 text-white/40"}`}>
                        {h.status}
                      </span>
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
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 rounded-lg text-white/40 hover:text-white disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages} className="p-1.5 rounded-lg text-white/40 hover:text-white disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
