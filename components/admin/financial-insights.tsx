"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Building2,
  Package,
  RefreshCw,
  Filter,
} from "lucide-react";
import {
  getAllHotels,
  getAllSuppliers,
  getAllProducts,
  type RealHotel,
  type RealSupplier,
  type RealProduct,
} from "@/lib/marketplace/real-suppliers";

interface InsightQuery {
  id: string;
  label: string;
  category: "supplier" | "hotel" | "product" | "order" | "date" | "consumption";
  icon: React.ElementType;
}

const PRESET_QUERIES: InsightQuery[] = [
  { id: "top-suppliers-gmv", label: "Top 10 suppliers by GMV", category: "supplier", icon: TrendingUp },
  { id: "hotel-spending", label: "Hotel spending by governorate", category: "hotel", icon: Building2 },
  { id: "product-prices", label: "Price comparison: poultry vs seafood", category: "product", icon: Package },
  { id: "monthly-trend", label: "Monthly GMV trend (last 6 months)", category: "date", icon: Calendar },
  { id: "low-stock-risk", label: "Suppliers with capacity < EGP 1M", category: "supplier", icon: TrendingDown },
  { id: "luxury-hotels", label: "Luxury tier hotel procurement", category: "hotel", icon: Building2 },
  { id: "coastal-cluster", label: "Red Sea & South Sinai cluster", category: "hotel", icon: Building2 },
  { id: "dairy-category", label: "Dairy category performance", category: "product", icon: Package },
  { id: "cairo-vs-alex", label: "Cairo vs Alexandria GMV", category: "hotel", icon: BarChart3 },
  { id: "top-products", label: "Top 20 products by price", category: "product", icon: Package },
  { id: "industrial-zones", label: "Supplier concentration by zone", category: "supplier", icon: PieChart },
  { id: "consumption-pattern", label: "Weekly vs monthly order patterns", category: "consumption", icon: Calendar },
];

