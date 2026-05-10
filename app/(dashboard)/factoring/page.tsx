"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Landmark, FileCheck, AlertTriangle, TrendingUp,
  ArrowUpRight, ArrowDownRight, Plus, Search, Eye,
  Wallet, Receipt, CheckCircle2, Clock,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { Modal } from "@/components/ui/modal";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface Facility {
  id: string;
  status: string;
  limit: number;
  utilized: number;
  currency: string;
  hotel: { name: string };
  factoringCompany: { name: string };
}

interface FactoringRequest {
  id: string;
  status: string;
  amount: number;
  discountRate: number;
  currency: string;
  createdAt: string;
  invoice: { invoiceNumber: string; hotel: { name: string }; supplier: { name: string }; total: number };
  factoringCompany: { name: string };
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  total: number;
  currency: string;
  status: string;
  etaStatus: string;
  factoringStatus: string;
  createdAt: string;
  hotel: { name: string };
  supplier: { name: string };
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    ACTIVE: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Active" },
    PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    APPROVED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Approved" },
    REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Rejected" },
    FUNDED: { bg: "bg-[#022349]/10", text: "text-[#022349]", dot: "bg-[#022349]", label: "Funded" },
    COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Completed" },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

export default function FinanceDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<FactoringRequest | null>(null);

  const { data: facilitiesData, loading: facilitiesLoading, error: facilitiesError } = useApi<Facility[]>(
    "/api/factoring/facilities"
  );

  const { data: requestsData, loading: requestsLoading } = useApi<{ requests: FactoringRequest[]; pagination: { total: number } }>(
    "/api/v1/factoring/requests?page=1&limit=10"
  );

  const { data: invoicesData, loading: invoicesLoading } = useApi<{ data: Invoice[]; meta: { total: number } }>(
    "/api/invoices?page=1&limit=10"
  );

  const facilities = facilitiesData ?? [];
  const requests = requestsData?.requests ?? [];
  const invoices = invoicesData?.data ?? [];

  const stats = useMemo(() => {
    const totalLimit = facilities.reduce((sum, f) => sum + f.limit, 0);
    const totalUtilized = facilities.reduce((sum, f) => sum + f.utilized, 0);
    const available = totalLimit - totalUtilized;
    const pendingRequests = requests.filter((r) => r.status === "PENDING").length;

    return [
      { label: "Available Credit", value: formatCurrency(available), change: `${formatCurrency(totalLimit)} total limit`, up: true, icon: Wallet },
      { label: "Outstanding", value: formatCurrency(totalUtilized), change: "Utilized", up: false, icon: Receipt },
      { label: "Factored Amount", value: formatCurrency(requests.filter((r) => r.status === "FUNDED").reduce((s, r) => s + r.amount, 0)), change: "This month", up: true, icon: Landmark },
      { label: "Pending Requests", value: pendingRequests.toString(), change: "Awaiting approval", up: pendingRequests === 0, icon: AlertTriangle },
    ];
  }, [facilities, requests]);

  const filteredRequests = requests.filter(
    (r) =>
      r.invoice?.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.invoice?.hotel?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLoading = facilitiesLoading || requestsLoading || invoicesLoading;

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Finance Dashboard</h1>
          <p className="text-sm text-white/40 mt-0.5">Liquidity overview, factoring requests, and credit facilities</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#022349] hover:bg-[#022349]/80 text-xs text-white font-medium transition-all">
          <Plus size={14} />
          New Factoring Request
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
          : stats.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeInUp}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{s.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                    <s.icon size={15} className="text-white/40" />
                  </div>
                </div>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {s.up ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-red-400" />}
                  <span className={`text-[11px] font-medium ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.change}</span>
                </div>
              </motion.div>
            ))}
      </motion.div>

      {/* Main Grid */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Factoring Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileCheck size={14} className="text-white/40" />
              Factoring Requests
            </h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#022349]/50 w-56"
              />
            </div>
          </div>

          {requestsLoading ? (
            <LoadingTable rows={5} />
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              title="No factoring requests"
              description="Factoring requests will appear here once submitted."
              action={
                <button className="px-4 py-2 rounded-lg bg-[#022349] text-xs text-white font-medium">
                  Submit Request
                </button>
              }
            />
          ) : (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Invoice</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Rate</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-white/60">{req.invoice?.invoiceNumber || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-white">{req.invoice?.hotel?.name || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-white">{formatCurrency(req.amount, req.currency)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-white/40">{(req.discountRate * 100).toFixed(1)}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Credit Facilities */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Wallet size={14} className="text-white/40" />
              Credit Facilities
            </h3>
            {facilitiesLoading ? (
              <LoadingTable rows={3} />
            ) : facilities.length === 0 ? (
              <EmptyState title="No facilities" description="Credit facilities will appear here." />
            ) : (
              <div className="space-y-3">
                {facilities.map((facility) => {
                  const pct = facility.limit > 0 ? (facility.utilized / facility.limit) * 100 : 0;
                  return (
                    <div key={facility.id} className="p-3 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-white">{facility.hotel?.name}</span>
                        <StatusBadge status={facility.status} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/20 mb-1.5">
                        <span>{formatCurrency(facility.utilized, facility.currency)} used</span>
                        <span>{formatCurrency(facility.limit, facility.currency)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct > 80 ? "bg-red-500" : pct > 50 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Invoices */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Receipt size={14} className="text-white/40" />
              Recent Invoices
            </h3>
            {invoicesLoading ? (
              <LoadingTable rows={3} />
            ) : invoices.length === 0 ? (
              <EmptyState title="No invoices" description="Invoices will appear here." />
            ) : (
              <div className="space-y-2">
                {invoices.slice(0, 5).map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                    <div>
                      <p className="text-xs text-white">{inv.invoiceNumber}</p>
                      <p className="text-[10px] text-white/25">{inv.hotel?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-white">{formatCurrency(inv.total, inv.currency)}</p>
                      <p className={`text-[9px] ${inv.factoringStatus === "FUNDED" ? "text-[#022349]" : inv.factoringStatus === "PENDING" ? "text-amber-400" : "text-white/20"}`}>
                        {inv.factoringStatus || "Unfunded"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Request Detail Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={`Factoring Request`}
        description={`Invoice: ${selectedRequest?.invoice?.invoiceNumber}`}
        size="md"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Amount</p>
                <p className="text-sm text-white mt-0.5">{formatCurrency(selectedRequest.amount, selectedRequest.currency)}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Discount Rate</p>
                <p className="text-sm text-white mt-0.5">{(selectedRequest.discountRate * 100).toFixed(1)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Status</p>
                <div className="mt-0.5"><StatusBadge status={selectedRequest.status} /></div>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Factoring Company</p>
                <p className="text-sm text-white mt-0.5">{selectedRequest.factoringCompany?.name || "—"}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-[10px] text-white/20 uppercase mb-1">Invoice Details</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">Hotel:</span>
                <span className="text-white">{selectedRequest.invoice?.hotel?.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-white/40">Supplier:</span>
                <span className="text-white">{selectedRequest.invoice?.supplier?.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-white/40">Invoice Total:</span>
                <span className="text-white">{formatCurrency(selectedRequest.invoice?.total || 0, selectedRequest.currency)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
