"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

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
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/hotel");
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
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#800000]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#800000]/3 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-8"
        >
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#800000]/15 border border-[#800000]/25 flex items-center justify-center">
              <Image src="/logo-horse-only.png" alt="Hotels Vendors" width={32} height={32} className="opacity-90" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Hotels Vendors</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Digital Procurement Hub</p>
            </div>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
            <h2 className="text-lg font-semibold">Welcome back</h2>
            <p className="text-sm text-white/40 mt-1">Sign in to your procurement portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hotel.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#800000]/50 focus:shadow-[0_0_0_3px_rgba(128,0,0,0.1)] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#800000]/50 focus:shadow-[0_0_0_3px_rgba(128,0,0,0.1)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-white/40 cursor-pointer hover:text-white/60 transition-colors">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/20 bg-white/[0.04] accent-[#800000]" />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[#ff4d4d] hover:text-[#ff6666] transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#800000] hover:bg-[#990000] text-white text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
              <span className="text-[10px] text-white/20 uppercase tracking-wider">or continue with</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* Demo credentials */}
            <div className="space-y-2">
              <p className="text-[10px] text-center text-white/20 uppercase tracking-wider">Demo Accounts</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Hotel", email: "hotel.owner@nilegrand.com", pass: "HotelOwner123!" },
                  { label: "Admin", email: "admin@hotelsvendors.com", pass: "Admin123!" },
                ].map((acc) => (
                  <button
                    key={acc.label}
                    type="button"
                    onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                    className="px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs text-white/50 hover:text-white/80 hover:border-white/[0.12] transition-colors text-center"
                  >
                    <span className="block font-medium">{acc.label}</span>
                    <span className="block text-[10px] text-white/30 mt-0.5 truncate">{acc.email}</span>
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
          className="text-center text-sm text-white/30 mt-6"
        >
          Don't have an account?{" "}
          <Link href="/register" className="text-[#ff4d4d] hover:text-[#ff6666] font-medium transition-colors">
            Create account
          </Link>
        </motion.p>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-4 text-[10px] text-white/20"
        >
          <Shield className="w-3 h-3" />
          <span>Secured with JWT + RBAC + ETA Compliance</span>
        </motion.div>
      </div>
    </div>
  );
}
