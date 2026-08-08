"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Smartphone,
  Send,
  Timer,
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP login mode
  const [useOtp, setUseOtp] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);

  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const resolvedEmail = email.toLowerCase() === "admin" ? "admin@hotelsvendors.com" : email;
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: resolvedEmail, password }),
      });
      const data = await res.json();

      if (data.success) {
        const role = data.user?.platformRole;
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
        }
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

  const handleSendOtp = async () => {
    if (!otpPhone) {
      setOtpError("Please enter your mobile number");
      return;
    }

    setLoading(true);
    setOtpError("");

    try {
      const res = await fetch("/api/v1/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: otpPhone, purpose: "LOGIN" }),
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtpCooldown(60);
        if (data.devCode) setDevOtpCode(data.devCode);
      } else {
        setOtpError(data.error || "Failed to send code");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter the 6-digit code");
      return;
    }

    setLoading(true);
    setOtpError("");

    try {
      const res = await fetch("/api/v1/auth/otp-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: otpPhone, code: otpCode }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
        }
        const role = data.user?.platformRole;
        if (role === "ADMIN") router.push("/admin");
        else if (role === "SUPPLIER") router.push("/supplier");
        else if (role === "FACTORING") router.push("/factoring");
        else if (role === "SHIPPING") router.push("/shipping");
        else router.push("/hotel");
      } else {
        setOtpError(data.error || "Invalid code or account not found");
      }
    } catch {
      setOtpError("Network error. Please try again.");
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
              Email or Mobile Number
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@hotel.com or +201012345678"
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

          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center"><div className="flex-1 border-t border-white/[0.06]"></div></div>
            <div className="relative flex justify-center text-[11px] text-foreground-muted uppercase tracking-[0.15em]">
              Or continue with
            </div>
            <div className="absolute inset-0 flex items-center"><div className="flex-1 border-t border-white/[0.06]"></div></div>
          </div>

          {!useOtp ? (
            <button
              type="button"
              onClick={() => setUseOtp(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/[0.06] text-[13px] font-medium text-foreground hover:bg-white/[0.03] transition-all"
            >
              <Smartphone size={16} />
              Sign in with mobile & OTP
            </button>
          ) : (
            <div className="space-y-3">
              {!otpSent ? (
                <>
                  <div className="relative">
                    <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                    <input
                      type="tel"
                      inputMode="tel"
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value)}
                      placeholder="+20 10 1234 5678"
                      className={fieldCls}
                    />
                  </div>
                  {otpError && (
                    <p className="text-[12px] text-red-400">{otpError}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || !otpPhone}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-base text-surface text-[13px] font-semibold hover:bg-accent-dark disabled:opacity-50 transition-all"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Send verification code
                  </button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit code"
                    maxLength={6}
                    className={fieldCls}
                  />
                  </div>
                  {devOtpCode && (
                    <p className="text-[11px] text-foreground-muted">
                      Dev code: <span className="font-mono text-accent-base">{devOtpCode}</span>
                    </p>
                  )}
                  {otpError && (
                    <p className="text-[12px] text-red-400">{otpError}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleOtpLogin}
                    disabled={loading || otpCode.length !== 6}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-base text-surface text-[13px] font-semibold hover:bg-accent-dark disabled:opacity-50 transition-all"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    Sign In with OTP
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || otpCooldown > 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[12px] text-foreground-muted hover:border-accent-base/20 transition-all disabled:opacity-50"
                  >
                    {otpCooldown > 0 ? (
                      <>
                        <Timer size={12} className="animate-pulse" />
                        Resend in {otpCooldown}s
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        Resend code
                      </>
                    )}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => { setUseOtp(false); setOtpSent(false); setOtpCode(""); setOtpError(""); setDevOtpCode(null); }}
                className="text-[12px] text-foreground-muted hover:text-foreground-secondary text-center w-full"
              >
                Back to password login
              </button>
            </div>
          )}
        </form>
      </div>

      <p className="text-center text-[13px] text-foreground-muted">
        Don&apos;t have an account? Your account works on both Web and INVO Mobile.
      </p>
      <div className="flex justify-center gap-3 mt-3">
        <Link href="/register?type=hotel" className="px-4 py-2 rounded-lg border border-white/[0.08] text-[12px] font-medium text-white/60 hover:text-white hover:border-white/[0.15] transition-all">
          Register as Hotel
        </Link>
        <Link href="/register?type=supplier" className="px-4 py-2 rounded-lg border border-white/[0.08] text-[12px] font-medium text-white/60 hover:text-white hover:border-white/[0.15] transition-all">
          Register as Supplier
        </Link>
      </div>
    </div>
  );
}