import { LucideIcon } from "lucide-react";

interface MetricTileProps {
  label: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
  iconBg?: string;
}

export function MetricTile({
  label,
  value,
  trend,
  icon: Icon,
  iconBg = "bg-cyan-500/10 text-cyan-400",
}: MetricTileProps) {
  return (
    <div className="command-panel rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg border border-white/10 ${iconBg}`}>
          <Icon size={18} />
        </div>
        {trend && (
          <span className="command-chip border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[9px] text-emerald-300">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white sm:text-[30px]">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/45">{label}</p>
    </div>
  );
}
