"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Package, TrendingDown, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Plus, Search, Eye,
  Building2, Calendar, FileText, Truck, CreditCard,
  Clock, CheckCircle2, XCircle, AlertOctagon, ChevronRight,
  BarChart3, PiggyBank, Sparkles, Target, Zap,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboards/shared/stat-card";
import { SectionCard } from "@/components/dashboards/shared/section-card";

/* ───────────────────────────────────────────────────────────
   ANIMATION VARIANTS
   ─────────────────────────────────────────────────────────── */
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const kanbanColumn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const cardEnter = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* ───────────────────────────────────────────────────────────
   TYPE INTERFACES
   ─────────────────────────────────────────────────────────── */
interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  deliveryDate: string | null;
  supplier: { name: string; id: string };
  hotel: { name: string };
  items: { quantity: number; product: { name: string } }[];
}

interface Product {
  id: string;
  sku: string;
  name: string;
  stockQuantity: number;
  reorderPoint: number;
  unitPrice: number;
  supplier: { name: string };
}

interface SpendRecord {
  month: number;
  amount: number;
  orderCount: number;
  category: string;
}

interface SpendData {
  year: number;
  records: SpendRecord[];
  totalSpend: number;
  totalOrders: number;
  byCategory: Record<string, { amount: number; orderCount: number }>;
}

interface Invoice {
  id: string;
  internalId: string;
  totalAmount: number;
  status: string;
  submittedAt: string | null;
  deadline: string | null;
}

interface CreditFacility {
  id: string;
  limit: number;
  used: number;
  remaining: number;
  interestRate: number;
  status: string;
}

/* ───────────────────────────────────────────────────────────
   STATUS BADGE
   ─────────────────────────────────────────────────────────── */
