"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Package,
  Loader2,
  Shield,
  Banknote,
  Truck,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { SearchBar, type SearchFilters } from "@/components/marketplace/search-bar";
import { CategoryNav } from "@/components/marketplace/category-nav";
import { ProductCard } from "@/components/marketplace/product-card";
import { CompareDrawer } from "@/components/marketplace/compare-drawer";
import { useCompare, CompareProvider } from "@/components/marketplace/compare-context";
import { CartProvider } from "@/components/cart/cart-context";
import { MarketTicker } from "@/components/marketing/market-ticker";
import { HOTEL_CATEGORIES } from "@/lib/marketplace/categories";
import type { MarketplaceProduct } from "@/lib/marketplace/category-mapper";

// ── Mock data for marketplace display ──────────────────────────
const MOCK_PRODUCTS: MarketplaceProduct[] = [
  { id: "p-001", sku: "BEEF-001", name: "Egyptian Grass-Fed Beef Cuts — Ribeye", description: "Prime ribeye steaks, vacuum-sealed, 200g portions", category: "fb", prismaCategory: "F_AND_B", subcategory: "Meat", unitPrice: 285, currency: "EGP", stockQuantity: 1200, minOrderQty: 50, unitOfMeasure: "kg", leadTimeDays: 2, shelfLifeDays: 180, temperatureReq: "Frozen", images: null, status: "ACTIVE", supplierId: "s04", supplierName: "Cairo Poultry & Meat Processing", supplierTier: "PREMIER", supplierRating: 4.8, supplierReviewCount: 124, supplierCity: "Cairo" },
  { id: "p-002", sku: "CHKN-002", name: "Boneless Chicken Breast — Halal Certified", description: "Fresh halal chicken breast, skinless, individually quick-frozen", category: "fb", prismaCategory: "F_AND_B", subcategory: "Poultry", unitPrice: 145, currency: "EGP", stockQuantity: 3000, minOrderQty: 100, unitOfMeasure: "kg", leadTimeDays: 1, shelfLifeDays: 365, temperatureReq: "Frozen", images: null, status: "ACTIVE", supplierId: "s04", supplierName: "Cairo Poultry & Meat Processing", supplierTier: "PREMIER", supplierRating: 4.7, supplierReviewCount: 98, supplierCity: "Cairo" },
  { id: "p-003", sku: "MILK-001", name: "UHT Long-Life Milk — 1L Tetra Pak", description: "Full cream UHT milk, 3.5% fat, shelf-stable 6 months", category: "fb", prismaCategory: "F_AND_B", subcategory: "Dairy", unitPrice: 32, currency: "EGP", stockQuantity: 15000, minOrderQty: 240, unitOfMeasure: "unit", leadTimeDays: 3, shelfLifeDays: 180, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s18", supplierName: "Beyti Dairy & Beverages", supplierTier: "PREMIER", supplierRating: 4.9, supplierReviewCount: 256, supplierCity: "6th of October City" },
  { id: "p-004", sku: "YOGT-002", name: "Greek Yogurt — 2kg Bulk Tub", description: "Strained Greek yogurt, 10% fat, ideal for buffet and kitchen prep", category: "fb", prismaCategory: "F_AND_B", subcategory: "Dairy", unitPrice: 95, currency: "EGP", stockQuantity: 6000, minOrderQty: 48, unitOfMeasure: "kg", leadTimeDays: 2, shelfLifeDays: 21, temperatureReq: "Cold", images: null, status: "ACTIVE", supplierId: "s18", supplierName: "Beyti Dairy & Beverages", supplierTier: "PREMIER", supplierRating: 4.8, supplierReviewCount: 189, supplierCity: "6th of October City" },
  { id: "p-005", sku: "JUIC-001", name: "Mango Juice Concentrate — 5L Bag-in-Box", description: "Premium mango juice concentrate, 65° Brix, made from Egyptian mangoes", category: "fb", prismaCategory: "F_AND_B", subcategory: "Beverages", unitPrice: 210, currency: "EGP", stockQuantity: 800, minOrderQty: 20, unitOfMeasure: "box", leadTimeDays: 3, shelfLifeDays: 365, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s17", supplierName: "Juhayna Food Industries", supplierTier: "PREMIER", supplierRating: 4.6, supplierReviewCount: 312, supplierCity: "Giza" },
  { id: "p-006", sku: "OIL-001", name: "Blended Vegetable Cooking Oil — 20L Tin", description: "Refined blended vegetable oil, suitable for deep frying and cooking", category: "fb", prismaCategory: "F_AND_B", subcategory: "Oils", unitPrice: 680, currency: "EGP", stockQuantity: 5000, minOrderQty: 40, unitOfMeasure: "tin", leadTimeDays: 2, shelfLifeDays: 365, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s23", supplierName: "Alexandria Vegetable Oil Company", supplierTier: "PREMIER", supplierRating: 4.5, supplierReviewCount: 87, supplierCity: "Alexandria" },
  { id: "p-007", sku: "RICE-001", name: "Egyptian Short-Grain Rice — 25kg Bag", description: "Premium Egyptian short-grain rice, high-quality, polished", category: "fb", prismaCategory: "F_AND_B", subcategory: "Dry Goods", unitPrice: 520, currency: "EGP", stockQuantity: 10000, minOrderQty: 100, unitOfMeasure: "bag", leadTimeDays: 1, shelfLifeDays: 365, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s06", supplierName: "Egyptian Rice & Grains Co.", supplierTier: "VERIFIED", supplierRating: 4.3, supplierReviewCount: 65, supplierCity: "Kafr El Sheikh" },
  { id: "p-008", sku: "SHEET-001", name: "Premium Cotton Bed Sheet — 300TC King", description: "Egyptian cotton bed sheet set, 300 thread count, king size", category: "lin", prismaCategory: "GUEST_SUPPLIES", subcategory: "Linens", unitPrice: 450, currency: "EGP", stockQuantity: 2000, minOrderQty: 50, unitOfMeasure: "set", leadTimeDays: 5, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s08", supplierName: "Egyptian Linen & Textile Mills", supplierTier: "PREMIER", supplierRating: 4.7, supplierReviewCount: 142, supplierCity: "El Mahalla El Kubra" },
  { id: "p-009", sku: "TOWL-002", name: "Hotel Bath Towel — 600gsm White", description: "Premium ring-spun cotton bath towel, 600gsm, hotel weight", category: "lin", prismaCategory: "GUEST_SUPPLIES", subcategory: "Linens", unitPrice: 185, currency: "EGP", stockQuantity: 5000, minOrderQty: 100, unitOfMeasure: "piece", leadTimeDays: 5, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s08", supplierName: "Egyptian Linen & Textile Mills", supplierTier: "PREMIER", supplierRating: 4.6, supplierReviewCount: 118, supplierCity: "El Mahalla El Kubra" },
  { id: "p-010", sku: "CHLOR-001", name: "Pool Chlorine Tablets — 20kg Bucket", description: "Trichloroisocyanuric acid tablets, 90% available chlorine, slow-dissolving", category: "spa", prismaCategory: "CONSUMABLES", subcategory: "Pool Chemicals", unitPrice: 890, currency: "EGP", stockQuantity: 400, minOrderQty: 10, unitOfMeasure: "bucket", leadTimeDays: 3, shelfLifeDays: 730, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s42", supplierName: "Egyptian Chemical Industries", supplierTier: "VERIFIED", supplierRating: 4.2, supplierReviewCount: 34, supplierCity: "Alexandria" },
  { id: "p-011", sku: "DETERG-001", name: "Industrial Laundry Detergent — 25kg Bag", description: "Concentrated laundry detergent powder for commercial washing machines", category: "hk", prismaCategory: "CONSUMABLES", subcategory: "Cleaning", unitPrice: 340, currency: "EGP", stockQuantity: 3000, minOrderQty: 40, unitOfMeasure: "bag", leadTimeDays: 2, shelfLifeDays: 540, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s45", supplierName: "Cleopatra Cleaning Solutions", supplierTier: "CORE", supplierRating: 4.1, supplierReviewCount: 52, supplierCity: "Cairo" },
  { id: "p-012", sku: "SHAMP-001", name: "Hotel Shampoo — 400ml Dispenser", description: "pH-balanced shampoo for hotel guest room dispensers, mild formula", category: "gra", prismaCategory: "GUEST_SUPPLIES", subcategory: "Amenities", unitPrice: 28, currency: "EGP", stockQuantity: 10000, minOrderQty: 200, unitOfMeasure: "bottle", leadTimeDays: 4, shelfLifeDays: 365, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s50", supplierName: "Arabian Cosmetics & Amenities", supplierTier: "VERIFIED", supplierRating: 4.4, supplierReviewCount: 76, supplierCity: "Cairo" },
  { id: "p-013", sku: "HVAC-001", name: "HVAC Air Filter — 24x24x4 MERV-13", description: "Pleated HVAC air filter, MERV-13 rating, for commercial AHU systems", category: "eng", prismaCategory: "SERVICES", subcategory: "HVAC", unitPrice: 195, currency: "EGP", stockQuantity: 1000, minOrderQty: 30, unitOfMeasure: "piece", leadTimeDays: 5, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s57", supplierName: "Cairo Hospitality Equipment", supplierTier: "PREMIER", supplierRating: 4.5, supplierReviewCount: 63, supplierCity: "Cairo" },
  { id: "p-014", sku: "FURN-001", name: "Lobby Reception Desk — Modular Design", description: "Modern modular reception desk with marble-effect laminate, 3m width", category: "ffe", prismaCategory: "FFE", subcategory: "Furniture", unitPrice: 12500, currency: "EGP", stockQuantity: 25, minOrderQty: 1, unitOfMeasure: "unit", leadTimeDays: 21, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s57", supplierName: "Cairo Hospitality Equipment", supplierTier: "PREMIER", supplierRating: 4.6, supplierReviewCount: 41, supplierCity: "Cairo" },
  { id: "p-015", sku: "GLASS-001", name: "Wine Goblet — 350ml Crystal Glass", description: "Lead-free crystal wine glass, 350ml capacity, dishwasher safe", category: "fb", prismaCategory: "F_AND_B", subcategory: "Glassware", unitPrice: 65, currency: "EGP", stockQuantity: 5000, minOrderQty: 100, unitOfMeasure: "piece", leadTimeDays: 7, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s13", supplierName: "Cleopatra Ceramics & Glassware", supplierTier: "PREMIER", supplierRating: 4.7, supplierReviewCount: 95, supplierCity: "Cairo" },
  { id: "p-016", sku: "PLATE-001", name: "Hotel Dinner Plate — 27cm Porcelain", description: "Fine porcelain dinner plate, white, 27cm diameter, hotel grade", category: "fb", prismaCategory: "F_AND_B", subcategory: "Chinaware", unitPrice: 48, currency: "EGP", stockQuantity: 8000, minOrderQty: 200, unitOfMeasure: "piece", leadTimeDays: 7, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s13", supplierName: "Cleopatra Ceramics & Glassware", supplierTier: "PREMIER", supplierRating: 4.5, supplierReviewCount: 88, supplierCity: "Cairo" },
  { id: "p-017", sku: "UNIF-001", name: "Staff Uniform — Chef Coat Set", description: "Professional chef coat, pants, and apron set, 65/35 poly-cotton", category: "ose", prismaCategory: "CONSUMABLES", subcategory: "Uniforms", unitPrice: 380, currency: "EGP", stockQuantity: 1500, minOrderQty: 30, unitOfMeasure: "set", leadTimeDays: 10, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s65", supplierName: "United Uniform Manufacturing", supplierTier: "VERIFIED", supplierRating: 4.3, supplierReviewCount: 47, supplierCity: "Cairo" },
  { id: "p-018", sku: "BED-001", name: "Hotel Mattress — Queen Size Premium", description: "Pocket spring mattress, queen size, medium firm, hotel certification", category: "ffe", prismaCategory: "FFE", subcategory: "Furniture", unitPrice: 5800, currency: "EGP", stockQuantity: 200, minOrderQty: 10, unitOfMeasure: "unit", leadTimeDays: 14, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s57", supplierName: "Cairo Hospitality Equipment", supplierTier: "PREMIER", supplierRating: 4.4, supplierReviewCount: 56, supplierCity: "Cairo" },
  { id: "p-019", sku: "LANDR-001", name: "Commercial Washing Machine — 50kg Capacity", description: "Industrial washing machine, 50kg load, stainless steel drum, energy efficient", category: "eng", prismaCategory: "SERVICES", subcategory: "Equipment", unitPrice: 185000, currency: "EGP", stockQuantity: 5, minOrderQty: 1, unitOfMeasure: "unit", leadTimeDays: 45, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s57", supplierName: "Cairo Hospitality Equipment", supplierTier: "PREMIER", supplierRating: 4.8, supplierReviewCount: 22, supplierCity: "Cairo" },
  { id: "p-020", sku: "COFF-001", name: "Specialty Coffee Beans — Arabica 1kg", description: "Single-origin Ethiopian Yirgacheffe Arabica, medium roast, whole bean", category: "fb", prismaCategory: "F_AND_B", subcategory: "Beverages", unitPrice: 420, currency: "EGP", stockQuantity: 600, minOrderQty: 12, unitOfMeasure: "kg", leadTimeDays: 3, shelfLifeDays: 180, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s72", supplierName: "Nile Premium Coffee Roasters", supplierTier: "CORE", supplierRating: 4.9, supplierReviewCount: 134, supplierCity: "Cairo" },
  { id: "p-021", sku: "CLEAN-002", name: "Multi-Surface Disinfectant — 5L Gallon", description: "Hospital-grade disinfectant, effective against viruses and bacteria", category: "hk", prismaCategory: "CONSUMABLES", subcategory: "Cleaning", unitPrice: 165, currency: "EGP", stockQuantity: 4000, minOrderQty: 24, unitOfMeasure: "gallon", leadTimeDays: 2, shelfLifeDays: 365, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s45", supplierName: "Cleopatra Cleaning Solutions", supplierTier: "CORE", supplierRating: 4.0, supplierReviewCount: 39, supplierCity: "Cairo" },
  { id: "p-022", sku: "SOP-001", name: "Luxury Bath Soap — 50g Hotel Size", description: "Individually wrapped French-milled soap, hotel logo embossing available", category: "gra", prismaCategory: "GUEST_SUPPLIES", subcategory: "Amenities", unitPrice: 6.50, currency: "EGP", stockQuantity: 50000, minOrderQty: 500, unitOfMeasure: "piece", leadTimeDays: 7, shelfLifeDays: 365, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s50", supplierName: "Arabian Cosmetics & Amenities", supplierTier: "VERIFIED", supplierRating: 4.2, supplierReviewCount: 71, supplierCity: "Cairo" },
  { id: "p-023", sku: "WIFI-001", name: "Enterprise WiFi Access Point — Wi-Fi 6", description: "Dual-band WiFi 6 access point, 4x4 MU-MIMO, Omada compatible", category: "it", prismaCategory: "SERVICES", subcategory: "Networking", unitPrice: 2850, currency: "EGP", stockQuantity: 150, minOrderQty: 5, unitOfMeasure: "unit", leadTimeDays: 7, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s80", supplierName: "Egyptian Technology Solutions", supplierTier: "VERIFIED", supplierRating: 4.5, supplierReviewCount: 48, supplierCity: "Cairo" },
  { id: "p-024", sku: "SAFE-001", name: "Electronic Room Safe — Digital Lock", description: "In-room digital safe, fits 15.6\" laptop, tamper alarm, hotel management system compatible", category: "sec", prismaCategory: "SERVICES", subcategory: "Security", unitPrice: 3200, currency: "EGP", stockQuantity: 300, minOrderQty: 20, unitOfMeasure: "unit", leadTimeDays: 14, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s85", supplierName: "Secure Hotels Technology", supplierTier: "CORE", supplierRating: 4.1, supplierReviewCount: 29, supplierCity: "Cairo" },
  { id: "p-025", sku: "CCTV-001", name: "4MP IP Security Camera — Outdoor", description: "4MP outdoor IP camera with night vision, PoE, ONVIF compatible", category: "sec", prismaCategory: "SERVICES", subcategory: "Security", unitPrice: 1850, currency: "EGP", stockQuantity: 500, minOrderQty: 10, unitOfMeasure: "unit", leadTimeDays: 5, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s85", supplierName: "Secure Hotels Technology", supplierTier: "CORE", supplierRating: 4.3, supplierReviewCount: 37, supplierCity: "Cairo" },
  { id: "p-026", sku: "FISH-001", name: "Fresh Nile Tilapia — Whole Gutted", description: "Farm-raised Nile tilapia, fresh, gutted and scaled, 500-800g each", category: "fb", prismaCategory: "F_AND_B", subcategory: "Seafood", unitPrice: 85, currency: "EGP", stockQuantity: 2000, minOrderQty: 50, unitOfMeasure: "kg", leadTimeDays: 1, shelfLifeDays: 3, temperatureReq: "Cold", images: null, status: "ACTIVE", supplierId: "s07", supplierName: "National Fisheries Company", supplierTier: "VERIFIED", supplierRating: 4.4, supplierReviewCount: 62, supplierCity: "Alexandria" },
  { id: "p-027", sku: "SHRIMP-001", name: "Gulf Shrimp — Peeled Deveined 1kg", description: "Wild-caught Gulf shrimp, peeled and deveined, 31-40 count per kg", category: "fb", prismaCategory: "F_AND_B", subcategory: "Seafood", unitPrice: 320, currency: "EGP", stockQuantity: 800, minOrderQty: 20, unitOfMeasure: "kg", leadTimeDays: 2, shelfLifeDays: 365, temperatureReq: "Frozen", images: null, status: "ACTIVE", supplierId: "s07", supplierName: "National Fisheries Company", supplierTier: "VERIFIED", supplierRating: 4.6, supplierReviewCount: 55, supplierCity: "Alexandria" },
  { id: "p-028", sku: "BISC-001", name: "Petit Beurre Biscuits — 1kg Bulk Pack", description: "Classic petit beurre biscuits, bulk pack for hotel breakfast buffets", category: "fb", prismaCategory: "F_AND_B", subcategory: "Bakery", unitPrice: 95, currency: "EGP", stockQuantity: 3500, minOrderQty: 48, unitOfMeasure: "kg", leadTimeDays: 2, shelfLifeDays: 180, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s19", supplierName: "Edita Food Industries", supplierTier: "PREMIER", supplierRating: 4.7, supplierReviewCount: 203, supplierCity: "6th of October City" },
  { id: "p-029", sku: "CARPET-001", name: "Hotel Corridor Carpet — 4m Width", description: "Heavy-duty nylon carpet with moisture barrier, 4m wide, various patterns", category: "ffe", prismaCategory: "FFE", subcategory: "Flooring", unitPrice: 420, currency: "EGP", stockQuantity: 2000, minOrderQty: 50, unitOfMeasure: "m²", leadTimeDays: 10, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s14", supplierName: "Oriental Weavers Group", supplierTier: "PREMIER", supplierRating: 4.8, supplierReviewCount: 167, supplierCity: "Cairo" },
  { id: "p-030", sku: "MOP-001", name: "Professional Microfiber Mop — 40cm", description: "Reusable microfiber flat mop head, 40cm width, compatible with most handles", category: "hk", prismaCategory: "CONSUMABLES", subcategory: "Cleaning", unitPrice: 38, currency: "EGP", stockQuantity: 8000, minOrderQty: 100, unitOfMeasure: "piece", leadTimeDays: 2, shelfLifeDays: null, temperatureReq: null, images: null, status: "ACTIVE", supplierId: "s45", supplierName: "Cleopatra Cleaning Solutions", supplierTier: "CORE", supplierRating: 4.0, supplierReviewCount: 44, supplierCity: "Cairo" },
];

const HOTEL_GROUPS = [
  "Stella Di Mare", "Sunrise Resorts", "Jaz Hotels", "Baron Hotels",
  "Pickalbatros", "Marriott Hurghada", "Four Seasons Sharm", "Rixos Sharm",
];

function MarketplaceContent() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem: addToCompare, isInCompare } = useCompare();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (activeCategory) params.set("category", activeCategory);
      params.set("status", "ACTIVE");
      params.set("limit", "48");
      params.set("page", "1");

      const res = await fetch(`/api/v1/products?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error("API unavailable");
      setProducts(json.data.products);
    } catch {
      // Fallback to mock data with filtering
      let filtered = [...MOCK_PRODUCTS];
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.supplierName.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        );
      }
      if (activeCategory) {
        filtered = filtered.filter((p) => p.category === activeCategory);
      }
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  }, [search, activeCategory]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    return products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const handleSearch = (query: string, _filters: SearchFilters) => {
    setSearch(query);
  };

  const handleViewDetails = (id: string) => {
    window.location.href = `/marketplace/${id}`;
  };

  const handleAddToCart = (id: string) => {
    window.location.href = `/marketplace/${id}`;
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-canvas)", fontFamily: "var(--font-sans)" }}>
      <MarketingNav />

      {/* ═══ Hero ═══ */}
      <section className="pt-[4rem] pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full blur-[200px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--accent-muted) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: "var(--accent-muted)", border: "1px solid var(--accent-glow)" }}>
            <Sparkles size={12} style={{ color: "var(--accent-base)" }} />
            <span className="text-[11px] font-medium" style={{ color: "var(--accent-base)" }}>
              B2B Marketplace — {MOCK_PRODUCTS.length}+ Verified Products
            </span>
          </div>

          <h1 className="text-[32px] sm:text-[44px] font-semibold tracking-tight mb-4 leading-tight">
            Egypt's B2B Hospitality<br />Procurement Marketplace
          </h1>
          <p className="text-[15px] text-white/50 mb-8 max-w-2xl mx-auto leading-relaxed">
            Fixed-price catalogs from verified Egyptian suppliers. ETA-compliant invoicing.
            24-hour settlement via embedded factoring. Open API + plugin ecosystem.
          </p>

          {/* Inline Search */}
          <div className="max-w-2xl mx-auto mb-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search products, suppliers, SKUs..."
              trending={["Bed Linen", "Pool Chemicals", "Beef Cuts", "HVAC Parts"]}
            />
          </div>
          <p className="text-[11px] text-white/20">Browse {MOCK_PRODUCTS.length} products from trusted Egyptian suppliers</p>
        </div>
      </section>

      {/* ═══ Hotel Groups Trust Bar ═══ */}
      <section className="py-8" style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/20 text-center mb-5">Trusted by procurement teams at</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {HOTEL_GROUPS.map((name) => (
              <span key={name} className="text-[12px] text-white/25 font-medium">{name}</span>
            ))}
          </div>
        </div>
      </section>

      <MarketTicker />

      {/* ═══ Category Filter Pills + Product Grid ═══ */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--accent-muted)" }}>
              <Package size={16} style={{ color: "var(--accent-base)" }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--accent-base)" }}>Product Catalog</span>
          </div>
          <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3">
            Browse Verified Suppliers
          </h2>
          <p className="text-[14px] text-white/40 max-w-2xl mb-8">
            Fixed-price listings from verified Egyptian suppliers across F&B, consumables, guest supplies, FF&E, and services — actively serving Sharm El-Sheikh, Hurghada, Dahab, El Gouna, Marsa Alam, and the wider Red Sea corridor.
          </p>

          {/* Category Pills */}
          <div className="mb-8">
            <CategoryNav
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              counts={counts}
            />
          </div>

          {/* Loading / Error / Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24 text-white/40">
              <Loader2 className="w-6 h-6 animate-spin mr-3" />
              <span>Loading products...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-white/40">
              <Package className="w-12 h-12 mb-4 text-white/20" />
              <h3 className="text-lg font-semibold text-white/60 mb-1">Failed to load products</h3>
              <p className="text-sm text-white/30 mb-6">{error}</p>
              <button onClick={fetchProducts} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ backgroundColor: "var(--accent-base)" }}>
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-white/40">
              <Package className="w-12 h-12 mb-4 text-white/20" />
              <h3 className="text-lg font-semibold text-white/60 mb-1">No products found</h3>
              <p className="text-sm text-white/30 mb-6">Try adjusting your search or category filter.</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory(""); }}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--accent-base)" }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] text-white/40">
                  {products.length} product{products.length !== 1 ? "s" : ""}
                  {activeCategory && ` in ${HOTEL_CATEGORIES.find((c) => c.id === activeCategory)?.label || activeCategory}`}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.02 }}
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      description={product.description || undefined}
                      sku={product.sku}
                      category={product.category}
                      subcategory={product.subcategory || undefined}
                      unitPrice={product.unitPrice}
                      currency={product.currency}
                      stockQuantity={product.stockQuantity}
                      minOrderQty={product.minOrderQty}
                      unitOfMeasure={product.unitOfMeasure}
                      leadTimeDays={product.leadTimeDays}
                      shelfLifeDays={product.shelfLifeDays || undefined}
                      temperatureReq={product.temperatureReq || undefined}
                      supplierName={product.supplierName}
                      supplierTier={product.supplierTier}
                      supplierRating={product.supplierRating}
                      supplierReviewCount={product.supplierReviewCount}
                      supplierCity={product.supplierCity}
                      onAddToCart={handleAddToCart}
                      onViewDetails={handleViewDetails}
                      compareData={{
                        id: product.id,
                        name: product.name,
                        category: product.category,
                        unitPrice: product.unitPrice,
                        currency: product.currency,
                        supplierName: product.supplierName,
                        supplierRating: product.supplierRating,
                        supplierTier: product.supplierTier,
                        supplierCity: product.supplierCity,
                        stockQuantity: product.stockQuantity,
                        leadTimeDays: product.leadTimeDays,
                        minOrderQty: product.minOrderQty,
                        unitOfMeasure: product.unitOfMeasure,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ═══ Trust Signals ═══ */}
      <section className="py-12" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: "Verified Suppliers", desc: "KYC + trade license verified" },
              { icon: Banknote, label: "48h Settlement", desc: "Embedded invoice factoring" },
              { icon: Truck, label: "Coastal Delivery", desc: "Shark-Breaker shared logistics" },
              { icon: Clock, label: "ETA Invoicing", desc: "Auto-generated compliant invoices" },
            ].map((signal) => (
              <div key={signal.label} className="rounded-xl p-4 text-center" style={{ backgroundColor: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}>
                <signal.icon size={20} style={{ color: "var(--accent-base)" }} className="mx-auto mb-2" />
                <p className="text-[12px] font-medium text-white/70 mb-0.5">{signal.label}</p>
                <p className="text-[10px] text-white/30">{signal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3">
            Ready to Transform Your Procurement?
          </h2>
          <p className="text-[14px] text-white/40 mb-8 max-w-lg mx-auto">
            Join the waitlist for early access. Priority onboarding for coastal hotel procurement teams.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:opacity-90" style={{ backgroundColor: "var(--accent-base)", color: "var(--text-primary)" }}>
              Get Started Free <ArrowRight size={14} />
            </Link>
            <Link href="/become-supplier" className="inline-flex items-center gap-2 px-6 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid var(--accent-glow)", color: "var(--accent-base)" }}>
              Become a Supplier
            </Link>
          </div>
        </div>
      </section>

      <CompareDrawer />
      <MarketingFooter />
    </main>
  );
}

export default function MarketplacePage() {
  return (
    <CartProvider>
      <CompareProvider>
        <MarketplaceContent />
      </CompareProvider>
    </CartProvider>
  );
}
