import Link from "next/link";
import { MetricTile } from "@/components/dashboards/shared/metric-tile";
import { StatusPill } from "@/components/dashboards/shared/status-pill";
import { DataTableMini } from "@/components/dashboards/shared/data-table-mini";
import {
  ShoppingCart,
  CreditCard,
  FileCheck,
  TrendingUp,
  Utensils,
  Sparkles,
  Brush,
  Wrench,
  Bath,
  ArrowRight,
} from "lucide-react";

async function getData() {
  try {
    const [ordersRes, spendRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/v1/hotel/orders?limit=5`, {
        cache: "no-store",
      }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/v1/hotel/spend`, {
        cache: "no-store",
      }),
    ]);

    const ordersJson = ordersRes.ok ? await ordersRes.json() : null;
    const spendJson = spendRes.ok ? await spendRes.json() : null;

    const orders = ordersJson?.data?.orders || [];
    const spend = spendJson?.data || null;

    const openOrders = orders.filter((o: { status: string }) =>
      ["PENDING_APPROVAL", "APPROVED", "CONFIRMED", "IN_TRANSIT"].includes(o.status)
    ).length;

    const pendingApprovals = orders.filter((o: { status: string }) => o.status === "PENDING_APPROVAL").length;

    const totalSpend = spend?.totalSpend || 0;
    const avgOrder = orders.length > 0
      ? orders.reduce((s: number, o: { total: number }) => s + (o.total || 0), 0) / orders.length
      : 0;

    return {
      metrics: [
        { label: "Open Orders", value: openOrders.toString(), trend: `${orders.length} total`, icon: ShoppingCart, iconBg: "bg-accent-cyan/10 text-accent-cyan" },
        { label: "Monthly Spend", value: `${Math.round(totalSpend).toLocaleString()} EGP`, trend: spend ? "This year" : "No data", icon: CreditCard, iconBg: "bg-accent-emerald/10 text-accent-emerald" },
        { label: "Pending Approvals", value: pendingApprovals.toString(), trend: pendingApprovals > 0 ? "Needs action" : "All caught up", icon: FileCheck, iconBg: pendingApprovals > 0 ? "bg-accent-amber/10 text-accent-amber" : "bg-accent-emerald/10 text-accent-emerald" },
        { label: "Avg Order Value", value: `${Math.round(avgOrder).toLocaleString()} EGP`, trend: "Last 5 orders", icon: TrendingUp, iconBg: "bg-accent-gold/10 text-accent-gold" },
      ],
      recentOrders: orders.slice(0, 5).map((o: { id: string; orderNumber?: string; supplier?: { name?: string }; total?: number; status: string; createdAt?: string }) => ({
        id: o.orderNumber || o.id.slice(0, 8),
        supplier: o.supplier?.name || "Unknown",
        total: `${(o.total || 0).toLocaleString()} EGP`,
        status: o.status.toLowerCase().replace("_", " "),
        date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-GB") : "—",
      })),
      approvalCount: pendingApprovals,
      spendTrend: spend?.records?.map((r: { amount: number }) => r.amount) || [0, 0, 0, 0, 0, 0, 0],
    };
  } catch {
    // Fallback to empty state
    return {
      metrics: [
        { label: "Open Orders", value: "0", trend: "No orders yet", icon: ShoppingCart, iconBg: "bg-accent-cyan/10 text-accent-cyan" },
        { label: "Monthly Spend", value: "0 EGP", trend: "No data", icon: CreditCard, iconBg: "bg-accent-emerald/10 text-accent-emerald" },
        { label: "Pending Approvals", value: "0", trend: "All caught up", icon: FileCheck, iconBg: "bg-accent-emerald/10 text-accent-emerald" },
        { label: "Avg Order Value", value: "0 EGP", trend: "—", icon: TrendingUp, iconBg: "bg-accent-gold/10 text-accent-gold" },
      ],
      recentOrders: [],
      approvalCount: 0,
      spendTrend: [0, 0, 0, 0, 0, 0, 0],
    };
  }
}

const CATEGORIES = [
  { name: "F&B", icon: Utensils, filter: "F_AND_B" },
  { name: "Housekeeping", icon: Brush, filter: "CONSUMABLES" },
  { name: "Engineering", icon: Wrench, filter: "SERVICES" },
  { name: "Amenities", icon: Bath, filter: "GUEST_SUPPLIES" },
];

export default async function HotelDashboardPage() {
  const data = await getData();

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text-animated">Procurement Portal</span>
          </h1>
          <p className="text-foreground-muted mt-1 text-sm">Manage orders, browse catalog, and track spend</p>
        </div>
        <Link
          href="/hotel/catalog"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
        >
          <ShoppingCart size={16} />
          Browse Catalog
        </Link>
      </div>

      <div className="bento-grid mb-6">
        {data.metrics.map((m) => (
          <MetricTile key={m.label} {...m} />
        ))}
      </div>

      <div className="bento-grid">
        <div className="bento-item bento-item-large glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Browse by Category</h3>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/hotel/catalog?category=${cat.filter}`}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-raised border border-border-subtle hover:border-border-default cursor-pointer transition-colors"
              >
                <cat.icon size={22} className="text-foreground mb-2" />
                <p className="text-xs font-medium text-foreground">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="bento-item bento-item-large glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Orders</h3>
            <Link href="/hotel/order" className="text-xs text-brand-400 hover:text-brand-300 font-medium">
              View all →
            </Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <div className="text-center py-8 text-foreground-muted text-sm">
              No orders yet. <Link href="/hotel/catalog" className="text-brand-400 hover:underline">Place your first order</Link>
            </div>
          ) : (
            <DataTableMini
              columns={[
                { key: "id", header: "Order #" },
                { key: "supplier", header: "Supplier" },
                { key: "total", header: "Total" },
                { key: "status", header: "Status", render: (row) => <StatusPill status={row.status as string} /> },
                { key: "date", header: "Date", className: "text-right" },
              ]}
              data={data.recentOrders}
            />
          )}
        </div>

        <div className="bento-item glass-card p-5 flex flex-col justify-center">
          {data.approvalCount > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="status-badge bg-accent-amber/10 text-accent-amber border-accent-amber/20">
                  <span className="status-dot bg-accent-amber" />
                  {data.approvalCount}
                </span>
              </div>
              <p className="text-sm text-foreground font-medium">{data.approvalCount} orders need your approval</p>
              <Link href="/hotel/order" className="mt-3 text-xs font-medium text-brand-400 hover:text-brand-300 w-fit">
                Review Queue →
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="status-badge bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20">
                  <span className="status-dot bg-accent-emerald" />
                  0
                </span>
              </div>
              <p className="text-sm text-foreground font-medium">All orders approved</p>
              <p className="text-xs text-foreground-muted mt-1">Nothing pending</p>
            </>
          )}
        </div>

        <div className="bento-item bento-item-large glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Spend Trend</h3>
          <div className="flex items-end gap-2 h-24">
            {data.spendTrend.map((h: number, i: number) => {
              const max = Math.max(...data.spendTrend, 1);
              return (
                <div key={i} className="flex-1 rounded-t bg-brand-700/40 hover:bg-brand-600/50 transition-colors" style={{ height: `${(h / max) * 100}%` }} />
              );
            })}
          </div>
        </div>

        <div className="bento-item glass-card p-5 flex flex-col justify-center items-center text-center">
          <Sparkles size={24} className="text-accent-gold mb-2" />
          <p className="text-sm font-medium text-foreground">Ask about your procurement</p>
          <p className="text-xs text-foreground-faint mt-1">AI Assistant</p>
        </div>
      </div>
    </div>
  );
}
