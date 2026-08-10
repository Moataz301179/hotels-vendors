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

  const fieldCls = "w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-border-subtle text-foreground text-[14px] placeholder:text-foreground-muted focus:border-accent-base/30 focus:outline-none focus:ring-1 focus:ring-accent-base/10 transition-all";

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium uppercase tracking-[0.15em] mb-5" style={{ borderColor: "var(--border-accent)", background: "var(--accent-muted)", color: "var(--accent-base)" }}>
          <Lock size={11} />
          Secure Access
        </div>
        <h1 className="text-[28px] font-semibold text-foreground tracking-[-0.02em]">
          Sign In
        </h1>
        <p className="mt-2 text-[14px] text-foreground-secondary">
          Enter your credentials to access your procurement portal.
        </p>
      </div>

      <div className="rounded-2xl border border-subtle bg-surface-1 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-[13px]">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">
              Email or Username
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@hotel.com or admin"
                required
                className={fieldCls}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Min 6 characters"
                required
                minLength={6}
                className={fieldCls}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground-secondary transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-foreground-muted text-[13px] cursor-pointer hover:text-foreground-secondary transition-colors">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-border-subtle bg-white/[0.03] accent-accent-base" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-[13px] text-accent-base hover:opacity-80 transition-opacity font-medium">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-base text-surface text-[13px] font-semibold hover:bg-accent-dark disabled:opacity-50 transition-all hover:shadow-[0_0_20px_var(--accent-glow)]"
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

      <p className="text-center text-[13px] text-foreground-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-accent-base hover:opacity-80 font-medium transition-opacity">
          Create one
        </Link>
      </p>
    </div>
  );
}