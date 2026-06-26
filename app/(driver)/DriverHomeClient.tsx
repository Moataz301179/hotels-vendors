"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, Navigation, PackageCheck, FileCheck, Clock, MapPin, ChevronRight, Play, Square } from "lucide-react";

interface DriverStats {
  assignedCount: number;
  inTransitCount: number;
  deliveredCount: number;
  pendingGrns: number;
}

interface ActiveTrip {
  tripNumber: string;
  nextStop: { hotelName: string; stopOrder: number; estimatedArrival: string | null } | null;
}

export default function DriverHomeClient({
  driverName,
  carrierName,
  stats,
  activeTrip,
}: {
  driverName: string;
  carrierName: string;
  stats: DriverStats;
  activeTrip: ActiveTrip | null;
}) {
  const [shiftActive, setShiftActive] = useState(false);

  const statCards = [
    { label: "Assigned", value: stats.assignedCount, icon: Clock, color: "var(--warning)" },
    { label: "In Transit", value: stats.inTransitCount, icon: Navigation, color: "var(--accent-base)" },
    { label: "Delivered", value: stats.deliveredCount, icon: PackageCheck, color: "var(--success)" },
    { label: "Pending GRNs", value: stats.pendingGrns, icon: FileCheck, color: "var(--error)" },
  ];

  return (
    <div className="space-y-5 pt-4">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {driverName.split(" ")[0]}
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{carrierName}</p>
      </div>

      {/* Shift toggle */}
      <button
        onClick={() => setShiftActive(!shiftActive)}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all"
        style={{
          background: shiftActive ? "var(--success)" : "var(--accent-base)",
          color: "#000",
          boxShadow: shiftActive ? "0 0 20px rgba(52,211,153,0.3)" : "0 0 20px rgba(255,138,51,0.3)",
        }}
      >
        {shiftActive ? <Square size={18} /> : <Play size={18} />}
        {shiftActive ? "End Shift" : "Start Shift"}
      </button>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-4"
              style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} style={{ color: s.color }} />
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Active trip */}
      {activeTrip ? (
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Truck size={18} style={{ color: "var(--accent-base)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Trip {activeTrip.tripNumber}
              </span>
            </div>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: "var(--accent-base)", color: "#000" }}
            >
              ACTIVE
            </span>
          </div>
          {activeTrip.nextStop && (
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: "var(--text-muted)" }} />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  Stop {activeTrip.nextStop.stopOrder}: {activeTrip.nextStop.hotelName}
                </p>
                {activeTrip.nextStop.estimatedArrival && (
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    ETA {new Date(activeTrip.nextStop.estimatedArrival).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
              </div>
              <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
            </div>
          )}
        </div>
      ) : (
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <Truck size={32} style={{ color: "var(--text-muted)" }} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No active trip today</p>
        </div>
      )}
    </div>
  );
}
