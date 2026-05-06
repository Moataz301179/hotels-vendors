import { StatusPill } from "@/components/dashboards/shared/status-pill";
import { DataTableMini } from "@/components/dashboards/shared/data-table-mini";
import { Sparkline } from "@/components/dashboards/shared/sparkline";
import { ProgressRing } from "@/components/dashboards/shared/progress-ring";
import {
  Landmark,
  Banknote,
  TrendingUp,
  Shield,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

async function getData() {
  return {
    metrics: [
      {
        label: "Portfolio Value",
        value: "24.8M EGP",
        trend: { direction: "up" as const, label: "+4.2%" },
        icon: Banknote,
        sparklineData: [20000000, 21000000, 21500000, 22000000, 23000000, 24000000, 24800000],
      },
      {
        label: "Active Facilities",
        value: "45",
        trend: { direction: "up" as const, label: "+3 this week" },
        icon: Landmark,
        sparklineData: [35, 36, 38, 38, 40, 42, 45],
      },
      {
        label: "Avg Yield",
        value: "18.7%",
        trend: { direction: "up" as const, label: "Target: 20%" },
        icon: TrendingUp,
        sparklineData: [16, 16.5, 17, 17.2, 17.8, 18.2, 18.7],
      },
      {
        label: "Risk Score",
        value: "6.8/10",
        trend: { direction: "down" as const, label: "Stable" },
        icon: Shield,
        sparklineData: [8.2, 7.8, 7.5, 7.2, 7.0, 6.9, 6.8],
      },
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
    portfolioDistribution: [
      { label: "Low Risk", value: 62, color: "#34d399" },
      { label: "Medium Risk", value: 28, color: "#fbbf24" },
      { label: "High Risk", value: 8, color: "#ef4444" },
      { label: "Critical", value: 2, color: "#800000" },
    ],
  };
}

function FactoringMetricCard({
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

export default async function FactoringDashboardPage() {
  const data = await getData();

  const riskColor = (risk: string) => {
    switch (risk) {
      case "low": return "rgba(52,211,153,0.30)";
      case "medium": return "rgba(251,191,36,0.30)";
      case "high": return "rgba(239,68,68,0.35)";
      case "critical": return "rgba(128,0,0,0.50)";
      default: return "rgba(255,255,255,0.05)";
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text-animated">Liquidity Desk</span>
          </h1>
          <p className="text-sm text-[rgba(255,255,255,0.40)] mt-0.5">
            Monitor portfolio, assess risk, and manage funding
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{
              background: "rgba(251,191,36,0.08)",
              color: "#fbbf24",
              borderColor: "rgba(251,191,36,0.20)",
            }}
          >
            <AlertTriangle size={12} />
            {data.anomaly}
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="bento-grid mb-6">
        {data.metrics.map((m, i) => (
          <div key={m.label} className="bento-item-3 animate-fade-in-up">
            <FactoringMetricCard {...m} delay={i * 50} />
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="bento-grid">
        {/* Risk Heatmap */}
        <div className="bento-item-6 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Risk Heatmap</h3>
              <span className="text-[10px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider">
                16 active facilities
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {data.riskCells.map((cell, i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg border border-[rgba(255,255,255,0.05)] transition-all hover:scale-[1.02]"
                  style={{ background: riskColor(cell.risk) }}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-[10px] text-[rgba(255,255,255,0.30)]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded" style={{ background: "rgba(52,211,153,0.40)" }} /> Low</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded" style={{ background: "rgba(251,191,36,0.40)" }} /> Medium</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded" style={{ background: "rgba(239,68,68,0.40)" }} /> High</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded" style={{ background: "rgba(128,0,0,0.60)" }} /> Critical</span>
            </div>
          </div>
        </div>

        {/* Funding Queue */}
        <div className="bento-item-6 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Funding Queue</h3>
              <span className="text-[10px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider">
                {data.fundingQueue.length} pending
              </span>
            </div>
            <DataTableMini
              columns={[
                { key: "id", header: "Invoice" },
                { key: "hotel", header: "Hotel" },
                { key: "amount", header: "Amount", className: "metric-value" },
                { key: "risk", header: "Risk", render: (row) => <StatusPill status={row.risk as string} /> },
              ]}
              data={data.fundingQueue}
            />
          </div>
        </div>

        {/* Recent Funding */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <h3 className="text-sm font-semibold text-white mb-4">Recent Funding</h3>
            <div className="space-y-3">
              {data.recentFunding.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[rgba(52,211,153,0.08)] flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={14} className="text-[#34d399]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white metric-value">{f.amount}</p>
                    <p className="text-[11px] text-[rgba(255,255,255,0.30)]">{f.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Rate */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full flex flex-col justify-center">
            <p className="text-[11px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider">Current discount rate</p>
            <p className="text-3xl font-bold text-white metric-value mt-1">{data.marketRate}</p>
            <Sparkline
              data={[2.8, 2.6, 2.5, 2.4, 2.3, 2.25, 2.2]}
              width={120}
              height={32}
              color="#fbbf24"
              fillColor="rgba(251,191,36,0.06)"
              className="mt-3"
            />
          </div>
        </div>

        {/* Portfolio Distribution */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <h3 className="text-sm font-semibold text-white mb-4">Risk Distribution</h3>
            <div className="space-y-3">
              {data.portfolioDistribution.map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[rgba(255,255,255,0.50)]">{d.label}</span>
                    <span className="text-xs font-medium text-white metric-value">{d.value}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${d.value}%`, background: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Ring */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full flex flex-col items-center justify-center text-center">
            <p className="text-[11px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider mb-3">Portfolio Yield</p>
            <ProgressRing
              value={74}
              size={72}
              strokeWidth={5}
              color="#800000"
              trackColor="rgba(255,255,255,0.05)"
            >
              <span className="text-lg font-bold text-white metric-value">74%</span>
            </ProgressRing>
            <p className="text-[11px] text-[#34d399] mt-2">+2.1% vs target</p>
          </div>
        </div>
      </div>
    </div>
  );
}
