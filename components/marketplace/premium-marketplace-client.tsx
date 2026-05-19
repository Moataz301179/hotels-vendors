"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  Star,
  CheckCircle2,
  ArrowRight,
  Filter,
  X,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  ChevronDown,
  ExternalLink,
  MessageSquare,
  Send,
} from "lucide-react";
import { ButtonEnterprise } from "@/components/ui/button-enterprise";
import { CardEnterprise } from "@/components/ui/card-enterprise";
import { StatusBadge } from "@/components/ui/status-badge";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

// ============================================================================
// TYPES
// ============================================================================

interface Supplier {
  id: string;
  name: string;
  city: string;
  governorate: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  industrial_zone: string;
  tax_id: string;
  monthly_capacity_egp: number;
  years_established: number;
  verified: boolean;
}

interface Product {
  sku: string;
  name: string;
  category: string;
  unit: string;
  base_price_egp: number;
  supplier_id: string;
}

interface Hotel {
  id: string;
  name: string;
  city: string;
  governorate: string;
  tier: string;
  rooms: number;
  chain: string;
  monthly_gmv_egp: number;
  logo_url: string;
  website: string;
  brand_color: string;
}

interface MarketData {
  _meta: {
    version: string;
    generated: string;
    region: string;
    data_quality: string;
    total_suppliers: number;
    total_products: number;
    total_hotels: number;
  };
  suppliers: Supplier[];
  hotels: Hotel[];
  product_catalog: Product[];
}

// ============================================================================
// CATEGORY MAPPING
// ============================================================================

const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  kitchen_equipment: { label: "Kitchen Equipment", icon: "🔥", color: "#FF6B35" },
  cleaning_supplies: { label: "Cleaning Supplies", icon: "✨", color: "#00D4AA" },
  linens_textiles: { label: "Linens & Textiles", icon: "🛏️", color: "#9B59B6" },
  amenities: { label: "Hotel Amenities", icon: "🧴", color: "#3498DB" },
  multi_category: { label: "Multi-Category", icon: "📦", color: "#E74C3C" },
};

const CATEGORY_SLUGS = Object.keys(CATEGORY_CONFIG);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatPriceEGP(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(price >= 10000 ? 0 : 1)}K`;
  }
  return price.toString();
}

function formatFullPriceEGP(price: number): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getProductImage(product: Product): { type: "gradient"; colors: string[]; initials: string } {
  const categoryColors: Record<string, string[]> = {
    kitchen_equipment: ["#1a1a2e", "#16213e", "#0f3460"],
    cleaning_supplies: ["#0d3b3b", "#0a4f4f", "#086363"],
    linens_textiles: ["#2d1b4e", "#3d2b5e", "#4d3b6e"],
    amenities: ["#1e3a5f", "#2e4a6f", "#3e5a7f"],
    multi_category: ["#3d2817", "#4d3827", "#5d4837"],
  };

  const colors = categoryColors[product.category] || ["#1a1a2e", "#2a2a4a", "#4a4a7a"];
  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return { type: "gradient", colors, initials };
}

// ============================================================================
// COMPONENTS
// ============================================================================

function TrustBadge({ hotels }: { hotels: Hotel[] }) {
  const displayHotels = hotels.slice(0, 8);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <p className="text-sm text-white/40 uppercase tracking-widest font-medium">
        Trusted by Egypt&apos;s Leading Hotels
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
        {displayHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: hotel.brand_color }}
            />
            <span className="text-xs text-white/50 font-medium">{hotel.chain}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  supplier,
  onContact,
}: {
  product: Product;
  supplier: Supplier;
  onContact: (product: Product, supplier: Supplier) => void;
}) {
  const image = getProductImage(product);
  const categoryConfig = CATEGORY_CONFIG[product.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <CardEnterprise
        variant="glass"
        className="overflow-hidden h-full flex flex-col"
        isHoverable
      >
        {/* Product Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${image.colors[0]} 0%, ${image.colors[1]} 50%, ${image.colors[2]} 100%)`,
            }}
          >
            <div className="text-center">
              <span className="text-4xl font-bold text-white/20 tracking-tight">
                {image.initials}
              </span>
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md"
              style={{
                backgroundColor: `${categoryConfig?.color}20`,
                color: categoryConfig?.color,
                border: `1px solid ${categoryConfig?.color}30`,
              }}
            >
              {categoryConfig?.icon} {categoryConfig?.label}
            </span>
          </div>

          {/* Verified Badge */}
          {supplier.verified && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-medium text-emerald-400">Verified</span>
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-white/90 line-clamp-2 mb-2 group-hover:text-white transition-colors">
            {product.name}
          </h3>

          {/* Supplier Badge */}
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-3 h-3 text-white/40" />
            <span className="text-xs text-white/50 truncate">{supplier.name}</span>
          </div>

          {/* Price & CTA */}
          <div className="mt-auto pt-3 border-t border-white/[0.06]">
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-lg font-bold text-white">
                {formatFullPriceEGP(product.base_price_egp)}
              </span>
              <span className="text-xs text-white/40">/{product.unit}</span>
            </div>

            <ButtonEnterprise
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => onContact(product, supplier)}
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              Contact Supplier
            </ButtonEnterprise>
          </div>
        </div>
      </CardEnterprise>
    </motion.div>
  );
}

