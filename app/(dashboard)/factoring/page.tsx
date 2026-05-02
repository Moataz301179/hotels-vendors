import { MetricTile } from "@/components/dashboards/shared/metric-tile";
import { StatusPill } from "@/components/dashboards/shared/status-pill";
import { DataTableMini } from "@/components/dashboards/shared/data-table-mini";
import {
  Landmark,
  Banknote,
  TrendingUp,
  Shield,
  CheckCircle,
  AlertTriangle,
  TrendingDown,
} from "lucide-react";

async function getData() {
  // TODO: Replace with real API call
  return {
    metrics: [
      { label: "Portfolio Value", value: "24.8M EGP", trend: "+4.2%", icon: Banknote, iconBg: "bg-accent-cyan/10 text-accent-cyan" },
      { label: "Active Facilities", value: "45", trend: "+3 this week", icon: Landmark, iconBg: "bg-accent-emerald/10 text-accent-emerald" },
      { label: "Avg Yield", value: "18.7%", trend: "Target: 20%", icon: TrendingUp, iconBg: "bg-accent-amber/10 text-accent-amber" },
      { label: "Risk Score", value: "6.8/10", trend: "Stable", icon: Shield, iconBg: "bg-accent-gold/10 text-accent-gold" },
    ],
    riskCells: [
      { risk: "low" }, { risk: "low" }, { risk: "medium" }, { risk: "low" },
      { risk: "medium" }, { risk: "low" }, { risk: "high" }, { risk: "medium" },
      { risk: "low" }, { risk: "low" }, { risk: "low" }, { risk: "critical" },
      { risk: "low" }, { risk: "medium" }, { risk: "low" }, { risk: "low" },
    ],
    fundingQueue: [
      { id: "INV-2026-0089", hotel: "Marriott Cairo", amount: "142,000 EGP", status: "pending", risk: "low" },
      { id: "INV-2026-0087", hotel: "Four Seasons Giza", amount: "378,000 EGP", status: "pending", risk: "low" },
      { id: "INV-2026-0085", hotel: "Pyramid View Hotel", amount: "56,000 EGP", status: "pending", risk: "high" },
      { id: "INV-2026-0082", hotel: "Hilton Alexandria", amount: "456,000 EGP", status: "pending", risk: "low" },
    ],
    recentFunding: [
      { amount: "214,000 EGP", date: "2h ago" },
      { amount: "89,500 EGP", date: "5h ago" },
      { amount: "1.2M EGP", date: "1d ago" },
    ],
    marketRate: "2.2%",
    anomaly: "Hotel X default risk elevated",
  };
}

export default async function FactoringDashboardPage() {
  const data = await getData();

  const riskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-accent-emerald/40";
      case "medium": return "bg-accent-amber/40";
      case "high": return "bg-brand-500/40";
      case "critical": return "bg-brand-800/60";
      default: return "bg-surface-hover";
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text-animated">Liquidity Desk</span>
        </h1>
        <p className="text-foreground-muted mt-1 text-sm">Monitor portfolio, assess risk, and manage funding</p>
      </div>

      <div className="bento-grid mb-6">
        {data.metrics.map((m) => (
          <MetricTile key={m.label} {...m} />
        ))}
      </div>

      <div className="bento-grid">
        <div className="bento-item bento-item-large glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Heatmap</h3>
          <div className="grid grid-cols-4 gap-2">
            {data.riskCells.map((cell, i) => (
              <div key={i} className={`h-12 rounded-lg ${riskColor(cell.risk)} border border-border-subtle`} />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-foreground-faint">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-accent-emerald/40" /> Low</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-accent-amber/40" /> Medium</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-brand-500/40" /> High</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-brand-800/60" /> Critical</span>
          </div>
        </div>

        <div className="bento-item bento-item-large glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Funding Queue</h3>
          <DataTableMini
            columns={[
              { key: "id", header: "Invoice" },
              { key: "hotel", header: "Hotel" },
              { key: "amount", header: "Amount" },
              { key: "risk", header: "Risk", render: (row) => <StatusPill status={row.risk as string} /> },
            ]}
            data={data.fundingQueue}
          />
        </div>

        <div className="bento-item glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Funding</h3>
          <div className="space-y-3">
            {data.recentFunding.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle size={14} className="text-accent-emerald flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{f.amount}</p>
                  <p className="text-[11px] text-foreground-faint">{f.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-item glass-card p-5 flex flex-col justify-center">
          <TrendingDown size={20} className="text-accent-cyan mb-2" />
          <p className="text-sm text-foreground-faint">Current discount rate</p>
          <p className="text-2xl font-bold text-foreground metric-value">{data.marketRate}</p>
        </div>

        <div className="bento-item glass-card p-5 flex flex-col justify-center border-brand-700/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-brand-400" />
            <span className="text-xs font-medium text-brand-400 uppercase tracking-wider">Anomaly</span>
          </div>
          <p className="text-sm text-foreground font-medium">{data.anomaly}</p>
        </div>
      </div>
    </div>
  );
}
