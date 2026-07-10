"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2, KeyRound, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setSent(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative pt-36 pb-16 border-b border-white/[0.04]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(132,204,22,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/60 text-[11px] font-medium uppercase tracking-[0.15em] mb-6">
              <KeyRound className="w-3 h-3" />
              Password Reset
            </div>
            <h1 className="text-[32px] md:text-[44px] font-medium text-white leading-[1.1] tracking-[-0.02em]">
              Reset Your
              <br />
              <span className="text-[#84cc16]">Password</span>
            </h1>
            <p className="mt-5 text-[15px] text-white/40 leading-relaxed max-w-lg">
              Enter your registered email and we will send you password reset instructions.
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
                <Mail size={18} className="text-white/40" />
                Reset Password
              </h2>
              <p className="text-[13px] text-white/35 mt-1.5">
                Enter your email to receive reset instructions
              </p>
            </div>

            <div className="p-8">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-[#84cc16]/10 border border-[#84cc16]/20 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} className="text-[#84cc16]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Check your email</h3>
                    <p className="text-white/35 text-[13px] mt-1">
                      If an account exists for {email}, we have sent password reset instructions.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/60 text-[13px] font-medium hover:bg-white/[0.04] transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Back to Sign In
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
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

                  <div className="space-y-2">
                    <label className="block text-[13px] font-medium text-white/50">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/15" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        placeholder="you@hotel.com"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-white/[0.15] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#84cc16] text-black text-[13px] font-medium hover:bg-[#a3e635] disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[13px] text-white/30 mt-6">
            Remember your password?{" "}
            <Link href="/login" className="text-[#84cc16] hover:opacity-80 font-medium transition-opacity">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
