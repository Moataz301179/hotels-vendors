"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "lucide-react";

type StakeholderRole = "HOTEL" | "SUPPLIER" | "FACTORING" | "LOGISTICS";

const ROLES: { value: StakeholderRole; label: string; icon: React.ElementType; color: string }[] = [
  { value: "HOTEL", label: "Hotel / Property", icon: Hotel, color: "#39ff7e" },
  { value: "SUPPLIER", label: "Supplier / Vendor", icon: Store, color: "#ff7e1a" },
  { value: "FACTORING", label: "Factoring Company", icon: Landmark, color: "#c455ff" },
  { value: "LOGISTICS", label: "Logistics Provider", icon: Truck, color: "#64b5f6" },
];

const GOVERNORATES = [
  "Cairo", "Alexandria", "Giza", "Sharm El-Sheikh", "Hurghada", "Luxor", "Aswan",
  "Port Said", "Suez", "Ismailia", "Dakahlia", "Sharqia", "Qalyubia", "Gharbia",
  "Monufia", "Beheira", "Kafr El Sheikh", "Damietta", "Port Said", "North Sinai",
  "South Sinai", "Red Sea", "New Valley", "Matruh", "Fayoum", "Beni Suef",
  "Minya", "Assiut", "Sohag", "Qena", "Aswan", "Red Sea",
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
    role: initialRole as StakeholderRole,
    taxId: "",
    city: "",
    governorate: "",
  });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

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
    if (!form.taxId || !form.city || !form.governorate) {
      setError("Tax ID, City, and Governorate are required for business accounts");
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
          taxId: form.taxId,
          city: form.city,
          governorate: form.governorate,
          accountType: "business",
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
          <Store size={11} />
          Account Registration
        </div>
        <h1 className="text-[28px] font-semibold text-white tracking-[-0.02em]">
          Create Account
        </h1>
        <p className="mt-2 text-[14px] text-white/40">
          Join Egypt&apos;s leading B2B hospitality procurement platform.
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
              Tax ID <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
              <input
                type="text"
                value={form.taxId}
                onChange={(e) => updateForm("taxId", e.target.value)}
                placeholder="Egyptian Tax Identification Number"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all"
              />
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-white/50">
              City <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateForm("city", e.target.value)}
                placeholder="e.g. Cairo, Sharm El-Sheikh"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all"
              />
            </div>
          </div>

          {/* Governorate */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-white/50">
              Governorate <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
              <select
                value={form.governorate}
                onChange={(e) => updateForm("governorate", e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all appearance-none"
              >
                <option value="" className="bg-[#12121a] text-white/40">Select governorate</option>
                {GOVERNORATES.map((g) => (
                  <option key={g} value={g} className="bg-[#12121a] text-white">{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#39ff7e] text-[#07090f] text-[13px] font-semibold hover:bg-[#39ff7e]/90 disabled:opacity-50 transition-all hover:shadow-[0_0_20px_rgba(57,255,126,0.15)]"
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
