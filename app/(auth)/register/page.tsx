"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2, Store, Landmark, Truck, ArrowRight, Shield, Zap, Clock, Banknote, Sparkles,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { BrandLogo } from "@/components/layout/brand-logo";
import { RegistrationWizard } from "@/components/auth/registration-wizard";

const SECTORS = [
  {
    key: "hotel",
    icon: Building2,
    label: "Hotel / Resort",
    labelAr: "فندق / منتجع",
    color: "#22C55E",
    description: "AI procurement, budget control, ETA compliance, embedded factoring",
    descriptionAr: "مشتريات ذكية، تحكم في الميزانية، امتثال ضريبي، تمويل مدمج",
    benefits: [
      "AI demand forecasting — 94% accuracy",
      "ETA e-invoicing built-in",
      "Reverse factoring for suppliers",
      "Multi-property budget control",
    ],
  },
  {
    key: "supplier",
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
  },
  {
    key: "funder",
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
  },
  {
    key: "logistics",
    icon: Truck,
    label: "Logistics Provider",
    labelAr: "شركة لوجستيات",
    color: "#3B82F6",
    description: "Shared-route optimization, GPS tracking, auto-settlement on delivery",
    descriptionAr: "تحسين المسارات المشتركة، تتبع GPS، تسوية تلقائية عند التسليم",
    benefits: [
      "Shared-route cost reduction (up to 40%)",
      "GPS tracking for all deliveries",
      "Auto-settlement on POD confirmation",
      "Coastal hub model for Red Sea resorts",
    ],
  },
];

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const sectorParam = searchParams.get("sector");
  const [wizardOpen, setWizardOpen] = useState(!!sectorParam);

  useEffect(() => {
    if (sectorParam && SECTORS.find((s) => s.key === sectorParam)) {
      setWizardOpen(true);
    }
  }, [sectorParam]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#000000" }}>
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium mb-4" style={{ backgroundColor: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.15)", color: "#FF6B00" }}>
              <Sparkles size={12} />
              AI-Powered Registration — 2 minutes
            </div>
            <h1 className="text-[20px] md:text-[24px] font-medium text-white mb-3">
              Choose Your Role
            </h1>
            <p className="text-[14px] text-white/40 max-w-lg mx-auto">
              Select your stakeholder type and our AI wizard will guide you through registration.
            </p>
            <p className="text-[12px] text-white/25 mt-1" dir="rtl">
              اختر نوع الحساب وسيقوم المساعد الذكي بتوجيهك خلال التسجيل
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
                  <button
                    onClick={() => setWizardOpen(true)}
                    className="block w-full rounded-2xl p-6 h-full transition-all group hover:scale-[1.02] text-left cursor-pointer"
                    style={{
                      backgroundColor: "#0B0F1A",
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
                      Start Registration <ArrowRight size={12} />
                    </div>
                  </button>
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
              { icon: Shield, label: "Bank-grade security", color: "#22C55E" },
              { icon: Zap, label: "Free to start", color: "#FF6B00" },
              { icon: Clock, label: "2 min registration", color: "#3B82F6" },
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
            <Link href="/login" className="text-[#FF6B00] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <RegistrationWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </div>
  );
}
