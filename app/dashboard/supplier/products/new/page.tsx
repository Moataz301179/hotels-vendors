"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  X,
  Upload,
} from "lucide-react";
import { HOTEL_CATEGORIES } from "@/lib/marketplace/categories";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/v1/products/images", { method: "POST", body: fd });
        const json = await res.json();
        if (json.success) newUrls.push(json.data.url);
      }
      setImages((prev) => [...prev, ...newUrls]);
    } catch {
      // silently skip failed uploads
    } finally {
      setUploading(false);
    }
  }, []);

  const removeImage = useCallback((idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    category: "fb",
    subcategory: "",
    unitPrice: "",
    currency: "EGP",
    stockQuantity: "0",
    minOrderQty: "1",
    unitOfMeasure: "piece",
    leadTimeDays: "1",
    shelfLifeDays: "",
    temperatureReq: "",
    // supplierId is derived from auth session server-side
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          unitPrice: parseFloat(form.unitPrice),
          stockQuantity: parseInt(form.stockQuantity, 10),
          minOrderQty: parseInt(form.minOrderQty, 10),
          leadTimeDays: parseInt(form.leadTimeDays, 10),
          shelfLifeDays: form.shelfLifeDays ? parseInt(form.shelfLifeDays, 10) : undefined,
          images: images.length > 0 ? images : undefined,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Failed to create product");
      }

      setSuccess(true);
      setTimeout(() => router.push("/supplier/products"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </motion.div>
        <h2 className="text-xl font-bold text-foreground">Product Created!</h2>
        <p className="text-sm text-foreground-tertiary">Redirecting to your product catalog...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-6"
      initial="hidden"
      animate="animate"
      variants={{ hidden: {}, animate: { transition: { staggerChildren: 0.08 } } }}
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center gap-4">
        <Link
          href="/supplier/products"
          className="p-2 rounded-lg border border-subtle text-foreground-tertiary hover:text-foreground/70 hover:border-subtle12 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Add New Product</h1>
          <p className="text-xs text-foreground-tertiary">List a new product on the marketplace</p>
        </div>
      </motion.div>

      {error && (
        <motion.div variants={fadeInUp} className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center gap-2 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="rounded-2xl border border-subtle bg-surface-raised p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
            <Package className="w-4 h-4 text-foreground-muted" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-foreground-tertiary uppercase tracking-wider mb-1.5 block">SKU *</label>
              <input
                required
                value={form.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
                placeholder="e.g., POUL-001"
                className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-subtle20"
              />
            </div>
            <div>
              <label className="text-[11px] text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Product Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Whole Chicken (Halal, 1.2kg)"
                className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-subtle20"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your product..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-subtle20 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground focus:outline-none focus:border-subtle20 appearance-none"
              >
                {HOTEL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#121212]">
                    {cat.label} ({cat.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Subcategory</label>
              <input
                value={form.subcategory}
                onChange={(e) => handleChange("subcategory", e.target.value)}
                placeholder="e.g., poultry"
                className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-subtle20"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="rounded-2xl border border-subtle bg-surface-raised p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
            <Plus className="w-4 h-4 text-foreground-muted" />
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Unit Price (EGP) *</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.unitPrice}
                onChange={(e) => handleChange("unitPrice", e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-subtle20"
              />
            </div>
            <div>
              <label className="text-[11px] text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Stock Quantity *</label>
              <input
                required
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={(e) => handleChange("stockQuantity", e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-subtle20"
              />
            </div>
            <div>
              <label className="text-[11px] text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Min Order Qty *</label>
              <input
                required
                type="number"
                min="1"
                value={form.minOrderQty}
                onChange={(e) => handleChange("minOrderQty", e.target.value)}
                placeholder="1"
                className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-subtle20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Unit of Measure *</label>
              <select
                required
                value={form.unitOfMeasure}
                onChange={(e) => handleChange("unitOfMeasure", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground focus:outline-none focus:border-subtle20 appearance-none"
              >
                <option value="piece" className="bg-[#121212]">Piece</option>
                <option value="kg" className="bg-[#121212]">Kilogram (kg)</option>
                <option value="liter" className="bg-[#121212]">Liter</option>
                <option value="set" className="bg-[#121212]">Set</option>
                <option value="box" className="bg-[#121212]">Box</option>
                <option value="carton" className="bg-[#121212]">Carton</option>
                <option value="pack" className="bg-[#121212]">Pack</option>
                <option value="roll" className="bg-[#121212]">Roll</option>
                <option value="meter" className="bg-[#121212]">Meter</option>
                <option value="dozen" className="bg-[#121212]">Dozen</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Lead Time (days) *</label>
              <input
                required
                type="number"
                min="1"
                value={form.leadTimeDays}
                onChange={(e) => handleChange("leadTimeDays", e.target.value)}
                placeholder="1"
                className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-subtle20"
              />
            </div>
            <div>
              <label className="text-[11px] text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Shelf Life (days)</label>
              <input
                type="number"
                min="1"
                value={form.shelfLifeDays}
                onChange={(e) => handleChange("shelfLifeDays", e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground/15 focus:outline-none focus:border-subtle20"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Temperature Requirement</label>
            <select
              value={form.temperatureReq}
              onChange={(e) => handleChange("temperatureReq", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground focus:outline-none focus:border-subtle20 appearance-none"
            >
              <option value="" className="bg-[#121212]">Ambient (no special storage)</option>
              <option value="Chilled 2-5°C" className="bg-[#121212]">Chilled 2-5°C</option>
              <option value="Frozen -18°C" className="bg-[#121212]">Frozen -18°C</option>
              <option value="Frozen -25°C" className="bg-[#121212]">Frozen -25°C</option>
              <option value="Dry Storage" className="bg-[#121212]">Dry Storage</option>
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-subtle bg-surface-raised p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-foreground-muted" />
            Product Images
          </h2>

          <div
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-subtle hover:border-subtle20 rounded-xl p-6 text-center cursor-pointer transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 text-foreground-muted animate-spin mx-auto" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-foreground-muted mx-auto mb-2" />
                <p className="text-xs text-foreground-tertiary">
                  Drag & drop images here, or <span className="text-accent-base">browse</span>
                </p>
                <p className="text-[10px] text-foreground-muted mt-1">JPEG, PNG, WebP — up to 5 MB each</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-subtle group">
                  <img src={url} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-foreground-tertiary hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/supplier/products"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-foreground-muted hover:text-foreground border border-subtle hover:border-subtle[0.12] transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-base hover:bg-[#6B0000] disabled:opacity-50 text-sm font-medium text-foreground transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
