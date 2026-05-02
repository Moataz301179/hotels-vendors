import { MetricTile } from "@/components/dashboards/shared/metric-tile";
import { DataTableMini } from "@/components/dashboards/shared/data-table-mini";
import {
  Building2,
  Banknote,
  Receipt,
  Users,
  CheckCircle,
  AlertTriangle,
  Server,
} from "lucide-react";

async function getData() {
  // TODO: Replace with real API call
  return {
    metrics: [
      { label: "Total Tenants", value: "42", trend: "+2 this week", icon: Building2, iconBg: "bg-accent-cyan/10 text-accent-cyan" },
      { label: "Monthly GMV", value: "28.4M EGP", trend: "On track", icon: Banknote, iconBg: "bg-accent-emerald/10 text-accent-emerald" },
      { label: "Platform Fees", value: "569K EGP", trend: "2.0% margin", icon: Receipt, iconBg: "bg-accent-amber/10 text-accent-amber" },
      { label: "Active Users", value: "156", trend: "+8 today", icon: Users, iconBg: "bg-accent-gold/10 text-accent-gold" },
    ],
    tenants: [
      { name: "Marriott Cairo", status: "active", lastActivity: "2m ago", users: 24 },
      { name: "Four Seasons Giza", status: "active", lastActivity: "15m ago", users: 18 },
      { name: "Nile Textiles", status: "active", lastActivity: "1h ago", users: 6 },
      { name: "EFG Hermes", status: "warning", lastActivity: "3h ago", users: 4 },
      { name: "Pyramid View Hotel", status: "critical", lastActivity: "2d ago", users: 3 },
      { name: "Contact Financial", status: "active", lastActivity: "30m ago", users: 5 },
    ],
    auditLog: [
      { action: "Admin override approved", actor: "admin@hv.com", time: "10:42 AM" },
      { action: "Tenant created", actor: "ops@hv.com", time: "09:15 AM" },
      { action: "Authority matrix updated", actor: "security@hv.com", time: "08:30 AM" },
      { action: "Fee disbursement", actor: "system", time: "07:00 AM" },
      { action: "Cross-tenant block", actor: "security@hv.com", time: "06:45 AM" },
    ],
    feesCollected: "EGP 45,230",
    anomalyFlags: 2,
    systemHealth: [
      { name: "API", status: "active" },
      { name: "Database", status: "active" },
      { name: "ETA Bridge", status: "active" },
      { name: "Redis", status: "active" },
    ],
  };
}

export default async function AdminDashboardPage() {
  const data = await getData();

  const tenantDot = (status: string) => {
    switch (status) {
      case "active": return "bg-accent-emerald";
      case "warning": return "bg-accent-amber";
      case "critical": return "bg-brand-500";
      default: return "bg-foreground-faint";
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text-animated">Platform Control</span>
        </h1>
        <p className="text-foreground-muted mt-1 text-sm">Oversee tenants, fees, audit logs, and system health</p>
      </div>

      <div className="bento-grid mb-6">
        {data.metrics.map((m) => (
          <MetricTile key={m.label} {...m} />
        ))}
      </div>

      <div className="bento-grid">
        <div className="bento-item bento-item-large glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Tenant Health</h3>
          <div className="space-y-3">
            {data.tenants.map((t) => (
              <div key={t.name} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${tenantDot(t.status)}`} />
                  <span className="text-sm text-foreground">{t.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-foreground-faint">{t.lastActivity}</span>
                  <span className="text-xs font-mono text-foreground-muted">{t.users} users</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-item bento-item-large glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Audit Log Preview</h3>
          <DataTableMini
            columns={[
              { key: "action", header: "Action" },
              { key: "actor", header: "Actor" },
              { key: "time", header: "Time", className: "text-right" },
            ]}
            data={data.auditLog}
          />
        </div>

        <div className="bento-item glass-card p-5 flex flex-col justify-center">
          <Receipt size={20} className="text-accent-gold mb-2" />
          <p className="text-xs text-foreground-faint">Collected this month</p>
          <p className="text-xl font-bold text-foreground metric-value">{data.feesCollected}</p>
        </div>

        <div className="bento-item glass-card p-5 flex flex-col justify-center border-brand-700/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-brand-400" />
            <span className="text-xs font-medium text-brand-400 uppercase tracking-wider">Security</span>
          </div>
          <p className="text-sm text-foreground font-medium">{data.anomalyFlags} cross-tenant access attempts blocked</p>
        </div>

        <div className="bento-item glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">System Health</h3>
          <div className="space-y-2">
            {data.systemHealth.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server size={14} className="text-foreground-faint" />
                  <span className="text-xs text-foreground-muted">{s.name}</span>
                </div>
                <CheckCircle size={14} className="text-accent-emerald" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