const ORDER_STATUSES = [
  "DRAFT", "PENDING_APPROVAL", "APPROVED", "CONFIRMED",
  "IN_TRANSIT", "DELIVERED", "CANCELLED",
] as const;

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string; columnBg: string }> = {
  DRAFT: { bg: "bg-white/[0.06]", text: "text-white/40", dot: "bg-white/40", label: "Draft", columnBg: "bg-white/[0.01]" },
  PENDING_APPROVAL: { bg: "bg-amber-500/[0.08]", text: "text-amber-400/80", dot: "bg-amber-400", label: "Pending", columnBg: "bg-amber-500/[0.02]" },
  APPROVED: { bg: "bg-blue-500/[0.08]", text: "text-blue-400/80", dot: "bg-blue-400", label: "Approved", columnBg: "bg-blue-500/[0.02]" },
  CONFIRMED: { bg: "bg-[#bef264]/10", text: "text-[#bef264]/80", dot: "bg-[#bef264]", label: "Confirmed", columnBg: "bg-[#bef264]/[0.03]" },
  IN_TRANSIT: { bg: "bg-[#bef264]/10", text: "text-[#bef264]/80", dot: "bg-[#bef264]", label: "In Transit", columnBg: "bg-[#bef264]/[0.03]" },
  DELIVERED: { bg: "bg-emerald-500/[0.08]", text: "text-emerald-400/80", dot: "bg-emerald-400", label: "Delivered", columnBg: "bg-emerald-500/[0.02]" },
  CANCELLED: { bg: "bg-red-500/[0.08]", text: "text-red-400/80", dot: "bg-red-400", label: "Cancelled", columnBg: "bg-red-500/[0.02]" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

/* ───────────────────────────────────────────────────────────
   UTILITIES
   ─────────────────────────────────────────────────────────── */
function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

function monthName(month: number) {
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][month - 1];
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff;
}

/* ───────────────────────────────────────────────────────────
   KANBAN PIPELINE COMPONENT
   ─────────────────────────────────────────────────────────── */
function KanbanPipeline({ orders, onSelect }: { orders: Order[]; onSelect: (o: Order) => void }) {
  const columns = ORDER_STATUSES.filter((s) => s !== "CANCELLED");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
          <BarChart3 size={14} className="text-white/30" />
          Orders Pipeline
        </h3>
        <span className="text-[11px] text-white/20">{orders.length} total</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
        {columns.map((status) => {
          const columnOrders = orders.filter((o) => o.status === status);
          const config = STATUS_CONFIG[status];
          return (
            <motion.div key={status} variants={kanbanColumn} className="flex-shrink-0 w-[240px]">
              <div className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl border border-white/[0.06] border-b-0 ${config.columnBg}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                  <span className="text-[11px] font-semibold text-white/50">{config.label}</span>
                </div>
                <span className="text-[11px] font-bold text-white/30 bg-white/[0.04] px-1.5 py-0.5 rounded-md">{columnOrders.length}</span>
              </div>

              <div className={`min-h-[120px] max-h-[380px] overflow-y-auto rounded-b-xl border border-white/[0.06] border-t-0 p-2 space-y-2 ${config.columnBg}`}>
                <AnimatePresence>
                  {columnOrders.length === 0 ? (
                    <div className="flex items-center justify-center h-24">
                      <span className="text-[10px] text-white/12">No orders</span>
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <motion.div
                        key={order.id} variants={cardEnter} initial="hidden" animate="visible"
                        whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                        onClick={() => onSelect(order)}
                        className="p-3 rounded-lg bg-[#0d0d0d] border border-white/[0.04] hover:border-white/[0.08] cursor-pointer transition-all group/card"
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <span className="text-[11px] font-mono text-white/40">{order.orderNumber}</span>
                          <span className="text-[10px] text-white/20 font-medium">{formatCurrency(order.total, order.currency)}</span>
                        </div>
                        <p className="text-[12px] text-white/60 truncate mb-2">{order.supplier?.name || "—"}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/15">{order.items?.length || 0} items</span>
                          <span className="text-[10px] text-white/15">{new Date(order.createdAt).toLocaleDateString("en-EG", { day: "numeric", month: "short" })}</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   SPEND OVERVIEW COMPONENT
   ─────────────────────────────────────────────────────────── */
function SpendOverview({ data, loading }: { data: SpendData | null; loading: boolean }) {
  if (loading) return <LoadingTable rows={4} />;
  if (!data) return <EmptyState title="No spend data" description="Spend analytics will appear once orders are processed." />;

  const maxAmount = Math.max(...data.records.map((r) => r.amount), 1);
  const categories = Object.entries(data.byCategory).sort((a, b) => b[1].amount - a[1].amount);
  const totalCategoryAmount = categories.reduce((s, [, v]) => s + v.amount, 0);

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-[11px] font-semibold text-white/25 uppercase tracking-wider mb-3">Monthly Trend — {data.year}</h4>
        <div className="flex items-end gap-2 h-28">
          {data.records.map((record) => {
            const height = Math.max((record.amount / maxAmount) * 100, 4);
            return (
              <div key={record.month} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="relative w-full flex justify-center">
                  <div className="w-full max-w-[28px] rounded-t bg-gradient-to-t from-[#bef264]/40 to-[#bef264]/70 hover:from-[#bef264]/60 hover:to-[#bef264] transition-all" style={{ height: `${height}%` }} />
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-2.5 py-1 text-[10px] text-white/70 whitespace-nowrap z-10 shadow-xl">
                    {formatCurrency(record.amount)}
                  </div>
                </div>
                <span className="text-[9px] text-white/20 font-medium">{monthName(record.month)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-semibold text-white/25 uppercase tracking-wider mb-3">Category Breakdown</h4>
        <div className="space-y-3">
          {categories.map(([name, { amount }]) => {
            const pct = Math.round((amount / totalCategoryAmount) * 100);
            return (
              <div key={name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-white/55 font-medium">{name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-white/35">{formatCurrency(amount)}</span>
                    <span className="text-[10px] text-white/20 w-8 text-right font-medium">{pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#bef264]/40 to-[#bef264]/70 transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   ETA COMPLIANCE COMPONENT
   ─────────────────────────────────────────────────────────── */
function EtaCompliance({ invoices, loading }: { invoices: Invoice[]; loading: boolean }) {
  if (loading) return <LoadingTable rows={3} />;
  if (!invoices.length) return <EmptyState title="No invoices" description="ETA compliance data will appear once invoices are generated." icon={FileText} />;

  const urgent = invoices.filter((inv) => {
    const days = daysUntil(inv.deadline);
    return days !== null && days <= 3 && !inv.submittedAt;
  });

  return (
    <div className="space-y-3">
      {urgent.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/[0.06] border border-amber-500/10 mb-2">
          <AlertTriangle size={13} className="text-amber-400 flex-shrink-0" />
          <span className="text-[11px] text-amber-400/80 font-medium">{urgent.length} urgent submission{urgent.length > 1 ? "s" : ""}</span>
        </div>
      )}
      {invoices.slice(0, 5).map((inv) => {
        const days = daysUntil(inv.deadline);
        const isUrgent = days !== null && days <= 3 && !inv.submittedAt;
        return (
          <div key={inv.id} className={`p-3 rounded-lg border transition-all ${isUrgent ? "bg-amber-500/[0.03] border-amber-500/10" : "bg-white/[0.015] border-white/[0.04] hover:border-white/[0.08]"}`}>
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <FileText size={12} className={isUrgent ? "text-amber-400" : "text-white/25"} />
                <span className="text-[11px] font-mono text-white/40">{inv.internalId}</span>
              </div>
              {inv.submittedAt ? (
                <span className="text-[10px] text-emerald-400 font-medium">Submitted</span>
              ) : isUrgent ? (
                <span className="text-[10px] text-amber-400 font-semibold">{days}d left</span>
              ) : (
                <span className="text-[10px] text-white/25">{days !== null ? `${days}d` : "—"}</span>
              )}
            </div>
            <div className="h-1 rounded-full bg-white/[0.03] overflow-hidden">
              <div className={`h-full rounded-full ${inv.submittedAt ? "bg-emerald-500" : isUrgent ? "bg-amber-400" : "bg-white/10"}`} style={{ width: inv.submittedAt ? "100%" : isUrgent ? "70%" : "30%" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   ACTION ITEMS COMPONENT
   ─────────────────────────────────────────────────────────── */
function ActionItems({ orders, products, invoices }: { orders: Order[]; products: Product[]; invoices: Invoice[] }) {
  const items = useMemo(() => {
    const result: { icon: typeof AlertTriangle; color: string; bg: string; text: string; sub: string; urgent: boolean }[] = [];

    const pendingApprovals = orders.filter((o) => o.status === "PENDING_APPROVAL");
    if (pendingApprovals.length > 0) {
      result.push({ icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", text: `${pendingApprovals.length} order${pendingApprovals.length > 1 ? "s" : ""} pending approval`, sub: "Awaiting your review", urgent: true });
    }

    const lowStock = products.filter((p) => p.stockQuantity <= p.reorderPoint);
    if (lowStock.length > 0) {
      result.push({ icon: Package, color: "text-orange-400", bg: "bg-orange-500/10", text: `${lowStock.length} item${lowStock.length > 1 ? "s" : ""} low on stock`, sub: "Below reorder point", urgent: true });
    }

    const urgentEta = invoices.filter((inv) => {
      const days = daysUntil(inv.deadline);
      return days !== null && days <= 2 && !inv.submittedAt;
    });
    if (urgentEta.length > 0) {
      result.push({ icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", text: `${urgentEta.length} ETA submission${urgentEta.length > 1 ? "s" : ""} urgent`, sub: "Deadline approaching", urgent: true });
    }

    if (result.length === 0) {
      result.push({ icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", text: "All caught up", sub: "No action items right now", urgent: false });
    }

    return result.sort((a, b) => (a.urgent === b.urgent ? 0 : a.urgent ? -1 : 1));
  }, [orders, products, invoices]);

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <motion.div
          key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
          className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${item.urgent ? `${item.bg} border-white/[0.04]` : "bg-white/[0.015] border-white/[0.04]"}`}
        >
          <div className={`p-1.5 rounded-lg ${item.bg} flex-shrink-0 mt-0.5`}>
            <item.icon size={13} className={item.color} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[12px] font-medium ${item.urgent ? "text-white/80" : "text-white/50"}`}>{item.text}</p>
            <p className="text-[10px] text-white/25 mt-0.5">{item.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   FACTORING CARD COMPONENT
   ─────────────────────────────────────────────────────────── */
function FactoringCard({ facility, loading }: { facility: CreditFacility | null; loading: boolean }) {
  if (loading) return <LoadingCard rows={3} />;
  if (!facility) return <EmptyState title="No credit facility" description="Apply for factoring to unlock supplier financing." icon={CreditCard} />;

  const utilization = facility.limit > 0 ? Math.round((facility.used / facility.limit) * 100) : 0;

  return (
    <div className="p-4 rounded-xl border border-white/[0.06] bg-[#0a0a0a] relative overflow-hidden group/card hover:border-white/[0.1] transition-all">
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(139, 92, 246,0.03) 0%, transparent 50%)" }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#bef264]/10"><CreditCard size={13} className="text-[#bef264]" /></div>
            <span className="text-[12px] font-semibold text-white/70">Credit Line</span>
          </div>
          <span className="text-[10px] text-white/25 uppercase tracking-wider">{facility.status}</span>
        </div>
        <div className="mb-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[22px] font-bold text-white metric-value">{formatCurrency(facility.remaining)}</span>
            <span className="text-[11px] text-white/30">available</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-white/20">{formatCurrency(facility.used)} used</span>
            <span className="text-[10px] text-white/20">of {formatCurrency(facility.limit)}</span>
          </div>
        </div>
        <div className="h-2 rounded-full bg-white/[0.03] overflow-hidden mb-3">
          <div className="h-full rounded-full bg-gradient-to-r from-[#bef264]/50 to-[#bef264] transition-all" style={{ width: `${utilization}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/20">{facility.interestRate}% APR</span>
          <button className="text-[11px] font-medium text-[#bef264] hover:text-white transition-colors">Apply &rarr;</button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   MAIN PAGE
   ─────────────────────────────────────────────────────────── */
export default function HotelDashboardPage() {
  const { data: ordersData, loading: ordersLoading } = useApi<{ orders: Order[] }>("/api/v1/hotel/orders?page=1&limit=50");
  const { data: productsData } = useApi<{ products: Product[] }>("/api/v1/hotel/catalog");
  const { data: spendData, loading: spendLoading } = useApi<SpendData>("/api/v1/hotel/spend");
  const { data: invoicesData, loading: invoicesLoading } = useApi<{ invoices: Invoice[] }>("/api/v1/invoices");
  const { data: facilityData } = useApi<{ facility: CreditFacility }>("/api/v1/factoring/credit-lines");

  const orders = ordersData?.orders || [];
  const products = productsData?.products || [];
  const invoices = invoicesData?.invoices || [];
  const facility = facilityData?.facility || null;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter((o) =>
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const stats = useMemo(() => {
    const totalSpend = spendData?.totalSpend || orders.reduce((s, o) => s + (o.status !== "CANCELLED" ? o.total : 0), 0);
    const activeOrders = orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status)).length;
    const pendingApprovals = orders.filter((o) => o.status === "PENDING_APPROVAL").length;
    return [
      { label: "Total Spend", value: formatCurrency(totalSpend), change: "+12%", up: true, icon: Target, color: "crimson" as const },
      { label: "Active Orders", value: activeOrders.toString(), change: "+3", up: true, icon: ShoppingCart, color: "blue" as const },
      { label: "Pending Approval", value: pendingApprovals.toString(), change: pendingApprovals > 5 ? "-2" : "+1", up: pendingApprovals <= 5, icon: Clock, color: "amber" as const },
      { label: "ETA Compliance", value: "94%", change: "+2%", up: true, icon: CheckCircle2, color: "emerald" as const },
    ];
  }, [orders, spendData]);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 pb-10">
      <motion.div variants={fadeInUp}>
        <PageHeader
          title="Hotel Command Center"
          description="Procurement overview, spend analytics, and compliance tracking."
          breadcrumbs={[{ label: "Dashboard" }]}
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-[#bef264]/30 w-48"
                />
              </div>
              <button className="btn-crimson text-[12px] py-1.5 px-3">
                <Plus size={14} /> New Order
              </button>
            </div>
          }
        />
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i} />)}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <SectionCard title="Orders Pipeline" icon={BarChart3} action={<span className="text-[11px] text-white/20">{filteredOrders.length} orders</span>}>
            {ordersLoading ? <LoadingTable rows={4} /> : <KanbanPipeline orders={filteredOrders} onSelect={setSelectedOrder} />}
          </SectionCard>

          <SectionCard title="Spend Analytics" icon={Target}>
            <SpendOverview data={spendData ?? null} loading={spendLoading} />
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Action Items" icon={Zap}>
            <ActionItems orders={orders} products={products} invoices={invoices} />
          </SectionCard>

          <SectionCard title="ETA Compliance" icon={FileText}>
            <EtaCompliance invoices={invoices} loading={invoicesLoading} />
          </SectionCard>

          <SectionCard title="Quick Access" icon={Sparkles}>
            <div className="space-y-3">
              <FactoringCard facility={facility} loading={false} />
              <div className="pt-3 border-t border-white/[0.04]">
                <p className="text-[11px] font-medium text-white/30 mb-2">Recent Products</p>
                {products.slice(0, 4).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className="min-w-0">
                      <p className="text-[11px] text-white/55 font-medium truncate group-hover:text-white/80 transition-colors">{product.name}</p>
                      <p className="text-[10px] text-white/20">{product.supplier?.name}</p>
                    </div>
                    <span className="text-[10px] text-white/25 font-mono">{formatCurrency(product.unitPrice)}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder?.orderNumber || ""}`}>
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#0a0a0a] border border-white/[0.05]">
                <p className="text-[10px] text-white/25 uppercase tracking-wider">Total</p>
                <p className="text-[16px] font-bold text-white mt-0.5">{formatCurrency(selectedOrder.total, selectedOrder.currency)}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0a0a] border border-white/[0.05]">
                <p className="text-[10px] text-white/25 uppercase tracking-wider">Supplier</p>
                <p className="text-[13px] text-white/70 mt-0.5 truncate">{selectedOrder.supplier?.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0a0a] border border-white/[0.05]">
                <p className="text-[10px] text-white/25 uppercase tracking-wider">Status</p>
                <div className="mt-0.5"><StatusBadge status={selectedOrder.status} /></div>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0a0a] border border-white/[0.05]">
                <p className="text-[10px] text-white/25 uppercase tracking-wider">Created</p>
                <p className="text-[13px] text-white/70 mt-0.5">{new Date(selectedOrder.createdAt).toLocaleDateString("en-EG")}</p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-medium text-white/40 mb-2">Items</p>
              <div className="space-y-1.5">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.015] border border-white/[0.03]">
                    <span className="text-[12px] text-white/60">{item.product?.name}</span>
                    <span className="text-[11px] text-white/30 font-medium">x{item.quantity}</span>
                  </div>
                )) || <p className="text-[11px] text-white/20">No items</p>}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
