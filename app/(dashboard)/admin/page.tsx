import { Sparkline } from "@/components/dashboards/shared/sparkline";
import { DataTableMini } from "@/components/dashboards/shared/data-table-mini";
import { ProgressRing } from "@/components/dashboards/shared/progress-ring";
import { prisma } from "@/lib/prisma";
import {
  Building2,
  Banknote,
  Receipt,
  Users,
  CheckCircle,
  AlertTriangle,
  Server,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from "lucide-react";

async function getData() {
  const [tenantCount, userCount, orderTotal, auditLogs] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const tenants = await prisma.tenant.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const gmv = orderTotal._sum.total ?? 0;
  const fees = gmv * 0.02;

  return {
    metrics: [
      {
        label: "Total Tenants",
        value: String(tenantCount),
        trend: { direction: "up" as const, label: "+2 this week" },
        icon: Building2,
        sparklineData: [Math.max(1, tenantCount - 4), Math.max(1, tenantCount - 3), Math.max(1, tenantCount - 3), Math.max(1, tenantCount - 2), Math.max(1, tenantCount - 1), Math.max(1, tenantCount - 1), tenantCount],
      },
      {
        label: "Monthly GMV",
        value: `${(gmv / 1000000).toFixed(1)}M EGP`,
        trend: { direction: "up" as const, label: "On track" },
        icon: Banknote,
        sparklineData: [gmv * 0.7, gmv * 0.75, gmv * 0.72, gmv * 0.8, gmv * 0.88, gmv * 0.95, gmv],
      },
      {
        label: "Platform Fees",
        value: `${Math.round(fees / 1000)}K EGP`,
        trend: { direction: "up" as const, label: "2.0% margin" },
        icon: Receipt,
        sparklineData: [fees * 0.7, fees * 0.73, fees * 0.77, fees * 0.82, fees * 0.87, fees * 0.93, fees],
      },
      {
        label: "Active Users",
        value: String(userCount),
        trend: { direction: "up" as const, label: "+8 today" },
        icon: Users,
        sparklineData: [Math.max(1, userCount - 6), Math.max(1, userCount - 5), Math.max(1, userCount - 4), Math.max(1, userCount - 3), Math.max(1, userCount - 2), Math.max(1, userCount - 1), userCount],
      },
    ],
    tenants: tenants.map((t) => ({
      name: t.name,
      status: t.status === "ACTIVE" ? "active" : t.status === "SUSPENDED" ? "warning" : "critical",
      lastActivity: "2m ago",
      users: t._count.users,
    })),
    auditLog: auditLogs.map((a) => ({
      action: a.action,
      actor: a.actorId ?? "system",
      time: a.createdAt.toISOString().split("T")[1].slice(0, 5),
    })),
    feesCollected: `EGP ${Math.round(fees).toLocaleString()}`,
    anomalyFlags: 2,
    systemHealth: [
      { name: "API", uptime: 99.9 },
      { name: "Database", uptime: 99.99 },
      { name: "ETA Bridge", uptime: 99.5 },
      { name: "Redis", uptime: 100 },
    ],
  };
}

function AdminMetricCard({
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

export default async function AdminDashboardPage() {
  const data = await getData();

  const tenantDot = (status: string) => {
    switch (status) {
      case "active": return "#34d399";
      case "warning": return "#fbbf24";
      case "critical": return "#ef4444";
      default: return "rgba(255,255,255,0.20)";
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text-animated">Platform Control</span>
          </h1>
          <p className="text-sm text-[rgba(255,255,255,0.40)] mt-0.5">
            Oversee tenants, fees, audit logs, and system health
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{
              background: "rgba(239,68,68,0.08)",
              color: "#ef4444",
              borderColor: "rgba(239,68,68,0.20)",
            }}
          >
            <AlertTriangle size={12} />
            {data.anomalyFlags} anomalies
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="bento-grid mb-6">
        {data.metrics.map((m, i) => (
          <div key={m.label} className="bento-item-3 animate-fade-in-up">
            <AdminMetricCard {...m} delay={i * 50} />
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="bento-grid">
        {/* Tenant Health */}
        <div className="bento-item-6 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Tenant Health</h3>
              <span className="text-[10px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider">
                {data.tenants.length} tenants
              </span>
            </div>
            <div className="space-y-2">
              {data.tenants.map((t) => (
                <div
                  key={t.name}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: tenantDot(t.status) }}
                    />
                    <span className="text-sm text-white">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[rgba(255,255,255,0.25)]">{t.lastActivity}</span>
                    <span className="text-xs text-[rgba(255,255,255,0.40)] metric-value">{t.users} users</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bento-item-6 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Audit Log Preview</h3>
              <ShieldCheck size={15} className="text-[rgba(255,255,255,0.30)]" />
            </div>
            <DataTableMini
              columns={[
                { key: "action", header: "Action" },
                { key: "actor", header: "Actor", className: "text-[rgba(255,255,255,0.40)]" },
                { key: "time", header: "Time", className: "text-right text-[rgba(255,255,255,0.30)]" },
              ]}
              data={data.auditLog}
            />
          </div>
        </div>

        {/* Fees Card */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full flex flex-col justify-center">
            <Receipt size={18} className="text-[rgba(255,255,255,0.40)] mb-3" />
            <p className="text-[11px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider">Collected this month</p>
            <p className="text-2xl font-bold text-white metric-value mt-1">{data.feesCollected}</p>
            <Sparkline
              data={[30000, 32000, 35000, 38000, 40000, 43000, 45230]}
              width={120}
              height={32}
              color="#34d399"
              fillColor="rgba(52,211,153,0.06)"
              className="mt-3"
            />
          </div>
        </div>

        {/* Security Alert */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full flex flex-col justify-center border border-[rgba(239,68,68,0.15)]">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-[#ef4444]" />
              <span className="text-[10px] font-medium text-[#ef4444] uppercase tracking-wider">Security</span>
            </div>
            <p className="text-sm text-white font-medium">
              {data.anomalyFlags} cross-tenant access attempts blocked
            </p>
            <p className="text-[11px] text-[rgba(255,255,255,0.30)] mt-1">
              Last blocked 3 minutes ago
            </p>
          </div>
        </div>

        {/* System Health */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <h3 className="text-sm font-semibold text-white mb-4">System Health</h3>
            <div className="space-y-3">
              {data.systemHealth.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server size={14} className="text-[rgba(255,255,255,0.30)]" />
                    <span className="text-xs text-[rgba(255,255,255,0.50)]">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[rgba(255,255,255,0.30)] metric-value">{s.uptime}%</span>
                    <CheckCircle size={14} className="text-[#34d399]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Uptime Ring */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full flex flex-col items-center justify-center text-center">
            <p className="text-[11px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider mb-3">Platform Uptime</p>
            <ProgressRing
              value={99.8}
              size={72}
              strokeWidth={5}
              color="#800000"
              trackColor="rgba(255,255,255,0.05)"
            >
              <span className="text-lg font-bold text-white metric-value">99.8%</span>
            </ProgressRing>
            <p className="text-[11px] text-[#34d399] mt-2">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}
