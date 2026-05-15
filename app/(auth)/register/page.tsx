"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Check,
  AlertTriangle,
  Hotel,
  Store,
  Landmark,
  Truck,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

type StakeholderRole = "HOTEL" | "SUPPLIER" | "FACTORING" | "LOGISTICS";

const ROLES: { value: StakeholderRole; label: string; icon: React.ElementType }[] = [
  { value: "HOTEL", label: "Hotel / Property", icon: Hotel },
  { value: "SUPPLIER", label: "Supplier / Vendor", icon: Store },
  { value: "FACTORING", label: "Factoring Company", icon: Landmark },
  { value: "LOGISTICS", label: "Logistics Provider", icon: Truck },
];

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <RegisterPage />
    </Suspense>
  );
}

function RegisterSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] p-8 space-y-5">
        <div className="h-6 bg-white/[0.04] rounded w-1/3" />
        <div className="h-12 bg-white/[0.04] rounded" />
        <div className="h-12 bg-white/[0.04] rounded" />
        <div className="h-12 bg-white/[0.04] rounded" />
      </div>
    </div>
  );
}

function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "HOTEL" as StakeholderRole,
  });

  // Pre-select role from URL ?role= param
  useEffect(() => {
    const roleParam = searchParams.get("role");
    const validRoles: StakeholderRole[] = ["HOTEL", "SUPPLIER", "FACTORING", "LOGISTICS"];
    if (roleParam && validRoles.includes(roleParam.toUpperCase() as StakeholderRole)) {
      setForm((prev) => ({ ...prev, role: roleParam.toUpperCase() as StakeholderRole }));
    }
  }, [searchParams]);

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

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.role.toLowerCase(),
          name: form.name,
          email: form.email,
          password: form.password,
          accountType: "business",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRegistered(true);
        // Auto-redirect to login after 2 seconds
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

  return (
    <div>
      {/* Mobile-only brand header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:hidden flex items-center gap-3 mb-8 justify-center"
      >
        <BrandLogo variant="dark" size="md" />
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">Hotels Vendors</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">
            Digital Procurement Hub
          </p>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]"
      >
        {registered ? (
          <div className="p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto"
            >
              <Check className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <div>
              <h2 className="text-xl font-semibold text-white">Welcome aboard, {form.name}!</h2>
              <p className="text-sm text-white/50 mt-2 max-w-sm mx-auto">
                Your account has been created successfully. Redirecting you to sign in...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
              <h2 className="text-lg font-semibold text-white">Create your account</h2>
              <p className="text-sm text-white/40 mt-1">
                Quick signup — only name, email & password required
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400"
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => updateForm("role", role.value)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                          form.role === role.value
                            ? "bg-[#8B0000]/15 border-[#8B0000]/40 text-[#ff6b6b]"
                            : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:text-white/80 hover:border-white/[0.12]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {role.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8B0000]/60 focus:ring-1 focus:ring-[#8B0000]/20 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8B0000]/60 focus:ring-1 focus:ring-[#8B0000]/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8B0000]/60 focus:ring-1 focus:ring-[#8B0000]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#8B0000] hover:bg-[#6B0000] text-white text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(139,0,0,0.2)]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-white/30 mt-6"
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#ff6b6b] hover:text-[#ff9999] font-medium transition-colors"
        >
          Sign in
        </Link>
      </motion.p>
    </div>
  );
}
