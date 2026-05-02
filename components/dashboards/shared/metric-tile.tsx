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
  iconBg = "bg-accent-cyan/10 text-accent-cyan",
}: MetricTileProps) {
  return (
    <div className="bento-item glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <Icon size={18} />
        </div>
        {trend && (
          <span className="text-[11px] font-medium text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="metric-value text-2xl font-bold text-foreground">{value}</p>
      <p className="metric-label mt-1">{label}</p>
    </div>
  );
}
