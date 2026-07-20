"use client";

import { useState, useRef } from "react";
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
  Upload,
  X,
  ImageIcon,
  FileDown,
  BarChart3,
} from "lucide-react";
import { HOTEL_CATEGORIES } from "@/lib/marketplace/categories";
import OlivReferralCTA from "@/components/auth/OlivReferralCTA";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface CSVRow {
  sku: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  unitPrice: number;
  currency?: string;
  stockQuantity: number;
  minOrderQty?: number;
  unitOfMeasure?: string;
  leadTimeDays?: number;
  shelfLifeDays?: number;
  temperatureReq?: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [csvLoading, setCsvLoading] = useState(false);
  const [barcodeLoading, setBarcodeLoading] = useState(false);

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
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError(null);

    try {
      const formData = new FormData();
      for (let i = 0; i < Math.min(files.length, 5); i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Failed to upload images");
      }

      const newUrls = json.data.urls as string[];
      setImageUrls((prev) => [...prev, ...newUrls]);

      // Create previews
      for (const file of Array.from(files).slice(0, 5)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const parseCSV = (content: string): CSVRow[] => {
    const lines = content.trim().split("\n");
    if (lines.length < 2) throw new Error("CSV must have headers and at least one row");

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows: CSVRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: Record<string, string> = {};

      headers.forEach((header, idx) => {
        row[header] = values[idx] || "";
      });

      // Validate required fields
      if (!row.sku || !row.name || !row.category) {
        console.warn(`Skipping row ${i + 1}: missing required fields`);
        continue;
      }

      rows.push({
        sku: row.sku,
        name: row.name,
        description: row.description || undefined,
        category: row.category,
        subcategory: row.subcategory || undefined,
        unitPrice: parseFloat(row.unitprice || "0"),
        currency: row.currency || "EGP",
        stockQuantity: parseInt(row.stockquantity || "0", 10),
        minOrderQty: row.minorderqty ? parseInt(row.minorderqty, 10) : 1,
        unitOfMeasure: row.unitofmeasure || "piece",
        leadTimeDays: row.leaddatedays ? parseInt(row.leaddatedays, 10) : 1,
        shelfLifeDays: row.shelflifedays ? parseInt(row.shelflifedays, 10) : undefined,
        temperatureReq: row.temperaturerequest || undefined,
      });
    }

    return rows;
  };

  const handleCSVUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setCsvLoading(true);
    setError(null);

    try {
      const file = files[0];
      const content = await file.text();

      const products = parseCSV(content);

      if (products.length === 0) {
        throw new Error("No valid products found in CSV file");
      }

      // Upload each product
      let successCount = 0;
      let errorCount = 0;

      for (const product of products) {
        try {
          const res = await fetch("/api/v1/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...product,
              images: imageUrls.length > 0 ? imageUrls : undefined,
            }),
          });

          const json = await res.json();
          if (json.success) {
            successCount++;
          } else {
            console.error(`Failed to create product: ${json.error}`);
            errorCount++;
          }
        } catch (err) {
          console.error(`Error uploading product ${product.sku}:`, err);
          errorCount++;
        }
      }

      if (successCount > 0) {
        setSuccess(true);
        setTimeout(() => router.push("/supplier/products"), 1500);
      } else {
        throw new Error("All products failed to upload");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process CSV file");
    } finally {
      setCsvLoading(false);
    }
  };

  const handleBarcodeScan = async () => {
    setBarcodeLoading(true);
    setError(null);

    try {
      // Check if barcode scanner API is available
      if (!("BarcodeScanner" in window)) {
        throw new Error("Barcode scanning is not supported on this device/browser");
      }

      const scanner = new (window as any).BarcodeScanner();
      await scanner.open();
      const result = await scanner.scan();

      if (result) {
        // Auto-fill form with scanned data
        setForm((prev) => ({
          ...prev,
          sku: result.format || "BARCODE-" + Date.now(),
          name: result.rawValue || "Scanned Product",
        }));
      }

      await scanner.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Barcode scan failed");
    } finally {
      setBarcodeLoading(false);
    }
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
          images: imageUrls.length > 0 ? imageUrls : undefined,
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

  // Generate CSV template for download
  const downloadCSVTemplate = () => {
    const headers = "sku,name,description,category,subcategory,unitPrice,currency,stockQuantity,minOrderQty,unitOfMeasure,leadTimeDays,shelfLifeDays,temperatureReq";
    const example = "PROD-001,Product Name,Description,fb,subcategory,100,EGP,100,1,EGP,piece,1,30,Ambient";
    const csvContent = `data:text/csv;charset=utf-8,${headers}%0A${example}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "product-import-template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </motion.div>
        <h2 className="text-xl font-bold text-white">Product Created!</h2>
        <p className="text-sm text-white/40">Redirecting to your product catalog...</p>
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
          className="p-2 rounded-lg border border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/12 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Add New Product</h1>
          <p className="text-xs text-white/40">List a new product on the marketplace</p>
        </div>
      </motion.div>

      {error && (
        <motion.div variants={fadeInUp} className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center gap-2 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Bulk Import Section */}
      <motion.div variants={fadeInUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white/70 flex items-center gap-2">
          <FileDown className="w-4 h-4 text-white/30" />
          Bulk Import Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">CSV Template</label>
            <button
              type="button"
              onClick={downloadCSVTemplate}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/[0.12] bg-white/[0.02] text-white/50 hover:text-white/70 hover:border-white/20 transition-all"
            >
              <FileDown className="w-4 h-4" />
              Download CSV Template
            </button>
            <p className="mt-1 text-[11px] text-white/30">
              Download template with required columns
            </p>
          </div>

          <div>
            <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Upload CSV</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => handleCSVUpload(e.target.files)}
              disabled={csvLoading}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={csvLoading}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/[0.12] bg-white/[0.02] text-white/50 hover:text-white/70 hover:border-white/20 transition-all disabled:opacity-50"
            >
              {csvLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {csvLoading ? "Processing..." : "Upload CSV File"}
            </button>
            <p className="mt-1 text-[11px] text-white/30">
              Upload multiple products at once
            </p>
          </div>

          <div>
            <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Barcode Scanner</label>
            <button
              type="button"
              onClick={handleBarcodeScan}
              disabled={barcodeLoading}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/[0.12] bg-white/[0.02] text-white/50 hover:text-white/70 hover:border-white/20 transition-all disabled:opacity-50"
            >
              {barcodeLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <BarChart3 className="w-4 h-4" />
              )}
              {barcodeLoading ? "Scanning..." : "Scan Product Barcode"}
            </button>
            <p className="mt-1 text-[11px] text-white/30">
              Auto-fill product details from barcode
            </p>
          </div>
        </div>
      </motion.div>

      <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white/70 flex items-center gap-2">
            <Package className="w-4 h-4 text-white/30" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">SKU *</label>
              <input
                required
                value={form.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
                placeholder="e.g., POUL-001"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Product Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Whole Chicken (Halal, 1.2kg)"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your product..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-white/20 appearance-none"
              >
                {HOTEL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#121212]">
                    {cat.label} ({cat.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Subcategory</label>
              <input
                value={form.subcategory}
                onChange={(e) => handleChange("subcategory", e.target.value)}
                placeholder="e.g., poultry"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white/70 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-white/30" />
            Product Images
          </h2>

          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImages || imageUrls.length >= 5}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/[0.12] bg-white/[0.02] text-white/50 hover:text-white/70 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImages ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploadingImages ? "Uploading..." : "Upload Images"}
            </button>
            <span className="text-[11px] text-white/30">
              {imageUrls.length}/5 images • JPEG, PNG, WebP • Max 5MB each
            </span>
          </div>

          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/[0.08]">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Inventory */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white/70 flex items-center gap-2">
            <Plus className="w-4 h-4 text-white/30" />
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Unit Price (EGP) *</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.unitPrice}
                onChange={(e) => handleChange("unitPrice", e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Stock Quantity *</label>
              <input
                required
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={(e) => handleChange("stockQuantity", e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Min Order Qty *</label>
              <input
                required
                type="number"
                min="1"
                value={form.minOrderQty}
                onChange={(e) => handleChange("minOrderQty", e.target.value)}
                placeholder="1"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Unit of Measure *</label>
              <select
                required
                value={form.unitOfMeasure}
                onChange={(e) => handleChange("unitOfMeasure", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-white/20 appearance-none"
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
              <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Lead Time (days) *</label>
              <input
                required
                type="number"
                min="1"
                value={form.leadTimeDays}
                onChange={(e) => handleChange("leadTimeDays", e.target.value)}
                placeholder="1"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Shelf Life (days)</label>
              <input
                type="number"
                min="1"
                value={form.shelfLifeDays}
                onChange={(e) => handleChange("shelfLifeDays", e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Temperature Requirement</label>
            <select
              value={form.temperatureReq}
              onChange={(e) => handleChange("temperatureReq", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-white/20 appearance-none"
            >
              <option value="" className="bg-[#121212]">Ambient (no special storage)</option>
              <option value="Chilled 2-5°C" className="bg-[#121212]">Chilled 2-5°C</option>
              <option value="Frozen -18°C" className="bg-[#121212]">Frozen -18°C</option>
              <option value="Frozen -25°C" className="bg-[#121212]">Frozen -25°C</option>
              <option value="Dry Storage" className="bg-[#121212]">Dry Storage</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/supplier/products"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white border border-white/[0.06] hover:border-white/[0.12] transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-base hover:bg-[#6B0000] disabled:opacity-50 text-sm font-medium text-white transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </motion.form>

      {/* Oliv Referral CTA */}
      <OlivReferralCTA
        userId="supplier_product_creator"
        userType="SUPPLIER"
        onOlivComplete={() => console.log("Oliv financing applied")}
      />
    </motion.div>
  );
}