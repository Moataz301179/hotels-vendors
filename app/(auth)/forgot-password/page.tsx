"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

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
    <div>
      {/* Mobile-only brand header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:hidden flex items-center gap-3 mb-8 justify-center"
      >
        <div>
          <h1 className="text-lg font-bold tracking-tight" style={{ color: "var(--foreground, #FFFFFF)" }}>HotelsVendors</h1>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--foreground-muted, #6B7280)" }}>
            B2B Procurement Egypt
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))", backgroundColor: "var(--surface-raised, #111827)" }}
      >
        <div className="px-8 pt-8 pb-6" style={{ borderBottom: "1px solid var(--border-subtle, rgba(255,255,255,0.06))" }}>
          <h2 className="text-lg font-semibold" style={{ color: "var(--foreground, #FFFFFF)" }}>Reset your password</h2>
          <p className="text-sm mt-1" style={{ color: "var(--foreground-muted, #6B7280)" }}>
            Enter your email and we will send you reset instructions.
          </p>
        </div>

        <div className="p-8">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "var(--color-success, rgba(52,211,153,0.1))", border: "1px solid var(--color-success, rgba(52,211,153,0.2))" }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: "var(--color-success, #34D399)" }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: "var(--foreground, #FFFFFF)" }}>Check your email</h3>
                <p className="text-sm mt-1" style={{ color: "var(--foreground-muted, #6B7280)" }}>
                  If an account exists for {email}, we have sent password reset instructions.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text, #ffffff)" }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm"
                  style={{ backgroundColor: "var(--color-error, rgba(239,68,68,0.1))", border: "1px solid var(--color-error, rgba(239,68,68,0.2))", color: "var(--color-error, #F87171)" }}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--foreground-muted, #6B7280)" }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--foreground-muted, #4B5563)" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@hotel.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent-base)]/60 focus:ring-1 focus:ring-[var(--accent-base)]/20 transition-all"
                    style={{ backgroundColor: "var(--background)", border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))", color: "var(--foreground, #FFFFFF)" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text, #ffffff)" }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm mt-6"
        style={{ color: "var(--foreground-muted, #4B5563)" }}
      >
        Remember your password?{" "}
        <Link href="/login" className="font-medium transition-colors" style={{ color: "var(--accent-base)" }}>
          Sign in
        </Link>
      </motion.p>
    </div>
  );
}
