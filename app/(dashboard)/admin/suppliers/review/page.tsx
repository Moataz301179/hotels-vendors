"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Landmark,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  AlertCircle,
  ShieldCheck,
  Package,
  Clock,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { Modal } from "@/components/ui/modal";

interface Supplier {
  id: string;
  name: string;
  legalName: string | null;
  taxId: string;
  commercialReg: string | null;
  address: string | null;
  city: string;
  governorate: string;
  phone: string | null;
  email: string;
  website: string | null;
  description: string | null;
  bankName: string | null;
  bankAccount: string | null;
  certifications: string | null;
  status: string;
  tier: string;
  rating: number | null;
  createdAt: string;
  _count?: { products: number; orders: number };
}

export default function SupplierReviewPage() {
  const [search, setSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error } = useApi<{ data: Supplier[]; meta: { total: number } }>(
    `/api/suppliers?limit=100&sortBy=createdAt&sortOrder=asc${refreshKey > 0 ? `&_=${refreshKey}` : ""}`
  );

  const allSuppliers = data?.data ?? [];
  const pendingSuppliers = allSuppliers.filter((s) => s.status === "PENDING");
  const filtered = pendingSuppliers.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.taxId.includes(q)
    );
  });

  async function handleApprove(id: string, tier: string = "CORE") {
    setActionLoading(id);
    setActionError("");
    setActionSuccess("");
    try {
      const res = await fetch(`/api/v1/suppliers/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const json = await res.json();
      if (json.success) {
        setActionSuccess(json.message);
        setDetailOpen(false);
        setSelectedSupplier(null);
        setRefreshKey((k) => k + 1);
      } else {
        setActionError(json.error || "Approval failed");
      }
    } catch {
      setActionError("Network error");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id: string, reason: string = "") {
    setActionLoading(id);
    setActionError("");
    setActionSuccess("");
    try {
      const res = await fetch(`/api/v1/suppliers/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const json = await res.json();
      if (json.success) {
        setActionSuccess(json.message);
        setDetailOpen(false);
        setSelectedSupplier(null);
        setRefreshKey((k) => k + 1);
      } else {
        setActionError(json.error || "Rejection failed");
      }
    } catch {
      setActionError("Network error");
    } finally {
      setActionLoading(null);
    }
  }

  const openDetail = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDetailOpen(true);
    setActionError("");
    setActionSuccess("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Supplier Review</h1>
          <p className="text-sm text-white/40 mt-0.5">
            Review and approve pending supplier applications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/15">
            <span className="text-xs text-amber-400 font-medium">
              {pendingSuppliers.length} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { label: "Pending", value: pendingSuppliers.length, color: "amber" },
          { label: "Active", value: allSuppliers.filter((s) => s.status === "ACTIVE").length, color: "emerald" },
          { label: "Rejected", value: allSuppliers.filter((s) => s.status === "REJECTED").length, color: "red" },
          { label: "Total", value: allSuppliers.length, color: "white" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
          >
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, city, or tax ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/15 focus:border-[#022349]/40 focus:outline-none transition-colors text-sm"
          />
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {actionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-sm flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> {actionSuccess}
          </motion.div>
        )}
        {actionError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm flex items-center gap-2"
          >
            <AlertCircle size={16} /> {actionError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Company</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Location</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Tax ID</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Applied</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-4"><LoadingTable rows={3} /></td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="px-4 py-8"><EmptyState title="Error loading suppliers" description={error} /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8"><EmptyState title="No pending suppliers" description="All supplier applications have been reviewed." /></td></tr>
            ) : (
              filtered.map((supplier) => (
                <tr key={supplier.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-xs font-medium text-white">{supplier.name}</p>
                      <p className="text-[10px] text-white/25">{supplier.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-white/60">{supplier.city}, {supplier.governorate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-white/40">{supplier.taxId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-white/30">{new Date(supplier.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/15 text-[10px] font-medium text-amber-400">
                      <Clock size={10} /> Pending
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openDetail(supplier)}
                        className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleApprove(supplier.id)}
                        disabled={actionLoading === supplier.id}
                        className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-white/30 hover:text-emerald-400 transition-colors"
                        title="Approve"
                      >
                        {actionLoading === supplier.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      </button>
                      <button
                        onClick={() => handleReject(supplier.id)}
                        disabled={actionLoading === supplier.id}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                        title="Reject"
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedSupplier(null); }}
        title={selectedSupplier?.name || "Supplier Details"}
      >
        {selectedSupplier && (
          <div className="space-y-5">
            {/* Company */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building2 size={13} className="text-[#022349]" /> Company
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <DetailField label="Name" value={selectedSupplier.name} />
                <DetailField label="Legal Name" value={selectedSupplier.legalName || "—"} />
                <DetailField label="Tax ID" value={selectedSupplier.taxId} />
                <DetailField label="Commercial Reg." value={selectedSupplier.commercialReg || "—"} />
                <DetailField label="Description" value={selectedSupplier.description || "—"} colSpan={2} />
              </div>
            </div>

            {/* Contact */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin size={13} className="text-[#022349]" /> Contact
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <DetailField label="Address" value={selectedSupplier.address || "—"} colSpan={2} />
                <DetailField label="City" value={selectedSupplier.city} />
                <DetailField label="Governorate" value={selectedSupplier.governorate} />
                <DetailField label="Phone" value={selectedSupplier.phone || "—"} />
                <DetailField label="Email" value={selectedSupplier.email} />
                <DetailField label="Website" value={selectedSupplier.website || "—"} colSpan={2} />
              </div>
            </div>

            {/* Banking */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Landmark size={13} className="text-[#022349]" /> Banking
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <DetailField label="Bank Name" value={selectedSupplier.bankName || "—"} />
                <DetailField label="Account" value={selectedSupplier.bankAccount || "—"} />
              </div>
            </div>

            {/* Certifications */}
            {selectedSupplier.certifications && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShieldCheck size={13} className="text-[#022349]" /> Certifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSupplier.certifications.split(",").map((cert) => (
                    <span key={cert} className="px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/15 text-[10px] text-amber-400">
                      {cert.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleReject(selectedSupplier.id)}
                disabled={actionLoading === selectedSupplier.id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-colors text-sm font-medium"
              >
                <XCircle size={16} /> Reject
              </button>
              <button
                onClick={() => handleApprove(selectedSupplier.id, "CORE")}
                disabled={actionLoading === selectedSupplier.id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#022349] hover:bg-[#022349]/80 text-white text-sm font-medium transition-colors"
              >
                {actionLoading === selectedSupplier.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                Approve as CORE
              </button>
              <button
                onClick={() => handleApprove(selectedSupplier.id, "PREMIER")}
                disabled={actionLoading === selectedSupplier.id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 text-emerald-400 text-sm font-medium transition-colors"
              >
                {actionLoading === selectedSupplier.id ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                Approve as PREMIER
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function DetailField({ label, value, colSpan = 1 }: { label: string; value: string; colSpan?: number }) {
  return (
    <div className={colSpan === 2 ? "col-span-2" : ""}>
      <p className="text-[10px] text-white/25 uppercase tracking-wider">{label}</p>
      <p className="text-xs text-white/70 mt-0.5">{value}</p>
    </div>
  );
}
