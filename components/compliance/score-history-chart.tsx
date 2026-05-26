"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

interface ScorePoint {
  assessedAt: string;
  scoreValue: number;
  source: string;
  scoreLabel?: string | null;
  riskTier?: string | null;
}

interface ScoreHistoryChartProps {
  scores: ScorePoint[];
  height?: number;
  showGrid?: boolean;
}

const SOURCE_COLORS: Record<string, string> = {
  I_SCORE: "#10b981",
  DUN_BRADSTREET: "#3b82f6",
  GAFI: "#f59e0b",
  MANUAL: "#bef264",
  PLATFORM_INTERNAL: "#06b6d4",
};

const RISK_COLORS: Record<string, string> = {
  LOW: "#10b981",
  MEDIUM: "#f59e0b",
  HIGH: "#ef4444",
  CRITICAL: "#7f1d1d",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export function ScoreHistoryChart({ scores, height = 280, showGrid = true }: ScoreHistoryChartProps) {
  if (!scores || scores.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-[13px] text-neutral-500 border border-white/[0.06] rounded-xl bg-white/[0.02]">
        No score history available
      </div>
    );
  }

  // Normalize data for recharts — group by date, one entry per source
  const dataMap = new Map<string, Record<string, number | string>>();
  const sources = new Set<string>();

  for (const s of scores) {
    const dateKey = formatDate(s.assessedAt);
    sources.add(s.source);

    if (!dataMap.has(dateKey)) {
      dataMap.set(dateKey, { date: dateKey, fullDate: s.assessedAt });
    }
    const entry = dataMap.get(dateKey)!;
    entry[s.source] = s.scoreValue;
    entry[`${s.source}_label`] = s.scoreLabel || "";
    entry[`${s.source}_tier`] = s.riskTier || "";
  }

  const data = Array.from(dataMap.values());
  const sourceList = Array.from(sources);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 shadow-xl">
        <div className="text-[11px] text-neutral-500 mb-1">{label}</div>
        {payload.map((p: any) => {
          if (p.value == null) return null;
          const source = p.dataKey as string;
          const tier = p.payload[`${source}_tier`] as string;
          const scoreLabel = p.payload[`${source}_label`] as string;
          return (
            <div key={source} className="flex items-center gap-2 text-[12px]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-neutral-300">{source.replace(/_/g, " ")}:</span>
              <span className="text-white font-medium">{p.value}</span>
              {scoreLabel && <span className="text-neutral-500">({scoreLabel})</span>}
              {tier && (
                <span
                  className="px-1 py-0.5 rounded text-[10px] font-medium"
                  style={{
                    backgroundColor: (RISK_COLORS[tier] || "#666") + "20",
                    color: RISK_COLORS[tier] || "#666",
                  }}
                >
                  {tier}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          )}
          <XAxis
            dataKey="date"
            tick={{ fill: "#737373", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#737373", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#a3a3a3" }}
            formatter={(value: string) => value.replace(/_/g, " ")}
          />
          <ReferenceLine y={80} stroke="#10b981" strokeDasharray="4 4" strokeOpacity={0.3} />
          <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.3} />
          <ReferenceLine y={40} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.3} />

          {sourceList.map((source) => (
            <Line
              key={source}
              type="monotone"
              dataKey={source}
              name={source}
              stroke={SOURCE_COLORS[source] || "#a3a3a3"}
              strokeWidth={2}
              dot={{ r: 3, fill: SOURCE_COLORS[source] || "#a3a3a3", strokeWidth: 0 }}
              activeDot={{ r: 5, stroke: SOURCE_COLORS[source] || "#a3a3a3", strokeWidth: 2, fill: "#0a0a0a" }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend for reference lines */}
      <div className="flex items-center justify-center gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 border-t border-dashed border-emerald-500/30" />
          <span className="text-[10px] text-neutral-600">80 (Low Risk)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 border-t border-dashed border-amber-500/30" />
          <span className="text-[10px] text-neutral-600">60 (Medium)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 border-t border-dashed border-red-500/30" />
          <span className="text-[10px] text-neutral-600">40 (High)</span>
        </div>
      </div>
    </div>
  );
}
