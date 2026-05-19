"use client";


import type {
  ExplorerUser,
  ExplorerSupplier,
  ExplorerHotel,
  ExplorerOrder,
  ExplorerProduct,
  ExplorerInvoice,
  ExplorerFactoring,
  ExplorerLead,
} from "@/types/dashboard";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Users, Building2, Hotel, ShoppingCart, Package,
  FileText, Landmark, Target, Loader2, ChevronLeft, ChevronRight,
  ArrowUpDown, Eye, Filter, X,
} from "lucide-react";

type EntityType = "users" | "suppliers" | "hotels" | "orders" | "products" | "invoices" | "factoring" | "leads";

const TABS: { id: EntityType; label: string; icon: React.ElementType }[] = [
  { id: "users", label: "Users", icon: Users },
  { id: "suppliers", label: "Suppliers", icon: Building2 },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "products", label: "Products", icon: Package },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "factoring", label: "Factoring", icon: Landmark },
  { id: "leads", label: "Leads", icon: Target },
];

const STATUS_OPTIONS: Record<EntityType, string[]> = {
  users: ["ACTIVE", "INACTIVE", "SUSPENDED"],
  suppliers: ["PENDING", "ACTIVE", "SUSPENDED", "REJECTED"],
  hotels: ["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION"],
  orders: ["DRAFT", "PENDING_APPROVAL", "APPROVED", "CONFIRMED", "IN_TRANSIT", "DELIVERED", "DISPUTED", "CANCELLED"],
  products: ["ACTIVE", "INACTIVE", "OUT_OF_STOCK", "DISCONTINUED"],
  invoices: ["DRAFT", "ISSUED", "SUBMITTED", "VALIDATED", "DISPUTED"],
  factoring: ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "DISBURSED", "SETTLED"],
  leads: ["DISCOVERED", "ENRICHED", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"],
};

