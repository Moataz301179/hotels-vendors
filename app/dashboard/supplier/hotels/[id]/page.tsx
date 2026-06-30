"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Star,
  ShoppingBag,
  Loader2,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Hotel,
  Users,
  BedDouble,
  Calendar,
  FileText,
} from "lucide-react";

interface HotelDetail {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  address: string | null;
  status: string;
  rating: number | null;
  createdAt: string;
  description: string | null;
  properties?: { id: string; name: string; type: string; city: string }[];
  propertyCount?: number;
  totalOrders?: number;
  totalRevenue?: number;
}

function formatCurrency(amount: number) {
  return `EGP ${amount.toLocaleString("en-EG")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-EG", { year: "numeric", month: "short", day: "numeric" });
}

export default function HotelProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/v1/hotel/profile/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setHotel(json.data?.hotel ?? json.hotel);
        else setError(json.error || "Failed to load hotel");
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-foreground-muted" /></div>;
  }

  if (error || !hotel) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error || "Hotel not found"}</div>
        <button onClick={() => router.back()} className="mt-4 flex items-center gap-2 text-sm text-foreground-tertiary hover:text-foreground-tertiary transition-colors"><ArrowLeft size={14} /> Go back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground-tertiary transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Hotel size={28} className="text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-foreground">{hotel.name}</h1>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                  hotel.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-surface-raised text-foreground-tertiary border-subtle10"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hotel.status === "ACTIVE" ? "bg-emerald-400" : "bg-foreground-muted"}`} />
                  {hotel.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                {hotel.city && <span className="text-xs text-foreground-tertiary flex items-center gap-1"><MapPin size={12} />{hotel.city}</span>}
                {hotel.rating && <span className="text-xs text-amber-400 flex items-center gap-1"><Star size={12} fill="currentColor" />{hotel.rating.toFixed(1)}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2"><Building2 size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Properties</span></div>
          <p className="text-lg font-bold text-foreground">{hotel.propertyCount?.toString() || hotel.properties?.length?.toString() || "—"}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2"><ShoppingBag size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Total Orders</span></div>
          <p className="text-lg font-bold text-foreground">{hotel.totalOrders?.toLocaleString() || "—"}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2"><FileText size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Total Revenue</span></div>
          <p className="text-lg font-bold text-foreground">{hotel.totalRevenue ? formatCurrency(hotel.totalRevenue) : "—"}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2"><Calendar size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Member Since</span></div>
          <p className="text-lg font-bold text-foreground">{formatDate(hotel.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          {hotel.description && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">About</h3>
              <p className="text-sm text-foreground-tertiary leading-relaxed">{hotel.description}</p>
            </div>
          )}

          {hotel.properties && hotel.properties.length > 0 && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><BedDouble size={14} className="text-foreground-muted" />Properties</h3>
              <div className="space-y-2">
                {hotel.properties.map((prop) => (
                  <div key={prop.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-raised border border-subtle">
                    <div>
                      <p className="text-xs font-medium text-foreground">{prop.name}</p>
                      <p className="text-[10px] text-foreground-muted">{prop.city}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-raised text-foreground-tertiary">{prop.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="rounded-xl border border-subtle bg-surface-raised p-4">
            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">Contact</h3>
            <div className="space-y-2">
              {hotel.email && <div className="flex items-center gap-2 text-xs"><Mail size={12} className="text-foreground-muted" /><span className="text-foreground-tertiary">{hotel.email}</span></div>}
              {hotel.phone && <div className="flex items-center gap-2 text-xs"><Phone size={12} className="text-foreground-muted" /><span className="text-foreground-tertiary">{hotel.phone}</span></div>}
              {hotel.address && <div className="flex items-center gap-2 text-xs"><MapPin size={12} className="text-foreground-muted" /><span className="text-foreground-tertiary">{hotel.address}</span></div>}
            </div>
          </div>

          <div className="rounded-xl border border-subtle bg-surface-raised p-4">
            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">Activity</h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${hotel.status === "ACTIVE" ? "bg-emerald-400" : "bg-amber-400"}`} />
              <span className="text-sm text-foreground">{hotel.status === "ACTIVE" ? "Active Buyer" : "Inactive"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
