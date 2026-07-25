"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Truck, MapPin, Clock, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight,
  Package, Route, Navigation, Camera, DollarSign, Users, Car, Upload,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { ShippingOnboardingBot } from "@/components/ai-assistant/shipping-onboarding-chatbot";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface Trip {
  id: string;
  tripNumber: string;
  status: string;
  driverName: string;
  vehiclePlate: string;
  scheduledDate: string;
  completedAt: string | null;
  stops: { hotel: { name: string } }[];
}

interface Vehicle {
  plate: string;
  drivers: string[];
  phones: string[];
  totalTrips: number;
  activeTrips: number;
  status: string;
  lastUsed: string | null;
}

interface EarningsSummary {
  totalTrips: number;
  totalStops: number;
  totalEarnings: number;
  averagePerTrip: number;
  period: string;
}

interface PodStop {
  id: string;
  stopNumber: number;
  status: string;
  podPhotoUrl: string | null;
  signatureUrl: string | null;
  actualArrival: string | null;
  hotel: { name: string };
}

// ── Status badge ──
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    SCHEDULED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Scheduled" },
    PICKED_UP: { bg: "bg-indigo-500/10", text: "text-indigo-400", dot: "bg-indigo-400", label: "Picked Up" },
    LOADING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Loading" },
    IN_TRANSIT: { bg: "bg-accent-base/10", text: "text-accent-base", dot: "bg-accent-base", label: "In Transit" },
    ARRIVED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Arrived" },
    DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Delivered" },
    DELAYED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Delayed" },
    RETURNING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Returning" },
    CANCELLED: { bg: "bg-white/5", text: "text-white/30", dot: "bg-white/30", label: "Cancelled" },
    COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Completed" },
  };
  const c = config[status] || config.SCHEDULED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ── Progress bar ──
function ShipmentProgress({ status }: { status: string }) {
  const progressMap: Record<string, number> = {
    SCHEDULED: 5, PICKED_UP: 15, LOADING: 25, IN_TRANSIT: 60,
    ARRIVED: 90, DELIVERED: 100, RETURNING: 100, DELAYED: 40,
    COMPLETED: 100, CANCELLED: 0,
  };
  const progress = progressMap[status] || 0;
  const color = progress >= 100 ? "#10B981" : status === "DELAYED" ? "#EF4444" : progress > 50 ? "var(--accent-base)" : "#60a5fa";
  return (
    <div className="w-full">
      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Skeleton ──
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 animate-pulse">
      <div className="h-3 w-20 bg-white/10 rounded mb-3" />
      <div className="h-6 w-24 bg-white/10 rounded mb-2" />
      <div className="h-3 w-16 bg-white/10 rounded" />
    </div>
  );
}

// ── Tab navigation ──
type Tab = "trips" | "fleet" | "earnings" | "pod";

