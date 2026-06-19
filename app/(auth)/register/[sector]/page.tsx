"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2, Store, Landmark, Truck, ArrowRight, ArrowLeft, CheckCircle2,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { BrandLogo } from "@/components/layout/brand-logo";
import { RoleBenefits, type StakeholderRole } from "@/components/auth/role-benefits";
import { HotelDashboardMockup } from "@/components/marketing/hotel-dashboard-mockup";
import { SupplierDashboardMockup } from "@/components/marketing/supplier-dashboard-mockup";
import { FunderDashboardMockup } from "@/components/marketing/funder-dashboard-mockup";
import { LogisticsDashboardMockup } from "@/components/marketing/logistics-dashboard-mockup";

const SECTOR_CONFIG: Record<string, {
  role: StakeholderRole;
  label: string;
  labelAr: string;
  icon: React.ElementType;
  color: string;
  description: string;
  descriptionAr: string;
  dashboard: React.ComponentType;
  fields: { key: string; label: string; labelAr: string; type: string; placeholder: string; required: boolean }[];
}> = {
  hotel: {
    role: "HOTEL",
    label: "Hotel / Resort",
    labelAr: "فندق / منتجع",
    icon: Building2,
    color: "#22C55E",
    description: "AI procurement, budget control, ETA compliance, embedded factoring",
    descriptionAr: "مشتريات ذكية، تحكم في الميزانية، امتثال ضريبي، تمويل مدمج",
    dashboard: HotelDashboardMockup,
    fields: [
      { key: "name", label: "Full Name", labelAr: "الاسم الكامل", type: "text", placeholder: "Your full name", required: true },
      { key: "email", label: "Email", labelAr: "البريد الإلكتروني", type: "email", placeholder: "you@hotel.com", required: true },
      { key: "password", label: "Password", labelAr: "كلمة المرور", type: "password", placeholder: "Min 6 characters", required: true },
      { key: "hotelName", label: "Hotel / Property Name", labelAr: "اسم الفندق / المنشأة", type: "text", placeholder: "e.g. Stella Di Mare Resort", required: true },
      { key: "city", label: "City", labelAr: "المدينة", type: "text", placeholder: "e.g. Hurghada", required: true },
    ],
  },
  supplier: {
    role: "SUPPLIER",
    label: "Supplier / Vendor",
    labelAr: "مورد / بائع",
    icon: Store,
    color: "#F97316",
    description: "Receive POs, issue ETA invoices, get paid in 24–48 hours",
    descriptionAr: "استلام أوامر شراء، إصدار فواتير إلكترونية، تحصيل خلال 24-48 ساعة",
    dashboard: SupplierDashboardMockup,
    fields: [
      { key: "name", label: "Full Name", labelAr: "الاسم الكامل", type: "text", placeholder: "Your full name", required: true },
      { key: "email", label: "Email", labelAr: "البريد الإلكتروني", type: "email", placeholder: "you@supplier.com", required: true },
      { key: "password", label: "Password", labelAr: "كلمة المرور", type: "password", placeholder: "Min 6 characters", required: true },
      { key: "companyName", label: "Company Name", labelAr: "اسم الشركة", type: "text", placeholder: "e.g. Fresh Foods Co.", required: true },
      { key: "taxId", label: "Tax ID", labelAr: "الرقم الضريبي", type: "text", placeholder: "e.g. 123456789", required: true },
    ],
  },
  funder: {
    role: "FACTORING",
    label: "Factoring Company",
    labelAr: "شركة تمويل",
    icon: Landmark,
    color: "#A855F7",
    description: "Access pre-verified invoices, competitive bidding, bank-direct settlement",
    descriptionAr: "الوصول لفواتير موثقة، مناقصة تنافسية، تسوية بنكية مباشرة",
    dashboard: FunderDashboardMockup,
    fields: [
      { key: "name", label: "Full Name", labelAr: "الاسم الكامل", type: "text", placeholder: "Your full name", required: true },
      { key: "email", label: "Email", labelAr: "البريد الإلكتروني", type: "email", placeholder: "you@funder.com", required: true },
      { key: "password", label: "Password", labelAr: "كلمة المرور", type: "password", placeholder: "Min 6 characters", required: true },
      { key: "companyName", label: "Company Name", labelAr: "اسم الشركة", type: "text", placeholder: "e.g. Egyptian Factoring Co.", required: true },
      { key: "licenseNumber", label: "FRA License Number", labelAr: "رقم ترخيص هيئة الرقابة المالية", type: "text", placeholder: "e.g. FRA-2024-001", required: true },
    ],
  },
  logistics: {
    role: "LOGISTICS",
    label: "Logistics Provider",
    labelAr: "شركة لوجستيات",
    icon: Truck,
    color: "#D4A843",
    description: "Shared-route optimization, GPS tracking, auto-settlement on delivery",
    descriptionAr: "تحسين المسارات المشتركة، تتبع GPS، تسوية تلقائية عند التسليم",
    dashboard: LogisticsDashboardMockup,
    fields: [
      { key: "name", label: "Full Name", labelAr: "الاسم الكامل", type: "text", placeholder: "Your full name", required: true },
      { key: "email", label: "Email", labelAr: "البريد الإلكتروني", type: "email", placeholder: "you@logistics.com", required: true },
      { key: "password", label: "Password", labelAr: "كلمة المرور", type: "password", placeholder: "Min 6 characters", required: true },
      { key: "companyName", label: "Company Name", labelAr: "اسم الشركة", type: "text", placeholder: "e.g. Shark-Breaker Logistics", required: true },
      { key: "coverage", label: "Coverage Areas", labelAr: "مناطق التغطية", type: "text", placeholder: "e.g. Cairo, Hurghada, Sharm", required: true },
    ],
  },
};

