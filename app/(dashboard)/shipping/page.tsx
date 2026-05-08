"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Truck, MapPin, Clock, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight,
  Package, Route, Thermometer, Navigation,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";

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

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    SCHEDULED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Scheduled" },
    PICKED_UP: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Picked Up" },
    IN_TRANSIT: { bg: "bg-[#DC143C]/10", text: "text-[#DC143C]", dot: "bg-[#DC143C]", label: "In Transit" },
    ARRIVED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Arrived" },
    DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Delivered" },
    DELAYED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Delayed" },
    RETURNING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Returning" },
  };
  const c = config[status] || config.IN_TRANSIT;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function ShipmentProgress({ status }: { status: string }) {
  const progressMap: Record<string, number> = {
    SCHEDULED: 5,
    PICKED_UP: 20,
    IN_TRANSIT: 60,
    ARRIVED: 90,
    DELIVERED: 100,
    RETURNING: 100,
    DELAYED: 40,
  };
  const progress = progressMap[status] || 0;
  const isDelayed = status === "DELAYED";
  const color = progress >= 100 ? "#10B981" : isDelayed ? "#EF4444" : progress > 50 ? "#DC143C" : "#60a5fa";
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-white/20">{progress}%</span>
        <span className="text-[10px] text-white/20">{progress >= 100 ? "Complete" : "En Route"}</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progress}%`, background: color }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5 px-0.5">
        <div className={`w-2 h-2 rounded-full ${progress >= 5 ? "bg-blue-400" : "bg-white/10"}`} title="Scheduled" />
        <div className={`w-2 h-2 rounded-full ${progress >= 50 ? "bg-[#DC143C]" : "bg-white/10"}`} title="In Transit" />
        <div className={`w-2 h-2 rounded-full ${progress >= 100 ? "bg-emerald-400" : "bg-white/10"}`} title="Delivered" />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 animate-pulse">
      <div className="h-3 w-20 bg-white/10 rounded mb-3" />
      <div className="h-6 w-24 bg-white/10 rounded mb-2" />
      <div className="h-3 w-16 bg-white/10 rounded" />
    </div>
  );
}

export default function LogisticsPortalPage() {
  const { data: tripsData, loading: tripsLoading } = useApi<{ trips: Trip[]; pagination: { total: number } }>(
    "/api/v1/shipping/trips?page=1&limit=20"
  );

  const trips = tripsData?.trips ?? [];

  const metrics = useMemo(() => {
    const active = trips.filter((t) => !["DELIVERED", "RETURNING"].includes(t.status)).length;
    const delayed = trips.filter((t) => t.status === "DELAYED").length;
    const delivered = trips.filter((t) => t.status === "DELIVERED").length;
    return [
      { label: "Active Trips", value: active.toString(), change: `${trips.length} total`, up: true, icon: Truck },
      { label: "Fleet Utilization", value: trips.length > 0 ? `${Math.round((active / trips.length) * 100)}%` : "—", change: "Current load", up: true, icon: Route },
      { label: "Delivered Today", value: delivered.toString(), change: "Completed", up: true, icon: CheckCircle2 },
      { label: "Delayed", value: delayed.toString(), change: delayed > 0 ? "Action required" : "On schedule", up: delayed === 0, icon: AlertCircle },
    ];
  }, [trips]);

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
          <p className="text-sm text-white/40 mt-0.5">Real-time fleet tracking, route optimization, and delivery management</p>
        </div>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics ? (
          metrics.map((m) => (
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
          ))
        ) : (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        )}
      </motion.div>

      {/* Shipments + Fleet Grid */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Shipments */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Package size={14} className="text-white/40" />
            Active Trips
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

        {/* Fleet Status */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Truck size={14} className="text-white/40" />
              Fleet Status
            </h3>
            {tripsLoading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 bg-white/[0.02] rounded-lg" />
                ))}
              </div>
            ) : trips.length === 0 ? (
              <p className="text-xs text-white/30 py-4 text-center">No vehicles active.</p>
            ) : (
              <div className="space-y-3">
                {trips.slice(0, 6).map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        trip.status === "IN_TRANSIT" ? "bg-[#DC143C]" :
                        trip.status === "DELAYED" ? "bg-red-400" :
                        trip.status === "DELIVERED" ? "bg-emerald-400" :
                        "bg-blue-400"
                      }`} />
                      <div>
                        <p className="text-xs font-medium text-white">{trip.vehiclePlate}</p>
                        <p className="text-[10px] text-white/25">{trip.driverName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/40">{trip.stops.length} stops</p>
                      <p className="text-[9px] text-white/20">{trip.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Route Map Placeholder */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-white/40" />
              Live Routes
            </h3>
            <div className="aspect-video rounded-lg bg-white/[0.03] border border-white/[0.04] flex items-center justify-center">
              <div className="text-center">
                <Route size={24} className="text-white/10 mx-auto mb-2" />
                <p className="text-[11px] text-white/20">Map integration coming soon</p>
                <p className="text-[9px] text-white/15">Google Maps / Mapbox</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
