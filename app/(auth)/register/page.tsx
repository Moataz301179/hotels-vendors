"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SupplierOnboardingBot } from "@/components/ai-assistant/supplier-onboarding-chatbot";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Hotel,
  Store,
  Landmark,
  Truck,
  Loader2,
  CheckCircle2,
  MapPin,
  Building2,
  Home,
  Building,
  Users,
} from "lucide-react";
import { HOVIN_PILOT_CODE } from "@/lib/onboarding/hovin";

type StakeholderRole = "HOTEL" | "SUPPLIER" | "FACTORING" | "LOGISTICS";
type PropertyType = "SINGLE" | "CHAIN" | "MANAGEMENT";

const ROLES: { value: StakeholderRole; label: string; icon: React.ElementType; color: string }[] = [
  { value: "HOTEL", label: "Hotel / Property", icon: Hotel, color: "#39ff7e" },
  { value: "SUPPLIER", label: "Supplier / Vendor", icon: Store, color: "#ff7e1a" },
  { value: "FACTORING", label: "Factoring Company", icon: Landmark, color: "#c455ff" },
  { value: "LOGISTICS", label: "Logistics Provider", icon: Truck, color: "#64b5f6" },
];

const GOVERNORATES = [
  "Cairo", "Alexandria", "Giza", "Sharm El-Sheikh", "Hurghada", "Luxor", "Aswan",
  "Port Said", "Suez", "Ismailia", "Dakahlia", "Sharqia", "Qalyubia", "Gharbia",
  "Monufia", "Beheira", "Kafr El Sheikh", "Damietta", "North Sinai",
  "South Sinai", "Red Sea", "New Valley", "Matruh", "Fayoum", "Beni Suef",
  "Minya", "Assiut", "Sohag", "Qena",
];

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const initialRole = typeParam === "supplier" ? "SUPPLIER" : typeParam === "hotel" ? "HOTEL" : "HOTEL";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: HOVIN_PILOT_CODE,
    role: initialRole as StakeholderRole,
    taxId: "",
    city: "",
    governorate: "",
    propertyType: "SINGLE" as PropertyType,
    numberOfProperties: "1",
    marketingConsent: false,
    termsAccepted: false,
  });

  const updateForm = (field: string, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const isPilotReferral = form.referralCode.trim().toUpperCase() === HOVIN_PILOT_CODE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    if (!isPilotReferral && (!form.taxId || !form.city || !form.governorate)) {
      setError("Tax ID, City, and Governorate are required for business accounts");
      setLoading(false);
      return;
    }
    if (!form.termsAccepted) {
      setError("You must accept the Terms of Service and Privacy Policy");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.role.toLowerCase(),
          name: form.name,
          email: form.email,
          password: form.password,
          referralCode: form.referralCode,
          taxId: form.taxId,
          city: form.city,
          governorate: form.governorate,
          accountType: "business",
          marketingConsent: form.marketingConsent,
          termsAccepted: form.termsAccepted,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRegistered(true);
        setTimeout(() => router.push("/login"), 2000);
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
      <div className="text-center space-y-6 py-8">
        <div className="w-20 h-20 rounded-full bg-[#39ff7e]/10 border border-[#39ff7e]/20 flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} className="text-[#39ff7e]" />
        </div>
        <div>
          <h1 className="text-[24px] font-semibold text-white mb-2">Welcome aboard, {form.name}!</h1>
          <p className="text-white/40 text-[14px]">
            Your account has been created. Redirecting you to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39ff7e]/[0.08] border border-[#39ff7e]/15 text-[#39ff7e] text-[11px] font-medium uppercase tracking-[0.15em] mb-5">
          {form.role === "HOTEL" ? <Hotel size={11} /> : form.role === "SUPPLIER" ? <Store size={11} /> : form.role === "FACTORING" ? <Landmark size={11} /> : <Truck size={11} />}
          {form.role === "HOTEL" ? "Hotel Registration" : form.role === "SUPPLIER" ? "Supplier Registration" : form.role === "FACTORING" ? "Factoring Registration" : "Logistics Registration"}
        </div>
        <h1 className="text-[28px] font-semibold text-white tracking-[-0.02em]">
          Create Account
        </h1>
        <p className="mt-2 text-[14px] text-white/40">
          {form.role === "HOTEL" 
            ? "Join Egypt's leading B2B hospitality procurement platform. Net-60 terms via Oliv."
            : form.role === "SUPPLIER"
            ? "List your products, reach 480+ hotels, get paid in 48 hours via Oliv."
            : "Join Egypt's leading B2B hospitality procurement platform."}
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#12121a] p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-[13px]">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-white/50">
              Referral Code <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
              <input
                type="text"
                value={form.referralCode}
                onChange={(e) => updateForm("referralCode", e.target.value)}
                placeholder="CHV000"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all"
              />
            </div>
            <p className="text-[11px] text-white/30">
              HOVIN pilot access code for the first manual onboarding group.
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-white/50">I am a...</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = form.role === role.value;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => updateForm("role", role.value)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[13px] font-medium transition-all ${
                      isSelected
                        ? "text-[#07090f] border-transparent"
                        : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.10]"
                    }`}
                    style={isSelected ? { backgroundColor: role.color, borderColor: role.color } : {}}
                  >
                    <Icon size={14} />
                    {role.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-white/50">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                placeholder="Your full name"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-white/50">
              Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-white/50">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => updateForm("password", e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
                className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Tax ID */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-white/50">
              Tax ID <span className="text-white/25">(pilot optional)</span>
            </label>
            <div className="relative">
              <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
              <input
                type="text"
                value={form.taxId}
                onChange={(e) => updateForm("taxId", e.target.value)}
                placeholder="Egyptian Tax Identification Number"
                required={!isPilotReferral}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all"
              />
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-white/50">
              City <span className="text-white/25">(pilot optional)</span>
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateForm("city", e.target.value)}
                placeholder="e.g. Cairo, Sharm El-Sheikh"
                required={!isPilotReferral}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all"
              />
            </div>
          </div>

          {/* Governorate */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-white/50">
              Governorate <span className="text-white/25">(pilot optional)</span>
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
              <select
                value={form.governorate}
                onChange={(e) => updateForm("governorate", e.target.value)}
                required={!isPilotReferral}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all appearance-none"
              >
                <option value="" className="bg-[#12121a] text-white/40">Select governorate</option>
                {GOVERNORATES.map((g) => (
                  <option key={g} value={g} className="bg-[#12121a] text-white">{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Hotel-Specific Fields */}
          {form.role === "HOTEL" && (
            <>
              {/* Property Type */}
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-white/50">
                  Property Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "SINGLE", label: "Single Property", icon: Home, color: "#39ff7e" },
                    { value: "CHAIN", label: "Hotel Chain", icon: Building, color: "#4A7C59" },
                    { value: "MANAGEMENT", label: "Management Co.", icon: Users, color: "#c455ff" },
                  ].map((pt) => {
                    const Icon = pt.icon;
                    const isSelected = form.propertyType === pt.value;
                    return (
                      <button
                        key={pt.value}
                        type="button"
                        onClick={() => updateForm("propertyType", pt.value)}
                        className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-[11px] font-medium transition-all ${
                          isSelected
                            ? "text-[#07090f] border-transparent"
                            : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.10]"
                        }`}
                        style={isSelected ? { backgroundColor: pt.color, borderColor: pt.color } : {}}
                      >
                        <Icon size={16} />
                        {pt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Number of Properties */}
              {(form.propertyType === "CHAIN" || form.propertyType === "MANAGEMENT") && (
                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-white/50">
                    Number of Properties <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
                    <select
                      value={form.numberOfProperties}
                      onChange={(e) => updateForm("numberOfProperties", e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all appearance-none"
                    >
                      <option value="1" className="bg-[#12121a] text-white">1 property</option>
                      <option value="2-5" className="bg-[#12121a] text-white">2-5 properties</option>
                      <option value="6-10" className="bg-[#12121a] text-white">6-10 properties</option>
                      <option value="11-20" className="bg-[#12121a] text-white">11-20 properties</option>
                      <option value="20+" className="bg-[#12121a] text-white">20+ properties</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Hotel Info Box */}
              <div className="rounded-xl p-4" style={{ backgroundColor: "#4A7C5908", border: "1px solid #4A7C5922" }}>
                <p className="text-[12px] text-white/40 leading-relaxed">
                  <strong style={{ color: "#4A7C59" }}>After registration:</strong> Connect your ETA token for compliant invoicing, then set up Oliv financing for Net-60 payment terms. Suppliers get paid instantly.
                </p>
              </div>
            </>
          )}

          {/* Supplier Info Box */}
          {form.role === "SUPPLIER" && (
            <div className="rounded-xl p-4" style={{ backgroundColor: "#ff7e1a08", border: "1px solid #ff7e1a22" }}>
              <p className="text-[12px] text-white/40 leading-relaxed">
                <strong style={{ color: "#ff7e1a" }}>7-day free trial:</strong> Full access to all features — list products, receive orders, apply for Oliv financing. <strong>Transactional fees</strong> (factoring, commissions) still apply during trial. No commitment required.
              </p>
            </div>
          )}

          {/* Consent Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(e) => updateForm("termsAccepted", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/[0.03] text-[#39ff7e] focus:ring-[#39ff7e]/20"
              />
              <span className="text-[12px] text-white/40 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-[#39ff7e] hover:opacity-80 underline underline-offset-2">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-[#39ff7e] hover:opacity-80 underline underline-offset-2">Privacy Policy</Link>
                <span className="text-red-400 ml-0.5">*</span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.marketingConsent}
                onChange={(e) => updateForm("marketingConsent", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/[0.03] text-[#39ff7e] focus:ring-[#39ff7e]/20"
              />
              <span className="text-[12px] text-white/40 leading-relaxed">
                I agree to receive marketing communications about products, services, and promotions. You can withdraw consent at any time.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold disabled:opacity-50 transition-all hover:shadow-[0_0_20px_rgba(57,255,126,0.15)]"
            style={{
              backgroundColor: form.role === "HOTEL" ? "#4A7C59" : form.role === "SUPPLIER" ? "#ff7e1a" : form.role === "FACTORING" ? "#c455ff" : "#64b5f6",
              color: "#ffffff",
            }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* AI Onboarding Chatbot */}
      <SupplierOnboardingBot />

      {/* Footer */}
      <p className="text-center text-[13px] text-white/30">
        Already have an account?{" "}
        <Link href="/login" className="text-[#39ff7e] hover:opacity-80 font-medium transition-opacity">
          Sign in
        </Link>
      </p>
    </div>
  );
}