"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2, Store, Landmark, Truck, ArrowRight, Shield, Zap, Clock, Banknote,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { BrandLogo } from "@/components/layout/brand-logo";

const SECTORS = [
  {
    key: "hotel",
    role: "HOTEL",
    icon: Building2,
    label: "Hotel / Resort",
    labelAr: "فندق / منتجع",
    color: "#00E5FF",
    description: "AI procurement, budget control, ETA compliance, embedded factoring",
    descriptionAr: "مشتريات ذكية، تحكم في الميزانية، امتثال ضريبي، تمويل مدمج",
    benefits: [
      "AI demand forecasting — 94% accuracy",
      "ETA e-invoicing built-in",
      "Reverse factoring for suppliers",
      "Multi-property budget control",
    ],
    cta: "Register as Hotel",
  },
  {
    key: "supplier",
    role: "SUPPLIER",
    icon: Store,
    label: "Supplier / Vendor",
    labelAr: "مورد / بائع",
    color: "#F97316",
    description: "Receive POs, issue ETA invoices, get paid in 24–48 hours",
    descriptionAr: "استلام أوامر شراء، إصدار فواتير إلكترونية، تحصيل خلال 24-48 ساعة",
    benefits: [
      "Access to 680+ hotel buyers",
      "ETA-compliant invoicing pipeline",
      "48-hour reverse factoring payout",
      "Real-time order notifications",
    ],
    cta: "Register as Supplier",
  },
  {
    key: "funder",
    role: "FACTORING",
    icon: Landmark,
    label: "Factoring Company",
    labelAr: "شركة تمويل",
    color: "#A855F7",
    description: "Access pre-verified invoices, competitive bidding, bank-direct settlement",
    descriptionAr: "الوصول لفواتير موثقة، مناقصة تنافسية، تسوية بنكية مباشرة",
    benefits: [
      "Pre-verified ETA invoices",
      "Competitive bidding dashboard",
      "Bank-direct settlement",
      "FRA anti-fraud compliance",
    ],
    cta: "Register as Funder",
  },
  {
    key: "logistics",
    role: "LOGISTICS",
    icon: Truck,
    label: "Logistics Provider",
    labelAr: "شركة لوجستيات",
    color: "#D4A843",
    description: "Shared-route optimization, GPS tracking, auto-settlement on delivery",
    descriptionAr: "تحسين المسارات المشتركة، تتبع GPS، تسوية تلقائية عند التسليم",
    benefits: [
      "Shared-route cost reduction (up to 40%)",
      "GPS tracking for all deliveries",
      "Auto-settlement on POD confirmation",
      "Coastal hub model for Red Sea resorts",
    ],
    cta: "Register as Logistics",
  },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0B0F1A" }}>
      <MarketingNav />

      <div className="flex-1 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-8"
          >
            <BrandLogo variant="dark" size="lg" />
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="text-[20px] md:text-[24px] font-medium text-white mb-3">
              Choose Your Role
            </h1>
            <p className="text-[14px] text-white/40 max-w-lg mx-auto">
              Select your stakeholder type to access your dedicated dashboard and begin onboarding.
            </p>
            <p className="text-[12px] text-white/25 mt-1" dir="rtl">
              اختر نوع الحساب للوصول إلى لوحة التحكم المخصصة وابدأ التسجيل
            </p>
          </motion.div>

          {/* Sector cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SECTORS.map((sector, i) => {
              const Icon = sector.icon;
              return (
                <motion.div
                  key={sector.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                >
                  <Link
                    href={`/register/${sector.key}`}
                    className="block rounded-2xl p-6 h-full transition-all group hover:scale-[1.02]"
                    style={{
                      backgroundColor: "#0F1320",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all"
                        style={{ backgroundColor: sector.color + "12" }}
                      >
                        <Icon size={24} style={{ color: sector.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-semibold text-white mb-0.5">{sector.label}</h3>
                        <p className="text-[11px] text-white/25 font-medium" dir="rtl">{sector.labelAr}</p>
                      </div>
                      <ArrowRight
                        size={16}
                        className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                        style={{ color: sector.color }}
                      />
                    </div>

                    <p className="text-[12px] text-white/40 leading-relaxed mb-3">{sector.description}</p>
                    <p className="text-[11px] text-white/25 leading-relaxed mb-4" dir="rtl">{sector.descriptionAr}</p>

                    <ul className="space-y-1.5">
                      {sector.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-[11px] text-white/45">
                          <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: sector.color }} />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <div
                      className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
                      style={{ color: sector.color }}
                    >
                      {sector.cta} <ArrowRight size={12} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-wrap justify-center gap-6"
          >
            {[
              { icon: Shield, label: "Bank-grade security", color: "#00E5FF" },
              { icon: Zap, label: "Free to start", color: "#FFB000" },
              { icon: Clock, label: "24h onboarding", color: "#3B82F6" },
              { icon: Banknote, label: "No credit card required", color: "#A855F7" },
            ].map((t) => (
              <span key={t.label} className="flex items-center gap-1.5 text-[10px] text-white/30">
                <t.icon size={12} style={{ color: t.color }} />
                {t.label}
              </span>
            ))}
          </motion.div>

          <p className="text-center text-[12px] text-white/20 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#FFB000] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