export function FinancialInsights() {
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<React.ReactNode | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const hotels = getAllHotels();
  const suppliers = getAllSuppliers();
  const products = getAllProducts();

  const filteredQueries = useMemo(() => {
    if (filterCategory === "all") return PRESET_QUERIES;
    return PRESET_QUERIES.filter((q) => q.category === filterCategory);
  }, [filterCategory]);

  const runQuery = async (queryId: string) => {
    setActiveQuery(queryId);
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 800));
    const output = generateInsight(queryId, hotels, suppliers, products);
    setResult(output);
    setLoading(false);
  };

  const totalGmv = hotels.reduce((sum, h) => sum + h.monthlyGmvEgp, 0);
  const totalCapacity = suppliers.reduce((sum, s) => sum + s.monthlyCapacityEgp, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Hotel GMV"
          value={`EGP ${(totalGmv / 1_000_000).toFixed(1)}M`}
          sub="Monthly"
          icon={TrendingUp}
          color="#34d399"
        />
        <SummaryCard
          label="Supplier Capacity"
          value={`EGP ${(totalCapacity / 1_000_000).toFixed(0)}M`}
          sub="Monthly"
          icon={Package}
          color="#022349"
        />
        <SummaryCard
          label="Hotels"
          value={hotels.length.toString()}
          sub="Properties"
          icon={Building2}
          color="#55b3ff"
        />
        <SummaryCard
          label="Products"
          value={products.length.toString()}
          sub="SKUs"
          icon={Package}
          color="#fbbf24"
        />
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Auto-Generated Insights</h3>
            <p className="text-[11px] text-white/30 mt-0.5">
              Click any query to analyze real platform data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={12} className="text-white/30" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.06] rounded-lg text-[11px] text-white/60 px-2 py-1 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="supplier">By Supplier</option>
              <option value="hotel">By Hotel</option>
              <option value="product">By Product</option>
              <option value="date">By Date</option>
              <option value="consumption">Consumption</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {filteredQueries.map((q) => (
            <button
              key={q.id}
              onClick={() => runQuery(q.id)}
              disabled={loading && activeQuery === q.id}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all border ${
                activeQuery === q.id
                  ? "bg-[#022349]/15 border-[#022349]/30 text-[#022349]"
                  : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
              }`}
            >
              <q.icon size={11} />
              {q.label}
              {loading && activeQuery === q.id && (
                <RefreshCw size={10} className="animate-spin ml-1" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4"
            >
              {result}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-white/40">{label}</span>
        <Icon size={14} style={{ color }} />
      </div>
      <div className="text-[18px] font-bold text-white">{value}</div>
      <div className="text-[10px] text-white/25 mt-0.5">{sub}</div>
    </div>
  );
}

function generateInsight(
  queryId: string,
  hotels: RealHotel[],
  suppliers: RealSupplier[],
  products: RealProduct[]
): React.ReactNode {
  switch (queryId) {
    case "top-suppliers-gmv": {
      const top = [...suppliers]
        .sort((a, b) => b.monthlyCapacityEgp - a.monthlyCapacityEgp)
        .slice(0, 10);
      return (
        <div>
          <h4 className="text-[12px] font-semibold text-white mb-3">Top 10 Suppliers by Monthly Capacity</h4>
          <div className="space-y-2">
            {top.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-[10px] text-white/30 w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-white/80">{s.name}</span>
                    <span className="text-[11px] text-white/40">
                      EGP {(s.monthlyCapacityEgp / 1_000_000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.04] mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(s.monthlyCapacityEgp / top[0].monthlyCapacityEgp) * 100}%`,
                        backgroundColor: "#022349",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "hotel-spending": {
      const byGov: Record<string, number> = {};
      for (const h of hotels) {
        byGov[h.governorate] = (byGov[h.governorate] || 0) + h.monthlyGmvEgp;
      }
      const sorted = Object.entries(byGov).sort((a, b) => b[1] - a[1]);
      return (
        <div>
          <h4 className="text-[12px] font-semibold text-white mb-3">Hotel Spending by Governorate</h4>
          <div className="grid grid-cols-2 gap-2">
            {sorted.map(([gov, gmv]) => (
              <div key={gov} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[11px] text-white/60">{gov}</div>
                <div className="text-[14px] font-bold text-white mt-0.5">
                  EGP {(gmv / 1_000_000).toFixed(1)}M
                </div>
                <div className="text-[10px] text-white/25">
                  {hotels.filter((h) => h.governorate === gov).length} properties
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "product-prices": {
      const poultry = products.filter((p) => p.category === "poultry");
      const seafood = products.filter((p) => p.category === "seafood");
      const poultryAvg = poultry.reduce((s, p) => s + p.basePriceEgp, 0) / (poultry.length || 1);
      const seafoodAvg = seafood.reduce((s, p) => s + p.basePriceEgp, 0) / (seafood.length || 1);
      return (
        <div>
          <h4 className="text-[12px] font-semibold text-white mb-3">Price Comparison: Poultry vs Seafood</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="text-[11px] text-white/40 mb-1">Poultry Average</div>
              <div className="text-[18px] font-bold text-white">EGP {poultryAvg.toFixed(0)}</div>
              <div className="text-[10px] text-white/25">{poultry.length} SKUs</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="text-[11px] text-white/40 mb-1">Seafood Average</div>
              <div className="text-[18px] font-bold text-white">EGP {seafoodAvg.toFixed(0)}</div>
              <div className="text-[10px] text-white/25">{seafood.length} SKUs</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-white/40">
            Seafood commands a <span className="text-emerald-400">{((seafoodAvg / poultryAvg - 1) * 100).toFixed(0)}% premium</span> over poultry on average
          </div>
        </div>
      );
    }

    case "luxury-hotels": {
      const luxury = hotels.filter((h) => h.tier === "luxury");
      const luxuryGmv = luxury.reduce((s, h) => s + h.monthlyGmvEgp, 0);
      return (
        <div>
          <h4 className="text-[12px] font-semibold text-white mb-3">Luxury Tier Hotels</h4>
          <div className="space-y-2">
            {luxury.slice(0, 8).map((h) => (
              <div key={h.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <div>
                  <div className="text-[12px] text-white/80">{h.name}</div>
                  <div className="text-[10px] text-white/25">{h.city} · {h.rooms} rooms</div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] text-white/60">EGP {(h.monthlyGmvEgp / 1_000_000).toFixed(1)}M</div>
                  <div className="text-[10px] text-white/25">monthly</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.04] flex justify-between text-[11px]">
            <span className="text-white/40">{luxury.length} luxury properties</span>
            <span className="text-white/60 font-medium">Total: EGP {(luxuryGmv / 1_000_000).toFixed(1)}M/mo</span>
          </div>
        </div>
      );
    }

    case "coastal-cluster": {
      const coastal = hotels.filter((h) => ["Red Sea", "South Sinai", "Matrouh"].includes(h.governorate));
      const coastalGmv = coastal.reduce((s, h) => s + h.monthlyGmvEgp, 0);
      return (
        <div>
          <h4 className="text-[12px] font-semibold text-white mb-3">Coastal Cluster: Red Sea, South Sinai & Matrouh</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {coastal.map((h) => (
              <div key={h.id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[11px] text-white/70 truncate">{h.name}</div>
                <div className="text-[10px] text-white/25">{h.city}</div>
                <div className="text-[12px] font-semibold text-white mt-1">EGP {(h.monthlyGmvEgp / 1_000_000).toFixed(1)}M</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[11px] text-white/40">
            {coastal.length} coastal properties · Combined GMV: <span className="text-white/60 font-medium">EGP {(coastalGmv / 1_000_000).toFixed(1)}M/mo</span>
          </div>
        </div>
      );
    }

    case "top-products": {
      const top = [...products].sort((a, b) => b.basePriceEgp - a.basePriceEgp).slice(0, 20);
      return (
        <div>
          <h4 className="text-[12px] font-semibold text-white mb-3">Top 20 Products by Unit Price</h4>
          <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
            {top.map((p, i) => (
              <div key={p.sku} className="flex items-center gap-3 p-1.5 rounded hover:bg-white/[0.02]">
                <span className="text-[10px] text-white/20 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-white/70 truncate">{p.name}</div>
                </div>
                <span className="text-[11px] text-white/40 shrink-0">EGP {p.basePriceEgp}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "industrial-zones": {
      const zones: Record<string, { count: number; capacity: number }> = {};
      for (const s of suppliers) {
        const z = s.industrialZone;
        if (!zones[z]) zones[z] = { count: 0, capacity: 0 };
        zones[z].count++;
        zones[z].capacity += s.monthlyCapacityEgp;
      }
      const sorted = Object.entries(zones).sort((a, b) => b[1].capacity - a[1].capacity);
      return (
        <div>
          <h4 className="text-[12px] font-semibold text-white mb-3">Supplier Concentration by Industrial Zone</h4>
          <div className="space-y-2">
            {sorted.slice(0, 10).map(([zone, data]) => (
              <div key={zone} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/70">{zone}</span>
                    <span className="text-[10px] text-white/30">{data.count} suppliers</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.04] mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#55b3ff]"
                      style={{ width: `${(data.capacity / sorted[0][1].capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "low-stock-risk": {
      const low = suppliers.filter((s) => s.monthlyCapacityEgp < 1_000_000);
      return (
        <div>
          <h4 className="text-[12px] font-semibold text-white mb-3">Suppliers with Capacity Below EGP 1M</h4>
          <div className="text-[11px] text-amber-400/80 mb-3">{low.length} suppliers flagged as low-capacity</div>
          <div className="grid grid-cols-2 gap-2">
            {low.map((s) => (
              <div key={s.id} className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[11px] text-white/60 truncate">{s.name}</div>
                <div className="text-[10px] text-white/25">{s.city}</div>
                <div className="text-[11px] text-amber-400/60 mt-1">EGP {(s.monthlyCapacityEgp / 1000).toFixed(0)}K</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    default:
      return (
        <div className="text-[12px] text-white/40">
          Analysis complete. Select a specific query to view detailed breakdowns.
        </div>
      );
  }
}
