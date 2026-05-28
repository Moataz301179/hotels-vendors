"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, Shield, AlertTriangle, Hotel, UserCog, MailCheck,
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
        else if (role === "HOTEL") router.push("/hotel");
        else if (role === "SUPPLIER") router.push("/supplier");
        else if (role === "FACTORING") router.push("/factoring");
        else router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resending) return;
    setResending(true);
    setResendMsg("");
    try {
      const res = await fetch("/api/v1/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResendMsg(data.message || "Verification email sent.");
    } catch {
      setResendMsg("Failed to resend. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Single centered logo */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8" style={{ background: "#050505", border: "1px solid #1A1A1A" }}>
          <BrandLogo variant="dark" size="xl" />
        </div>
        <h1 className="text-[28px] font-bold text-white tracking-[-0.02em]">Welcome back</h1>
        <p className="mt-3 text-[15px] text-white/40">Sign in to your HotelsVendors account</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-300">{error}</p>
            {error.includes("verify") && (
              <button onClick={handleResend} disabled={resending}
                className="mt-2 text-xs text-red-400 hover:text-red-300 underline transition-colors">
                {resending ? "Sending..." : "Resend verification email"}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {resendMsg && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3">
          <MailCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-300">{resendMsg}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-3 tracking-wide">Email or Username</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@hotel.com or Admin"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-[#1A1A1A] text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF66]/30 focus:bg-white/[0.05] transition-all"
              required />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-medium text-white/50 tracking-wide">Password</label>
            <Link href="/forgot-password" className="text-xs text-[#00FF66] hover:text-[#33FF88] transition-colors">Forgot?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/[0.03] border border-[#1A1A1A] text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#00FF66]/30 focus:bg-white/[0.05] transition-all"
              required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00FF66] hover:bg-[#33FF88] text-black text-[14px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            <>Sign In <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <div className="flex items-center gap-4 my-10">
        <div className="flex-1 h-px bg-[#1A1A1A]" />
        <span className="text-xs text-white/20">or</span>
        <div className="flex-1 h-px bg-[#1A1A1A]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/register/hotel"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#1A1A1A] bg-white/[0.02] text-white/60 text-[13px] font-medium hover:border-[#00FF66]/20 hover:text-white hover:bg-white/[0.04] transition-all">
          <Hotel className="w-3.5 h-3.5" /> Hotel Owner
        </Link>
        <Link href="/register/supplier"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#1A1A1A] bg-white/[0.02] text-white/60 text-[13px] font-medium hover:border-[#00FF66]/20 hover:text-white hover:bg-white/[0.04] transition-all">
          <UserCog className="w-3.5 h-3.5" /> Supplier
        </Link>
      </div>

      <div className="mt-10 text-center">
        <p className="text-[13px] text-white/20">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#00FF66] hover:text-[#33FF88] transition-colors font-medium">Get Started</Link>
        </p>
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-white/10">
          <Shield className="w-3 h-3" /> Bank-grade encryption
        </div>
      </div>
    </motion.div>
  );
}
