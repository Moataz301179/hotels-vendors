"use client";

import { motion } from "framer-motion";
import { MapPin, Building2, TrendingUp, Award } from "lucide-react";
import {
  getFeaturedSuppliers,
  getCategoryLabel,
  getSupplierCategoryColor,
  type RealSupplier,
} from "@/lib/marketplace/real-suppliers";

export function SupplierShowcase() {
  const suppliers = getFeaturedSuppliers(12);

  return (
    <section className="mt-12 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[16px] font-bold text-white tracking-tight">
            Verified Egyptian Suppliers
          </h2>
          <p className="text-[12px] text-white/35 mt-0.5">
            Real industrial partners. Tax-registered. ETA-compliant.
          </p>
        </div>
        <span className="text-[11px] text-white/25 font-medium">
          {suppliers.length}+ partners
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {suppliers.map((s, i) => (
          <SupplierCard key={s.id} supplier={s} index={i} />
        ))}
      </div>
    </section>
  );
}

function SupplierCard({
  supplier,
  index,
}: {
  supplier: RealSupplier;
  index: number;
}) {
  const catColor = getSupplierCategoryColor(supplier.category);
  const capacityM = (supplier.monthlyCapacityEgp / 1_000_000).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[13px] font-bold text-white shrink-0"
          style={{ backgroundColor: `${catColor}18`, color: catColor }}
        >
          {supplier.name
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")}
        </div>
        <div
          className="px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider border"
          style={{
            borderColor: `${catColor}30`,
            color: catColor,
            backgroundColor: `${catColor}10`,
          }}
        >
          {getCategoryLabel(supplier.category)}
        </div>
      </div>

      <h3 className="text-[13px] font-semibold text-white/90 leading-snug mb-1 group-hover:text-white transition-colors">
        {supplier.name}
      </h3>

      <div className="flex items-center gap-1 text-[11px] text-white/30 mb-2">
        <MapPin size={10} />
        <span>
          {supplier.city}, {supplier.governorate}
        </span>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-white/[0.04]">
        <div className="flex items-center gap-1 text-[10px] text-white/25">
          <Building2 size={9} />
          <span>{supplier.industrialZone}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-white/25">
          <TrendingUp size={9} />
          <span>EGP {capacityM}M/mo</span>
        </div>
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Award size={12} className="text-white/20" />
      </div>
    </motion.div>
  );
}
