"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Thermometer,
  Package,
  Search,
  Flag,
  Clock,
  Users,
  Navigation,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardCard } from "../DashboardCard";

interface KPI {
  assignedJobs: number;
  inTransit: number;
  completedToday: number;
  fleetUtilization: number;
}

interface ActiveTrip {
  id: string;
  tripNumber: string;
  driverName: string;
  vehiclePlate: string;
  nextStop: string;
  eta: string;
  status: string;
  stopsCompleted: number;
  totalStops: number;
}

interface DeliveryJob {
  id: string;
  jobNumber: string;
  orderNumber: string;
  pickup: string;
  delivery: string;
  status: string;
  assignedTo: string | null;
  priority: "high" | "normal" | "low";
}

interface TempViolation {
  id: string;
  jobNumber: string;
  temperature: number;
  required: number;
  recordedAt: string;
  duration: string;
}

interface DriverStatus {
  id: string;
  name: string;
  status: "available" | "on-trip" | "off-duty";
  currentJob?: string;
}

/**
 * Logistics Dashboard — Shark-Breaker coastal delivery partners.
 * Mobile-first for drivers, with fleet overview for dispatchers.
 */
export function LogisticsDashboard() {
  const [kpis, setKpis] = useState<KPI>({
    assignedJobs: 0,
    inTransit: 0,
    completedToday: 0,
    fleetUtilization: 0,
  });
  const [trips, setTrips] = useState<ActiveTrip[]>([]);
  const [jobs, setJobs] = useState<DeliveryJob[]>([]);
  const [tempViolations, setTempViolations] = useState<TempViolation[]>([]);
  const [drivers, setDrivers] = useState<DriverStatus[]>([]);
  const [fleetData, setFleetData] = useState<{ day: string; completed: number; failed: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await fetch("/api/v1/dashboard/logistics");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setKpis(data.kpis || kpis);
        setTrips(data.trips || []);
        setJobs(data.jobs || []);
        setTempViolations(data.tempViolations || []);
        setDrivers(data.drivers || []);
        setFleetData(data.fleetData || []);
      } catch (err) {
        if (!cancelled) setError("Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--text-muted)] text-sm">Loading logistics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Logistics Command
          </h1>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            Track trips, monitor fleet, and manage delivery jobs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium bg-[var(--accent-base)] text-white hover:opacity-90 transition-opacity">
            <Navigation size={14} />
            View Trips
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
            <CheckCircle2 size={14} />
            Mark Delivered
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
            <Flag size={14} />
            Report Issue
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Truck} label="Assigned Jobs" value={kpis.assignedJobs.toString()} accent="var(--accent-base)" />
        <KPICard icon={Navigation} label="In Transit" value={kpis.inTransit.toString()} accent="var(--info)" />
        <KPICard icon={CheckCircle2} label="Completed Today" value={kpis.completedToday.toString()} accent="var(--success)" />
        <KPICard
          icon={Truck}
          label="Fleet Utilization"
          value={`${kpis.fleetUtilization}%`}
          accent={kpis.fleetUtilization > 90 ? "var(--warning)" : "var(--accent-base)"}
        />
      </div>

      {/* Fleet Performance Chart */}
      <DashboardCard title="Fleet Performance (Last 7 Days)">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fleetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="completed" fill="var(--success)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="var(--error)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      {/* Temperature Violations Alert */}
      {tempViolations.length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Thermometer size={16} className="text-red-400" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-red-400">
              Temperature Violations
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tempViolations.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface)] border border-red-500/10"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-[var(--text-primary)]">
                    {v.jobNumber}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {v.temperature}°C / Required: {v.required}°C · {v.duration}
                  </p>
                </div>
                <AlertTriangle size={14} className="text-red-400 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Trips + Delivery Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCard title="Active Trips">
          <div className="space-y-3">
            {trips.length === 0 && (
              <p className="text-[12px] text-[var(--text-muted)]">No active trips</p>
            )}
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="py-2 border-b border-[var(--border-invisible)] last:border-0"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-[var(--text-primary)]">
                    {trip.tripNumber}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {trip.stopsCompleted}/{trip.totalStops} stops
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                  <Users size={10} />
                  <span>{trip.driverName}</span>
                  <span>·</span>
                  <span>{trip.vehiclePlate}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                    <MapPin size={10} />
                    <span>Next: {trip.nextStop}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                    <Clock size={10} />
                    <span>ETA {trip.eta}</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--accent-base)]"
                    style={{ width: `${(trip.stopsCompleted / trip.totalStops) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Delivery Jobs Requiring Attention">
          <div className="space-y-3">
            {jobs.length === 0 && (
              <p className="text-[12px] text-[var(--text-muted)]">No jobs requiring attention</p>
            )}
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between py-2 border-b border-[var(--border-invisible)] last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-medium text-[var(--text-primary)]">
                      {job.jobNumber}
                    </p>
                    {job.priority === "high" && (
                      <span className="px-1 py-0.5 rounded text-[8px] font-medium uppercase bg-red-500/10 text-red-400">
                        urgent
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] truncate">
                    {job.pickup} → {job.delivery}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  {job.assignedTo ? (
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {job.assignedTo}
                    </span>
                  ) : (
                    <button className="px-2 py-1 rounded text-[9px] font-medium bg-[var(--accent-base)] text-white">
                      Assign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Driver Assignment Panel */}
      <DashboardCard title="Driver Status">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {drivers.length === 0 && (
            <p className="text-[12px] text-[var(--text-muted)] col-span-full">No drivers available</p>
          )}
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-invisible)] bg-[var(--surface-raised)]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    driver.status === "available"
                      ? "bg-emerald-400"
                      : driver.status === "on-trip"
                      ? "bg-blue-400"
                      : "bg-white/20"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-[var(--text-primary)] truncate">
                    {driver.name}
                  </p>
                  {driver.currentJob && (
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Job: {driver.currentJob}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`text-[9px] font-medium uppercase ${
                  driver.status === "available"
                    ? "text-emerald-400"
                    : driver.status === "on-trip"
                    ? "text-blue-400"
                    : "text-white/40"
                }`}
              >
                {driver.status.replace("-", " ")}
              </span>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${accent}15` }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}
