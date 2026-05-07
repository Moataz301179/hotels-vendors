"use client";

import { useState } from "react";
import {
  Truck, MapPin, Clock, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight,
  Package, Route, Fuel, Thermometer, Navigation,
} from "lucide-react";

/* ─── MOCK DATA ─── */
const METRICS = [
  { label: "Active Shipments", value: "14", change: "+3 today", up: true, icon: Truck },
  { label: "Fleet Utilization", value: "82%", change: "+5%", up: true, icon: Route },
  { label: "Avg. Delivery Time", value: "42h", change: "−8h", up: true, icon: Clock },
  { label: "Delayed Shipments", value: "2", change: "1 critical", up: false, icon: AlertCircle },
];

const SHIPMENTS = [
  {
    id: "SH-2026-0014",
    route: "Cairo → Hurghada",
    supplier: "Al-Gomhouria Food Supply",
    hotel: "Pickalbatros Palace Resort",
    items: "F&B Dry Goods (24 pallets)",
    status: "IN_TRANSIT",
    progress: 65,
    eta: "2026-05-06 14:00",
    driver: "Ahmed K.",
    vehicle: "TRK-044",
    temp: "Ambient",
  },
  {
    id: "SH-2026-0013",
    route: "Alexandria → Sharm El Sheikh",
    supplier: "CleanMax Professional",
    hotel: "Sunrise Arabian Beach",
    items: "Housekeeping Chemicals (8 drums)",
    status: "PICKED_UP",
    progress: 15,
    eta: "2026-05-07 09:00",
    driver: "Mohamed S.",
    vehicle: "TRK-031",
    temp: "Ambient",
  },
  {
    id: "SH-2026-0012",
    route: "10th of Ramadan → Marsa Alam",
    supplier: "Cotton House Egypt",
    hotel: "Baron Resort Sharm",
    items: "Linens & Towels (12 crates)",
    status: "ARRIVED",
    progress: 100,
    eta: "Delivered",
    driver: "Hassan R.",
    vehicle: "TRK-028",
    temp: "Ambient",
  },
  {
    id: "SH-2026-0011",
    route: "Cairo → El Gouna",
    supplier: "Egyptian Meat Co.",
    hotel: "Orascom El Gouna",
    items: "Frozen Meat & Poultry (6 tons)",
    status: "IN_TRANSIT",
    progress: 45,
    eta: "2026-05-06 18:00",
    driver: "Khaled M.",
    vehicle: "TRK-052",
    temp: "−18°C",
  },
  {
    id: "SH-2026-0010",
    route: "Hurghada → Sahl Hasheesh",
    supplier: "AquaChem Red Sea",
    hotel: "Pickalbatros Citadel",
    items: "Pool Chemicals (4 pallets)",
    status: "DELAYED",
    progress: 30,
    eta: "2026-05-08 12:00",
    driver: "Omar F.",
    vehicle: "TRK-019",
    temp: "Ambient",
  },
];

const FLEET = [
  { id: "TRK-044", type: "Refrigerated", capacity: "12 tons", status: "EN_ROUTE", location: "Suez Road", driver: "Ahmed K." },
  { id: "TRK-031", type: "Standard", capacity: "8 tons", status: "LOADING", location: "Alexandria Port", driver: "Mohamed S." },
  { id: "TRK-028", type: "Standard", capacity: "10 tons", status: "RETURNING", location: "Marsa Alam", driver: "Hassan R." },
  { id: "TRK-052", type: "Refrigerated", capacity: "15 tons", status: "EN_ROUTE", location: "Ain Sokhna", driver: "Khaled M." },
  { id: "TRK-019", type: "Standard", capacity: "6 tons", status: "DELAYED", location: "Hurghada", driver: "Omar F." },
];

