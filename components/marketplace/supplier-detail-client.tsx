"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  Star,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  Package,
  Calendar,
  TrendingUp,
  Shield,
  MessageSquare,
  Send,
  Clock,
  Award,
  Users,
  Briefcase,
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

// ============================================================================
// CATEGORY MAPPING
// ============================================================================

const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string; description: string }> = {
  kitchen_equipment: {
    label: "Kitchen Equipment",
    icon: "🔥",
    color: "#FF6B35",
    description: "Commercial kitchen appliances, refrigeration, and food preparation equipment",
  },
  cleaning_supplies: {
    label: "Cleaning Supplies",
    icon: "✨",
    color: "#00D4AA",
    description: "Industrial cleaning chemicals, equipment, and hygiene products",
  },
  linens_textiles: {
    label: "Linens & Textiles",
    icon: "🛏️",
    color: "#9B59B6",
    description: "Premium Egyptian cotton linens, towels, and hotel textiles",
  },
  amenities: {
    label: "Hotel Amenities",
    icon: "🧴",
    color: "#3498DB",
    description: "Guest room toiletries, bathroom amenities, and hospitality supplies",
  },
  multi_category: {
    label: "Multi-Category",
    icon: "📦",
    color: "#E74C3C",
    description: "Comprehensive hotel supplies across multiple categories",
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatFullPriceEGP(price: number): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatCapacity(capacity: number): string {
  if (capacity >= 1000000) {
    return `${(capacity / 1000000).toFixed(1)}M EGP/month`;
  }
  if (capacity >= 1000) {
    return `${(capacity / 1000).toFixed(0)}K EGP/month`;
  }
  return `${capacity} EGP/month`;
}

function getProductImage(product: Product): { colors: string[]; initials: string } {
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

  return { colors, initials };
}

// ============================================================================
// COMPONENTS
// ============================================================================

function ProductCard({ product }: { product: Product }) {
  const image = getProductImage(product);
  const categoryConfig = CATEGORY_CONFIG[product.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <CardEnterprise variant="glass" className="overflow-hidden h-full flex flex-col" isHoverable>
        {/* Product Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${image.colors[0]} 0%, ${image.colors[1]} 50%, ${image.colors[2]} 100%)`,
            }}
          >
            <span className="text-3xl font-bold text-white/20 tracking-tight">
              {image.initials}
            </span>
          </div>
          <div className="absolute top-3 left-3">
            <span
              className="px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${categoryConfig?.color}30`,
                color: categoryConfig?.color,
              }}
            >
              {categoryConfig?.label}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-auto pt-3 border-t border-white/[0.06]">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white">
                {formatFullPriceEGP(product.base_price_egp)}
              </span>
              <span className="text-xs text-white/40">/{product.unit}</span>
            </div>
          </div>
        </div>
      </CardEnterprise>
    </motion.div>
  );
}

function ContactModal({
  isOpen,
  onClose,
  supplier,
}: {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <CardEnterprise variant="glass" className="max-h-[90vh] overflow-auto">
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
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                    placeholder="I'm interested in your products. Please provide more details about availability and bulk pricing."
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
    </motion.div>
  );
}

function InviteModal({
  isOpen,
  onClose,
  supplier,
}: {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      onClose();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <CardEnterprise variant="glass" className="max-h-[90vh] overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Invite to Platform</h2>
                <p className="text-sm text-white/50 mt-1">
                  Help {supplier.name} join our marketplace
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                <h3 className="text-lg font-semibold text-white mb-2">Invitation Sent!</h3>
                <p className="text-sm text-white/50">
                  We&apos;ll reach out to {supplier.name} on your behalf.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-sm text-white/70 mb-2">
                    {supplier.name} is not yet registered on our platform.
                  </p>
                  <p className="text-xs text-white/50">
                    By inviting them, you&apos;ll help us connect with more verified suppliers
                    and expand our marketplace for Egyptian hospitality.
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
                    Supplier Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={supplier.email}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--crimson-primary)] transition-colors"
                  />
                </div>

                <ButtonEnterprise variant="primary" className="w-full" size="lg">
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation
                </ButtonEnterprise>

                <p className="text-xs text-white/30 text-center">
                  We&apos;ll send a professional invitation to join our verified supplier network
                </p>
              </form>
            )}
          </div>
        </CardEnterprise>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SupplierDetailClient({
  supplier,
  products,
  allSuppliers,
}: {
  supplier: Supplier;
  products: Product[];
  allSuppliers: Supplier[];
}) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const categoryConfig = CATEGORY_CONFIG[supplier.category];

  // Get related suppliers (same category, excluding current)
  const relatedSuppliers = allSuppliers
    .filter((s) => s.category === supplier.category && s.id !== supplier.id)
    .slice(0, 3);

  // Calculate stats
  const totalProducts = products.length;
  const avgPrice =
    totalProducts > 0
      ? products.reduce((sum, p) => sum + p.base_price_egp, 0) / totalProducts
      : 0;
  const priceRange =
    totalProducts > 0
      ? {
          min: Math.min(...products.map((p) => p.base_price_egp)),
          max: Math.max(...products.map((p) => p.base_price_egp)),
        }
      : null;

  return (
    <div className="min-h-screen bg-black">
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at top, ${categoryConfig?.color}20 0%, transparent 50%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Link>
          </motion.div>

          {/* Supplier Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12"
          >
            <div className="flex-1">
              {/* Category Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${categoryConfig?.color}20`,
                    color: categoryConfig?.color,
                  }}
                >
                  {categoryConfig?.icon} {categoryConfig?.label}
                </span>
                {supplier.verified && (
                  <StatusBadge variant="active" size="sm" dot>
                    Verified Supplier
                  </StatusBadge>
                )}
              </div>

              {/* Name */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {supplier.name}
              </h1>

              {/* Description */}
              <p className="text-lg text-white/50 max-w-2xl mb-6">
                {categoryConfig?.description}. Based in {supplier.city}, {supplier.governorate} with{" "}
                {supplier.years_established}+ years of industry experience.
              </p>

              {/* Location */}
              <div className="flex items-start gap-2 text-white/40">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/60">{supplier.address}</p>
                  <p className="text-sm">
                    {supplier.city}, {supplier.governorate} • {supplier.industrial_zone}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <CardEnterprise variant="glass" className="lg:w-80 flex-shrink-0">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contact Supplier</h3>
                <div className="space-y-3 mb-6">
                  <a
                    href={`tel:${supplier.phone}`}
                    className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {supplier.phone}
                  </a>
                  <a
                    href={`mailto:${supplier.email}`}
                    className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {supplier.email}
                  </a>
                  {supplier.website && (
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Visit Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <ButtonEnterprise
                  variant="primary"
                  className="w-full mb-3"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Inquiry
                </ButtonEnterprise>
                <ButtonEnterprise
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsInviteModalOpen(true)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Invite to Platform
                </ButtonEnterprise>
              </div>
            </CardEnterprise>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <CardEnterprise variant="glass" className="p-4 text-center">
              <Calendar className="w-5 h-5 text-[var(--crimson-primary)] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{supplier.years_established}+</p>
              <p className="text-xs text-white/40">Years in Business</p>
            </CardEnterprise>
            <CardEnterprise variant="glass" className="p-4 text-center">
              <Package className="w-5 h-5 text-[var(--crimson-primary)] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{totalProducts}</p>
              <p className="text-xs text-white/40">Products Listed</p>
            </CardEnterprise>
            <CardEnterprise variant="glass" className="p-4 text-center">
              <TrendingUp className="w-5 h-5 text-[var(--crimson-primary)] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {formatCapacity(supplier.monthly_capacity_egp)}
              </p>
              <p className="text-xs text-white/40">Monthly Capacity</p>
            </CardEnterprise>
            <CardEnterprise variant="glass" className="p-4 text-center">
              <Shield className="w-5 h-5 text-[var(--crimson-primary)] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{supplier.tax_id}</p>
              <p className="text-xs text-white/40">Tax ID</p>
            </CardEnterprise>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      {products.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Product Catalog</h2>
                <p className="text-white/50">
                  {totalProducts} products available • Price range:{" "}
                  {priceRange
                    ? `${formatFullPriceEGP(priceRange.min)} - ${formatFullPriceEGP(priceRange.max)}`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Suppliers */}
      {relatedSuppliers.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">Similar Suppliers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedSuppliers.map((relatedSupplier) => (
                <Link key={relatedSupplier.id} href={`/suppliers/${relatedSupplier.id}`}>
                  <CardEnterprise variant="interactive" className="h-full">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">
                          {relatedSupplier.name}
                        </h3>
                        {relatedSupplier.verified && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
                        <MapPin className="w-4 h-4" />
                        {relatedSupplier.city}, {relatedSupplier.governorate}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/[0.05] text-white/50">
                          {relatedSupplier.years_established}+ years
                        </span>
                      </div>
                    </div>
                  </CardEnterprise>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <CardEnterprise variant="glass" glow="crimson" className="p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to connect with {supplier.name}?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Send an inquiry directly to discuss pricing, availability, and bulk orders.
              All communications are tracked for your procurement records.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonEnterprise
                variant="primary"
                size="lg"
                onClick={() => setIsContactModalOpen(true)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Supplier
              </ButtonEnterprise>
              <Link href="/marketplace">
                <ButtonEnterprise variant="outline" size="lg">
                  Browse More Suppliers
                </ButtonEnterprise>
              </Link>
            </div>
          </CardEnterprise>
        </div>
      </section>

      <MarketingFooter />

      {/* Modals */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        supplier={supplier}
      />
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        supplier={supplier}
      />
    </div>
  );
}
