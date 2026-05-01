"use client";

import { useState, useEffect } from "react";
import { Store, Phone, Clock, MapPin } from "lucide-react";

interface Outlet {
  id: string;
  name: string;
  type: string;
  managerName?: string | null;
  managerPhone?: string | null;
  operatingHours?: string | null;
  property?: { name: string; hotel?: { name: string } };
}

const TYPE_LABELS: Record<string, string> = {
  KITCHEN: "Kitchen",
  POOL_BAR: "Pool Bar",
  BEACH_GRILL: "Beach Grill",
  SPA_CAFE: "Spa Café",
  ROOM_SERVICE: "Room Service",
  MINI_BAR: "Mini Bar",
  BANQUET: "Banquet",
  MAIN_RESTAURANT: "Main Restaurant",
};

const TYPE_COLORS: Record<string, string> = {
  KITCHEN: "bg-orange-500/10 text-orange-400",
  POOL_BAR: "bg-cyan-500/10 text-cyan-400",
  BEACH_GRILL: "bg-amber-500/10 text-amber-400",
  SPA_CAFE: "bg-violet-500/10 text-violet-400",
  ROOM_SERVICE: "bg-blue-500/10 text-blue-400",
  MINI_BAR: "bg-emerald-500/10 text-emerald-400",
  BANQUET: "bg-pink-500/10 text-pink-400",
  MAIN_RESTAURANT: "bg-red-500/10 text-red-400",
};

export default function OutletsPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/outlets?limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setOutlets(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-xs text-foreground-muted">
        <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading outlets...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Outlets</h1>
          <p className="text-[11px] text-foreground-muted">Manage hotel outlets and departments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {outlets.map((outlet) => (
          <div
            key={outlet.id}
            className="bg-[#13161c]/80 backdrop-blur border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-brand-700/20 flex items-center justify-center">
                  <Store className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <div className="text-xs font-semibold">{outlet.name}</div>
              </div>
              <span className={`text-[9px] px-1.5 py-[1px] rounded-full font-medium ${TYPE_COLORS[outlet.type] || "bg-slate-500/10 text-slate-400"}`}>
                {TYPE_LABELS[outlet.type] || outlet.type}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted">
                <MapPin className="w-2.5 h-2.5" />
                {outlet.property?.name || "—"}
                {outlet.property?.hotel?.name && ` · ${outlet.property.hotel.name}`}
              </div>
              {outlet.managerName && (
                <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted">
                  <Store className="w-2.5 h-2.5" />
                  Manager: {outlet.managerName}
                </div>
              )}
              {outlet.managerPhone && (
                <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted">
                  <Phone className="w-2.5 h-2.5" />
                  {outlet.managerPhone}
                </div>
              )}
              {outlet.operatingHours && (
                <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted">
                  <Clock className="w-2.5 h-2.5" />
                  {outlet.operatingHours}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {outlets.length === 0 && (
        <div className="text-center py-12 text-[11px] text-foreground-muted border border-dashed border-border-subtle rounded-lg">
          No outlets found. Seed coastal data to get started.
        </div>
      )}
    </div>
  );
}
