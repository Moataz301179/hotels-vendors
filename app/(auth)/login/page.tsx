"use client";

import { useState } from "react";
import Link from "next/link";
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
  MailCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/layout/brand-logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const resolvedEmail = email.toLowerCase() === "admin" ? "Admin" : email;
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
          <h1 className="text-lg font-bold tracking-tight text-white">HotelsVendors</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            B2B Procurement Egypt
          </p>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="rounded-2xl border border-white/[0.06] bg-[#111827] overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-white">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your procurement portal
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

          {resendMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400"
            >
              <MailCheck className="w-4 h-4 flex-shrink-0" />
              <span>{resendMsg}</span>
            </motion.div>
          )}

          {/* Email / Username */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hotel.com or admin"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#0B0F1A] border border-white/[0.06] text-sm text-white placeholder:text-gray-600 outline-none focus:border-accent-base/60 focus:ring-1 focus:ring-accent-base/20 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-[#0B0F1A] border border-white/[0.06] text-sm text-white placeholder:text-gray-600 outline-none focus:border-accent-base/60 focus:ring-1 focus:ring-accent-base/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-400 transition-colors">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-white/10 bg-[#0B0F1A] accent-accent-base"
              />
              <span>Remember me</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  const resolvedEmail = email === "admin" ? "admin@hotelsvendors.com" : email;
                  if (!resolvedEmail) { setError("Please enter your email first"); return; }
                  setResending(true);
                  setResendMsg("");
                  try {
                    const res = await fetch("/api/v1/auth/resend-verification", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: resolvedEmail }),
                    });
                    const data = await res.json();
                    setResendMsg(data.data?.message || "Verification email sent if account exists.");
                  } catch {
                    setResendMsg("Failed to send. Please try again.");
                  } finally {
                    setResending(false);
                  }
                }}
                disabled={resending}
                className="text-gray-600 hover:text-gray-400 transition-colors font-medium disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend verification"}
              </button>
              <Link
                href="/forgot-password"
                className="text-accent-base hover:text-accent-light transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent-base hover:bg-accent-light text-white text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[10px] text-gray-600 uppercase tracking-wider">
              or continue with
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Demo credentials */}
          <div className="space-y-2">
            <p className="text-[10px] text-center text-gray-600 uppercase tracking-wider">
              Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Hotel", icon: Hotel, email: "hotel.owner@nilegrand.com", pass: "HotelOwner123!" },
                { label: "Admin", icon: UserCog, email: "admin", pass: "1234Harly" },
              ].map((acc) => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-white/[0.06] bg-[#0B0F1A] text-xs text-gray-500 hover:text-gray-300 hover:border-white/[0.10] transition-all text-center"
                >
                  <acc.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <span className="block font-medium">{acc.label}</span>
                    <span className="block text-[10px] text-gray-600 mt-0.5 truncate">{acc.email}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </form>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-gray-600 mt-6"
      >
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-accent-base hover:text-accent-light font-medium transition-colors">
          Create account
        </Link>
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-700"
      >
        <Shield className="w-3 h-3" />
        <span>Secured with JWT + RBAC + Email Verification</span>
      </motion.div>
    </div>
  );
}
