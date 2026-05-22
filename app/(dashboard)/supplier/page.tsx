"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList, TrendingUp, Clock, Star, Package,
  ArrowUpRight, ArrowDownRight, Plus, Search, Eye,
  FileText, Truck, CheckCircle2, AlertTriangle,
  Building2, Zap, BarChart3, Shield, CreditCard,
  ChevronRight, TrendingDown, Timer, Warehouse,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboards/shared/stat-card";
import { SectionCard } from "@/components/dashboards/shared/section-card";

/* ─── ANIMATIONS ─── */
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const cardEnter = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* ─── TYPES ─── */
interface Order {
  id: string; orderNumber: string; status: string;
  total: number; currency: string; createdAt: string;
  confirmedAt?: string; shippedAt?: string; deliveredAt?: string;
  hotel: { name: string; id: string };
  items: { quantity: number; product: { name: string } }[];
}
interface Product {
  id: string; sku: string; name: string;
  stockQuantity: number; reorderPoint: number;
  unitPrice: number; category: string;
  inventorySnapshots: { stockQuantity: number; createdAt: string }[];
  supplier: { name: string };
}
interface ComplianceData {
  egsCodes: { total: number; synced: number; pending: number };
  certificates: { total: number; valid: number; expired: number };
}

/* ─── STATUS BADGE ─── */
const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PENDING_APPROVAL: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
  APPROVED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Approved" },
  CONFIRMED: { bg: "bg-[#8b5cf6]/10", text: "text-[#8b5cf6]", dot: "bg-[#8b5cf6]", label: "Confirmed" },
  IN_TRANSIT: { bg: "bg-[#8b5cf6]/10", text: "text-[#8b5cf6]", dot: "bg-[#8b5cf6]", label: "In Transit" },
  DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Delivered" },
  CANCELLED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Cancelled" },
  DRAFT: { bg: "bg-white/10", text: "text-white/40", dot: "bg-white/40", label: "Draft" },
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

function formatCurrency(amount: number, currency = "EGP") { return `${currency} ${amount.toLocaleString("en-EG")}`; }
function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

