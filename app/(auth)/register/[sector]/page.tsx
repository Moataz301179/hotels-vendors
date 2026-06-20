"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2, Store, Landmark, Truck, ArrowRight, ArrowLeft, CheckCircle2,
  Upload, FileText, Shield, CreditCard, AlertCircle, Loader2, Banknote,
  Phone, Mail, User, MapPin, Hash, FileCheck, ChevronRight, Info,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { RoleBenefits, type StakeholderRole } from "@/components/auth/role-benefits";
import { HotelDashboardMockup } from "@/components/marketing/hotel-dashboard-mockup";
import { SupplierDashboardMockup } from "@/components/marketing/supplier-dashboard-mockup";
import { FunderDashboardMockup } from "@/components/marketing/funder-dashboard-mockup";
import { LogisticsDashboardMockup } from "@/components/marketing/logistics-dashboard-mockup";

/* ─── Sector Configuration ─── */

const SECTOR_CONFIG: Record<string, {
  role: StakeholderRole;
  label: string;
  labelAr: string;
  icon: React.ElementType;
  color: string;
  description: string;
  descriptionAr: string;
  dashboard: React.ComponentType;
  legalNote: string;
  legalNoteAr: string;
  fields: {
    account: { key: string; label: string; labelAr: string; type: string; placeholder: string; required: boolean; icon: React.ElementType; note?: string }[];
    legal: { key: string; label: string; labelAr: string; type: string; placeholder: string; required: boolean; icon: React.ElementType; note?: string }[];
    banking: { key: string; label: string; labelAr: string; type: string; placeholder: string; required: boolean; icon: React.ElementType; note?: string }[];
  };
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
    legalNote: "Hotels must provide valid Commercial Registration and Tax ID for ETA e-invoicing compliance. Your account will be activated after document verification (typically 24 hours).",
    legalNoteAr: "يجب على الفنادق تقديم سجل تجاري ورقم ضريبي ساري للامتثال للفوترة الإلكترونية. سيتم تفعيل حسابك بعد التحقق من المستندات (عادة خلال 24 ساعة).",
    fields: {
      account: [
        { key: "name", label: "Full Name", labelAr: "الاسم الكامل", type: "text", placeholder: "Your full name", required: true, icon: User },
        { key: "email", label: "Business Email", labelAr: "البريد الإلكتروني", type: "email", placeholder: "you@hotel.com", required: true, icon: Mail },
        { key: "password", label: "Password", labelAr: "كلمة المرور", type: "password", placeholder: "Min 8 characters", required: true, icon: Shield },
        { key: "phone", label: "Phone Number", labelAr: "رقم الهاتف", type: "tel", placeholder: "+20 1XX XXX XXXX", required: true, icon: Phone },
        { key: "hotelName", label: "Hotel / Property Name", labelAr: "اسم الفندق / المنشأة", type: "text", placeholder: "e.g. Stella Di Mare Resort", required: true, icon: Building2 },
        { key: "city", label: "City", labelAr: "المدينة", type: "text", placeholder: "e.g. Hurghada", required: true, icon: MapPin },
      ],
      legal: [
        { key: "taxId", label: "Tax ID (الرقم الضريبي)", labelAr: "الرقم الضريبي", type: "text", placeholder: "e.g. 123-456-789", required: true, icon: Hash, note: "Required for ETA e-invoicing compliance" },
        { key: "commercialReg", label: "Commercial Registration No.", labelAr: "رقم السجل التجاري", type: "text", placeholder: "e.g. CR-12345", required: true, icon: FileText, note: "Must be valid and active" },
      ],
      banking: [
        { key: "bankName", label: "Bank Name", labelAr: "اسم البنك", type: "text", placeholder: "e.g. CIB, NBE, QNB", required: true, icon: Banknote },
        { key: "bankAccount", label: "Bank Account (IBAN)", labelAr: "رقم الحساب البنكي (IBAN)", type: "text", placeholder: "EGXX XXXX XXXX XXXX XXXX XXXX", required: true, icon: CreditCard },
      ],
    },
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
    legalNote: "Suppliers must provide valid Commercial Registration, Tax ID, and bank account for payout processing. Paymob merchant connection is required to receive payments on the platform.",
    legalNoteAr: "يجب على الموردين تقديم سجل تجاري ورقم ضريبي وحساب بنكي ساري لمعالجة المدفوعات. الاتصال ببايموب مطلوب لاستلام المدفوعات على المنصة.",
    fields: {
      account: [
        { key: "name", label: "Full Name", labelAr: "الاسم الكامل", type: "text", placeholder: "Your full name", required: true, icon: User },
        { key: "email", label: "Business Email", labelAr: "البريد الإلكتروني", type: "email", placeholder: "you@supplier.com", required: true, icon: Mail },
        { key: "password", label: "Password", labelAr: "كلمة المرور", type: "password", placeholder: "Min 8 characters", required: true, icon: Shield },
        { key: "phone", label: "Phone Number", labelAr: "رقم الهاتف", type: "tel", placeholder: "+20 1XX XXX XXXX", required: true, icon: Phone },
        { key: "companyName", label: "Company Name", labelAr: "اسم الشركة", type: "text", placeholder: "e.g. Fresh Foods Co.", required: true, icon: Store },
        { key: "city", label: "City", labelAr: "المدينة", type: "text", placeholder: "e.g. Cairo", required: true, icon: MapPin },
      ],
      legal: [
        { key: "taxId", label: "Tax ID (الرقم الضريبي)", labelAr: "الرقم الضريبي", type: "text", placeholder: "e.g. 123-456-789", required: true, icon: Hash, note: "Required for ETA e-invoicing" },
        { key: "commercialReg", label: "Commercial Registration No.", labelAr: "رقم السجل التجاري", type: "text", placeholder: "e.g. CR-12345", required: true, icon: FileText, note: "Must be valid and active" },
      ],
      banking: [
        { key: "bankName", label: "Bank Name", labelAr: "اسم البنك", type: "text", placeholder: "e.g. CIB, NBE, QNB", required: true, icon: Banknote },
        { key: "bankAccount", label: "Bank Account (IBAN)", labelAr: "رقم الحساب البنكي (IBAN)", type: "text", placeholder: "EGXX XXXX XXXX XXXX XXXX XXXX", required: true, icon: CreditCard },
        { key: "paymobMerchantId", label: "Paymob Merchant ID (optional)", labelAr: "معرف تاجر بايموب (اختياري)", type: "text", placeholder: "Connect Paymob to receive instant payouts", required: false, icon: CreditCard, note: "You can connect later from your dashboard" },
      ],
    },
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
    legalNote: "Factoring companies must be licensed by the Egyptian Financial Regulatory Authority (FRA). FRA license number is mandatory. Paymob or bank API connection is required for fund disbursement.",
    legalNoteAr: "يجب أن تكون شركات التمويل مرخصة من هيئة الرقابة المالية المصرية. رقم ترخيص الهيئة إلزامي. الاتصال ببايموب أو API البنك مطلوب لصرف الأموال.",
    fields: {
      account: [
        { key: "name", label: "Full Name", labelAr: "الاسم الكامل", type: "text", placeholder: "Your full name", required: true, icon: User },
        { key: "email", label: "Business Email", labelAr: "البريد الإلكتروني", type: "email", placeholder: "you@funder.com", required: true, icon: Mail },
        { key: "password", label: "Password", labelAr: "كلمة المرور", type: "password", placeholder: "Min 8 characters", required: true, icon: Shield },
        { key: "phone", label: "Phone Number", labelAr: "رقم الهاتف", type: "tel", placeholder: "+20 1XX XXX XXXX", required: true, icon: Phone },
        { key: "companyName", label: "Company Name", labelAr: "اسم الشركة", type: "text", placeholder: "e.g. Egyptian Factoring Co.", required: true, icon: Landmark },
        { key: "city", label: "City", labelAr: "المدينة", type: "text", placeholder: "e.g. Cairo", required: true, icon: MapPin },
      ],
      legal: [
        { key: "taxId", label: "Tax ID (الرقم الضريبي)", labelAr: "الرقم الضريبي", type: "text", placeholder: "e.g. 123-456-789", required: true, icon: Hash },
        { key: "commercialReg", label: "Commercial Registration No.", labelAr: "رقم السجل التجاري", type: "text", placeholder: "e.g. CR-12345", required: true, icon: FileText },
        { key: "licenseNumber", label: "FRA License Number", labelAr: "رقم ترخيص هيئة الرقابة المالية", type: "text", placeholder: "e.g. FRA-2024-001", required: true, icon: FileCheck, note: "Mandatory — must be valid FRA license" },
      ],
      banking: [
        { key: "bankName", label: "Bank Name", labelAr: "اسم البنك", type: "text", placeholder: "e.g. CIB, NBE, QNB", required: true, icon: Banknote },
        { key: "bankAccount", label: "Bank Account (IBAN)", labelAr: "رقم الحساب البنكي (IBAN)", type: "text", placeholder: "EGXX XXXX XXXX XXXX XXXX XXXX", required: true, icon: CreditCard },
        { key: "paymobMerchantId", label: "Paymob Merchant ID (optional)", labelAr: "معرف تاجر بايموب (اختياري)", type: "text", placeholder: "Connect Paymob for instant disbursement", required: false, icon: CreditCard, note: "You can connect later from your dashboard" },
      ],
    },
  },
  logistics: {
    role: "LOGISTICS",
    label: "Logistics Provider",
    labelAr: "شركة لوجستيات",
    icon: Truck,
    color: "#D4A843",
    description: "Shared-route optimization, GPS tracking, auto-settlement on delivery",
    descriptionAr: "تحسين المسارات المشتركة، تتبع GPS، تسوية تلقائية عند التليم",
    dashboard: LogisticsDashboardMockup,
    legalNote: "Logistics providers must provide valid Commercial Registration, Tax ID, and bank account for settlement. Coverage areas determine your route assignments.",
    legalNoteAr: "يجب على شركات اللوجستيات تقديم سجل تجاري ورقم ضريبي وحساب بنكي ساري. مناطق التغطية تحدد تعيينات المسارات.",
    fields: {
      account: [
        { key: "name", label: "Full Name", labelAr: "الاسم الكامل", type: "text", placeholder: "Your full name", required: true, icon: User },
        { key: "email", label: "Business Email", labelAr: "البريد الإلكتروني", type: "email", placeholder: "you@logistics.com", required: true, icon: Mail },
        { key: "password", label: "Password", labelAr: "كلمة المرور", type: "password", placeholder: "Min 8 characters", required: true, icon: Shield },
        { key: "phone", label: "Phone Number", labelAr: "رقم الهاتف", type: "tel", placeholder: "+20 1XX XXX XXXX", required: true, icon: Phone },
        { key: "companyName", label: "Company Name", labelAr: "اسم الشركة", type: "text", placeholder: "e.g. Shark-Breaker Logistics", required: true, icon: Truck },
        { key: "city", label: "City", labelAr: "المدينة", type: "text", placeholder: "e.g. Cairo", required: true, icon: MapPin },
      ],
      legal: [
        { key: "taxId", label: "Tax ID (الرقم الضريبي)", labelAr: "الرقم الضريبي", type: "text", placeholder: "e.g. 123-456-789", required: true, icon: Hash },
        { key: "commercialReg", label: "Commercial Registration No.", labelAr: "رقم السجل التجاري", type: "text", placeholder: "e.g. CR-12345", required: true, icon: FileText },
      ],
      banking: [
        { key: "bankName", label: "Bank Name", labelAr: "اسم البنك", type: "text", placeholder: "e.g. CIB, NBE, QNB", required: true, icon: Banknote },
        { key: "bankAccount", label: "Bank Account (IBAN)", labelAr: "رقم الحساب البنكي (IBAN)", type: "text", placeholder: "EGXX XXXX XXXX XXXX XXXX XXXX", required: true, icon: CreditCard },
        { key: "coverage", label: "Coverage Areas", labelAr: "مناطق التغطية", type: "text", placeholder: "e.g. Cairo, Hurghada, Sharm", required: true, icon: MapPin },
      ],
    },
  },
};

