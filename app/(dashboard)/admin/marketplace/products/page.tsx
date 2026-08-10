"use client";

import { Package, Search, Tag, Store, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "@/lib/hooks/use-api";
import { useState } from "react";
import { getProductImage } from "@/lib/marketplace/product-images";

interface ProductRecord {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stockQuantity: number;
  unitOfMeasure: string;
  supplierName: string;
  status: string;
  createdAt: string;
}

interface ProductsData {
  products: ProductRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

function ProductThumb({ name, category }: { name: string; category: string }) {
  const resolved = getProductImage({ name, category });
  if (resolved.type === "url") {
    return <img src={resolved.src} alt={name} className="w-full h-full object-cover" loading="lazy" />;
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${resolved.colors[0]} 0%, ${resolved.colors[1]} 50%, ${resolved.colors[2]} 100%)` }}
    >
      <span className="text-[10px] font-bold text-foreground-muted">{resolved.initials}</span>
    </div>
  );
}

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useApi<ProductsData>(`/api/v1/products?page=${page}&limit=20`);
  const products = data?.products || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border-subtle">
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-base/15 flex items-center justify-center">
              <Package className="w-4 h-4 text-accent-base" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold tracking-tight text-white">Product Catalog</h1>
              <p className="text-[13px] text-foreground-muted">Manage SKUs, categories, and supplier inventory</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-5">
        {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">{error}</div>}

        <div className="rounded-xl bg-surface-1 border border-border-subtle overflow-hidden">
          <div className="overflow-x-auto table-scroll-wrapper">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="px-5 py-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Product</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">SKU</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Supplier</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading && <tr><td colSpan={6} className="px-5 py-12 text-center text-foreground-muted">Loading products...</td></tr>}
                {!loading && products.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-foreground-muted">No products found</td></tr>}
                {products.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-surface-1 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-border-subtle">
                          <ProductThumb name={p.name} category={p.category} />
                        </div>
                        <p className="text-[13px] font-medium text-white">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-foreground-muted font-mono">{p.sku || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-2 text-[10px] text-foreground-tertiary">
                        <Tag className="w-3 h-3" /> {p.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-foreground-secondary flex items-center gap-1">
                      <Store className="w-3 h-3" /> {p.supplierName || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-white">EGP {p.price?.toFixed(2) || "0.00"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[12px] font-medium ${p.stockQuantity > 10 ? "text-emerald-400" : p.stockQuantity > 0 ? "text-amber-400" : "text-red-400"}`}>
                        {p.stockQuantity} {p.unitOfMeasure}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between">
              <span className="text-[11px] text-foreground-muted">Page {page} of {pagination.totalPages}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-foreground-muted hover:text-white disabled:opacity-30" aria-label="Previous page"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages} className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-foreground-muted hover:text-white disabled:opacity-30" aria-label="Next page"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