/* ─── FULFILLMENT VELOCITY ─── */
function FulfillmentVelocity({ orders }: { orders: Order[] }) {
  const metrics = useMemo(() => {
    const fulfilled = orders.filter((o) => o.status === "DELIVERED" && o.confirmedAt && o.deliveredAt);
    const avgDays = fulfilled.length > 0
      ? fulfilled.reduce((sum, o) => sum + daysSince(o.confirmedAt!) - daysSince(o.deliveredAt!), 0) / fulfilled.length
      : 0;
    const onTime = fulfilled.filter((o) => {
      const actual = daysSince(o.confirmedAt!);
      const expected = daysSince(o.deliveredAt!);
      return actual <= expected + 1;
    }).length;
    const onTimeRate = fulfilled.length > 0 ? Math.round((onTime / fulfilled.length) * 100) : 0;
    return { avgDays: Math.abs(avgDays).toFixed(1), onTimeRate, fulfilledCount: fulfilled.length };
  }, [orders]);

  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: "Avg Fulfillment", value: `${metrics.avgDays}d`, icon: Timer, color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "On-Time Rate", value: `${metrics.onTimeRate}%`, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
      ].map((m) => (
        <div key={m.label} className="p-3 rounded-xl border border-white/[0.05] bg-[#0a0a0a] hover:border-white/[0.08] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1 rounded-md ${m.bg}`}><m.icon size={12} className={m.color} /></div>
            <span className="text-[10px] text-white/30 uppercase tracking-wider">{m.label}</span>
          </div>
          <p className="text-[20px] font-bold text-white metric-value">{m.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── INVENTORY HEALTH ─── */
function InventoryHealth({ products }: { products: Product[] }) {
  const metrics = useMemo(() => {
    const lowStock = products.filter((p) => p.stockQuantity <= p.reorderPoint);
    const outOfStock = products.filter((p) => p.stockQuantity === 0);
    const healthy = products.filter((p) => p.stockQuantity > p.reorderPoint * 1.5);
    const byCategory: Record<string, { count: number; avgStock: number }> = {};
    products.forEach((p) => {
      if (!byCategory[p.category]) byCategory[p.category] = { count: 0, avgStock: 0 };
      byCategory[p.category].count++;
      byCategory[p.category].avgStock += p.stockQuantity;
    });
    Object.values(byCategory).forEach((v) => { v.avgStock = Math.round(v.avgStock / v.count); });
    return { lowStock, outOfStock, healthy, byCategory, total: products.length };
  }, [products]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Healthy", value: metrics.healthy.length, color: "text-emerald-400", bar: "bg-emerald-500" },
          { label: "Low Stock", value: metrics.lowStock.length, color: "text-amber-400", bar: "bg-amber-500" },
          { label: "Out of Stock", value: metrics.outOfStock.length, color: "text-red-400", bar: "bg-red-500" },
        ].map((s) => (
          <div key={s.label} className="text-center p-2.5 rounded-lg bg-white/[0.015] border border-white/[0.03]">
            <p className={`text-[18px] font-bold ${s.color} metric-value`}>{s.value}</p>
            <p className="text-[9px] text-white/25 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      {products.slice(0, 5).map((product) => {
        const ratio = product.reorderPoint > 0 ? Math.min(product.stockQuantity / (product.reorderPoint * 2), 1) : 0.5;
        const isLow = product.stockQuantity <= product.reorderPoint;
        return (
          <div key={product.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/55 font-medium truncate max-w-[70%]">{product.name}</span>
              <span className={`text-[10px] font-mono ${isLow ? "text-amber-400" : "text-white/30"}`}>{product.stockQuantity} units</span>
            </div>
            <div className="h-1 rounded-full bg-white/[0.03] overflow-hidden">
              <div className={`h-full rounded-full transition-all ${isLow ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.max(ratio * 100, 4)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── HOTEL BUYERS ─── */
function HotelBuyers({ orders }: { orders: Order[] }) {
  const buyers = useMemo(() => {
    const map: Record<string, { name: string; count: number; revenue: number; trend: number[] }> = {};
    orders.forEach((o) => {
      if (!map[o.hotel.id]) map[o.hotel.id] = { name: o.hotel.name, count: 0, revenue: 0, trend: [] };
      map[o.hotel.id].count++;
      map[o.hotel.id].revenue += o.total;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-2">
      {buyers.map((buyer, i) => (
        <motion.div key={buyer.name} variants={cardEnter} initial="hidden" animate="visible" transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.015] border border-white/[0.03] hover:border-white/[0.06] hover:bg-white/[0.025] transition-all cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center flex-shrink-0">
            <Building2 size={14} className="text-[#8b5cf6]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-white/70 truncate group-hover:text-white/90 transition-colors">{buyer.name}</p>
            <p className="text-[10px] text-white/25">{buyer.count} orders</p>
          </div>
          <span className="text-[12px] font-semibold text-white/50 font-mono">{formatCurrency(buyer.revenue)}</span>
        </motion.div>
      ))}
      {buyers.length === 0 && <EmptyState title="No buyer data" description="Orders will appear as hotels place them." />}
    </div>
  );
}

/* ─── COMPLIANCE STATUS ─── */
function ComplianceStatus({ data, loading }: { data: ComplianceData | null; loading: boolean }) {
  if (loading) return <LoadingCard rows={3} />;
  if (!data) return <EmptyState title="No compliance data" description="EGS code sync status will appear here." />;

  const egsRate = data.egsCodes.total > 0 ? Math.round((data.egsCodes.synced / data.egsCodes.total) * 100) : 0;
  const certRate = data.certificates.total > 0 ? Math.round((data.certificates.valid / data.certificates.total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-white/[0.05] bg-[#0a0a0a]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-white/40 font-medium">EGS Code Sync</span>
          <span className="text-[13px] font-bold text-white metric-value">{egsRate}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.03] overflow-hidden mb-2">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-500/50 to-blue-400" style={{ width: `${egsRate}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-white/20">
          <span>{data.egsCodes.synced} synced</span>
          <span>{data.egsCodes.pending} pending</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-white/[0.05] bg-[#0a0a0a]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-white/40 font-medium">Certificates Valid</span>
          <span className="text-[13px] font-bold text-white metric-value">{certRate}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.03] overflow-hidden mb-2">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500/50 to-emerald-400" style={{ width: `${certRate}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-white/20">
          <span>{data.certificates.valid} valid</span>
          <span>{data.certificates.expired} expired</span>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function SupplierDashboardPage() {
  const { data: ordersData, loading: ordersLoading } = useApi<{ orders: Order[] }>("/api/v1/supplier/orders");
  const { data: productsData, loading: productsLoading } = useApi<{ products: Product[] }>("/api/v1/supplier/inventory");
  const { data: complianceData, loading: complianceLoading } = useApi<ComplianceData>("/api/v1/supplier/profile");

  const orders = ordersData?.orders || [];
  const products = productsData?.products || [];

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter((o) =>
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const stats = useMemo(() => {
    const revenue = orders.filter((o) => o.status !== "CANCELLED").reduce((s, o) => s + o.total, 0);
    const pending = orders.filter((o) => ["PENDING_APPROVAL", "APPROVED"].includes(o.status)).length;
    const toFulfill = orders.filter((o) => o.status === "CONFIRMED").length;
    return [
      { label: "Revenue", value: formatCurrency(revenue), change: "+8%", up: true, icon: TrendingUp, color: "emerald" as const },
      { label: "Pending", value: pending.toString(), change: "-2", up: false, icon: Clock, color: "amber" as const },
      { label: "To Fulfill", value: toFulfill.toString(), change: "+5", up: true, icon: Package, color: "blue" as const },
      { label: "Fulfillment", value: "96%", change: "+1%", up: true, icon: Truck, color: "crimson" as const },
    ];
  }, [orders]);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 pb-10">
      <motion.div variants={fadeInUp}>
        <PageHeader
          title="Supplier Operations"
          description="Order fulfillment, inventory health, and compliance tracking."
          breadcrumbs={[{ label: "Dashboard" }]}
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                <input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-[#8b5cf6]/30 w-48" />
              </div>
              <button className="btn-crimson text-[12px] py-1.5 px-3"><Plus size={14} /> Add Product</button>
            </div>
          }
        />
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i} />)}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <SectionCard title="Orders" icon={ClipboardList}
            action={<span className="text-[11px] text-white/20">{filteredOrders.length} orders</span>}>
            {ordersLoading ? <LoadingTable rows={5} /> : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {filteredOrders.slice(0, 8).map((order) => (
                  <motion.div key={order.id} variants={cardEnter} initial="hidden" animate="visible"
                    whileHover={{ scale: 1.01 }} onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.015] border border-white/[0.03] hover:border-white/[0.08] cursor-pointer transition-all group">
                    <div className="w-9 h-9 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center flex-shrink-0">
                      <ClipboardList size={15} className="text-[#8b5cf6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-white/35">{order.orderNumber}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-[12px] text-white/60 mt-0.5 truncate">{order.hotel?.name}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[12px] font-semibold text-white/70 font-mono">{formatCurrency(order.total, order.currency)}</p>
                      <p className="text-[10px] text-white/20">{new Date(order.createdAt).toLocaleDateString("en-EG", { day: "numeric", month: "short" })}</p>
                    </div>
                  </motion.div>
                ))}
                {filteredOrders.length === 0 && <EmptyState title="No orders" description="Orders from hotels will appear here." />}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Fulfillment Velocity" icon={Zap}>
            <FulfillmentVelocity orders={orders} />
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Inventory Health" icon={Package}>
            {productsLoading ? <LoadingCard rows={4} /> : <InventoryHealth products={products} />}
          </SectionCard>

          <SectionCard title="Top Buyers" icon={Building2}>
            <HotelBuyers orders={orders} />
          </SectionCard>

          <SectionCard title="Compliance" icon={Shield}>
            <ComplianceStatus data={complianceData ?? null} loading={complianceLoading} />
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
                <p className="text-[10px] text-white/25 uppercase tracking-wider">Hotel</p>
                <p className="text-[13px] text-white/70 mt-0.5 truncate">{selectedOrder.hotel?.name}</p>
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
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
