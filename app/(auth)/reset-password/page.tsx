"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

function PasswordStrength({ password }: { password: string }) {
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const labels = ["", "Weak", "Fair", "Strong"];
  const colors = ["", "var(--color-error, #F87171)", "var(--color-warning, #FBBF24)", "var(--color-success, #34D399)"];
  if (password.length === 0) return null;
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 flex gap-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ backgroundColor: level <= strength ? colors[strength] : "var(--border-subtle, rgba(255,255,255,0.06))" }}
          />
        ))}
      </div>
      <span className="text-[10px] font-medium" style={{ color: colors[strength] }}>{labels[strength]}</span>
    </div>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error || "Failed to reset password. Please try again.");
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
          <h1 className="text-lg font-bold tracking-tight text-white">HotelsVendors</h1>
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
          <h2 className="text-lg font-semibold" style={{ color: "var(--foreground, #FFFFFF)" }}>Create new password</h2>
          <p className="text-sm mt-1" style={{ color: "var(--foreground-muted, #6B7280)" }}>
            Enter a new password for your account.
          </p>
        </div>

        <div className="p-8">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "var(--color-success, rgba(52,211,153,0.1))", border: "1px solid var(--color-success, rgba(52,211,153,0.2))" }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: "var(--color-success, #34D399)" }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: "var(--foreground, #FFFFFF)" }}>Password updated</h3>
                <p className="text-sm mt-1" style={{ color: "var(--foreground-muted, #6B7280)" }}>
                  Your password has been reset successfully. Redirecting to sign in...
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text, #ffffff)" }}
              >
                Sign In Now
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
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--foreground-muted, #4B5563)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent-base)]/60 focus:ring-1 focus:ring-[var(--accent-base)]/20 transition-all"
                    style={{ backgroundColor: "var(--background)", border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))", color: "var(--foreground, #FFFFFF)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "var(--foreground-muted, #4B5563)" }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <PasswordStrength password={password} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--foreground-muted, #6B7280)" }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--foreground-muted, #4B5563)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent-base)]/60 focus:ring-1 focus:ring-[var(--accent-base)]/20 transition-all"
                    style={{ backgroundColor: "var(--background)", border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))", color: "var(--foreground, #FFFFFF)" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text, #ffffff)" }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Reset Password</span>
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
        <Link href="/login" className="font-medium transition-colors" style={{ color: "var(--accent-base)" }}>
          Back to Sign In
        </Link>
      </motion.p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="animate-pulse">
        <div className="rounded-2xl p-8" style={{ border: "1px solid var(--border-subtle, rgba(255,255,255,0.06))", backgroundColor: "var(--surface-raised, #111827)" }}>
          <div className="h-6 rounded w-1/3 mb-4" style={{ backgroundColor: "var(--surface, var(--background))" }} />
          <div className="h-12 rounded mb-4" style={{ backgroundColor: "var(--surface, var(--background))" }} />
          <div className="h-12 rounded" style={{ backgroundColor: "var(--surface, var(--background))" }} />
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
