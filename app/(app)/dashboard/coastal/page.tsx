"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Anchor,
  Truck,
  Clock,
  MapPin,
  CreditCard,
  Store,
  TrendingUp,
  Activity,
  ArrowRight,
} from "lucide-react";

interface Trip {
  id: string;
  tripNumber: string;
  driverName?: string | null;
  vehiclePlate?: string | null;
  status: string;
  scheduledDate?: string | null;
  hub?: { name: string; city: string };
  stops?: { id: string; stopNumber?: number | null; eta?: string | null; status: string }[];
}

interface LogisticsHub {
  id: string;
  name: string;
  city: string;
  governorate: string;
  isActive: boolean;
}

interface CreditFacility {
  id: string;
  limit: number;
  utilized: number;
  status: string;
}

interface Outlet {
  id: string;
  name: string;
  type: string;
  property?: { name: string; hotel?: { name: string } };
}

interface Hotel {
  id: string;
  name: string;
  city: string;
}

export default function CoastalDashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [hubs, setHubs] = useState<LogisticsHub[]>([]);
  const [facilities, setFacilities] = useState<CreditFacility[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [tRes, hRes, fRes, oRes, hotelsRes] = await Promise.all([
          fetch("/api/logistics/trips?limit=20"),
          fetch("/api/logistics/hubs"),
          fetch("/api/factoring/facilities?status=ACTIVE"),
          fetch("/api/outlets?limit=100"),
          fetch("/api/hotels?limit=1"),
        ]);
        const tData = await tRes.json();
        const hData = await hRes.json();
        const fData = await fRes.json();
        const oData = await oRes.json();
        const hotelsData = await hotelsRes.json();

        if (tData.success) setTrips(tData.data);
        if (hData.success) setHubs(hData.data);
        if (fData.success) setFacilities(fData.data);
        if (oData.success) setOutlets(oData.data);
        if (hotelsData.success && hotelsData.data.length > 0) setHotel(hotelsData.data[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeTrips = trips.filter((t) => t.status === "SCHEDULED" || t.status === "LOADING" || t.status === "IN_TRANSIT");
  const nextTrip = activeTrips.sort((a, b) => {
    if (!a.scheduledDate) return 1;
    if (!b.scheduledDate) return -1;
    return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
  })[0];

  const totalApproved = facilities.reduce((s, f) => s + f.limit, 0);
  const totalUtilized = facilities.reduce((s, f) => s + f.utilized, 0);
  const totalRemaining = totalApproved - totalUtilized;

  const outletsByProperty = outlets.reduce<Record<string, number>>((acc, o) => {
    const key = o.property?.name || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-xs text-foreground-muted">
        <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading coastal command center...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Coastal Command Center</h1>
          <p className="text-[11px] text-foreground-muted">
            {hotel ? `${hotel.name} · ${hotel.city}` : "Shark-Breaker Logistics Network"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center gap-1">
            <Anchor className="w-2.5 h-2.5" />
            Coastal Tier
          </span>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: "Active Trips", value: activeTrips.length, icon: <Truck className="w-3.5 h-3.5 text-[#0ea5e9]" /> },
          { label: "Logistics Hubs", value: hubs.length, icon: <MapPin className="w-3.5 h-3.5 text-emerald-400" /> },
          { label: "Credit Facilities", value: facilities.length, icon: <CreditCard className="w-3.5 h-3.5 text-amber-400" /> },
          { label: "Outlets", value: outlets.length, icon: <Store className="w-3.5 h-3.5 text-violet-400" /> },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-md border border-border-subtle bg-surface p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] uppercase tracking-wider text-foreground-muted font-medium">{kpi.label}</span>
              {kpi.icon}
            </div>
            <div className="text-sm font-semibold">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Shark-Breaker Logistics */}
        <div className="lg:col-span-2 rounded-md border border-border-subtle bg-surface">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle bg-surface-raised/50">
            <div className="flex items-center gap-2">
              <Anchor className="w-3.5 h-3.5 text-[#0ea5e9]" />
              <h2 className="text-xs font-semibold">Shark-Breaker Logistics</h2>
              {activeTrips.length > 0 && (
                <span className="text-[9px] px-1 py-0 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9]">{activeTrips.length} active</span>
              )}
            </div>
            <Link href="/orders" className="text-[9px] text-[#0ea5e9] hover:underline flex items-center gap-0.5">
              View all <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>

          <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Next Delivery */}
            <div className="bg-[#13161c]/80 backdrop-blur border border-white/10 rounded-lg p-3">
              <div className="text-[9px] uppercase tracking-wider text-foreground-muted font-medium mb-2">Next Delivery</div>
              {nextTrip ? (
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold">{nextTrip.tripNumber}</div>
                  <div className="text-[10px] text-foreground-muted">{nextTrip.hub?.name} · {nextTrip.hub?.city}</div>
                  <div className="flex items-center gap-1 text-[10px] text-[#0ea5e9]">
                    <Clock className="w-2.5 h-2.5" />
                    {nextTrip.scheduledDate ? new Date(nextTrip.scheduledDate).toLocaleString() : "Not scheduled"}
                  </div>
                  <div className="text-[10px] text-foreground-muted">
                    Driver: {nextTrip.driverName || "—"} · {nextTrip.vehiclePlate || "—"}
                  </div>
                  <div className="text-[9px] text-foreground-muted">
                    {nextTrip.stops?.length || 0} stops planned
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-foreground-muted">No upcoming trips</div>
              )}
            </div>

            {/* Hub Status */}
            <div className="bg-[#13161c]/80 backdrop-blur border border-white/10 rounded-lg p-3">
              <div className="text-[9px] uppercase tracking-wider text-foreground-muted font-medium mb-2">Hub Status</div>
              <div className="space-y-1.5">
                {hubs.slice(0, 4).map((hub) => (
                  <div key={hub.id} className="flex items-center justify-between">
                    <div className="text-[11px]">{hub.name}</div>
                    <span className={`text-[9px] px-1 py-[1px] rounded-full ${hub.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {hub.isActive ? "Online" : "Offline"}
                    </span>
                  </div>
                ))}
                {hubs.length === 0 && (
                  <div className="text-[11px] text-foreground-muted">No hubs configured</div>
                )}
              </div>
            </div>

            {/* Active Trips Table */}
            <div className="md:col-span-2">
              <div className="text-[9px] uppercase tracking-wider text-foreground-muted font-medium mb-2">Active Trips</div>
              <div className="rounded-md border border-border-subtle/50 overflow-hidden">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-border-subtle text-foreground-muted bg-surface-raised/30">
                      <th className="text-left px-2 py-1 font-medium">Trip #</th>
                      <th className="text-left px-2 py-1 font-medium">Hub</th>
                      <th className="text-left px-2 py-1 font-medium">Driver</th>
                      <th className="text-left px-2 py-1 font-medium">Status</th>
                      <th className="text-left px-2 py-1 font-medium">Stops</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTrips.slice(0, 5).map((trip) => (
                      <tr key={trip.id} className="border-b border-border-subtle/40 hover:bg-surface-raised/40 transition-colors">
                        <td className="px-2 py-1 font-mono text-foreground-muted">{trip.tripNumber}</td>
                        <td className="px-2 py-1">{trip.hub?.name || "—"}</td>
                        <td className="px-2 py-1">{trip.driverName || "—"}</td>
                        <td className="px-2 py-1">
                          <span className={`inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full text-[9px] font-medium ${
                            trip.status === "IN_TRANSIT" ? "bg-[#0ea5e9]/10 text-[#0ea5e9]" :
                            trip.status === "LOADING" ? "bg-amber-500/10 text-amber-400" :
                            "bg-slate-500/10 text-slate-400"
                          }`}>
                            {trip.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-2 py-1 text-foreground-muted">{trip.stops?.length || 0}</td>
                      </tr>
                    ))}
                    {activeTrips.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-2 py-4 text-center text-foreground-muted">No active trips</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Factoring Availability */}
          <div className="rounded-md border border-border-subtle bg-surface">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-surface-raised/50">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <h2 className="text-xs font-semibold">Factoring Availability</h2>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-foreground-muted">Total Approved</span>
                <span className="text-[11px] font-semibold">EGP {totalApproved.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-foreground-muted">Utilized</span>
                <span className="text-[11px] font-semibold text-red-400">EGP {totalUtilized.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-foreground-muted">Remaining</span>
                <span className="text-[11px] font-semibold text-emerald-400">EGP {totalRemaining.toLocaleString()}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface overflow-hidden mt-1">
                <div
                  className="h-full rounded-full bg-amber-500/60"
                  style={{ width: `${totalApproved ? (totalUtilized / totalApproved) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Outlet Summary */}
          <div className="rounded-md border border-border-subtle bg-surface">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-surface-raised/50">
              <Store className="w-3.5 h-3.5 text-violet-400" />
              <h2 className="text-xs font-semibold">Outlet Summary</h2>
            </div>
            <div className="divide-y divide-border-subtle/40">
              {Object.entries(outletsByProperty).map(([property, count]) => (
                <div key={property} className="px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[11px]">{property}</span>
                  <span className="text-[9px] px-1.5 py-[1px] rounded-full bg-violet-500/10 text-violet-400">{count} outlets</span>
                </div>
              ))}
              {outlets.length === 0 && (
                <div className="px-3 py-4 text-center text-[11px] text-foreground-muted">No outlets configured</div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-md border border-border-subtle bg-surface">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-surface-raised/50">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <h2 className="text-xs font-semibold">Quick Actions</h2>
            </div>
            <div className="p-2 space-y-0.5">
              <Link href="/factoring" className="flex items-center gap-2 px-2 py-1.5 rounded text-[11px] text-foreground-muted hover:bg-surface-raised hover:text-foreground transition-colors">
                <CreditCard className="w-3 h-3" /> Apply for Factoring
              </Link>
              <Link href="/orders" className="flex items-center gap-2 px-2 py-1.5 rounded text-[11px] text-foreground-muted hover:bg-surface-raised hover:text-foreground transition-colors">
                <Truck className="w-3 h-3" /> Track Deliveries
              </Link>
              <Link href="/catalog" className="flex items-center gap-2 px-2 py-1.5 rounded text-[11px] text-foreground-muted hover:bg-surface-raised hover:text-foreground transition-colors">
                <TrendingUp className="w-3 h-3" /> Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
