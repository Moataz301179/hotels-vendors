"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, Clock, CheckCircle2, AlertTriangle, Truck,
  ArrowUpRight, ArrowDownRight, Plus, Search, ChevronLeft, ChevronRight,
  Package, MapPin, User,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const SCHEDULER_STATS = [
  { label: "Today's Deliveries", value: "12", change: "3 completed", up: true, icon: Truck },
  { label: "Pending Pickups", value: "5", change: "Awaiting collection", up: true, icon: Package },
  { label: "On Schedule", value: "89%", change: "11 of 12 on time", up: true, icon: CheckCircle2 },
  { label: "Delayed", value: "1", change: "Route B affected", up: false, icon: AlertTriangle },
];

const DELIVERIES = [
  { id: "DLV-2026-0045", time: "08:00", hotel: "Pickalbatros Palace", supplier: "El Araby Group", items: 24, driver: "Mohamed Ali", status: "COMPLETED", route: "Route A" },
  { id: "DLV-2026-0044", time: "09:30", hotel: "Hilton Cairo", supplier: "Cairo Kitchen Supply", items: 12, driver: "Ahmed Hassan", status: "IN_PROGRESS", route: "Route A" },
  { id: "DLV-2026-0043", time: "11:00", hotel: "Marriott Mena", supplier: "Delta Textiles", items: 45, driver: "Khaled Omar", status: "SCHEDULED", route: "Route B" },
  { id: "DLV-2026-0042", time: "13:00", hotel: "Four Seasons", supplier: "Nile Fresh", items: 18, driver: "Sara Ibrahim", status: "SCHEDULED", route: "Route B" },
  { id: "DLV-2026-0041", time: "14:30", hotel: "Steigenberger", supplier: "Alexandria Imports", items: 30, driver: "Omar Farouk", status: "DELAYED", route: "Route C" },
  { id: "DLV-2026-0040", time: "16:00", hotel: "InterContinental", supplier: "El Araby Group", items: 15, driver: "Nadia Samir", status: "SCHEDULED", route: "Route C" },
];

const ROUTES = [
  { name: "Route A", stops: 4, driver: "Mohamed Ali", vehicle: "TRK-001", status: "active", progress: 50 },
  { name: "Route B", stops: 3, driver: "Khaled Omar", vehicle: "TRK-003", status: "active", progress: 25 },
  { name: "Route C", stops: 5, driver: "Omar Farouk", vehicle: "TRK-005", status: "delayed", progress: 20 },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    SCHEDULED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Scheduled" },
    IN_PROGRESS: { bg: "bg-[#022349]/10", text: "text-[#022349]", dot: "bg-[#022349]", label: "In Progress" },
    COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Completed" },
    DELAYED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Delayed" },
  };
  const c = config[status] || config.SCHEDULED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export default function SchedulerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("all");

  const filteredDeliveries = DELIVERIES.filter(
    (d) =>
      (selectedRoute === "all" || d.route === selectedRoute) &&
      (d.hotel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          <h1 className="text-2xl font-bold tracking-tight text-white">Delivery Scheduler</h1>
          <p className="text-sm text-white/40 mt-0.5">Plan, schedule, and track all delivery routes and assignments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#022349] hover:bg-[#022349]/80 text-xs text-white font-medium transition-all">
          <Plus size={14} />
          New Route
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SCHEDULER_STATS.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeInUp}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{s.label}</span>
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <s.icon size={15} className="text-white/40" />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {s.up ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-red-400" />}
              <span className={`text-[11px] font-medium ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Routes Overview */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {ROUTES.map((route) => (
          <div
            key={route.name}
            className={`rounded-xl border p-4 cursor-pointer transition-all ${
              selectedRoute === route.name
                ? "border-[#022349]/30 bg-[#022349]/5"
                : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.03]"
            }`}
            onClick={() => setSelectedRoute(selectedRoute === route.name ? "all" : route.name)}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">{route.name}</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                route.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              }`}>
                {route.status === "active" ? "Active" : "Delayed"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[10px] text-white/20">Stops</p>
                <p className="text-sm font-bold text-white">{route.stops}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/20">Driver</p>
                <p className="text-sm font-bold text-white">{route.driver}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className={`h-full rounded-full ${route.status === "delayed" ? "bg-red-500" : "bg-[#022349]"}`}
                  style={{ width: `${route.progress}%` }}
                />
              </div>
              <span className="text-[10px] text-white/30">{route.progress}%</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Timeline + Deliveries */}
      <motion.div variants={fadeInUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Calendar size={14} className="text-white/40" />
            Today's Schedule
          </h3>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors">
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-white/40">May 8, 2026</span>
            <button className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Search deliveries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#022349]/50"
            />
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Time</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Delivery ID</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Items</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Driver</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Route</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((d) => (
                <tr key={d.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-white/20" />
                      <span className="text-xs text-white/60">{d.time}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-white/60">{d.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-white">{d.hotel}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-white">{d.items}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-white/20" />
                      <span className="text-[11px] text-white/40">{d.driver}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] text-white/30">{d.route}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
