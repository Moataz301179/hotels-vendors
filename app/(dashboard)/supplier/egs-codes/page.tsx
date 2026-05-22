"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Link2,
  Unlink,
  RefreshCw,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { StatusPill } from "@/components/dashboards/shared/status-pill";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface EgsCode {
  id: string;
  codeValue: string;
  codeType: string;
  status: string;
  description: string | null;
  activeFrom: string;
  activeTo: string | null;
  Product: { id: string; name: string; sku: string } | null;
}

interface EgsApiResponse {
  items: EgsCode[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const statusConfig: Record<string, { label: string; variant: string; icon: React.ReactNode }> = {
  ACTIVE: { label: "Active", variant: "success", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  PENDING: { label: "Pending", variant: "warning", icon: <Clock className="w-3.5 h-3.5" /> },
  REJECTED: { label: "Rejected", variant: "danger", icon: <XCircle className="w-3.5 h-3.5" /> },
  EXPIRED: { label: "Expired", variant: "neutral", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
};

export default function SupplierEgsCodesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, loading, error, mutate } = useApi<EgsApiResponse>(
    "/api/v1/egs-codes?pageSize=100"
  );

  const codes = useMemo(() => data?.items ?? [], [data]);

  const filtered = useMemo(() => {
    return codes.filter((c) => {
      const matchesSearch =
        c.codeValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.Product?.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.Product?.sku ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [codes, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = codes.length;
    const active = codes.filter((c) => c.status === "ACTIVE").length;
    const pending = codes.filter((c) => c.status === "PENDING").length;
    const linked = codes.filter((c) => c.Product).length;
    return { total, active, pending, linked };
  }, [codes]);

  const handleSync = async () => {
    try {
      const res = await fetch("/api/v1/egs-codes/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        mutate();
      }
    } catch {
      // ignore
    }
  };

  if (loading) return <LoadingTable rows={6} cols={5} />;
  if (error) return <EmptyState title="Error" description={error.message} icon={AlertTriangle} />;

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <QrCode className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">EGS Codes</h1>
            <p className="text-[13px] text-neutral-400">
              Manage Egyptian Goods/Services codes for ETA e-invoicing compliance
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Codes", value: stats.total, color: "text-white" },
          { label: "Active", value: stats.active, color: "text-emerald-400" },
          { label: "Pending", value: stats.pending, color: "text-amber-400" },
          { label: "Linked to Products", value: stats.linked, color: "text-sky-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Toolbar */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by code, product name, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/20"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <button
            onClick={handleSync}
            className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-neutral-300 hover:bg-white/[0.06] hover:text-white transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync with ETA
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeInUp}>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Valid Until</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <EmptyState
                        title="No EGS codes found"
                        description={
                          searchQuery || statusFilter !== "all"
                            ? "Try adjusting your filters"
                            : "EGS codes are required for ETA e-invoicing. Contact your platform admin to register codes."
                        }
                        icon={QrCode}
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((code) => {
                    const cfg = statusConfig[code.status] || statusConfig.PENDING;
                    return (
                      <tr
                        key={code.id}
                        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="font-mono text-[13px] text-white">{code.codeValue}</div>
                          {code.description && (
                            <div className="text-[11px] text-neutral-500 mt-0.5">{code.description}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[12px] text-neutral-300 bg-white/[0.05] px-2 py-0.5 rounded">
                            {code.codeType}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {code.Product ? (
                            <div className="flex items-center gap-2">
                              <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                              <div>
                                <div className="text-[13px] text-white">{code.Product.name}</div>
                                <div className="text-[11px] text-neutral-500">{code.Product.sku}</div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-neutral-500">
                              <Unlink className="w-3.5 h-3.5" />
                              <span className="text-[12px]">Unlinked</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusPill variant={cfg.variant as any} icon={cfg.icon}>
                            {cfg.label}
                          </StatusPill>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-neutral-400">
                          {code.activeTo
                            ? new Date(code.activeTo).toLocaleDateString("en-GB")
                            : "No expiry"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