export default function LogisticsPortalPage() {
  const [activeTab, setActiveTab] = useState<Tab>("trips");

  const { data: tripsData, loading: tripsLoading } = useApi<{ trips: Trip[]; pagination: { total: number } }>(
    "/api/v1/shipping/trips?page=1&limit=20"
  );
  const { data: fleetData, loading: fleetLoading } = useApi<Vehicle[]>("/api/v1/shipping/fleet");
  const { data: earningsData, loading: earningsLoading } = useApi<{
    summary: EarningsSummary;
    daily: { date: string; trips: number; stops: number; earnings: number }[];
    topVehicles: { plate: string; trips: number; earnings: number }[];
  }>("/api/v1/shipping/earnings?period=30d");

  const trips = tripsData?.trips ?? [];
  const fleet = fleetData ?? [];

  const metrics = useMemo(() => {
    const active = trips.filter((t) => !["DELIVERED", "RETURNING", "CANCELLED", "COMPLETED"].includes(t.status)).length;
    const delayed = trips.filter((t) => t.status === "DELAYED").length;
    const delivered = trips.filter((t) => t.status === "DELIVERED" || t.status === "COMPLETED").length;
    const earnings = earningsData?.summary;
    return [
      { label: "Active Trips", value: active.toString(), change: `${trips.length} total`, up: true, icon: Truck },
      { label: "Fleet Utilization", value: trips.length > 0 ? `${Math.round((active / trips.length) * 100)}%` : "—", change: `${fleet.length} vehicles`, up: true, icon: Route },
      { label: "Delivered", value: delivered.toString(), change: "This period", up: true, icon: CheckCircle2 },
      { label: "Revenue", value: earnings ? `EGP ${earnings.totalEarnings.toLocaleString()}` : "—", change: earnings ? `EGP ${earnings.averagePerTrip}/trip avg` : "Loading", up: true, icon: DollarSign },
    ];
  }, [trips, fleet, earningsData]);

  const tabs: { key: Tab; label: string; icon: typeof Truck }[] = [
    { key: "trips", label: "Trips", icon: Truck },
    { key: "fleet", label: "Fleet", icon: Car },
    { key: "earnings", label: "Earnings", icon: DollarSign },
    { key: "pod", label: "Proof of Delivery", icon: Camera },
  ];

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Logistics Command Center</h1>
          <p className="text-sm text-white/40 mt-0.5">Fleet tracking, route optimization, and delivery management</p>
        </div>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <motion.div
            key={m.label}
            variants={fadeInUp}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{m.label}</span>
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <m.icon size={15} className="text-white/40" />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{m.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {m.up ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-red-400" />}
              <span className={`text-[11px] font-medium ${m.up ? "text-emerald-400" : "text-red-400"}`}>{m.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeInUp} className="flex gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white/[0.08] text-white shadow-sm"
                : "text-white/30 hover:text-white/50 hover:bg-white/[0.03]"
            }`}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      {activeTab === "trips" && (
        <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Package size={14} className="text-white/40" /> Active Trips
            </h3>
            {tripsLoading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 bg-white/[0.02] rounded-xl border border-white/[0.04]" />
                ))}
              </div>
            ) : trips.length === 0 ? (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
                <p className="text-sm text-white/30">No trips scheduled yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.map((trip) => {
                  const destinations = trip.stops.map((s) => s.hotel.name).join(" → ");
                  return (
                    <div key={trip.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.025] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono text-white/40">{trip.tripNumber}</span>
                            <StatusBadge status={trip.status} />
                          </div>
                          <p className="text-xs font-medium text-white">{destinations || "Direct Delivery"}</p>
                          <p className="text-[11px] text-white/30 mt-0.5">Driver: {trip.driverName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-white/20">Scheduled</p>
                          <p className="text-xs text-white/60">{new Date(trip.scheduledDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-[10px] text-white/25 flex items-center gap-1"><Truck size={10} /> {trip.vehiclePlate}</span>
                        <span className="text-[10px] text-white/25 flex items-center gap-1"><Navigation size={10} /> {trip.driverName}</span>
                      </div>
                      <ShipmentProgress status={trip.status} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Truck size={14} className="text-white/40" /> Fleet Status
              </h3>
              {fleetLoading ? (
                <div className="animate-pulse space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-white/[0.02] rounded-lg" />)}
                </div>
              ) : fleet.length === 0 ? (
                <p className="text-xs text-white/30 py-4 text-center">No vehicles active.</p>
              ) : (
                <div className="space-y-3">
                  {fleet.slice(0, 6).map((v) => (
                    <div key={v.plate} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${v.status === "ACTIVE" ? "bg-accent-base" : "bg-white/20"}`} />
                        <div>
                          <p className="text-xs font-medium text-white">{v.plate}</p>
                          <p className="text-[10px] text-white/25">{v.drivers.join(", ") || "No driver"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/40">{v.totalTrips} trips</p>
                        <p className="text-[9px] text-white/20">{v.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <MapPin size={14} className="text-white/40" /> Live Routes
              </h3>
              <div className="aspect-video rounded-lg bg-white/[0.03] border border-white/[0.04] flex items-center justify-center">
                <div className="text-center">
                  <Route size={24} className="text-white/10 mx-auto mb-2" />
                  <p className="text-[11px] text-white/20">Map integration coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "fleet" && (
        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Car size={14} className="text-white/40" /> Fleet Management
            </h3>
          </div>
          {fleetLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : fleet.length === 0 ? (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
              <Car size={32} className="text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30">No vehicles registered yet.</p>
              <p className="text-xs text-white/20 mt-1">Vehicles appear here when trips are created.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {fleet.map((v) => (
                <div key={v.plate} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.025] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${v.status === "ACTIVE" ? "bg-emerald-400" : "bg-white/20"}`} />
                      <span className="text-sm font-semibold text-white">{v.plate}</span>
                    </div>
                    <StatusBadge status={v.status === "ACTIVE" ? "IN_TRANSIT" : "SCHEDULED"} />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/30">Drivers</span>
                      <span className="text-white/60">{v.drivers.join(", ") || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30">Total Trips</span>
                      <span className="text-white/60">{v.totalTrips}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30">Active</span>
                      <span className="text-white/60">{v.activeTrips}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30">Last Used</span>
                      <span className="text-white/60">{v.lastUsed ? new Date(v.lastUsed).toLocaleDateString() : "—"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "earnings" && (
        <motion.div variants={fadeInUp} className="space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <DollarSign size={14} className="text-white/40" /> Earnings Overview
          </h3>
          {earningsLoading ? (
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : earningsData ? (
            <div className="space-y-4">
              {/* Summary cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Total Revenue", value: `EGP ${earningsData.summary.totalEarnings.toLocaleString()}` },
                  { label: "Completed Trips", value: earningsData.summary.totalTrips.toString() },
                  { label: "Total Stops", value: earningsData.summary.totalStops.toString() },
                  { label: "Avg per Trip", value: `EGP ${earningsData.summary.averagePerTrip.toLocaleString()}` },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{s.label}</p>
                    <p className="text-lg font-bold text-white">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Top vehicles */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <h4 className="text-xs font-semibold text-white mb-3">Top Performing Vehicles</h4>
                <div className="space-y-2">
                  {earningsData.topVehicles.map((v, i) => (
                    <div key={v.plate} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04]">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-white/20 font-mono w-4">#{i + 1}</span>
                        <span className="text-xs font-medium text-white">{v.plate}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-emerald-400">EGP {v.earnings.toLocaleString()}</p>
                        <p className="text-[10px] text-white/25">{v.trips} trips</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily breakdown */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <h4 className="text-xs font-semibold text-white mb-3">Daily Breakdown</h4>
                <div className="space-y-1">
                  {earningsData.daily.slice(0, 14).map((d) => (
                    <div key={d.date} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02]">
                      <span className="text-xs text-white/40">{new Date(d.date).toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" })}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-white/30">{d.trips} trips</span>
                        <span className="text-[10px] text-white/30">{d.stops} stops</span>
                        <span className="text-xs font-semibold text-emerald-400">EGP {d.earnings.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
              <DollarSign size={32} className="text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30">No earnings data yet.</p>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "pod" && (
        <motion.div variants={fadeInUp} className="space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Camera size={14} className="text-white/40" /> Proof of Delivery
          </h3>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <Camera size={32} className="text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">Select a trip to view or submit proof of delivery.</p>
            <p className="text-xs text-white/20 mt-1">POD includes photo capture, recipient signature, and delivery notes.</p>
          </div>
        </motion.div>
      )}

      {/* Onboarding Chatbot */}
      <ShippingOnboardingBot />
    </motion.div>
  );
}
