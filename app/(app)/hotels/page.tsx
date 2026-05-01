"use client";

import { useState, useEffect } from "react";
import { Search, Hotel, MapPin, Users, Star, CreditCard } from "lucide-react";

interface HotelItem {
  id: string;
  name: string;
  legalName?: string;
  taxId: string;
  city: string;
  governorate: string;
  starRating?: number;
  roomCount?: number;
  tier: string;
  status: string;
  creditLimit?: number;
  creditUsed?: number;
  properties: { id: string; name: string; city: string; type: string }[];
  users: { id: string; name: string; role: string; status: string }[];
  _count: { orders: number; properties: number; users: number };
}

const TIER_BADGE: Record<string, string> = {
  CORE: "bg-slate-500/10 text-slate-400",
  PREMIER: "bg-amber-500/10 text-amber-400",
  COASTAL: "bg-cyan-500/10 text-cyan-400",
};

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400",
  INACTIVE: "bg-slate-500/10 text-slate-400",
  SUSPENDED: "bg-red-500/10 text-red-400",
  PENDING_VERIFICATION: "bg-amber-500/10 text-amber-400",
};

export default function HotelsPage() {
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hotels?limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setHotels(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = hotels.filter(
    (h) =>
      search === "" ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()) ||
      h.taxId.includes(search)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-xs text-foreground-muted">
        <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading hotels...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">Hotels</h1>
        <span className="text-[11px] text-foreground-muted">{filtered.length} properties</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search hotels, cities, tax IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-6 pr-2 py-[3px] text-[11px] rounded-md bg-surface border border-border-subtle focus:border-brand-500/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((hotel) => (
          <div
            key={hotel.id}
            className="rounded-md border border-border-subtle bg-surface p-3 hover:border-border-default transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-brand-700/20 flex items-center justify-center text-brand-400">
                  <Hotel className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold">{hotel.name}</div>
                  <div className="text-[9px] text-foreground-muted">
                    {hotel.legalName || hotel.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`text-[9px] px-1.5 py-[1px] rounded-full font-medium ${
                    TIER_BADGE[hotel.tier] || ""
                  }`}
                >
                  {hotel.tier}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-[1px] rounded-full font-medium ${
                    STATUS_BADGE[hotel.status] || ""
                  }`}
                >
                  {hotel.status}
                </span>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-4 gap-2 text-center">
              <div className="rounded bg-surface-raised/30 p-1.5">
                <div className="text-[9px] text-foreground-muted uppercase">Rooms</div>
                <div className="text-xs font-semibold">{hotel.roomCount || 0}</div>
              </div>
              <div className="rounded bg-surface-raised/30 p-1.5">
                <div className="text-[9px] text-foreground-muted uppercase">Orders</div>
                <div className="text-xs font-semibold">{hotel._count.orders}</div>
              </div>
              <div className="rounded bg-surface-raised/30 p-1.5">
                <div className="text-[9px] text-foreground-muted uppercase">Users</div>
                <div className="text-xs font-semibold">{hotel._count.users}</div>
              </div>
              <div className="rounded bg-surface-raised/30 p-1.5">
                <div className="text-[9px] text-foreground-muted uppercase">Credit</div>
                <div className="text-xs font-semibold">
                  EGP {(hotel.creditUsed || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-3 text-[9px] text-foreground-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                {hotel.city}, {hotel.governorate}
              </span>
              {hotel.starRating && (
                <span className="flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 text-amber-400" />
                  {hotel.starRating}★
                </span>
              )}
              <span className="flex items-center gap-1">
                <CreditCard className="w-2.5 h-2.5" />
                {hotel.taxId}
              </span>
            </div>

            {hotel.properties.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {hotel.properties.map((p) => (
                  <span
                    key={p.id}
                    className="text-[9px] px-1.5 py-[1px] rounded bg-surface-raised/40 border border-border-subtle"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
