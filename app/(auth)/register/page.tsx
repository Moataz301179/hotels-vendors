"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertTriangle,
  Hotel,
  Store,
  Landmark,
  Truck,
  Loader2,
  CheckCircle2,
} from "lucide-react";

type StakeholderRole = "HOTEL" | "SUPPLIER" | "FACTORING" | "LOGISTICS";

const ROLES: { value: StakeholderRole; label: string; icon: React.ElementType }[] = [
  { value: "HOTEL", label: "Hotel / Property", icon: Hotel },
  { value: "SUPPLIER", label: "Supplier / Vendor", icon: Store },
  { value: "FACTORING", label: "Factoring Company", icon: Landmark },
  { value: "LOGISTICS", label: "Logistics Provider", icon: Truck },
];

export default function RegisterPage() {
  const router = useRouter();
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
      <main className="min-h-screen bg-black">
        <section className="relative pt-36 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="w-20 h-20 rounded-full bg-[#84cc16]/10 border border-[#84cc16]/20 flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={40} className="text-[#84cc16]" />
                </div>
                <h1 className="text-[28px] font-medium text-white mb-4">Welcome aboard, {form.name}!</h1>
                <p className="text-white/40 text-[15px] mb-10 max-w-md mx-auto">
                  Your account has been created successfully. Redirecting you to sign in...
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative pt-36 pb-16 border-b border-white/[0.04]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(132,204,22,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/60 text-[11px] font-medium uppercase tracking-[0.15em] mb-6">
              <Store className="w-3 h-3" />
              Account Registration
            </div>
            <h1 className="text-[32px] md:text-[44px] font-medium text-white leading-[1.1] tracking-[-0.02em]">
              Create Your
              <br />
              <span className="text-[#84cc16]">HotelsVendors Account</span>
            </h1>
            <p className="mt-5 text-[15px] text-white/40 leading-relaxed max-w-lg">
              Join Egypt&apos;s leading B2B hospitality procurement platform. Connect with verified suppliers, streamline procurement, and unlock embedded financing.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-2xl">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-white/[0.04]">
              <h2 className="text-[15px] font-medium text-white flex items-center gap-2.5">
                <User size={18} className="text-white/40" />
                Create Account
              </h2>
              <p className="text-[13px] text-white/35 mt-1.5">
                Quick signup — only name, email & password required
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-[13px]"
                >
                  <AlertTriangle size={14} />
                  {error}
                </motion.div>
              )}

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-white/50">I am a...</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => updateForm("role", role.value)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[13px] font-medium transition-all ${
                          form.role === role.value
                            ? "bg-[#84cc16] text-black border-[#84cc16]"
                            : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.10]"
                        }`}
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-white/[0.15] focus:outline-none transition-colors"
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-white/[0.15] focus:outline-none transition-colors"
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
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-white/[0.15] focus:outline-none transition-colors"
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#84cc16] text-black text-[13px] font-medium hover:bg-[#a3e635] disabled:opacity-50 transition-colors"
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
          <p className="text-center text-[13px] text-white/30 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#84cc16] hover:opacity-80 font-medium transition-opacity">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
