"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Hotel,
  UserCog,
  Store,
  Landmark,
  Truck,
  Loader2,
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39ff7e]/[0.08] border border-[#39ff7e]/15 text-[#39ff7e] text-[11px] font-medium uppercase tracking-[0.15em] mb-5">
          <Lock size={11} />
          Secure Access
        </div>
        <h1 className="text-[28px] font-semibold text-white tracking-[-0.02em]">
          Sign In
        </h1>
        <p className="mt-2 text-[14px] text-white/40">
          Enter your credentials to access your procurement portal.
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

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-white/50">
              Email or Username
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@hotel.com or admin"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-white/50">
              Password
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

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-white/35 text-[13px] cursor-pointer hover:text-white/50 transition-colors">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/10 bg-white/[0.03] accent-[#39ff7e]" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-[13px] text-[#39ff7e] hover:opacity-80 transition-opacity font-medium">
              Forgot password?
            </Link>
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
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Demo Accounts */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#12121a] p-6">
        <h3 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-1">
          Quick Access
        </h3>
        <p className="text-[13px] text-white/30 mb-4">
          Explore the platform with a demo account:
        </p>
        <div className="grid grid-cols-1 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.label}
              type="button"
              onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-left hover:border-[#39ff7e]/20 hover:bg-[#39ff7e]/[0.03] transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-[#39ff7e]/[0.08] flex items-center justify-center shrink-0 transition-colors">
                <acc.icon size={14} className="text-white/40 group-hover:text-[#39ff7e]/70 transition-colors" />
              </div>
              <div className="min-w-0">
                <span className="block text-[13px] font-medium text-white/60 group-hover:text-white/80 transition-colors">{acc.label}</span>
                <span className="block text-[11px] text-white/25 truncate">{acc.email}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-[13px] text-white/30">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[#39ff7e] hover:opacity-80 font-medium transition-opacity">
          Create one
        </Link>
      </p>
    </div>
  );
}