export default function AdminExplorerPage() {
  const [activeTab, setActiveTab] = useState<EntityType>("users");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState<ExplorerEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        entity: activeTab,
        page: String(page),
        limit: "20",
        sortBy,
        sortOrder,
      });
      if (search) params.set("search", search);
      if (status) params.set("status", status);

      const res = await fetch(`/api/v1/admin/explorer?${params}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
      }
    } catch (err) {
      console.error("Explorer fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, status, page, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, search, status]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const formatCurrency = (amount: number | null, currency = "EGP") => {
    if (amount == null) return "—";
    return `${amount.toLocaleString()} ${currency}`;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      IN_TRANSIT: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      DISPUTED: "bg-red-500/10 text-red-400 border-red-500/20",
      CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
      REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
      SUSPENDED: "bg-red-500/10 text-red-400 border-red-500/20",
      VALIDATED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      SUBMITTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      DISBURSED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      CONVERTED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      LOST: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return map[s] || "bg-white/5 text-white/50 border-white/10";
  };

  const renderTable = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-white/30 text-sm">No records found</p>
        </div>
      );
    }

    switch (activeTab) {
      case "users":
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/30">
                <th className="text-left py-3 px-4 cursor-pointer hover:text-white/50" onClick={() => toggleSort("name")}>Name <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Tenant</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4 cursor-pointer hover:text-white/50" onClick={() => toggleSort("createdAt")}>Created <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.map((u: ExplorerUser) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-medium text-white/80">{u.name}</td>
                  <td className="py-3 px-4 text-white/50">{u.email}</td>
                  <td className="py-3 px-4"><span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-white/50">{u.platformRole}</span></td>
                  <td className="py-3 px-4 text-white/40">{u.tenant?.name || "—"}</td>
                  <td className="py-3 px-4"><span className={`text-[11px] px-2 py-0.5 rounded border ${statusColor(u.status)}`}>{u.status}</span></td>
                  <td className="py-3 px-4 text-white/30 text-xs">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "suppliers":
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/30">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">City</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Tier</th>
                <th className="text-left py-3 px-4">Rating</th>
                <th className="text-left py-3 px-4">Products</th>
                <th className="text-left py-3 px-4">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.map((s: ExplorerSupplier) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-medium text-white/80">{s.name}</td>
                  <td className="py-3 px-4 text-white/40">{s.city || "—"}</td>
                  <td className="py-3 px-4"><span className={`text-[11px] px-2 py-0.5 rounded border ${statusColor(s.status)}`}>{s.status}</span></td>
                  <td className="py-3 px-4 text-white/40">{s.tier}</td>
                  <td className="py-3 px-4 text-white/40">{s.rating ? `${s.rating} ★` : "—"}</td>
                  <td className="py-3 px-4 text-white/40">{s._count?.products || 0}</td>
                  <td className="py-3 px-4 text-white/40">{s._count?.orders || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "hotels":
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/30">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">City</th>
                <th className="text-left py-3 px-4">Stars</th>
                <th className="text-left py-3 px-4">Rooms</th>
                <th className="text-left py-3 px-4">Credit Limit</th>
                <th className="text-left py-3 px-4">Orders</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.map((h: ExplorerHotel) => (
                <tr key={h.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-medium text-white/80">{h.name}</td>
                  <td className="py-3 px-4 text-white/40">{h.city || "—"}</td>
                  <td className="py-3 px-4 text-white/40">{h.starRating ? `${h.starRating}★` : "—"}</td>
                  <td className="py-3 px-4 text-white/40">{h.roomCount || "—"}</td>
                  <td className="py-3 px-4 text-white/40">{formatCurrency(h.creditLimit)}</td>
                  <td className="py-3 px-4 text-white/40">{h._count?.orders || 0}</td>
                  <td className="py-3 px-4"><span className={`text-[11px] px-2 py-0.5 rounded border ${statusColor(h.status)}`}>{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "orders":
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/30">
                <th className="text-left py-3 px-4">Order #</th>
                <th className="text-left py-3 px-4">Hotel</th>
                <th className="text-left py-3 px-4">Supplier</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Payment</th>
                <th className="text-left py-3 px-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.map((o: ExplorerOrder) => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-medium text-white/80">{o.orderNumber}</td>
                  <td className="py-3 px-4 text-white/40">{o.hotel?.name || "—"}</td>
                  <td className="py-3 px-4 text-white/40">{o.supplier?.name || "—"}</td>
                  <td className="py-3 px-4 font-medium text-white/60">{formatCurrency(o.total, o.currency)}</td>
                  <td className="py-3 px-4"><span className={`text-[11px] px-2 py-0.5 rounded border ${statusColor(o.status)}`}>{o.status}</span></td>
                  <td className="py-3 px-4">{o.paymentGuaranteed ? <span className="text-emerald-400 text-xs">✓ Guaranteed</span> : <span className="text-amber-400 text-xs">Pending</span>}</td>
                  <td className="py-3 px-4 text-white/30 text-xs">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "products":
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/30">
                <th className="text-left py-3 px-4">SKU</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Stock</th>
                <th className="text-left py-3 px-4">Supplier</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.map((p: ExplorerProduct) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono text-white/40 text-xs">{p.sku}</td>
                  <td className="py-3 px-4 font-medium text-white/80">{p.name}</td>
                  <td className="py-3 px-4 text-white/40">{p.category}</td>
                  <td className="py-3 px-4 font-medium text-white/60">{formatCurrency(p.unitPrice, p.currency)}</td>
                  <td className="py-3 px-4 text-white/40">{p.stockQuantity}</td>
                  <td className="py-3 px-4 text-white/40">{p.supplier?.name || "—"}</td>
                  <td className="py-3 px-4"><span className={`text-[11px] px-2 py-0.5 rounded border ${statusColor(p.status)}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "invoices":
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/30">
                <th className="text-left py-3 px-4">Invoice #</th>
                <th className="text-left py-3 px-4">Order #</th>
                <th className="text-left py-3 px-4">Hotel</th>
                <th className="text-left py-3 px-4">Supplier</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">ETA Status</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.map((i: ExplorerInvoice) => (
                <tr key={i.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-medium text-white/80">{i.invoiceNumber}</td>
                  <td className="py-3 px-4 text-white/40">{i.order?.orderNumber || "—"}</td>
                  <td className="py-3 px-4 text-white/40">{i.hotel?.name || "—"}</td>
                  <td className="py-3 px-4 text-white/40">{i.supplier?.name || "—"}</td>
                  <td className="py-3 px-4 font-medium text-white/60">{formatCurrency(i.total, i.currency)}</td>
                  <td className="py-3 px-4"><span className={`text-[11px] px-2 py-0.5 rounded border ${statusColor(i.etaStatus)}`}>{i.etaStatus}</span></td>
                  <td className="py-3 px-4"><span className={`text-[11px] px-2 py-0.5 rounded border ${statusColor(i.status)}`}>{i.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "factoring":
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/30">
                <th className="text-left py-3 px-4">Invoice</th>
                <th className="text-left py-3 px-4">Factoring Co.</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Risk Score</th>
                <th className="text-left py-3 px-4">Risk Tier</th>
                <th className="text-left py-3 px-4">Disbursed</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.map((f: ExplorerFactoring) => (
                <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 text-white/40">{f.invoice?.invoiceNumber || "—"}</td>
                  <td className="py-3 px-4 font-medium text-white/80">{f.factoringCompany?.name || "—"}</td>
                  <td className="py-3 px-4 font-medium text-white/60">{formatCurrency(f.requestedAmount)}</td>
                  <td className="py-3 px-4 text-white/40">{f.riskScore ?? "—"}</td>
                  <td className="py-3 px-4 text-white/40">{f.riskTier || "—"}</td>
                  <td className="py-3 px-4 text-white/40">{formatCurrency(f.disbursedAmount)}</td>
                  <td className="py-3 px-4"><span className={`text-[11px] px-2 py-0.5 rounded border ${statusColor(f.status)}`}>{f.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "leads":
        return (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/30">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">City</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Priority</th>
                <th className="text-left py-3 px-4">Tier</th>
                <th className="text-left py-3 px-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.map((l: ExplorerLead) => (
                <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-medium text-white/80">{l.name}</td>
                  <td className="py-3 px-4 text-white/40">{l.entityType}</td>
                  <td className="py-3 px-4 text-white/40">{l.city || "—"}</td>
                  <td className="py-3 px-4"><span className={`text-[11px] px-2 py-0.5 rounded border ${statusColor(l.status)}`}>{l.status}</span></td>
                  <td className="py-3 px-4 text-white/40">{l.priority || "—"}</td>
                  <td className="py-3 px-4 text-white/40">{l.tier || "—"}</td>
                  <td className="py-3 px-4 text-white/40">{l.source || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[24px] font-bold tracking-tight text-white">Data Explorer</h1>
        <p className="text-[13px] text-white/40 mt-1">Search and review all platform records across every tenant</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-[#8B0000]/20 text-[#ff6b6b] border border-[#8B0000]/30"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8B0000]/40 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/20" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white outline-none focus:border-[#8B0000]/40 transition-all"
          >
            <option value="" className="bg-[#1a1a2e]">All Statuses</option>
            {STATUS_OPTIONS[activeTab].map((s) => (
              <option key={s} value={s} className="bg-[#1a1a2e]">{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white/30">
          {total.toLocaleString()} records found
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-1.5 rounded-lg border border-white/[0.08] text-white/30 hover:text-white/60 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-white/40">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-white/[0.08] text-white/30 hover:text-white/60 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0f] overflow-hidden">
        {renderTable()}
      </div>
    </div>
  );
}
