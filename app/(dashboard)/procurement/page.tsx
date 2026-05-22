"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList, CheckCircle2, Clock, AlertTriangle, ShoppingCart,
  ArrowUpRight, ArrowDownRight, Plus, Search, ChevronRight,
  FileText, User, Eye,
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

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  hotel: { name: string };
  supplier: { name: string };
  items: { quantity: number; product: { name: string } }[];
  approvals: { status: string; approver: { name: string } }[];
}

interface AuthorityRule {
  id: string;
  role: string;
  orderValueMin: number;
  orderValueMax: number;
  requiredApprovals: number;
  priority: number;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    APPROVED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Approved" },
    PENDING_APPROVAL: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Rejected" },
    DRAFT: { bg: "bg-white/10", text: "text-white/40", dot: "bg-white/40", label: "Draft" },
    CONFIRMED: { bg: "bg-[#8b5cf6]/10", text: "text-[#8b5cf6]", dot: "bg-[#8b5cf6]", label: "Confirmed" },
  };
  const c = config[status] || config.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    Urgent: "bg-red-500/10 text-red-400",
    High: "bg-amber-500/10 text-amber-400",
    Normal: "bg-white/10 text-white/40",
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors[priority] || colors.Normal}`}>{priority}</span>
  );
}

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

export default function ProcurementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: ordersData, loading: ordersLoading, error: ordersError } = useApi<Order[]>(
    "/api/orders?page=1&limit=50&sortOrder=desc"
  );

  const { data: rulesData, loading: rulesLoading } = useApi<AuthorityRule[]>("/api/authority");

  const orders = ordersData ?? [];
  const rules = rulesData ?? [];

  const stats = [
    { label: "Active Requests", value: orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status)).length.toString(), change: "+5 this week", up: true, icon: ClipboardList },
    { label: "Approved", value: orders.filter((o) => o.status === "APPROVED" || o.status === "CONFIRMED" || o.status === "DELIVERED").length.toString(), change: "Approved orders", up: true, icon: CheckCircle2 },
    { label: "Pending Review", value: orders.filter((o) => o.status === "PENDING_APPROVAL").length.toString(), change: "Awaiting approval", up: true, icon: Clock },
    { label: "Urgent", value: orders.filter((o) => o.total > 100000 && o.status === "PENDING_APPROVAL").length.toString(), change: "High priority", up: false, icon: AlertTriangle },
  ];

  const filteredOrders = orders.filter(
    (r) =>
      (filterStatus === "all" || r.status === filterStatus) &&
      (r.hotel?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isLoading = ordersLoading || rulesLoading;

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
          <h1 className="text-2xl font-bold tracking-tight text-white">Procurement Hub</h1>
          <p className="text-sm text-white/40 mt-0.5">Purchase requests, approvals, and order management across all properties</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 text-xs text-white font-medium transition-all">
          <Plus size={14} />
          New Request
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

      {/* Workflow Pipeline */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Approval Workflow</h3>
        <div className="flex items-center justify-between">
          {[
            { name: "Submitted", icon: FileText, count: orders.length },
            { name: "Pending", icon: User, count: orders.filter((o) => o.status === "PENDING_APPROVAL").length },
            { name: "Approved", icon: ClipboardList, count: orders.filter((o) => o.status === "APPROVED").length },
            { name: "Confirmed", icon: CheckCircle2, count: orders.filter((o) => o.status === "CONFIRMED").length },
            { name: "Ordered", icon: ShoppingCart, count: orders.filter((o) => o.status === "DELIVERED").length },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-2">
                  <step.icon size={16} className="text-white/40" />
                </div>
                <span className="text-[10px] text-white/30 font-medium">{step.name}</span>
                <span className="text-xs font-bold text-white mt-0.5">{step.count}</span>
              </div>
              {i < 4 && <ChevronRight size={16} className="text-white/10 -mt-6" />}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Authority Rules */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Authority Matrix Rules</h3>
        {rulesLoading ? (
          <LoadingTable rows={3} />
        ) : rules.length === 0 ? (
          <EmptyState title="No rules configured" description="Authority rules will appear here once configured." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {rules.map((rule) => (
              <div key={rule.id} className="p-3 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white">{rule.role}</span>
                  <span className="text-[10px] text-white/20">Priority {rule.priority}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/30">Value Range</span>
                    <span className="text-white/60">{formatCurrency(rule.orderValueMin)} - {formatCurrency(rule.orderValueMax)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/30">Approvals Required</span>
                    <span className="text-white/60">{rule.requiredApprovals}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Search + Filter + Table */}
      <motion.div variants={fadeInUp} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Search by ID or hotel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#8b5cf6]/50"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white/60 focus:outline-none"
          >
            <option value="all" className="bg-[#0a0a0a]">All Status</option>
            <option value="APPROVED" className="bg-[#0a0a0a]">Approved</option>
            <option value="PENDING_APPROVAL" className="bg-[#0a0a0a]">Pending</option>
            <option value="REJECTED" className="bg-[#0a0a0a]">Rejected</option>
          </select>
        </div>

        {ordersLoading ? (
          <LoadingTable rows={6} />
        ) : ordersError ? (
          <EmptyState title="Error loading orders" description={ordersError} />
        ) : filteredOrders.length === 0 ? (
          <EmptyState title="No requests found" description="Try adjusting your search or filters." />
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Request ID</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Items</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Date</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((req) => (
                  <tr key={req.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-mono text-white/60">{req.orderNumber}</span></td>
                    <td className="px-4 py-3"><span className="text-xs text-white">{req.hotel?.name}</span></td>
                    <td className="px-4 py-3"><span className="text-xs text-white">{req.items?.reduce((s, i) => s + i.quantity, 0) || 0}</span></td>
                    <td className="px-4 py-3"><span className="text-xs font-semibold text-white">{formatCurrency(req.total, req.currency)}</span></td>
                    <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                    <td className="px-4 py-3"><span className="text-[11px] text-white/30">{new Date(req.createdAt).toLocaleDateString()}</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedOrder(req)} className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Request ${selectedOrder?.orderNumber}`}
        description={`From ${selectedOrder?.hotel?.name}`}
        size="md"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Total</p>
                <p className="text-sm text-white mt-0.5">{formatCurrency(selectedOrder.total, selectedOrder.currency)}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Status</p>
                <div className="mt-0.5"><StatusBadge status={selectedOrder.status} /></div>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Supplier</p>
                <p className="text-sm text-white mt-0.5">{selectedOrder.supplier?.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Items</p>
                <p className="text-sm text-white mt-0.5">{selectedOrder.items?.reduce((s, i) => s + i.quantity, 0) || 0}</p>
              </div>
            </div>
            {selectedOrder.approvals && selectedOrder.approvals.length > 0 && (
              <div>
                <p className="text-[10px] text-white/20 uppercase mb-2">Approvals</p>
                <div className="space-y-1.5">
                  {selectedOrder.approvals.map((app, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                      <span className="text-xs text-white/60">{app.approver?.name}</span>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