/* ─── Steps ─── */

type FormStep = "account" | "legal" | "banking" | "done";

const STEPS: { key: FormStep; label: string; labelAr: string }[] = [
  { key: "account", label: "Account", labelAr: "الحساب" },
  { key: "legal", label: "Legal Verification", labelAr: "التحقق القانوني" },
  { key: "banking", label: "Banking & Payouts", labelAr: "البنوك والمدفوعات" },
];

/* ─── Field Input Component ─── */

function FieldInput({
  field,
  value,
  onChange,
  color,
  error,
}: {
  field: { key: string; label: string; labelAr: string; type: string; placeholder: string; required: boolean; icon: React.ElementType; note?: string };
  value: string;
  onChange: (v: string) => void;
  color: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const Icon = field.icon;

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider flex items-center gap-1.5">
        <Icon size={12} className="text-white/25" />
        {field.label}
        {field.required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={field.type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border text-sm text-white placeholder:text-white/20 outline-none transition-all"
        style={{
          borderColor: focused ? color + "60" : error ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.06)",
          boxShadow: focused ? `0 0 0 2px ${color}20` : "none",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {field.note && (
        <p className="text-[10px] text-white/25 flex items-center gap-1">
          <Info size={10} />
          {field.note}
        </p>
      )}
      {error && (
        <p className="text-[10px] text-red-400 flex items-center gap-1">
          <AlertCircle size={10} />
          {error}
        </p>
      )}
      <p className="text-[10px] text-white/20" dir="rtl">{field.labelAr}</p>
    </div>
  );
}

/* ─── Registration Form ─── */

function SectorRegisterForm({ sector }: { sector: typeof SECTOR_CONFIG[string] }) {
  const [step, setStep] = useState<FormStep>("account");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Record<string, string>>({});

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setError("");
  };

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  const validateStep = (): boolean => {
    const errors: Record<string, string> = {};
    const fields = sector.fields[step as "account" | "legal" | "banking"];
    if (!fields) return true;

    for (const field of fields) {
      if (field.required && !form[field.key]?.trim()) {
        errors[field.key] = `${field.label} is required`;
      }
    }

    // Email format validation
    if (step === "account" && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password length validation
    if (step === "account" && form.password && form.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    // Tax ID format (Egyptian: 9+ digits, often with dashes)
    if (step === "legal" && form.taxId && form.taxId.replace(/-/g, "").length < 9) {
      errors.taxId = "Tax ID must be at least 9 digits";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    const idx = currentStepIndex;
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1].key);
    }
  };

  const prevStep = () => {
    const idx = currentStepIndex;
    if (idx > 0) {
      setStep(STEPS[idx - 1].key);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: sector.role.toLowerCase(),
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || "",
          accountType: "business",
          companyName: form.companyName || form.hotelName || "",
          taxId: form.taxId || "",
          commercialReg: form.commercialReg || "",
          city: form.city || "",
          governorate: form.coverage || "",
          bankName: form.bankName || "",
          bankAccount: form.bankAccount || "",
          paymobMerchantId: form.paymobMerchantId || "",
          licenseNumber: form.licenseNumber || "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRegistered(true);
      } else {
        setError(data.error || "Registration failed. Please try again.");
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
        <h2 className="text-xl font-medium text-white mb-2">Registration Submitted!</h2>
        <p className="text-sm text-white/40 mb-2">
          Your {sector.label} account has been created and is pending verification.
        </p>
        <p className="text-xs text-white/30 mb-6">
          We will verify your documents and activate your account within 24 hours. Check your email for updates.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium rounded-lg transition-all"
            style={{ backgroundColor: sector.color, color: "#07090f" }}
          >
            Go to Sign In <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    );
  }

  const currentFields = sector.fields[step as "account" | "legal" | "banking"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Step indicator */}
      <div className="px-8 pt-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-4">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 flex-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 transition-all"
                style={{
                  backgroundColor: i < currentStepIndex ? sector.color + "20" : i === currentStepIndex ? sector.color + "30" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${i <= currentStepIndex ? sector.color + "40" : "rgba(255,255,255,0.06)"}`,
                  color: i <= currentStepIndex ? sector.color : "rgba(255,255,255,0.3)",
                }}
              >
                {i < currentStepIndex ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <div className="hidden sm:block">
                <p className="text-[11px] font-medium" style={{ color: i <= currentStepIndex ? sector.color : "rgba(255,255,255,0.3)" }}>
                  {s.label}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-1" style={{ backgroundColor: i < currentStepIndex ? sector.color + "30" : "rgba(255,255,255,0.06)" }} />
              )}
            </div>
          ))}
        </div>
        <h2 className="text-lg font-medium text-white">
          {step === "account" && "Create Your Account"}
          {step === "legal" && "Legal Verification"}
          {step === "banking" && "Banking & Payout Setup"}
        </h2>
        <p className="text-[12px] text-white/30 mt-0.5" dir="rtl">
          {step === "account" && "أدخل بياناتك الأساسية لإنشاء الحساب"}
          {step === "legal" && "التحقق القانوني مطلوب للامتثال للفوترة الإلكترونية"}
          {step === "banking" && "بيانات الحساب البنكي لاستلام المدفوعات"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-4">
        {error && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Legal verification note on legal step */}
        {step === "legal" && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-[12px]" style={{ backgroundColor: sector.color + "08", border: `1px solid ${sector.color}20`, color: "rgba(255,255,255,0.5)" }}>
            <Shield size={14} className="mt-0.5 shrink-0" style={{ color: sector.color }} />
            <div>
              <p className="font-medium mb-1" style={{ color: sector.color }}>Document Verification Required</p>
              <p className="text-white/40">{sector.legalNote}</p>
              <p className="text-white/30 mt-1" dir="rtl">{sector.legalNoteAr}</p>
            </div>
          </div>
        )}

        {/* Banking note on banking step */}
        {step === "banking" && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-[12px]" style={{ backgroundColor: "rgba(255,176,0,0.06)", border: "1px solid rgba(255,176,0,0.15)", color: "rgba(255,255,255,0.5)" }}>
            <CreditCard size={14} className="mt-0.5 shrink-0 text-[#FFB000]" />
            <div>
              <p className="font-medium mb-1 text-[#FFB000]">Payout Account</p>
              <p className="text-white/40">
                {sector.role === "SUPPLIER" && "Your bank account will receive payouts from reverse factoring. Paymob connection enables instant settlement."}
                {sector.role === "FACTORING" && "Your bank account will be used for fund disbursement to suppliers. Paymob connection enables instant settlement."}
                {sector.role === "HOTEL" && "Your bank account will be used for payment processing and factoring settlements."}
                {sector.role === "LOGISTICS" && "Your bank account will receive delivery settlement payments."}
              </p>
            </div>
          </div>
        )}

        {currentFields?.map((field) => (
          <FieldInput
            key={field.key}
            field={field}
            value={form[field.key] || ""}
            onChange={(v) => updateForm(field.key, v)}
            color={sector.color}
            error={fieldErrors[field.key]}
          />
        ))}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          {currentStepIndex > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStepIndex < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all active:scale-[0.98]"
              style={{ backgroundColor: sector.color, color: "#000000" }}
            >
              Continue <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ backgroundColor: sector.color, color: "#000000" }}
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  Submit Registration
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}

/* ─── Skeleton ─── */

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

/* ─── Page Components ─── */

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

              <p className="text-[13px] text-white/40 mb-2">{sector.description}</p>
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

                {/* Legal compliance badges */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { label: "ETA Compliant", icon: FileCheck },
                    { label: "FRA Registered", icon: Shield },
                    { label: "Bank-Grade Security", icon: CreditCard },
                    { label: "Paymob Connected", icon: Banknote },
                  ].map((badge) => (
                    <div
                      key={badge.label}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] text-white/30"
                      style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <badge.icon size={12} className="text-white/20" />
                      {badge.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
