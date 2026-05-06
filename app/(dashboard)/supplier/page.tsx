import { StatusPill } from "@/components/dashboards/shared/status-pill";
import { DataTableMini } from "@/components/dashboards/shared/data-table-mini";
import { Sparkline } from "@/components/dashboards/shared/sparkline";
import { PipelineSteps } from "@/components/dashboards/shared/pipeline-steps";
import { ProgressRing } from "@/components/dashboards/shared/progress-ring";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server-auth";
import {
  ClipboardList,
  Banknote,
  Package,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Plus,
} from "lucide-react";

async function getData() {
  const user = await getCurrentUser();
  if (!user || !user.supplierId) {
    return null;
  }

  const [orders, products, orderCounts] = await Promise.all([
    prisma.order.findMany({
      where: { supplierId: user.supplierId },
      include: { hotel: { select: { name: true } }, items: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.product.findMany({
      where: { supplierId: user.supplierId },
      orderBy: { stockQuantity: "asc" },
      take: 3,
    }),
    prisma.order.groupBy({
      by: ["status"],
      where: { supplierId: user.supplierId },
      _count: { status: true },
    }),
  ]);

  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const productCount = products.length;

  const pipelineMap = new Map(orderCounts.map((c) => [c.status, c._count.status]));
  const pipeline = [
    { stage: "Pending", count: pipelineMap.get("PENDING_APPROVAL") || 0 },
    { stage: "Processing", count: pipelineMap.get("CONFIRMED") || 0 },
    { stage: "Shipped", count: pipelineMap.get("IN_TRANSIT") || 0 },
    { stage: "Delivered", count: pipelineMap.get("DELIVERED") || 0 },
  ];

  return {
    metrics: [
      {
        label: "Total Orders",
        value: String(totalOrders),
        trend: { direction: "up" as const, label: "+8 this week" },
        icon: ClipboardList,
        sparklineData: [Math.max(1, totalOrders * 0.8), Math.max(1, totalOrders * 0.82), Math.max(1, totalOrders * 0.85), Math.max(1, totalOrders * 0.83), Math.max(1, totalOrders * 0.9), Math.max(1, totalOrders * 0.95), Math.max(1, totalOrders)],
      },
      {
        label: "Revenue This Month",
        value: `${Math.round(revenue).toLocaleString()} EGP`,
        trend: { direction: "up" as const, label: "+8.4%" },
        icon: Banknote,
        sparklineData: [revenue * 0.8, revenue * 0.85, revenue * 0.83, revenue * 0.88, revenue * 0.92, revenue * 0.96, revenue],
      },
      {
        label: "Active Products",
        value: String(productCount),
        trend: { direction: "up" as const, label: "98% in stock" },
        icon: Package,
        sparklineData: [Math.max(1, productCount * 0.85), Math.max(1, productCount * 0.88), Math.max(1, productCount * 0.9), Math.max(1, productCount * 0.92), Math.max(1, productCount * 0.95), Math.max(1, productCount * 0.98), Math.max(1, productCount)],
      },
      {
        label: "Avg Fulfillment",
        value: "2.4 days",
        trend: { direction: "down" as const, label: "-12%" },
        icon: Clock,
        sparklineData: [3.2, 3.0, 2.9, 2.8, 2.6, 2.5, 2.4],
      },
    ],
    pipeline,
    inventoryAlerts: products.map((p) => ({
      sku: p.sku,
      name: p.name,
      qty: p.stockQuantity,
      status: p.stockQuantity < (p.minOrderQty || 10) ? "critical" : p.stockQuantity < (p.minOrderQty || 10) * 2 ? "low" : "ok",
      threshold: p.minOrderQty || 10,
    })),
    topProducts: [
      { name: "Egyptian Cotton Towels", share: 85 },
      { name: "Olive Oil 5L", share: 62 },
      { name: "Industrial Detergent", share: 45 },
      { name: "LED Downlight", share: 30 },
    ],
    recentOrders: orders.map((o) => ({
      id: o.orderNumber,
      hotel: o.hotel?.name ?? "Unknown",
      total: `${o.total.toLocaleString()} EGP`,
      status: o.status.toLowerCase().replace("_", " "),
      date: o.createdAt.toISOString().split("T")[0],
    })),
    forecast: "Next week: +12% rice orders",
    onTimeRate: 94,
  };
}

function SupplierMetricCard({
  label,
  value,
  trend,
  icon: Icon,
  sparklineData,
  delay,
}: {
  label: string;
  value: string;
  trend: { direction: "up" | "down"; label: string };
  icon: React.ElementType;
  sparklineData: number[];
  delay: number;
}) {
  const TrendIcon = trend.direction === "up" ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend.direction === "up" ? "#34d399" : "#ef4444";
  const isPositiveTrend = trend.direction === "up";

  return (
    <div
      className="glass-card-interactive p-5 flex flex-col justify-between animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="label-upper">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.60)]">
          <Icon size={16} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white metric-value">{value}</p>
        <div className="flex items-center justify-between mt-2">
          <span
            className="inline-flex items-center gap-0.5 text-[11px] font-medium"
            style={{ color: trendColor }}
          >
            <TrendIcon size={12} />
            {trend.label}
          </span>
          <Sparkline
            data={sparklineData}
            width={64}
            height={26}
            color={isPositiveTrend ? "#34d399" : "#ef4444"}
            fillColor={isPositiveTrend ? "rgba(52,211,153,0.06)" : "rgba(239,68,68,0.06)"}
          />
        </div>
      </div>
    </div>
  );
}

export default async function SupplierDashboardPage() {
  const data = await getData();
  if (!data) {
    return (
      <div className="max-w-[1600px] mx-auto p-8">
        <p className="text-white">Loading supplier data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text-animated">Supplier Central</span>
          </h1>
          <p className="text-sm text-[rgba(255,255,255,0.40)] mt-0.5">
            Manage inventory, track orders, and optimize fulfillment
          </p>
        </div>
        <button className="btn-primary h-9 px-4 text-xs">
          <Plus size={14} />
          Add Product
        </button>
      </div>

      {/* Metrics */}
      <div className="bento-grid mb-6">
        {data.metrics.map((m, i) => (
          <div key={m.label} className="bento-item-3 animate-fade-in-up">
            <SupplierMetricCard {...m} delay={i * 50} />
          </div>
        ))}
      </div>

      {/* Main Bento Grid */}
      <div className="bento-grid">
        {/* Order Pipeline */}
        <div className="bento-item-6 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-white">Order Pipeline</h3>
              <span className="text-[10px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider">
                {data.pipeline.reduce((a, b) => a + b.count, 0)} total
              </span>
            </div>
            <div className="mb-6">
              <PipelineSteps
                steps={data.pipeline.map((p) => ({ label: p.stage, count: p.count }))}
                activeIndex={1}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {data.pipeline.map((p) => (
                <div
                  key={p.stage}
                  className="flex flex-col items-center p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.10)] transition-colors"
                >
                  <p className="text-xl font-bold text-white metric-value">{p.count}</p>
                  <p className="text-[10px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider mt-1">
                    {p.stage}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={15} className="text-[#fbbf24]" />
              <h3 className="text-sm font-semibold text-white">Inventory Alerts</h3>
            </div>
            <div className="space-y-4">
              {data.inventoryAlerts.map((item) => {
                const pct = Math.min(100, Math.round((item.qty / item.threshold) * 100));
                const barColor = item.status === "critical" ? "#ef4444" : "#fbbf24";
                return (
                  <div key={item.sku}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <p className="text-xs font-medium text-white">{item.name}</p>
                        <p className="text-[10px] text-[rgba(255,255,255,0.25)] font-mono">{item.sku}</p>
                      </div>
                      <StatusPill status={item.status} />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: barColor }}
                        />
                      </div>
                      <span className="text-[10px] text-[rgba(255,255,255,0.30)] metric-value w-8 text-right">
                        {item.qty}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Performance Ring */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-semibold text-white mb-4">On-Time Delivery</h3>
            <ProgressRing
              value={data.onTimeRate}
              size={80}
              strokeWidth={5}
              color="#800000"
              trackColor="rgba(255,255,255,0.05)"
            >
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-white metric-value">{data.onTimeRate}%</span>
              </div>
            </ProgressRing>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp size={12} className="text-[#34d399]" />
              <span className="text-[11px] text-[#34d399] font-medium">+3% vs last month</span>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <h3 className="text-sm font-semibold text-white mb-4">Top Products</h3>
            <div className="space-y-4">
              {data.topProducts.map((p) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[rgba(255,255,255,0.50)] truncate max-w-[140px]">
                      {p.name}
                    </span>
                    <span className="text-xs font-medium text-white metric-value">{p.share}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[rgba(255,255,255,0.15)]"
                      style={{ width: `${p.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bento-item-6 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Recent Orders</h3>
              <button className="text-[11px] text-[rgba(255,255,255,0.40)] hover:text-white transition-colors">
                View all →
              </button>
            </div>
            <DataTableMini
              columns={[
                { key: "id", header: "Order #" },
                { key: "hotel", header: "Hotel" },
                { key: "total", header: "Total", className: "metric-value" },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => <StatusPill status={row.status as string} />,
                },
                { key: "date", header: "Date", className: "text-right text-[rgba(255,255,255,0.30)]" },
              ]}
              data={data.recentOrders}
            />
          </div>
        </div>

        {/* Demand Forecast */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full flex flex-col justify-center items-center text-center">
            <div className="w-10 h-10 rounded-full bg-[rgba(52,211,153,0.08)] flex items-center justify-center mb-3">
              <TrendingUp size={18} className="text-[#34d399]" />
            </div>
            <p className="text-sm font-medium text-white">{data.forecast}</p>
            <p className="text-[11px] text-[rgba(255,255,255,0.30)] mt-1">Demand Forecast</p>
            <Sparkline
              data={[40, 45, 42, 50, 55, 60, 72]}
              width={120}
              height={40}
              color="#34d399"
              fillColor="rgba(52,211,153,0.08)"
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