function ContactModal({
  isOpen,
  onClose,
  product,
  supplier,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  supplier: Supplier | null;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !product || !supplier) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      setMessage("");
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <CardEnterprise variant="glass" className="w-full max-w-lg max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Contact Supplier</h2>
                    <p className="text-sm text-white/50 mt-1">
                      Send inquiry to {supplier.name}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Inquiry Sent!</h3>
                    <p className="text-sm text-white/50">
                      {supplier.name} will contact you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                        Product
                      </p>
                      <p className="text-sm font-medium text-white">{product.name}</p>
                      <p className="text-sm text-white/50 mt-1">
                        {formatFullPriceEGP(product.base_price_egp)} / {product.unit}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hotel@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--crimson-primary)] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
                        Message
                      </label>
                      <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="I'm interested in this product. Please provide more details about availability and bulk pricing."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--crimson-primary)] transition-colors resize-none"
                      />
                    </div>

                    <ButtonEnterprise variant="primary" className="w-full" size="lg">
                      <Send className="w-4 h-4 mr-2" />
                      Send Inquiry
                    </ButtonEnterprise>

                    <p className="text-xs text-white/30 text-center">
                      Your contact information will be shared with {supplier.name}
                    </p>
                  </form>
                )}
              </div>
            </CardEnterprise>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PremiumMarketplaceClient({ data }: { data: MarketData }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { suppliers, hotels, product_catalog } = data;

  // Create supplier lookup map
  const supplierMap = useMemo(() => {
    return new Map(suppliers.map((s) => [s.id, s]));
  }, [suppliers]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return product_catalog.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [product_catalog, activeCategory, searchQuery]);

  // Group products by category for masonry layout
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    filteredProducts.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  }, [filteredProducts]);

  const handleContact = useCallback((product: Product, supplier: Supplier) => {
    setSelectedProduct(product);
    setSelectedSupplier(supplier);
    setIsContactModalOpen(true);
  }, []);

  const stats = [
    { label: "Verified Suppliers", value: suppliers.length, icon: Building2 },
    { label: "Products", value: product_catalog.length, icon: Sparkles },
    { label: "Hotel Partners", value: hotels.length, icon: Star },
    { label: "Years Experience", value: "500+", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-black">
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--crimson-glow-soft)]/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--crimson-primary)]/10 rounded-full blur-[150px]" />

        <div className="relative max-w-7xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.1]">
              <Shield className="w-4 h-4 text-[var(--gold-primary)]" />
              <span className="text-sm text-white/70">Real Suppliers, Verified Prices</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-white mb-6 tracking-tight"
          >
            Premium Marketplace
            <span className="block text-[var(--gold-primary)] mt-2">
              for Egyptian Hospitality
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/50 text-center max-w-2xl mx-auto mb-12"
          >
            Browse verified products from Egypt&apos;s leading hotel suppliers.
            Real wholesale prices in EGP. Contact suppliers directly to negotiate.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16"
          >
            {stats.map((stat, index) => (
              <CardEnterprise
                key={stat.label}
                variant="glass"
                className="text-center py-4"
              >
                <stat.icon className="w-5 h-5 text-[var(--crimson-primary)] mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </CardEnterprise>
            ))}
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search products, categories, or suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--crimson-primary)] transition-all"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mb-16"
          >
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-[var(--crimson-primary)] text-white"
                  : "bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white"
              }`}
            >
              All Categories
            </button>
            {CATEGORY_SLUGS.map((slug) => (
              <button
                key={slug}
                onClick={() => setActiveCategory(slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === slug
                    ? "bg-[var(--crimson-primary)] text-white"
                    : "bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white"
                }`}
              >
                {CATEGORY_CONFIG[slug].icon} {CATEGORY_CONFIG[slug].label}
              </button>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <TrustBadge hotels={hotels} />
        </div>
      </section>

      {/* Products Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-white/50">
              Showing <span className="text-white font-semibold">{filteredProducts.length}</span> products
            </p>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <TrendingUp className="w-4 h-4" />
              <span>Prices updated: {data._meta.generated}</span>
            </div>
          </div>

          {/* Masonry Grid */}
          {filteredProducts.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredProducts.map((product) => {
                const supplier = supplierMap.get(product.supplier_id);
                if (!supplier) return null;
                return (
                  <div key={product.sku} className="break-inside-avoid">
                    <ProductCard
                      product={product}
                      supplier={supplier}
                      onContact={handleContact}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white/30" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-white/40">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </section>

      {/* Suppliers Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Verified Suppliers</h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Connect directly with Egypt&apos;s leading hospitality suppliers.
              All suppliers are verified and have years of industry experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier, index) => (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/suppliers/${supplier.id}`}>
                  <CardEnterprise
                    variant="interactive"
                    className="h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {supplier.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-white/50">
                          <MapPin className="w-3.5 h-3.5" />
                          {supplier.city}, {supplier.governorate}
                        </div>
                      </div>
                      {supplier.verified && (
                        <StatusBadge variant="active" size="sm" dot>
                          Verified
                        </StatusBadge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className="px-2 py-1 rounded-md text-xs font-medium"
                        style={{
                          backgroundColor: `${CATEGORY_CONFIG[supplier.category]?.color}20`,
                          color: CATEGORY_CONFIG[supplier.category]?.color,
                        }}
                      >
                        {CATEGORY_CONFIG[supplier.category]?.label}
                      </span>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/[0.05] text-white/50">
                        {supplier.years_established}+ years
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-white/40">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="truncate">{supplier.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{supplier.email}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs text-white/30">
                        {product_catalog.filter((p) => p.supplier_id === supplier.id).length} products
                      </span>
                      <span className="text-sm text-[var(--crimson-primary)] flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Profile <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </CardEnterprise>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-4xl mx-auto">
          <CardEnterprise variant="glass" glow="crimson" className="p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Are you a supplier?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Join Egypt&apos;s premier B2B hospitality marketplace. Connect with
              15+ leading hotel chains and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonEnterprise variant="primary" size="lg">
                Apply to Join
              </ButtonEnterprise>
              <ButtonEnterprise variant="outline" size="lg">
                Learn More
              </ButtonEnterprise>
            </div>
          </CardEnterprise>
        </div>
      </section>

      <MarketingFooter />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        product={selectedProduct}
        supplier={selectedSupplier}
      />
    </div>
  );
}
