"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Truck, Package, Clock, CheckCircle2, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Search, Eye, Route, Gauge,
  Warehouse, TrendingUp, Users, Navigation, Calendar,
  Zap, BarChart3, Thermometer, Fuel, Wrench, Flag,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboards/shared/stat-card";
import { SectionCard } from "@/components/dashboards/shared/section-card";

/* ─── ANIMATIONS ─── */
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const cardEnter = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* ─── TYPES ─── */
interface Trip {
  id: string; tripNumber: string; status: string;
  origin: string; destination: string; cargoType: string;
  weight: number; eta: string;
  driver?: string; vehicle?: string;
  stops: number; distance: number;
  startedAt?: string; completedAt?: string;
}
interface Hub {
  id: string; name: string; location: string;
  capacity: number; used: number;
  inbound: number; outbound: number; activeTrips: number;
}
interface Vehicle {
  id: string; plateNumber: string; type: string;
  status: "ACTIVE" | "IDLE" | "MAINTENANCE" | "OFF_DUTY";
  driver?: string; lastMaintenance?: string; fuelLevel?: number;
}
interface PerformanceMetrics {
  onTimeRate: number; customerSatisfaction: number;
  exceptionRate: number; avgDeliveryTime: number; totalTrips: number;
}

/* ─── STATUS CONFIG ─── */
const TRIP_STATUS: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  SCHEDULED: { bg: "bg-white/10", text: "text-white/40", dot: "bg-white/40", label: "Scheduled" },
  IN_TRANSIT: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "In Transit" },
  AT_HUB: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "At Hub" },
  OUT_FOR_DELIVERY: { bg: "bg-[#bef264]/10", text: "text-[#bef264]", dot: "bg-[#bef264]", label: "Out for Delivery" },
  DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Delivered" },
  DELAYED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Delayed" },
};
function StatusBadge({ status }: { status: string }) {
  const c = TRIP_STATUS[status] || TRIP_STATUS.SCHEDULED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{c.label}
    </span>
  );
}

function formatCurrency(amount: number, currency = "EGP") { return `${currency} ${amount.toLocaleString("en-EG")}`; }

