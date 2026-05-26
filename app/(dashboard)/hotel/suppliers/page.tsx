"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, Search, Star, MapPin, Phone, Mail,
  Package, TrendingUp, ChevronRight, AlertTriangle,
  Filter,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  rating: number;
  totalOrders: number;
  totalValue: number;
  categories: string[];
  status: string;
  logoUrl: string | null;
}

interface SuppliersData {
  suppliers: Supplier[];
  total: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-white/10"}
        />
      ))}
      <span className="text-xs text-white/30 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "#22c55e",
    PENDING: "#f59e0b",
    SUSPENDED: "#ef4444",
    INACTIVE: "#6b7280",
  };
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors[status] || "#6b7280"}20`, color: colors[status] || "#6b7280" }}>
      {status}
    </span>
  );
}

export default function HotelSuppliersPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const queryParams = new URLSearchParams();
  if (search) queryParams.set("search", search);
  if (categoryFilter) queryParams.set("category", categoryFilter);

  const { data, loading, error, refetch } = useApi<SuppliersData>(
    `/api/v1/hotel/suppliers?${queryParams.toString()}`
  );

  const suppliers = data?.suppliers || [];

  if (loading) {
    return (
      <div className="p-6 space-y-4" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
        <div className="p-4 rounded-xl border bg-red-500/10 text-red-300" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
          <AlertTriangle size={20} className="mb-2" />
          <p className="text-sm">{error}</p>
          <button onClick={refetch} className="mt-3 px-3 py-1.5 rounded-lg text-xs bg-red-500/20 hover:bg-red-500/30 transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Suppliers</h1>
          <p className="text-xs text-white/30 mt-1">{data?.total || 0} verified suppliers</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-xs text-[#1a1a1a] placeholder:text-[#999999] border outline-none focus:border-[#a3e635]"
            style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {suppliers.length === 0 && (
          <div className="p-8 text-center text-xs text-white/20 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            No suppliers found
          </div>
        )}
        {suppliers.map((supplier) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border flex items-center gap-4"
            style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold" style={{ backgroundColor: "#a3e63520", color: "#a3e635" }}>
              {supplier.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{supplier.name}</span>
                <StatusBadge status={supplier.status} />
              </div>
              <div className="flex items-center gap-4 mt-1">
                <StarRating rating={supplier.rating} />
                <span className="text-[10px] text-white/20">{supplier.totalOrders} orders</span>
                <span className="text-[10px] text-white/20">EGP {supplier.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-white/20 flex items-center gap-1">
                  <MapPin size={10} /> {supplier.city}
                </span>
                <span className="text-[10px] text-white/20 flex items-center gap-1">
                  <Package size={10} /> {supplier.categories.join(", ")}
                </span>
              </div>
            </div>

            <a href={`/hotel/suppliers/${supplier.id}`} className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/5 transition-colors">
              <ChevronRight size={18} />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