function SectorRegisterForm({ sector }: { sector: typeof SECTOR_CONFIG[string] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    for (const field of sector.fields) {
      if (field.required && !form[field.key]?.trim()) {
        setError(`Please fill in ${field.label}`);
        setLoading(false);
        return;
      }
    }
    if (form.password && form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: sector.role.toLowerCase(),
          name: form.name,
          email: form.email,
          password: form.password,
          accountType: "business",
          companyName: form.companyName || form.hotelName || "",
          taxId: form.taxId || "",
          city: form.city || "",
          governorate: form.coverage || "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRegistered(true);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-8 text-center"
        style={{ backgroundColor: "#0a0a0a", border: `1px solid ${sector.color}30` }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: sector.color + "15", border: `1px solid ${sector.color}30` }}
        >
          <CheckCircle2 size={32} style={{ color: sector.color }} />
        </div>
        <h2 className="text-xl font-medium text-white mb-2">Welcome aboard!</h2>
        <p className="text-sm text-white/40 mb-4">
          Your {sector.label} account has been created. Check your email to verify.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium rounded-lg transition-all"
          style={{ backgroundColor: sector.color, color: "#07090f" }}
        >
          Go to Sign In <ArrowRight size={14} />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
        <h2 className="text-lg font-medium text-white">Register as {sector.label}</h2>
        <p className="text-sm text-white/40 mt-1" dir="rtl">{sector.labelAr}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-4">
        {error && (
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}
          >
            {error}
          </div>
        )}

        {sector.fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {field.type === "password" ? (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form[field.key] || ""}
                  onChange={(e) => updateForm(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  minLength={field.type === "password" ? 6 : undefined}
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none transition-all"
                  style={{ borderColor: undefined }}
                  onFocus={(e) => { e.target.style.borderColor = sector.color + "60"; e.target.style.boxShadow = `0 0 0 2px ${sector.color}20`; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.06)"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            ) : (
              <input
                type={field.type}
                value={form[field.key] || ""}
                onChange={(e) => updateForm(field.key, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none transition-all"
                onFocus={(e) => { e.target.style.borderColor = sector.color + "60"; e.target.style.boxShadow = `0 0 0 2px ${sector.color}20`; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.06)"; e.target.style.boxShadow = "none"; }}
              />
            )}
            <p className="text-[10px] text-white/20" dir="rtl">{field.labelAr}</p>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
          style={{ backgroundColor: sector.color, color: "#000000" }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <span>Create {sector.label} Account</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

function RegisterSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-8 bg-white/[0.04] rounded w-1/2" />
      <div className="h-12 bg-white/[0.04] rounded" />
      <div className="h-12 bg-white/[0.04] rounded" />
      <div className="h-12 bg-white/[0.04] rounded" />
      <div className="h-12 bg-white/[0.04] rounded" />
    </div>
  );
}

export default function SectorRegisterPage({ params }: { params: Promise<{ sector: string }> }) {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <SectorRegisterPageInner params={params} />
    </Suspense>
  );
}

function SectorRegisterPageInner({ params }: { params: Promise<{ sector: string }> }) {
  const [sectorKey, setSectorKey] = useState<string>("");

  useEffect(() => {
    (params as Promise<{ sector: string }>).then((p) => setSectorKey(p.sector));
  }, [params]);

  const sector = SECTOR_CONFIG[sectorKey];

  if (!sector) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#000000" }}>
        <MarketingNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-[24px] font-medium text-white mb-3">Invalid sector</h1>
            <p className="text-[14px] text-white/40 mb-6">The registration type you requested doesn&apos;t exist.</p>
            <Link href="/register" className="text-[#FFB000] hover:underline font-medium">
              ← Back to registration
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const Icon = sector.icon;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#000000" }}>
      <MarketingNav />

      <div className="flex-1 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          {/* Back link */}
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors mb-8"
          >
            <ArrowLeft size={14} /> All Roles
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Form */}
            <div>
              {/* Sector header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: sector.color + "15" }}
                >
                  <Icon size={24} style={{ color: sector.color }} />
                </div>
                <div>
                  <h2 className="text-[22px] font-medium text-white">{sector.label}</h2>
                  <p className="text-[12px] text-white/30" dir="rtl">{sector.labelAr}</p>
                </div>
              </div>

              <p className="text-[13px] text-white/40 mb-6">{sector.description}</p>
              <p className="text-[12px] text-white/25 mb-6" dir="rtl">{sector.descriptionAr}</p>

              {/* Role benefits */}
              <div className="mb-6">
                <RoleBenefits role={sector.role} variant="compact" />
              </div>

              {/* Registration form */}
              <SectorRegisterForm sector={sector} />

              <p className="text-[12px] text-white/20 mt-4 text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-[#FFB000] hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Right: Dashboard Preview */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3 text-center">
                  Your Dashboard Preview
                </p>
                <sector.dashboard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
