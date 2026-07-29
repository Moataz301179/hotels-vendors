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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14b8a6]/[0.08] border border-[#14b8a6]/15 text-[#14b8a6] text-[11px] font-medium uppercase tracking-[0.15em] mb-5">
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
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#14b8a6]/30 focus:outline-none focus:ring-1 focus:ring-[#14b8a6]/10 transition-all"
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
                className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#14b8a6]/30 focus:outline-none focus:ring-1 focus:ring-[#14b8a6]/10 transition-all"
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
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/10 bg-white/[0.03] accent-[#14b8a6]" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-[13px] text-[#14b8a6] hover:opacity-80 transition-opacity font-medium">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#14b8a6] text-[#07090f] text-[13px] font-semibold hover:bg-[#14b8a6]/90 disabled:opacity-50 transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]"
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

      {/* Footer */}
      <p className="text-center text-[13px] text-white/30">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[#14b8a6] hover:opacity-80 font-medium transition-opacity">
          Create one
        </Link>
      </p>
    </div>
  );
}
