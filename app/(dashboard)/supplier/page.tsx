import { MetricTile } from "@/components/dashboards/shared/metric-tile";
import { StatusPill } from "@/components/dashboards/shared/status-pill";
import { DataTableMini } from "@/components/dashboards/shared/data-table-mini";
import {
  ClipboardList,
  Banknote,
  Package,
  Clock,
  TrendingUp,
} from "lucide-react";

async function getData() {
  // TODO: Replace with real API call
  return {
    metrics: [
      { label: "Total Orders", value: "156", trend: "+8 this week", icon: ClipboardList, iconBg: "bg-accent-cyan/10 text-accent-cyan" },
      { label: "Revenue This Month", value: "486,250 EGP", trend: "+8.4%", icon: Banknote, iconBg: "bg-accent-emerald/10 text-accent-emerald" },
      { label: "Active Products", value: "1,247", trend: "98% in stock", icon: Package, iconBg: "bg-accent-amber/10 text-accent-amber" },
      { label: "Avg Fulfillment Time", value: "2.4 days", trend: "-12%", icon: Clock, iconBg: "bg-accent-gold/10 text-accent-gold" },
    ],
    pipeline: [
      { stage: "Pending", count: 12 },
      { stage: "Processing", count: 8 },
      { stage: "Shipped", count: 5 },
      { stage: "Delivered", count: 131 },
    ],
    inventoryAlerts: [
      { sku: "FB-OIL-024", name: "Cold-Pressed Olive Oil", qty: 85, status: "low" },
      { sku: "ENG-LED-112", name: "LED Panel Downlight 18W", qty: 12, status: "critical" },
      { sku: "AMN-KIT-045", name: "Guest Amenity Kit", qty: 1800, status: "low" },
    ],
    topProducts: [
      { name: "Egyptian Cotton Towels", share: 85 },
      { name: "Olive Oil 5L", share: 62 },
      { name: "Industrial Detergent", share: 45 },
      { name: "LED Downlight", share: 30 },
    ],
    recentOrders: [
      { id: "PO-2026-0114", hotel: "Marriott Cairo", total: "14,200 EGP", status: "pending", date: "2026-04-28" },
      { id: "PO-2026-0112", hotel: "Four Seasons Giza", total: "37,800 EGP", status: "confirmed", date: "2026-04-27" },
      { id: "PO-2026-0109", hotel: "Hilton Alexandria", total: "5,600 EGP", status: "shipped", date: "2026-04-26" },
      { id: "PO-2026-0107", hotel: "Movenpick Hurghada", total: "45,600 EGP", status: "delivered", date: "2026-04-24" },
      { id: "PO-2026-0105", hotel: "Steigenberger Cairo", total: "9,500 EGP", status: "delivered", date: "2026-04-22" },
    ],
    forecast: "Next week: +12% rice orders",
  };
}

export default async function SupplierDashboardPage() {
  const data = await getData();

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text-animated">Supplier Central</span>
        </h1>
        <p className="text-foreground-muted mt-1 text-sm">Manage inventory, track orders, and optimize fulfillment</p>
      </div>

      <div className="bento-grid mb-6">
        {data.metrics.map((m) => (
          <MetricTile key={m.label} {...m} />
        ))}
      </div>

      <div className="bento-grid">
        <div className="bento-item bento-item-large glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Order Pipeline</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {data.pipeline.map((p) => (
              <div key={p.stage} className="flex flex-col items-center p-4 rounded-xl bg-surface-raised border border-border-subtle">
                <p className="metric-value text-2xl font-bold text-foreground">{p.count}</p>
                <p className="text-xs text-foreground-faint mt-1">{p.stage}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-item glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Inventory Alerts</h3>
          <div className="space-y-3">
            {data.inventoryAlerts.map((item) => (
              <div key={item.sku} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">{item.name}</p>
                  <p className="text-[10px] text-foreground-faint font-mono">{item.sku}</p>
                </div>
                <StatusPill status={item.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="bento-item glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Top Products</h3>
          <div className="space-y-3">
            {data.topProducts.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground-muted">{p.name}</span>
                  <span className="text-xs font-medium text-foreground">{p.share}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-hover overflow-hidden">
                  <div className="h-full rounded-full bg-accent-emerald" style={{ width: `${p.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-item bento-item-large glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Orders</h3>
          <DataTableMini
            columns={[
              { key: "id", header: "Order #" },
              { key: "hotel", header: "Hotel" },
              { key: "total", header: "Total" },
              { key: "status", header: "Status", render: (row) => <StatusPill status={row.status as string} /> },
              { key: "date", header: "Date", className: "text-right" },
            ]}
            data={data.recentOrders}
          />
        </div>

        <div className="bento-item glass-card p-5 flex flex-col justify-center items-center text-center">
          <TrendingUp size={22} className="text-accent-emerald mb-2" />
          <p className="text-sm font-medium text-foreground">{data.forecast}</p>
          <p className="text-xs text-foreground-faint mt-1">Demand Forecast</p>
        </div>
      </div>
    </div>
  );
}
