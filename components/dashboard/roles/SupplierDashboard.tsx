"use client";

import { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  Truck,
  DollarSign,
  AlertTriangle,
  Plus,
  Search,
  Edit3,
  Star,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardCard } from "../DashboardCard";

interface KPI {
  activeListings: number;
  openOrders: number;
  pendingShipments: number;
  revenueThisMonth: string;
}

interface OrderRequest {
  id: string;
  orderNumber: string;
  hotelName: string;
  total: string;
  items: number;
  requestedAt: string;
  status: string;
}

interface InventoryAlert {
  id: string;
  productName: string;
  stock: number;
  threshold: number;
  severity: "low" | "critical" | "out";
}

interface Review {
  id: string;
  hotelName: string;
  rating: number;
  comment: string;
  date: string;
}

/**
 * Supplier Dashboard — food suppliers, linen vendors, chemical manufacturers, equipment dealers.
 * Shows listings, orders, inventory, and revenue.
 */
export function SupplierDashboard() {
  const [kpis, setKpis] = useState<KPI>({
    activeListings: 0,
    openOrders: 0,
    pendingShipments: 0,
    revenueThisMonth: "0",
  });
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await fetch("/api/v1/dashboard/supplier");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setKpis(data.kpis || kpis);
        setOrderRequests(data.orderRequests || []);
        setInventoryAlerts(data.inventoryAlerts || []);
        setReviews(data.reviews || []);
        setRevenueData(data.revenueData || []);
      } catch (err) {
        if (!cancelled) setError("Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--text-muted)] text-sm">Loading supplier data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Supplier Portal
          </h1>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            Manage products, fulfill orders, and track revenue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium bg-[var(--accent-base)] text-white hover:opacity-90 transition-opacity">
            <Plus size={14} />
            Add Product
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
            <Search size={14} />
            View Orders
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
            <Edit3 size={14} />
            Update Inventory
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Package} label="Active Listings" value={kpis.activeListings.toString()} accent="var(--accent-base)" />
        <KPICard icon={ShoppingCart} label="Open Orders" value={kpis.openOrders.toString()} accent="var(--info)" />
        <KPICard icon={Truck} label="Pending Shipments" value={kpis.pendingShipments.toString()} accent="var(--warning)" />
        <KPICard icon={DollarSign} label="Revenue This Month" value={`${kpis.revenueThisMonth} EGP`} accent="var(--success)" />
      </div>

      {/* Revenue Chart */}
      <DashboardCard title="Revenue Trend (Last 6 Months)">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value.toLocaleString()} EGP`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--accent-base)"
                fill="var(--accent-base)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      {/* Inventory Alerts */}
      {inventoryAlerts.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-400" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-amber-400">
              Inventory Alerts
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inventoryAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-invisible)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-[var(--text-primary)] truncate">
                    {alert.productName}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Stock: {alert.stock} / Threshold: {alert.threshold}
                  </p>
                </div>
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-medium uppercase ${
                    alert.severity === "out"
                      ? "text-red-400 bg-red-500/10"
                      : alert.severity === "critical"
                      ? "text-orange-400 bg-orange-500/10"
                      : "text-amber-400 bg-amber-500/10"
                  }`}
                >
                  {alert.severity === "out" ? "Out of Stock" : alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Requests + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCard title="Order Requests Awaiting Confirmation">
          <div className="space-y-3">
            {orderRequests.length === 0 && (
              <p className="text-[12px] text-[var(--text-muted)]">No pending order requests</p>
            )}
            {orderRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between py-2 border-b border-[var(--border-invisible)] last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-[var(--text-primary)]">
                    {req.orderNumber}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {req.hotelName} · {req.items} items · {req.requestedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <span className="text-[12px] font-medium text-[var(--text-primary)]">
                    {req.total} EGP
                  </span>
                  <button className="p-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                    <CheckCircle2 size={14} />
                  </button>
                  <button className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                    <XCircle size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Recent Reviews">
          <div className="space-y-3">
            {reviews.length === 0 && (
              <p className="text-[12px] text-[var(--text-muted)]">No reviews yet</p>
            )}
            {reviews.map((review) => (
              <div
                key={review.id}
                className="py-2 border-b border-[var(--border-invisible)] last:border-0"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-[var(--text-primary)]">
                    {review.hotelName}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-white/20"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] line-clamp-2">
                  {review.comment}
                </p>
                <p className="text-[9px] text-[var(--text-muted)] mt-1">{review.date}</p>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${accent}15` }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-[11px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}
