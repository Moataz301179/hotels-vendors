"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Star,
  Package,
  ShoppingBag,
  Loader2,
  Phone,
  Mail,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Store,
  FileText,
  ThumbsUp,
} from "lucide-react";

interface SupplierDetail {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  tier: string;
  status: string;
  rating: number | null;
  reviewCount: number | null;
  createdAt: string;
  taxId: string | null;
  commercialReg: string | null;
  description: string | null;
  productCount?: number;
  completedOrders?: number;
  totalRevenue?: number;
  categories?: string[];
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    PREMIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    STANDARD: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    VERIFIED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${colors[tier] || "bg-surface-raised text-foreground-tertiary border-subtle10"}`}>
      <Shield size={10} /> {tier}
    </span>
  );
}

function formatCurrency(amount: number) {
  return `EGP ${amount.toLocaleString("en-EG")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-EG", { year: "numeric", month: "short", day: "numeric" });
}

export default function SupplierProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/v1/suppliers/${id}`).then((r) => r.json()).catch(() => null),
      fetch(`/api/v1/supplier/analytics`).then((r) => r.json()).catch(() => null),
    ]).then(([profileJson]) => {
      if (profileJson?.success) {
        setSupplier(profileJson.data?.supplier ?? profileJson.supplier);
      } else {
        setError(profileJson?.error || "Failed to load supplier");
      }
    }).catch(() => setError("Network error"))
    .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-foreground-muted" /></div>;
  }

  if (error || !supplier) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error || "Supplier not found"}</div>
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
            <div className="w-14 h-14 rounded-xl bg-accent-base/15 flex items-center justify-center">
              <Store size={28} className="text-accent-base" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-foreground">{supplier.name}</h1>
                <TierBadge tier={supplier.tier} />
              </div>
              <div className="flex items-center gap-3 mt-1">
                {supplier.city && <span className="text-xs text-foreground-tertiary flex items-center gap-1"><MapPin size={12} />{supplier.city}</span>}
                {supplier.rating && (
                  <span className="text-xs text-amber-400 flex items-center gap-1">
                    <Star size={12} fill="currentColor" /> {supplier.rating.toFixed(1)} ({supplier.reviewCount || 0})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push(`/dashboard/hotel/catalog?supplier=${supplier.id}`)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-base hover:bg-accent-base/80 text-xs text-foreground font-medium transition-all"
        >
          <ShoppingBag size={14} /> View Products
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2"><Package size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Products</span></div>
          <p className="text-lg font-bold text-foreground">{supplier.productCount?.toLocaleString() || "—"}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2"><CheckCircle2 size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Completed Orders</span></div>
          <p className="text-lg font-bold text-foreground">{supplier.completedOrders?.toLocaleString() || "—"}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2"><FileText size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Total Revenue</span></div>
          <p className="text-lg font-bold text-foreground">{supplier.totalRevenue ? formatCurrency(supplier.totalRevenue) : "—"}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2"><Clock size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Member Since</span></div>
          <p className="text-lg font-bold text-foreground">{formatDate(supplier.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: About & Details */}
        <div className="lg:col-span-2 space-y-4">
          {supplier.description && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">About</h3>
              <p className="text-sm text-foreground-tertiary leading-relaxed">{supplier.description}</p>
            </div>
          )}

          {supplier.categories && supplier.categories.length > 0 && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {supplier.categories.map((cat) => (
                  <span key={cat} className="px-2.5 py-1 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground-tertiary">{cat}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Contact & Docs */}
        <div className="space-y-4">
          <div className="rounded-xl border border-subtle bg-surface-raised p-4">
            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">Contact</h3>
            <div className="space-y-2">
              {supplier.email && (
                <div className="flex items-center gap-2 text-xs">
                  <Mail size={12} className="text-foreground-muted" />
                  <span className="text-foreground-tertiary">{supplier.email}</span>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center gap-2 text-xs">
                  <Phone size={12} className="text-foreground-muted" />
                  <span className="text-foreground-tertiary">{supplier.phone}</span>
                </div>
              )}
              {supplier.city && (
                <div className="flex items-center gap-2 text-xs">
                  <MapPin size={12} className="text-foreground-muted" />
                  <span className="text-foreground-tertiary">{supplier.city}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-subtle bg-surface-raised p-4">
            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">Documents</h3>
            <div className="space-y-2">
              {supplier.taxId && (
                <div className="flex justify-between text-xs">
                  <span className="text-foreground-muted">Tax ID</span>
                  <span className="text-foreground-tertiary font-mono">{supplier.taxId}</span>
                </div>
              )}
              {supplier.commercialReg && (
                <div className="flex justify-between text-xs">
                  <span className="text-foreground-muted">Commercial Reg</span>
                  <span className="text-foreground-tertiary font-mono">{supplier.commercialReg}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-subtle bg-surface-raised p-4">
            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">Status</h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${supplier.status === "ACTIVE" ? "bg-emerald-400" : "bg-amber-400"}`} />
              <span className="text-sm text-foreground">{supplier.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
