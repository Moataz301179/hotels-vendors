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
  ArrowRight,
  Shield,
  AlertTriangle,
  Hotel,
  UserCog,
  Store,
  Landmark,
  Truck,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const resolvedEmail = email.toLowerCase() === "admin" ? "admin@hotelsvendors.com" : email;
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resolvedEmail, password }),
      });
      const data = await res.json();

      if (data.success) {
        const role = data.user?.platformRole;
        if (role === "ADMIN") router.push("/admin");
        else if (role === "SUPPLIER") router.push("/supplier");
        else if (role === "FACTORING") router.push("/factoring");
        else if (role === "SHIPPING") router.push("/shipping");
        else router.push("/hotel");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const DEMO_ACCOUNTS = [
    { label: "Hotel", icon: Hotel, email: "hotel.owner@nilegrand.com", pass: "HotelOwner123!" },
    { label: "Supplier", icon: Store, email: "supplier@freshfoods.com", pass: "Supplier123!" },
    { label: "Factoring", icon: Landmark, email: "fund@cib.com.eg", pass: "Factor123!" },
    { label: "Logistics", icon: Truck, email: "ops@sharkbreaker.com", pass: "Logistics123!" },
    { label: "Admin", icon: UserCog, email: "admin", pass: "1234Harly" },
  ];

  return (
    <main className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative pt-36 pb-16 border-b border-white/[0.04]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(132,204,22,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/60 text-[11px] font-medium uppercase tracking-[0.15em] mb-6">
              <Shield className="w-3 h-3" />
              Secure Access
            </div>
            <h1 className="text-[32px] md:text-[44px] font-medium text-white leading-[1.1] tracking-[-0.02em]">
              Welcome to
              <br />
              <span className="text-[#84cc16]">HotelsVendors</span>
            </h1>
            <p className="mt-5 text-[15px] text-white/40 leading-relaxed max-w-lg">
              Sign in to access your procurement portal, manage orders, track invoices, and connect with verified suppliers across Egypt.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Login Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-white/[0.04]">
                <h2 className="text-[15px] font-medium text-white flex items-center gap-2.5">
                  <Lock size={18} className="text-white/40" />
                  Sign In
                </h2>
                <p className="text-[13px] text-white/35 mt-1.5">
                  Enter your credentials to access your account
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

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-white/50">
                    Email or Username <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="you@hotel.com or admin"
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
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
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

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-white/35 text-[13px] cursor-pointer hover:text-white/50 transition-colors">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/10 bg-white/[0.03] accent-[#84cc16]" />
                    Remember me
                  </label>
                  <Link href="/forgot-password" className="text-[13px] text-[#84cc16] hover:opacity-80 transition-opacity font-medium">
                    Forgot password?
                  </Link>
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
                      Sign In
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Demo Accounts */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6">
                <h3 className="text-[12px] font-medium text-white/30 uppercase tracking-wider mb-4">Quick Access</h3>
                <p className="text-[13px] text-white/35 mb-5">Use a demo account to explore the platform:</p>
                <div className="space-y-2">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.label}
                      type="button"
                      onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-left hover:border-white/[0.12] hover:bg-white/[0.04] transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                        <acc.icon size={14} className="text-white/40" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[13px] font-medium text-white/60">{acc.label}</span>
                        <span className="block text-[11px] text-white/25 truncate">{acc.email}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