/* ─── UTILS ─── */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PICKED_UP: { bg: "bg-[#60a5fa]/10", text: "text-[#60a5fa]", dot: "bg-[#60a5fa]", label: "Picked Up" },
    IN_TRANSIT: { bg: "bg-[#FF5C00]/10", text: "text-[#FF5C00]", dot: "bg-[#FF5C00]", label: "In Transit" },
    ARRIVED: { bg: "bg-[#10B981]/10", text: "text-[#10B981]", dot: "bg-[#10B981]", label: "Arrived" },
    DELIVERED: { bg: "bg-[#10B981]/10", text: "text-[#10B981]", dot: "bg-[#10B981]", label: "Delivered" },
    DELAYED: { bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", dot: "bg-[#EF4444]", label: "Delayed" },
  };
  const c = config[status] || config.IN_TRANSIT;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function ShipmentProgress({ progress, status }: { progress: number; status: string }) {
  const isDelayed = status === "DELAYED";
  const color = progress >= 100 ? "#10B981" : isDelayed ? "#EF4444" : progress > 50 ? "#FF5C00" : "#60a5fa";
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
      {/* Stage dots */}
      <div className="flex items-center justify-between mt-1.5 px-0.5">
        <div className={`w-2 h-2 rounded-full ${progress >= 5 ? "bg-[#60a5fa]" : "bg-white/10"}`} title="Picked Up" />
        <div className={`w-2 h-2 rounded-full ${progress >= 50 ? "bg-[#FF5C00]" : "bg-white/10"}`} title="In Transit" />
        <div className={`w-2 h-2 rounded-full ${progress >= 100 ? "bg-[#10B981]" : "bg-white/10"}`} title="Arrived" />
      </div>
    </div>
  );
}

/* ─── PAGE ─── */
export default function LogisticsPortalPage() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Logistics Command Center</h1>
          <p className="text-sm text-white/40 mt-0.5">Real-time fleet tracking, route optimization, and delivery management</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{m.label}</span>
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <m.icon size={15} className="text-white/40" />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{m.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {m.up ? <ArrowUpRight size={12} className="text-[#10B981]" /> : <ArrowDownRight size={12} className="text-[#EF4444]" />}
              <span className={`text-[11px] font-medium ${m.up ? "text-[#10B981]" : "text-[#EF4444]"}`}>{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Shipments + Fleet Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Shipments */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Package size={14} className="text-white/40" />
            Active Shipments
          </h3>
          <div className="space-y-3">
            {SHIPMENTS.map((s) => (
              <div key={s.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.025] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono text-white/40">{s.id}</span>
                      <StatusBadge status={s.status} />
                      {s.temp !== "Ambient" && (
                        <span className="inline-flex items-center gap-1 text-[9px] text-[#60a5fa] bg-[#60a5fa]/10 px-1.5 py-0.5 rounded">
                          <Thermometer size={9} /> {s.temp}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-white">{s.route}</p>
                    <p className="text-[11px] text-white/30 mt-0.5">{s.supplier} → {s.hotel}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/20">ETA</p>
                    <p className="text-xs text-white/60">{s.eta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-[10px] text-white/25 flex items-center gap-1"><Truck size={10} /> {s.vehicle}</span>
                  <span className="text-[10px] text-white/25 flex items-center gap-1"><Navigation size={10} /> {s.driver}</span>
                  <span className="text-[10px] text-white/25">{s.items}</span>
                </div>
                <ShipmentProgress progress={s.progress} status={s.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Status */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Truck size={14} className="text-white/40" />
              Fleet Status
            </h3>
            <div className="space-y-3">
              {FLEET.map((f) => (
                <div key={f.id} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${f.status === "EN_ROUTE" ? "bg-[#FF5C00]" : f.status === "DELAYED" ? "bg-[#EF4444]" : f.status === "RETURNING" ? "bg-[#10B981]" : "bg-[#60a5fa]"}`} />
                    <div>
                      <p className="text-xs font-medium text-white">{f.id}</p>
                      <p className="text-[10px] text-white/25">{f.type} · {f.capacity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40">{f.location}</p>
                    <p className="text-[9px] text-white/20">{f.driver}</p>
                  </div>
                </div>
              ))}
            </div>
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
      </div>
    </div>
  );
}
