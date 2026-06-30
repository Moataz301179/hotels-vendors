"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Search, ChevronLeft, ChevronRight, ExternalLink, UserPlus } from "lucide-react";
import Link from "next/link";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function HotelSuppliersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", "20");
  if (search) queryParams.set("search", search);

  const { data, loading, error } = useApi<{ suppliers: { id: string; name: string; tier: string; city: string; status: string; productCount: number }[]; pagination: { page: number; totalPages: number; total: number } }>(
    `/api/v1/hotel/suppliers?${queryParams.toString()}`
  );

  const suppliers = data?.suppliers || [];
  const pagination = data?.pagination;

  return (
    <motion.div className="max-w-[1600px] mx-auto space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-base/15 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-accent-base" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Suppliers</h1>
            <p className="text-sm text-foreground-tertiary mt-0.5">All suppliers connected to your hotel</p>
          </div>
        </div>
        <Link
          href="/dashboard/hotel/suppliers/invite"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-base hover:bg-accent-base/80 text-xs text-foreground font-medium transition-all"
        >
          <UserPlus size={14} /> Add Supplier
        </Link>
      </motion.div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">{error}</div>
      )}

      <motion.div variants={fadeInUp} className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-10 pl-10 pr-4 rounded-lg text-sm text-foreground placeholder:text-foreground-muted bg-surface-raised border border-subtle outline-none focus:border-accent-base/40 transition-all"
          />
        </div>
      </motion.div>

      {loading ? (
        <LoadingTable rows={5} cols={4} />
      ) : suppliers.length === 0 ? (
        <EmptyState icon={<Building2 className="w-12 h-12 text-foreground-muted" />} title="No suppliers yet" description="Invite your suppliers to start procuring through the platform." action={<Link href="/dashboard/hotel/suppliers/invite" className="px-4 py-2 rounded-lg bg-accent-base text-foreground text-sm font-medium">Invite Supplier</Link>} />
      ) : (
        <motion.div variants={fadeInUp} className="rounded-xl overflow-hidden border border-subtle bg-surface-raised">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-subtle">
                  {["Name", "Tier", "City", "Products", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-foreground-tertiary uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.id} className="border-b border-subtle hover:bg-surface-raised transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/hotel/suppliers/${s.id}`} className="text-sm text-foreground hover:text-accent-base transition-colors">{s.name}</Link>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-surface-raised text-foreground-tertiary border border-subtle10">{s.tier}</span></td>
                    <td className="px-4 py-3 text-sm text-foreground-tertiary">{s.city}</td>
                    <td className="px-4 py-3 text-sm text-foreground-tertiary">{s.productCount}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "ACTIVE" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"}`}>{s.status}</span></td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/dashboard/hotel/suppliers/${s.id}`} className="inline-flex items-center gap-1 text-xs text-foreground-muted hover:text-accent-base transition-colors">
                        View <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-subtle">
              <span className="text-xs text-foreground-muted">{pagination.total} suppliers</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="p-1.5 rounded-md hover:bg-surface-raised disabled:opacity-20 text-foreground-tertiary"><ChevronLeft size={14} /></button>
                <span className="text-xs text-foreground-tertiary">Page {page} of {pagination.totalPages}</span>
                <button onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} disabled={page >= pagination.totalPages} className="p-1.5 rounded-md hover:bg-surface-raised disabled:opacity-20 text-foreground-tertiary"><ChevronRight size={14} /></button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