/* ─── TRIP SCHEDULE ─── */
function TripSchedule({ trips, onSelect }: { trips: Trip[]; onSelect: (t: Trip) => void }) {
  const grouped = useMemo(() => {
    const g: Record<string, Trip[]> = { TODAY: [], TOMORROW: [], LATER: [] };
    trips.forEach((t) => {
      const eta = new Date(t.eta);
      const now = new Date();
      const diff = Math.ceil((eta.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diff <= 0) g.TODAY.push(t);
      else if (diff === 1) g.TOMORROW.push(t);
      else g.LATER.push(t);
    });
    return g;
  }, [trips]);

  return (
    <div className="space-y-4">
      {(["TODAY", "TOMORROW", "LATER"] as const).map((day) => (
        <div key={day}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">{day}</span>
            <span className="text-[10px] text-white/15 font-medium">{grouped[day].length} trips</span>
          </div>
          <div className="space-y-2">
            {grouped[day].slice(0, 4).map((trip) => (
              <motion.div key={trip.id} variants={cardEnter} initial="hidden" animate="visible"
                whileHover={{ scale: 1.01 }} onClick={() => onSelect(trip)}
                className="p-3 rounded-lg bg-white/[0.015] border border-white/[0.03] hover:border-white/[0.08] cursor-pointer transition-all group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Truck size={13} className="text-blue-400/60" />
                    <span className="text-[11px] font-mono text-white/40">{trip.tripNumber}</span>
                  </div>
                  <StatusBadge status={trip.status} />
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-white/50">{trip.origin}</span>
                  <ArrowRight size={10} className="text-white/15" />
                  <span className="text-white/70 font-medium">{trip.destination}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-white/20">
                  <span>{trip.distance}km</span>
                  <span>{trip.weight}kg</span>
                  <span>{trip.stops} stops</span>
                  {trip.driver && <span className="text-white/30">{trip.driver}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── FLEET STATUS ─── */
function FleetStatus({ vehicles }: { vehicles: Vehicle[] }) {
  const counts = useMemo(() => ({
    active: vehicles.filter((v) => v.status === "ACTIVE").length,
    idle: vehicles.filter((v) => v.status === "IDLE").length,
    maintenance: vehicles.filter((v) => v.status === "MAINTENANCE").length,
    offDuty: vehicles.filter((v) => v.status === "OFF_DUTY").length,
  }), [vehicles]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Active", value: counts.active, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Idle", value: counts.idle, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Maintenance", value: counts.maintenance, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Off Duty", value: counts.offDuty, color: "text-white/30", bg: "bg-white/5" },
        ].map((s) => (
          <div key={s.label} className="p-2.5 rounded-lg bg-white/[0.015] border border-white/[0.03] text-center">
            <p className={`text-[18px] font-bold ${s.color} metric-value`}>{s.value}</p>
            <p className="text-[9px] text-white/20 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      {vehicles.slice(0, 4).map((v) => (
        <div key={v.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
          <div className={`w-2 h-2 rounded-full ${v.status === "ACTIVE" ? "bg-emerald-400" : v.status === "IDLE" ? "bg-blue-400" : v.status === "MAINTENANCE" ? "bg-amber-400" : "bg-white/20"}`} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-white/60 font-medium">{v.plateNumber}</p>
            <p className="text-[10px] text-white/20">{v.type} · {v.driver || "No driver"}</p>
          </div>
          {v.fuelLevel !== undefined && (
            <div className="flex items-center gap-1">
              <Fuel size={10} className={v.fuelLevel > 30 ? "text-white/20" : "text-amber-400"} />
              <span className={`text-[10px] ${v.fuelLevel > 30 ? "text-white/25" : "text-amber-400"}`}>{v.fuelLevel}%</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── HUB OVERVIEW ─── */
function HubOverview({ hubs }: { hubs: Hub[] }) {
  return (
    <div className="space-y-3">
      {hubs.map((hub) => {
        const utilization = hub.capacity > 0 ? Math.round((hub.used / hub.capacity) * 100) : 0;
        return (
          <div key={hub.id} className="p-3 rounded-lg bg-white/[0.015] border border-white/[0.03] hover:border-white/[0.06] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Warehouse size={13} className="text-blue-400/60" />
                <span className="text-[12px] font-medium text-white/60">{hub.name}</span>
              </div>
              <span className="text-[10px] text-white/20">{hub.location}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.03] overflow-hidden mb-2">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500/40 to-blue-400" style={{ width: `${utilization}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/20">
              <span>{utilization}% used</span>
              <span>{hub.activeTrips} active trips</span>
            </div>
          </div>
        );
      })}
      {hubs.length === 0 && <EmptyState title="No hubs" description="Logistics hubs will appear here." icon={Warehouse} />}
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function ShippingDashboardPage() {
  const { data: tripsData, loading: tripsLoading } = useApi<{ trips: Trip[] }>("/api/v1/shipping/trips");
  const { data: hubsData } = useApi<{ hubs: Hub[] }>("/api/v1/logistics/hubs");
  const { data: metricsData } = useApi<PerformanceMetrics>("/api/v1/shipping/routes/optimize");

  const trips = tripsData?.trips || [];
  const hubs = hubsData?.hubs || [];
  const metrics = metricsData || null;

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const stats = useMemo(() => {
    const active = trips.filter((t) => t.status === "IN_TRANSIT" || t.status === "OUT_FOR_DELIVERY").length;
    const delivered = trips.filter((t) => t.status === "DELIVERED").length;
    const delayed = trips.filter((t) => t.status === "DELAYED").length;
    const today = trips.filter((t) => {
      const eta = new Date(t.eta);
      const now = new Date();
      return Math.ceil((eta.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) <= 0;
    }).length;
    return [
      { label: "Active Trips", value: active.toString(), change: "+3", up: true, icon: Truck, color: "blue" as const },
      { label: "Delivered Today", value: delivered.toString(), change: "+8", up: true, icon: CheckCircle2, color: "emerald" as const },
      { label: "Delayed", value: delayed.toString(), change: "-1", up: true, icon: AlertTriangle, color: "amber" as const },
      { label: "Due Today", value: today.toString(), change: "+2", up: false, icon: Clock, color: "crimson" as const },
    ];
  }, [trips]);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 pb-10">
      <motion.div variants={fadeInUp}>
        <PageHeader title="Logistics Command Center" description="Fleet management, trip scheduling, and route optimization."
          breadcrumbs={[{ label: "Dashboard" }]}
          actions={
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-[12px] py-1.5 px-3"><Route size={14} /> Optimize Routes</button>
              <button className="btn-crimson text-[12px] py-1.5 px-3"><Plus size={14} /> New Trip</button>
            </div>
          }
        />
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i} />)}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <SectionCard title="Trip Schedule" icon={Calendar}
            action={<span className="text-[11px] text-white/20">{trips.length} trips</span>}>
            {tripsLoading ? <LoadingTable rows={5} /> : <TripSchedule trips={trips} onSelect={setSelectedTrip} />}
          </SectionCard>

          {metrics && (
            <SectionCard title="Performance" icon={BarChart3}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "On-Time %", value: `${metrics.onTimeRate}%`, icon: CheckCircle2 },
                  { label: "Avg Time", value: `${metrics.avgDeliveryTime}h`, icon: Clock },
                  { label: "Exceptions", value: `${(metrics.exceptionRate * 100).toFixed(1)}%`, icon: AlertTriangle },
                  { label: "Total Trips", value: metrics.totalTrips.toString(), icon: TrendingUp },
                ].map((m) => (
                  <div key={m.label} className="p-3 rounded-xl border border-white/[0.05] bg-[#0a0a0a] text-center">
                    <m.icon size={14} className="text-blue-400/50 mx-auto mb-1.5" />
                    <p className="text-[16px] font-bold text-white metric-value">{m.value}</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-wider mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        <div className="space-y-5">
          <SectionCard title="Fleet Status" icon={Truck}>
            <FleetStatus vehicles={[]} />
          </SectionCard>

          <SectionCard title="Hub Overview" icon={Warehouse}>
            <HubOverview hubs={hubs} />
          </SectionCard>

          <div className="p-5 rounded-xl border border-amber-500/10 bg-amber-500/[0.03]">
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-medium text-amber-400/80">2 vehicles need maintenance</p>
                <p className="text-[10px] text-amber-400/40 mt-0.5">Scheduled for tomorrow morning</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={!!selectedTrip} onClose={() => setSelectedTrip(null)} title={`Trip ${selectedTrip?.tripNumber || ""}`}>
        {selectedTrip && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#0a0a0a] border border-white/[0.05]">
                <p className="text-[10px] text-white/25 uppercase tracking-wider">Route</p>
                <p className="text-[13px] text-white/70 mt-0.5">{selectedTrip.origin} → {selectedTrip.destination}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0a0a] border border-white/[0.05]">
                <p className="text-[10px] text-white/25 uppercase tracking-wider">Status</p>
                <div className="mt-0.5"><StatusBadge status={selectedTrip.status} /></div>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0a0a] border border-white/[0.05]">
                <p className="text-[10px] text-white/25 uppercase tracking-wider">Cargo</p>
                <p className="text-[13px] text-white/70 mt-0.5">{selectedTrip.cargoType} · {selectedTrip.weight}kg</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0a0a] border border-white/[0.05]">
                <p className="text-[10px] text-white/25 uppercase tracking-wider">ETA</p>
                <p className="text-[13px] text-white/70 mt-0.5">{new Date(selectedTrip.eta).toLocaleString("en-EG")}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
