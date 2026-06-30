"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package, Search, Plus, Tag, DollarSign,
  Grid3X3, List, Eye, Filter, Star, ArrowUpDown,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { StatusPill } from "@/components/dashboards/shared/status-pill";

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
  unitPrice: number;
  currency: string;
  stockQuantity: number;
  status: string;
  featured: boolean;
  supplierName?: string;
}

interface ProductsApiResponse {
  products: Product[];
  pagination: { total: number };
}

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

export default function InvoProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFeatured, setShowFeatured] = useState(false);

  const { data, loading, error } = useApi<ProductsApiResponse>("/api/v1/products?limit=100");

  const products = useMemo(() => data?.products ?? [], [data]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesFeatured = !showFeatured || p.featured;
      return matchesSearch && matchesCategory && matchesFeatured;
    });

    if (sortBy === "price_asc") filtered.sort((a, b) => a.unitPrice - b.unitPrice);
    else if (sortBy === "price_desc") filtered.sort((a, b) => b.unitPrice - a.unitPrice);
    else if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  }, [products, searchQuery, categoryFilter, sortBy, showFeatured]);

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === "ACTIVE").length;
    const featured = products.filter((p) => p.featured).length;
    return { total, active, featured };
  }, [products]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-foreground-tertiary">
        <Package className="w-12 h-12 mb-4 text-foreground-muted" />
        <h3 className="text-lg font-semibold text-foreground-tertiary mb-1">Failed to load products</h3>
        <p className="text-sm text-foreground-muted">{error}</p>
      </div>
    );
  }

  if (loading) return <LoadingTable rows={6} />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Product Listings</h1>
          <p className="text-sm text-foreground-tertiary mt-1">
            {stats.total} products ({stats.active} active, {stats.featured} featured)
          </p>
        </div>
        <Link
          href="/dashboard/supplier/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4A843] text-black text-sm font-medium rounded-xl hover:bg-[#e0b856] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13px] text-foreground placeholder:text-foreground-muted bg-surface-raised border border-subtle outline-none focus:border-[#D4A843]/30 transition-colors"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-[13px] text-foreground-tertiary bg-surface-raised border border-subtle outline-none focus:border-[#D4A843]/30 transition-colors"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-[13px] text-foreground-tertiary bg-surface-raised border border-subtle outline-none focus:border-[#D4A843]/30 transition-colors"
        >
          <option value="newest">Newest</option>
          <option value="name">Name</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <button
          onClick={() => setShowFeatured(!showFeatured)}
          className={`inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
            showFeatured
              ? "bg-[rgba(212,168,67,0.12)] text-[#D4A843] border border-[rgba(212,168,67,0.2)]"
              : "text-foreground-tertiary bg-surface-raised border border-subtle hover:bg-surface-raised"
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          Featured
        </button>

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-surface-raised text-foreground" : "text-foreground-muted hover:text-foreground-muted"}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-surface-raised text-foreground" : "text-foreground-muted hover:text-foreground-muted"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={<Package className="w-12 h-12" />}
          title="No products found"
          description={searchQuery ? "Try a different search term" : "Add your first product to get started"}
          action={!searchQuery ? <a href="/dashboard/supplier/products/new" className="px-4 py-2 rounded-lg bg-accent-base text-foreground text-sm font-medium">Add Product</a> : undefined}
        />
      ) : viewMode === "list" ? (
        <div className="rounded-xl border border-subtle overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-surface-raised border-b border-subtle">
                <th className="text-left py-3 px-4 text-foreground-tertiary font-medium">Product</th>
                <th className="text-left py-3 px-4 text-foreground-tertiary font-medium">SKU</th>
                <th className="text-left py-3 px-4 text-foreground-tertiary font-medium">Category</th>
                <th className="text-right py-3 px-4 text-foreground-tertiary font-medium">Price</th>
                <th className="text-right py-3 px-4 text-foreground-tertiary font-medium">Stock</th>
                <th className="text-center py-3 px-4 text-foreground-tertiary font-medium">Status</th>
                <th className="text-center py-3 px-4 text-foreground-tertiary font-medium">Featured</th>
                <th className="text-right py-3 px-4 text-foreground-tertiary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-subtle hover:bg-surface-raised transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-foreground/80 font-medium">{product.name}</span>
                  </td>
                  <td className="py-3 px-4 text-foreground-tertiary">{product.sku}</td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] text-foreground-tertiary bg-surface-raised px-2 py-1 rounded-md">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-foreground-tertiary">{formatCurrency(product.unitPrice, product.currency)}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`${product.stockQuantity > 0 ? "text-green-400" : "text-red-400"}`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusPill status={product.status} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    {product.featured ? (
                      <Star className="w-4 h-4 text-[#D4A843] inline-block" />
                    ) : (
                      <span className="text-foreground-muted">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/marketplace/${product.id}`}
                      className="inline-flex items-center gap-1.5 text-[12px] text-foreground-tertiary hover:text-[#D4A843] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="rounded-xl p-4 bg-surface-raised border border-subtle hover:bg-surface-raised transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[rgba(212,168,67,0.08)] border border-[rgba(212,168,67,0.12)] flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#D4A843]" />
                </div>
                {product.featured && <Star className="w-4 h-4 text-[#D4A843]" />}
              </div>
              <h3 className="text-[14px] text-foreground font-medium mb-1 truncate">{product.name}</h3>
              <p className="text-[11px] text-foreground-muted mb-3">{product.sku}</p>
              <div className="flex items-center justify-between">
                <span className="text-[15px] text-foreground font-semibold">{formatCurrency(product.unitPrice, product.currency)}</span>
                <StatusPill status={product.status} />
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-foreground-muted">
                <span>{product.category}</span>
                <span>Stock: {product.stockQuantity}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
