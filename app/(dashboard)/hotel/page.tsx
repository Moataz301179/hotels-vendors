import {
  Clock,
  CreditCard,
  TrendingUp,
  FileCheck,
  ShoppingCart,
  Package,
  CheckCircle,
  XCircle,
  Search,
  ChevronDown,
  Users,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";
import { Sparkline } from "@/components/dashboards/shared/sparkline";
import { PipelineSteps } from "@/components/dashboards/shared/pipeline-steps";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server-auth";

async function getData() {
  const user = await getCurrentUser();
  if (!user || !user.hotelId) {
    return null;
  }

  const [orders, productCount, authorityRules, pendingCount, deliveredTotal, avgOrder] = await Promise.all([
    prisma.order.findMany({
      where: { hotelId: user.hotelId },
      include: { supplier: { select: { name: true } }, items: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.product.count(),
    prisma.authorityRule.findMany({ where: { isActive: true }, orderBy: { priority: "desc" } }),
    prisma.order.count({ where: { hotelId: user.hotelId, status: "PENDING_APPROVAL" } }),
    prisma.order.aggregate({
      where: { hotelId: user.hotelId, status: "DELIVERED" },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { hotelId: user.hotelId },
      _avg: { total: true },
    }),
  ]);

  const totalSpend = deliveredTotal._sum.total ?? 0;
  const avg = avgOrder._avg.total ?? 0;

  return {
    hotelName: user.name,
    orders: orders.map((o) => ({
      id: o.orderNumber,
      supplier: o.supplier?.name ?? "Unknown",
      items: o.items.length,
      total: `EGP ${o.total.toLocaleString()}`,
      status: o.status.replace("_", " "),
      date: o.createdAt.toISOString().split("T")[0],
    })),
    metrics: [
      {
        label: "Pending POs",
        value: String(pendingCount),
        trend: { direction: "up" as const, label: pendingCount > 0 ? `${pendingCount} awaiting` : "All clear" },
        icon: Clock,
        sparklineData: [0, 0, 0, pendingCount, pendingCount, pendingCount, pendingCount],
      },
      {
        label: "Total Spend",
        value: `EGP ${Math.round(totalSpend).toLocaleString()}`,
        trend: { direction: "up" as const, label: "+12%" },
        icon: CreditCard,
        sparklineData: [totalSpend * 0.7, totalSpend * 0.75, totalSpend * 0.72, totalSpend * 0.8, totalSpend * 0.88, totalSpend * 0.95, totalSpend],
      },
      {
        label: "30-Day Spend",
        value: `EGP ${Math.round(totalSpend * 0.5).toLocaleString()}`,
        trend: { direction: "down" as const, label: "-8%" },
        icon: TrendingUp,
        sparklineData: [totalSpend * 0.6, totalSpend * 0.58, totalSpend * 0.56, totalSpend * 0.55, totalSpend * 0.52, totalSpend * 0.51, totalSpend * 0.5],
      },
      {
        label: "ETA Approved",
        value: "100%",
        trend: { direction: "up" as const, label: "All clear" },
        icon: FileCheck,
        sparklineData: [80, 85, 90, 95, 100, 100, 100],
      },
      {
        label: "Avg Order",
        value: `EGP ${Math.round(avg).toLocaleString()}`,
        trend: { direction: "up" as const, label: "+5%" },
        icon: ShoppingCart,
        sparklineData: [avg * 0.9, avg * 0.92, avg * 0.95, avg * 0.97, avg * 0.98, avg * 0.99, avg],
      },
      {
        label: "Products",
        value: String(productCount),
        trend: { direction: "up" as const, label: "+3 new" },
        icon: Package,
        sparklineData: [productCount * 0.6, productCount * 0.65, productCount * 0.7, productCount * 0.75, productCount * 0.8, productCount * 0.9, productCount],
      },
    ],
    authorityRules: authorityRules.map((r) => ({
      role: r.role,
      label: r.name,
      range: `EGP ${r.minValue.toLocaleString()} – ${r.maxValue.toLocaleString()}`,
      color: r.action === "AUTO_APPROVE" ? "#34d399" : r.action === "DUAL_SIGN_OFF" ? "#800000" : "rgba(255,255,255,0.35)",
    })),
  };
}

function StatusPill({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    "PENDING APPROVAL": {
      bg: "rgba(251,191,36,0.08)",
      text: "#fbbf24",
      border: "rgba(251,191,36,0.20)",
      dot: "#fbbf24",
    },
    DELIVERED: {
      bg: "rgba(52,211,153,0.08)",
      text: "#34d399",
      border: "rgba(52,211,153,0.20)",
      dot: "#34d399",
    },
    CONFIRMED: {
      bg: "rgba(96,165,250,0.08)",
      text: "#60a5fa",
      border: "rgba(96,165,250,0.20)",
      dot: "#60a5fa",
    },
    SHIPPED: {
      bg: "rgba(255,255,255,0.05)",
      text: "rgba(255,255,255,0.60)",
      border: "rgba(255,255,255,0.10)",
      dot: "rgba(255,255,255,0.40)",
    },
  };
  const c = config[status] || config["SHIPPED"];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {status}
    </span>
  );
}

function MetricCard({
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
      className="glass-card-interactive p-4 flex flex-col justify-between"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="label-upper">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.60)]">
          <Icon size={16} />
        </div>
      </div>
      <div>
        <p className="text-xl font-bold text-white metric-value">{value}</p>
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
            width={60}
            height={24}
            color={isPositiveTrend ? "#34d399" : "#ef4444"}
            fillColor={isPositiveTrend ? "rgba(52,211,153,0.06)" : "rgba(239,68,68,0.06)"}
          />
        </div>
      </div>
    </div>
  );
}

export default async function HotelDashboardPage() {
  const data = await getData();
  if (!data) {
    return (
      <div className="max-w-[1600px] mx-auto p-8">
        <p className="text-white">Loading hotel data...</p>
      </div>
    );
  }

  const pendingOrders = data.orders.filter((o) => o.status.includes("PENDING"));

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-sm text-[rgba(255,255,255,0.40)] mt-0.5">
            {data.hotelName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{
              background: "rgba(52,211,153,0.08)",
              color: "#34d399",
              borderColor: "rgba(52,211,153,0.20)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-dot-pulse" />
            ETA Connected
          </span>
          <span className="text-xs text-[rgba(255,255,255,0.40)]">
            Credit: <span className="text-white font-medium metric-value">EGP 0</span>
          </span>
          <button className="btn-primary h-8 px-3 text-xs">
            <Plus size={14} />
            New PO
          </button>
        </div>
      </div>

      {/* Metrics — Bento Row */}
      <div className="bento-grid mb-6 stagger-children">
        {data.metrics.map((m, i) => (
          <div key={m.label} className="bento-item animate-fade-in-up">
            <MetricCard {...m} delay={i * 50} />
          </div>
        ))}
      </div>

      {/* Main Content — Bento Grid */}
      <div className="bento-grid">
        {/* Purchase Orders Table */}
        <div className="bento-item-8 animate-fade-in-up">
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-3">
                <ClipboardIcon />
                <h2 className="text-sm font-semibold text-white">Purchase Orders</h2>
                <span className="text-xs text-[rgba(255,255,255,0.30)]">{data.orders.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative group">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.25)] group-focus-within:text-[#800000] transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="h-9 w-44 pl-9 pr-3 text-xs text-white placeholder:text-[rgba(255,255,255,0.25)] glass-input"
                  />
                </div>
                <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs text-[rgba(255,255,255,0.50)] hover:text-white glass-input">
                  All <ChevronDown size={12} />
                </button>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.04)]">
                  {["PO #", "Supplier", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.30)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.orders.map((o) => (
                  <tr key={o.id} className="data-table-row">
                    <td className="px-5 py-3.5">
                      <span className="text-white font-medium text-xs">{o.id}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[rgba(255,255,255,0.60)] text-xs">{o.supplier}</td>
                    <td className="px-5 py-3.5 text-[rgba(255,255,255,0.40)] text-xs">{o.items} items</td>
                    <td className="px-5 py-3.5 text-white font-medium metric-value text-xs">{o.total}</td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-5 py-3.5 text-[rgba(255,255,255,0.30)] text-xs">{o.date}</td>
                    <td className="px-5 py-3.5">
                      {o.status.includes("PENDING") ? (
                        <div className="flex items-center gap-1.5">
                          <button className="p-1.5 rounded-md hover:bg-[rgba(52,211,153,0.10)] text-[#34d399] border border-[rgba(52,211,153,0.15)] hover:border-[rgba(52,211,153,0.30)] transition-all">
                            <CheckCircle size={14} />
                          </button>
                          <button className="p-1.5 rounded-md hover:bg-[rgba(239,68,68,0.10)] text-[#ef4444] border border-[rgba(239,68,68,0.15)] hover:border-[rgba(239,68,68,0.30)] transition-all">
                            <XCircle size={14} />
                          </button>
                        </div>
                      ) : (
                        <button className="text-[11px] text-[rgba(255,255,255,0.40)] hover:text-white transition-colors">
                          View →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="bento-item-4 flex flex-col gap-6">
          {/* Approval Queue */}
          <div className="glass-card p-5 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield size={15} className="text-[#800000]" />
                <h3 className="text-sm font-semibold text-white">Approval Queue</h3>
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(128,0,0,0.15)", color: "#ff4d4d" }}
              >
                {pendingOrders.length}
              </span>
            </div>
            {pendingOrders.length === 0 ? (
              <p className="text-[11px] text-[rgba(255,255,255,0.30)]">No pending approvals</p>
            ) : (
              pendingOrders.slice(0, 1).map((o) => (
                <div key={o.id} className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white">{o.id}</span>
                    <StatusPill status={o.status} />
                  </div>
                  <p className="text-[11px] text-[rgba(255,255,255,0.35)]">
                    {o.supplier} · {o.total}
                  </p>
                  <div className="mt-3">
                    <PipelineSteps
                      steps={[
                        { label: "Draft", count: undefined },
                        { label: "Review", count: undefined },
                        { label: "Approve", count: undefined },
                        { label: "Issue", count: undefined },
                      ]}
                      activeIndex={1}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button className="flex-1 h-8 rounded-md text-xs font-medium transition-all bg-[rgba(52,211,153,0.08)] text-[#34d399] border border-[rgba(52,211,153,0.15)] hover:bg-[rgba(52,211,153,0.14)]">
                      Approve
                    </button>
                    <button className="flex-1 h-8 rounded-md text-xs font-medium transition-all bg-[rgba(239,68,68,0.08)] text-[#ef4444] border border-[rgba(239,68,68,0.15)] hover:bg-[rgba(239,68,68,0.14)]">
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Team */}
          <div className="glass-card p-5 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <Users size={15} className="text-[rgba(255,255,255,0.40)]" />
              <h3 className="text-sm font-semibold text-white">Approval Chain</h3>
            </div>
            <div className="space-y-3">
              {[
                { initials: "KF", name: "Karim Fathy", role: "Dept Head", limit: "EGP 50,000" },
                { initials: "LI", name: "Laila Ibrahim", role: "Dept Head", limit: "EGP 50,000" },
                { initials: "MF", name: "Mohamed Farouk", role: "Controller", limit: "EGP 250,000" },
                { initials: "SE", name: "Sarah El-Masry", role: "General Manager", limit: "EGP 1,000,000" },
                { initials: "AH", name: "Ahmed Hassan", role: "Owner", limit: "Unlimited" },
              ].map((t, i) => (
                <div key={t.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ring-1 ring-[rgba(255,255,255,0.08)]"
                      style={{ background: i === 0 ? "#800000" : "rgba(255,255,255,0.08)" }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">{t.name}</p>
                      <p className="text-[10px] text-[rgba(255,255,255,0.30)]">{t.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[rgba(255,255,255,0.25)] metric-value">{t.limit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Authority Matrix */}
          <div className="glass-card p-5 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={15} className="text-[rgba(255,255,255,0.40)]" />
              <h3 className="text-sm font-semibold text-white">Authority Matrix</h3>
            </div>
            <div className="space-y-3">
              {data.authorityRules.map((r) => (
                <div key={r.role} className="flex items-center gap-3">
                  <div
                    className="w-1 h-6 rounded-full"
                    style={{ background: r.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white">{r.role}</span>
                      <span className="text-[10px] text-[rgba(255,255,255,0.35)]">{r.label}</span>
                    </div>
                    <p className="text-[10px] text-[rgba(255,255,255,0.25)] metric-value mt-0.5">{r.range}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-[11px] text-[rgba(255,255,255,0.40)] hover:text-[#ff4d4d] transition-colors">
              View all rules →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClipboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[rgba(255,255,255,0.30)]">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}
