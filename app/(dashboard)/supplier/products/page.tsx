"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  Plus,
  Tag,
  AlertTriangle,
  DollarSign,
  Grid3X3,
  List,
  Eye,
  Filter,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { StatusPill } from "@/components/dashboards/shared/status-pill";
import { Modal } from "@/components/ui/modal";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  currency?: string;
  stockQuantity: number;
  status: string;
}

interface ProductsApiResponse {
  products: Product[];
  pagination?: { total: number };
}

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

export default function SupplierProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data, loading, error } = useApi<ProductsApiResponse>("/api/products");

  const products = useMemo(() => data?.products ?? [], [data]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const stats = useMemo(() => {
    const total = products.length;
    const categoriesCount = new Set(products.map((p) => p.category)).size;
    const lowStock = products.filter((p) => p.stockQuantity <= 10).length;
    const avgPrice = total > 0 ? products.reduce((sum, p) => sum + p.price, 0) / total : 0;

    return [
      { label: "Total Products", value: total.toString(), icon: Package },
      { label: "Categories", value: categoriesCount.toString(), icon: Tag },
      { label: "Low Stock", value: lowStock.toString(), icon: AlertTriangle },
      { label: "Avg Price", value: formatCurrency(Math.round(avgPrice)), icon: DollarSign },
    ];
  }, [products]);

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Product Catalog</h1>
          <p className="text-sm text-white/40 mt-0.5">Manage your inventory and product listings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#022349] hover:bg-[#022349]/80 text-xs text-white font-medium transition-all self-start">
          <Plus size={14} />
          Add Product
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
          : stats.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeInUp}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{s.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                    <s.icon size={15} className="text-white/40" />
                  </div>
                </div>
                <p className="text-xl font-bold text-white">{s.value}</p>
              </motion.div>
            ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#022349]/50 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none focus:border-[#022349]/50 appearance-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#121212]">
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-white/[0.06] text-white" : "text-white/30 hover:text-white/60"}`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-white/[0.06] text-white" : "text-white/30 hover:text-white/60"}`}
            >
              <Grid3X3 size={14} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div variants={fadeInUp}>
        {loading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : (
            <LoadingTable rows={6} />
          )
        ) : error ? (
          <EmptyState title="Error loading products" description={error} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description={searchQuery || categoryFilter !== "all" ? "Try adjusting your filters." : "Add your first product to start selling."}
            icon="package"
          />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-mono text-white/30">{product.sku}</span>
                  <StatusPill status={product.status} />
                </div>
                <h3 className="text-sm font-medium text-white mb-1">{product.name}</h3>
                <p className="text-[11px] text-white/30 mb-3">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{formatCurrency(product.price, product.currency)}</span>
                  <span className={`text-[11px] ${product.stockQuantity <= 10 ? "text-red-400" : "text-white/30"}`}>
                    {product.stockQuantity} in stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">SKU</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Stock</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-white">{product.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-white/40">{product.sku}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-white/60">{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-white">{formatCurrency(product.price, product.currency)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${product.stockQuantity <= 10 ? "text-red-400 font-medium" : "text-white/40"}`}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={product.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Product Detail Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name}
        description={`SKU: ${selectedProduct?.sku}`}
        size="md"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Price</p>
                <p className="text-sm text-white mt-0.5">{formatCurrency(selectedProduct.price, selectedProduct.currency)}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Stock</p>
                <p className={`text-sm mt-0.5 ${selectedProduct.stockQuantity <= 10 ? "text-red-400" : "text-white"}`}>
                  {selectedProduct.stockQuantity} units
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Category</p>
                <p className="text-sm text-white mt-0.5">{selectedProduct.category}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Status</p>
                <div className="mt-0.5">
                  <StatusPill status={selectedProduct.status} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
