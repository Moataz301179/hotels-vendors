"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  Factory,
  Eye,
  ClipboardList,
  Plus,
} from "lucide-react";
import { useRole } from "@/components/app/role-context";

interface Supplier {
  id: string;
  name: string;
  legalName?: string | null;
  taxId: string;
  email: string;
  phone?: string | null;
  city: string;
  governorate: string;
  status: string;
  tier: string;
  rating?: number | null;
  reviewCount: number;
  certifications?: string | null;
  createdAt: string;
  _count?: { products: number; orders: number; audits: number };
}

const STATUS_TABS = ["ALL", "PENDING", "ACTIVE", "SUSPENDED"] as const;

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400",
  ACTIVE: "bg-emerald-500/10 text-emerald-400",
  SUSPENDED: "bg-red-500/10 text-red-400",
  REJECTED: "bg-slate-500/10 text-slate-400",
};

const TIER_BADGE: Record<string, string> = {
  CORE: "bg-slate-500/10 text-slate-400",
  PREMIER: "bg-violet-500/10 text-violet-400",
  COASTAL: "bg-cyan-500/10 text-cyan-400",
  VERIFIED: "bg-emerald-500/10 text-emerald-400",
};

function SupplierPageContent() {
  const { role } = useRole();
  const searchParams = useSearchParams();
  const onboardingSuccess = searchParams.get("onboarding") === "success";

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<string>("ALL");
  const [toast, setToast] = useState<string | null>(
    onboardingSuccess ? "Supplier application submitted successfully!" : null
  );

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/suppliers?limit=200");
        const data = await res.json();
        if (data.success) setSuppliers(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function verifySupplier(id: string) {
    try {
      const res = await fetch(`/api/suppliers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE" }),
      });
      const data = await res.json();
      if (data.success) {
        setSuppliers((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "ACTIVE" } : s))
        );
        setToast("Supplier verified successfully");
      }
    } catch (e) {
      console.error(e);
    }
  }

  const filtered = suppliers.filter((s) => {
    const matchSearch =
      search === "" ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.taxId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusTab === "ALL" || s.status === statusTab;
    return matchSearch && matchStatus;
  });

  const counts = {
    ALL: suppliers.length,
    PENDING: suppliers.filter((s) => s.status === "PENDING").length,
    ACTIVE: suppliers.filter((s) => s.status === "ACTIVE").length,
    SUSPENDED: suppliers.filter((s) => s.status === "SUSPENDED").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-xs text-foreground-muted">
        <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading suppliers...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Toast */}
      {toast && (
        <div className="fixed top-14 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Suppliers</h1>
          <p className="text-[11px] text-foreground-muted">Manage and verify supplier applications</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/supplier/onboarding"
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-medium bg-brand-700 text-white hover:bg-brand-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Onboard Supplier
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-6 pr-2 py-[3px] text-[11px] rounded-md bg-surface border border-border-subtle focus:border-brand-500/50 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`px-2.5 py-[3px] rounded-md text-[11px] font-medium transition-colors ${
                statusTab === tab
                  ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                  : "text-foreground-muted hover:bg-surface hover:text-foreground border border-transparent"
              }`}
            >
              {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
              <span className="ml-1 text-[10px] text-foreground-faint">{counts[tab]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border-subtle text-foreground-muted bg-surface-raised/50">
              <th className="text-left px-3 py-2 font-medium">Supplier</th>
              <th className="text-left px-3 py-2 font-medium">Location</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-left px-3 py-2 font-medium">Tier</th>
              <th className="text-right px-3 py-2 font-medium">Products</th>
              <th className="text-right px-3 py-2 font-medium">Orders</th>
              <th className="text-right px-3 py-2 font-medium">Audits</th>
              <th className="text-left px-3 py-2 font-medium">Rating</th>
              <th className="text-right px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.id}
                className="border-b border-border-subtle/40 hover:bg-surface-raised/40 transition-colors"
              >
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-brand-700/20 flex items-center justify-center text-[10px] font-bold text-brand-400 shrink-0">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-[11px]">{s.name}</div>
                      <div className="text-[10px] text-foreground-muted">{s.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-foreground-muted">
                  {s.city}, {s.governorate}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full text-[9px] font-medium ${
                      STATUS_BADGE[s.status] || ""
                    }`}
                  >
                    {s.status === "PENDING" && <Clock className="w-2.5 h-2.5" />}
                    {s.status === "ACTIVE" && <CheckCircle2 className="w-2.5 h-2.5" />}
                    {s.status === "SUSPENDED" && <AlertTriangle className="w-2.5 h-2.5" />}
                    {s.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full text-[9px] font-medium ${
                      TIER_BADGE[s.tier] || ""
                    }`}
                  >
                    <Star className="w-2.5 h-2.5" />
                    {s.tier}
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-mono text-foreground-muted">
                  {s._count?.products ?? 0}
                </td>
                <td className="px-3 py-2 text-right font-mono text-foreground-muted">
                  {s._count?.orders ?? 0}
                </td>
                <td className="px-3 py-2 text-right font-mono text-foreground-muted">
                  {s._count?.audits ?? 0}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent-gold" />
                    <span className="font-medium">{s.rating?.toFixed(1) ?? "0.0"}</span>
                    <span className="text-[10px] text-foreground-muted">({s.reviewCount})</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/supplier/${s.id}/audits`}
                      className="flex items-center gap-1 px-2 py-[3px] rounded-md text-[10px] font-medium bg-white/5 border border-white/10 text-foreground-muted hover:bg-white/[0.07] hover:text-foreground transition-colors"
                    >
                      <ClipboardList className="w-3 h-3" />
                      Audits
                    </Link>
                    {role === "ADMIN" && s.status === "PENDING" && (
                      <button
                        onClick={() => verifySupplier(s.id)}
                        className="flex items-center gap-1 px-2 py-[3px] rounded-md text-[10px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        Verify
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-foreground-muted text-[11px]">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SupplierPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-96 text-xs text-foreground-muted">
        <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading suppliers...
      </div>
    }>
      <SupplierPageContent />
    </Suspense>
  );
}
