import { MetricTile } from "@/components/dashboards/shared/metric-tile";
import { StatusPill } from "@/components/dashboards/shared/status-pill";
import { DataTableMini } from "@/components/dashboards/shared/data-table-mini";
import {
  Truck,
  PackageCheck,
  Fuel,
  Route,
  Circle,
  Zap,
} from "lucide-react";

async function getData() {
  // TODO: Replace with real API call
  return {
    metrics: [
      { label: "Active Trips", value: "18", trend: "4 completing today", icon: Truck, iconBg: "bg-accent-cyan/10 text-accent-cyan" },
      { label: "Deliveries Today", value: "47", trend: "+12 vs yesterday", icon: PackageCheck, iconBg: "bg-accent-emerald/10 text-accent-emerald" },
      { label: "On-Time %", value: "94.3%", trend: "Top quartile", icon: Route, iconBg: "bg-accent-amber/10 text-accent-amber" },
      { label: "Fuel Cost Index", value: "8,420 EGP", trend: "-3.2%", icon: Fuel, iconBg: "bg-accent-gold/10 text-accent-gold" },
    ],
    trips: [
      { id: "TR-2026-0418", driver: "Mohamed Ali", stops: 6, status: "in transit", eta: "14:30" },
      { id: "TR-2026-0417", driver: "Khaled Omar", stops: 4, status: "in transit", eta: "16:00" },
      { id: "TR-2026-0416", driver: "Hassan Ibrahim", stops: 8, status: "pending", eta: "18:45" },
      { id: "TR-2026-0415", driver: "Ahmed Sayed", stops: 5, status: "delivered", eta: "—" },
      { id: "TR-2026-0414", driver: "Youssef Kamal", stops: 3, status: "in transit", eta: "12:15" },
    ],
    vehicles: [
      { id: "V-001", status: "active" },
      { id: "V-002", status: "active" },
      { id: "V-003", status: "active" },
      { id: "V-004", status: "active" },
      { id: "V-005", status: "warning" },
    ],
    zones: [
      { name: "Greater Cairo", load: 85 },
      { name: "Alexandria", load: 62 },
      { name: "North Coast", load: 40 },
      { name: "Red Sea", load: 73 },
    ],
  };
}

export default async function ShippingDashboardPage() {
  const data = await getData();

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text-animated">Logistics Command</span>
        </h1>
        <p className="text-foreground-muted mt-1 text-sm">Monitor trips, optimize routes, and track fleet</p>
      </div>

      <div className="bento-grid mb-6">
        {data.metrics.map((m) => (
          <MetricTile key={m.label} {...m} />
        ))}
      </div>

      <div className="bento-grid">
        <div className="bento-item bento-item-large glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Route Map</h3>
          <div className="relative h-48 rounded-xl bg-surface-raised border border-border-subtle overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <path d="M 40 140 Q 100 100 160 80 T 300 50" fill="none" stroke="rgba(6,182,212,0.4)" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 60 160 Q 140 120 200 90 T 320 60" fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
            <div className="absolute left-[40px] top-[140px] w-3 h-3 rounded-full bg-accent-cyan ring-2 ring-surface" />
            <div className="absolute left-[160px] top-[80px] w-3 h-3 rounded-full bg-accent-cyan ring-2 ring-surface" />
            <div className="absolute left-[300px] top-[50px] w-3 h-3 rounded-full bg-accent-emerald ring-2 ring-surface" />
            <div className="absolute left-[200px] top-[90px] w-3 h-3 rounded-full bg-accent-amber ring-2 ring-surface" />
            <div className="absolute left-[320px] top-[60px] w-3 h-3 rounded-full bg-accent-emerald ring-2 ring-surface" />
            <div className="absolute top-2 left-3 text-[10px] font-mono text-foreground-dim">Map View</div>
          </div>
        </div>

        <div className="bento-item bento-item-large glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Trip Schedule</h3>
          <DataTableMini
            columns={[
              { key: "id", header: "Trip #" },
              { key: "driver", header: "Driver" },
              { key: "stops", header: "Stops" },
              { key: "status", header: "Status", render: (row) => <StatusPill status={row.status as string} /> },
              { key: "eta", header: "ETA", className: "text-right" },
            ]}
            data={data.trips}
          />
        </div>

        <div className="bento-item glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Vehicle Status</h3>
          <div className="flex items-center gap-3 flex-wrap">
            {data.vehicles.map((v) => (
              <div key={v.id} className="flex flex-col items-center gap-1">
                <Circle size={16} className={v.status === "active" ? "text-accent-emerald" : "text-accent-amber"} fill="currentColor" />
                <span className="text-[10px] text-foreground-faint font-mono">{v.id}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-item glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Delivery Zones</h3>
          <div className="space-y-3">
            {data.zones.map((z) => (
              <div key={z.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground-muted">{z.name}</span>
                  <span className="text-xs font-medium text-foreground">{z.load}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-hover overflow-hidden">
                  <div className="h-full rounded-full bg-accent-cyan" style={{ width: `${z.load}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-item glass-card p-5 flex flex-col justify-center items-center text-center">
          <Zap size={22} className="text-accent-gold mb-2" />
          <p className="text-sm font-medium text-foreground">Run route optimization</p>
          <p className="text-xs text-foreground-faint mt-1">AI-powered</p>
        </div>
      </div>
    </div>
  );
}
