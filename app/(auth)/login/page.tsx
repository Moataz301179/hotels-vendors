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
  Store,
  Landmark,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20" style={{ backgroundColor: "#000000" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8 justify-center"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#84cc16" }}>
            <span className="text-black font-bold text-lg">HV</span>
          </div>
          <div>
            <h1 className="text-lg font-medium tracking-tight text-white">HotelsVendors</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">B2B Procurement Egypt</p>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
            <h2 className="text-lg font-medium text-white">Welcome back</h2>
            <p className="text-sm text-white/40 mt-1">
              Sign in to your procurement portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm"
                style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {resendMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm"
                style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22C55E" }}
              >
                <MailCheck className="w-4 h-4 flex-shrink-0" />
                <span>{resendMsg}</span>
              </motion.div>
            )}

            {/* Email / Username */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hotel.com or admin"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#84cc16]/60 focus:ring-1 focus:ring-[#84cc16]/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#84cc16]/60 focus:ring-1 focus:ring-[#84cc16]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-white/40 cursor-pointer hover:text-white/60 transition-colors">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-white/10 bg-white/[0.03] accent-[#84cc16]"
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
                  className="text-white/30 hover:text-white/50 transition-colors font-medium disabled:opacity-50"
                >
                  {resending ? "Sending..." : "Resend verification"}
                </button>
                <Link
                  href="/forgot-password"
                  className="text-[#84cc16] hover:opacity-80 transition-opacity font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(132,204,22,0.15)]"
              style={{ backgroundColor: "#84cc16", color: "#000000" }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
              <span className="text-[10px] text-white/20 uppercase tracking-wider">
                or continue with
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <p className="text-[11px] text-center text-white/20">
              Need an account?{" "}
              <Link href="/register" className="text-[#D4A843] hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-white/30 mt-6"
        >
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#84cc16] hover:opacity-80 font-medium transition-opacity">
            Create account
          </Link>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-4 text-[10px] text-white/20"
        >
          <Shield className="w-3 h-3" />
          <span>Secured with JWT + RBAC + Email Verification</span>
        </motion.div>
      </div>
    </div>
  );
}
