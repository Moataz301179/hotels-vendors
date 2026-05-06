import { StatusPill } from "@/components/dashboards/shared/status-pill";
import { DataTableMini } from "@/components/dashboards/shared/data-table-mini";
import { Sparkline } from "@/components/dashboards/shared/sparkline";
import { ProgressRing } from "@/components/dashboards/shared/progress-ring";
import { prisma } from "@/lib/prisma";
import {
  Truck,
  PackageCheck,
  Fuel,
  Route,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
} from "lucide-react";

async function getData() {
  const [trips, zones, tripCounts] = await Promise.all([
    prisma.trip.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.deliveryZone.findMany(),
    prisma.trip.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  const activeTrips = tripCounts.find((c) => c.status === "IN_TRANSIT")?._count.status || 0;
  const completedTrips = tripCounts.find((c) => c.status === "COMPLETED")?._count.status || 0;
  const totalTrips = tripCounts.reduce((sum, c) => sum + c._count.status, 0);
  const onTimeRate = totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 94;

  return {
    metrics: [
      {
        label: "Active Trips",
        value: String(activeTrips),
        trend: { direction: "up" as const, label: "4 completing today" },
        icon: Truck,
        sparklineData: [Math.max(1, activeTrips - 3), Math.max(1, activeTrips - 2), Math.max(1, activeTrips - 2), Math.max(1, activeTrips - 1), Math.max(1, activeTrips - 1), Math.max(1, activeTrips), activeTrips],
      },
      {
        label: "Deliveries Today",
        value: String(completedTrips),
        trend: { direction: "up" as const, label: "+12 vs yesterday" },
        icon: PackageCheck,
        sparklineData: [Math.max(1, completedTrips - 5), Math.max(1, completedTrips - 4), Math.max(1, completedTrips - 3), Math.max(1, completedTrips - 2), Math.max(1, completedTrips - 1), Math.max(1, completedTrips), completedTrips],
      },
      {
        label: "On-Time %",
        value: `${onTimeRate}%`,
        trend: { direction: "up" as const, label: "Top quartile" },
        icon: Route,
        sparklineData: [Math.max(50, onTimeRate - 10), Math.max(50, onTimeRate - 8), Math.max(50, onTimeRate - 6), Math.max(50, onTimeRate - 4), Math.max(50, onTimeRate - 2), Math.max(50, onTimeRate - 1), onTimeRate],
      },
      {
        label: "Fuel Cost Index",
        value: "8,420 EGP",
        trend: { direction: "down" as const, label: "-3.2%" },
        icon: Fuel,
        sparklineData: [9500, 9200, 9100, 8900, 8700, 8500, 8420],
      },
    ],
    trips: trips.map((t) => ({
      id: t.tripNumber,
      driver: t.driverName ?? "Unassigned",
      stops: Math.floor(Math.random() * 6) + 2,
      status: t.status.toLowerCase().replace("_", " "),
      eta: t.arrivalDate ? t.arrivalDate.toISOString().split("T")[1].slice(0, 5) : "—",
    })),
    vehicles: [
      { id: "V-001", status: "active" },
      { id: "V-002", status: "active" },
      { id: "V-003", status: "active" },
      { id: "V-004", status: "active" },
      { id: "V-005", status: "warning" },
    ],
    zones: zones.map((z) => ({ name: z.zone, load: Math.floor(Math.random() * 60) + 40 })),
    routeMapLines: [
      { d: "M 40 140 Q 100 100 160 80 T 300 50", color: "rgba(6,182,212,0.4)" },
      { d: "M 60 160 Q 140 120 200 90 T 320 60", color: "rgba(245,158,11,0.3)" },
    ],
    routeMapPoints: [
      { x: 40, y: 140, color: "#06b6d4" },
      { x: 160, y: 80, color: "#06b6d4" },
      { x: 300, y: 50, color: "#34d399" },
      { x: 200, y: 90, color: "#f59e0b" },
      { x: 320, y: 60, color: "#34d399" },
    ],
  };
}

function ShippingMetricCard({
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

export default async function ShippingDashboardPage() {
  const data = await getData();

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text-animated">Logistics Command</span>
          </h1>
          <p className="text-sm text-[rgba(255,255,255,0.40)] mt-0.5">
            Monitor trips, optimize routes, and track fleet
          </p>
        </div>
        <button className="btn-primary h-9 px-4 text-xs">
          <Zap size={14} />
          Optimize Routes
        </button>
      </div>

      {/* Metrics */}
      <div className="bento-grid mb-6">
        {data.metrics.map((m, i) => (
          <div key={m.label} className="bento-item-3 animate-fade-in-up">
            <ShippingMetricCard {...m} delay={i * 50} />
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="bento-grid">
        {/* Route Map */}
        <div className="bento-item-6 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Route Map</h3>
              <span className="text-[10px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider flex items-center gap-1">
                <MapPin size={10} /> Live
              </span>
            </div>
            <div className="relative h-48 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                {data.routeMapLines.map((line, i) => (
                  <path
                    key={i}
                    d={line.d}
                    fill="none"
                    stroke={line.color}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                ))}
              </svg>
              {data.routeMapPoints.map((p, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full ring-2 ring-black"
                  style={{ left: `${p.x}px`, top: `${p.y}px`, background: p.color }}
                />
              ))}
              <div className="absolute top-2 left-3 text-[10px] font-mono text-[rgba(255,255,255,0.20)]">
                Map View
              </div>
            </div>
          </div>
        </div>

        {/* Trip Schedule */}
        <div className="bento-item-6 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Trip Schedule</h3>
              <span className="text-[10px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider">
                {data.trips.length} trips
              </span>
            </div>
            <DataTableMini
              columns={[
                { key: "id", header: "Trip #" },
                { key: "driver", header: "Driver" },
                { key: "stops", header: "Stops", className: "metric-value" },
                { key: "status", header: "Status", render: (row) => <StatusPill status={row.status as string} /> },
                { key: "eta", header: "ETA", className: "text-right text-[rgba(255,255,255,0.30)] metric-value" },
              ]}
              data={data.trips}
            />
          </div>
        </div>

        {/* Vehicle Status */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <h3 className="text-sm font-semibold text-white mb-4">Fleet Status</h3>
            <div className="flex items-center gap-4 flex-wrap">
              {data.vehicles.map((v) => (
                <div key={v.id} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold metric-value border ${
                      v.status === "active"
                        ? "bg-[rgba(52,211,153,0.08)] text-[#34d399] border-[rgba(52,211,153,0.15)]"
                        : "bg-[rgba(251,191,36,0.08)] text-[#fbbf24] border-[rgba(251,191,36,0.15)]"
                    }`}
                  >
                    {v.id.split("-")[1]}
                  </div>
                  <span className="text-[10px] text-[rgba(255,255,255,0.30)]">{v.id}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[rgba(255,255,255,0.04)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34d399]" />
                <span className="text-[10px] text-[rgba(255,255,255,0.40)]">Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
                <span className="text-[10px] text-[rgba(255,255,255,0.40)]">Warning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full">
            <h3 className="text-sm font-semibold text-white mb-4">Delivery Zones</h3>
            <div className="space-y-3">
              {data.zones.map((z) => (
                <div key={z.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[rgba(255,255,255,0.50)]">{z.name}</span>
                    <span className="text-xs font-medium text-white metric-value">{z.load}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#06b6d4]"
                      style={{ width: `${z.load}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* On-Time Ring */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full flex flex-col items-center justify-center text-center">
            <p className="text-[11px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider mb-3">On-Time Rate</p>
            <ProgressRing
              value={94.3}
              size={72}
              strokeWidth={5}
              color="#800000"
              trackColor="rgba(255,255,255,0.05)"
            >
              <span className="text-lg font-bold text-white metric-value">94.3%</span>
            </ProgressRing>
            <p className="text-[11px] text-[#34d399] mt-2">Top quartile</p>
          </div>
        </div>

        {/* Fuel Trend */}
        <div className="bento-item-3 animate-fade-in-up">
          <div className="glass-card p-5 h-full flex flex-col justify-center">
            <p className="text-[11px] text-[rgba(255,255,255,0.30)] uppercase tracking-wider">Fuel Trend (7d)</p>
            <Sparkline
              data={[9500, 9200, 9100, 8900, 8700, 8500, 8420]}
              width={140}
              height={40}
              color="#f59e0b"
              fillColor="rgba(245,158,11,0.06)"
              className="mt-3"
            />
            <p className="text-[11px] text-[#ef4444] mt-2">-3.2% vs last week</p>
          </div>
        </div>
      </div>
    </div>
  );
}
