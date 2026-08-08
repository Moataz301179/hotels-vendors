"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RoleBenefits } from "@/components/auth/role-benefits";
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight, Hotel, Store, Landmark, Truck,
  Loader2, CheckCircle2, Smartphone, Send, Timer, CheckCircle, Shield, Zap,
} from "lucide-react";

type StakeholderRole = "HOTEL" | "SUPPLIER" | "FACTORING" | "LOGISTICS";

const ROLES: { value: StakeholderRole; label: string; icon: React.ElementType; color: string; title: string; desc: string; cta: string; }[] = [
  { value: "HOTEL", label: "Hotel / Property", icon: Hotel, color: "var(--accent-base)", title: "Create Hotel Account", desc: "Register your hotel or property group to run RFQs, approvals, and ETA-compliant procurement on the web — no mobile required.", cta: "Create Hotel Account" },
  { value: "SUPPLIER", label: "Supplier / Vendor", icon: Store, color: "var(--orange-base)", title: "Create Supplier Account", desc: "Register on the web or the INVO app — your account works across both. List products, receive orders, and cash out in 48h.", cta: "Create Supplier Account" },
  { value: "FACTORING", label: "Factoring Company", icon: Landmark, color: "var(--purple-base)", title: "Create Factoring Account", desc: "Join as a liquidity partner. Provide 48h invoice financing and earn returns on verified GRN-backed invoices.", cta: "Create Factoring Account" },
  { value: "LOGISTICS", label: "Logistics Provider", icon: Truck, color: "var(--info)", title: "Create Carrier Account", desc: "Register your fleet on the web or the driver app. Get dispatched ETA e-Waybill jobs and reconcile deliveries digitally.", cta: "Create Carrier Account" },
];

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const initialRole: StakeholderRole =
    typeParam === "supplier" ? "SUPPLIER"
    : typeParam === "hotel" ? "HOTEL"
    : typeParam === "factoring" ? "FACTORING"
    : typeParam === "logistics" || typeParam === "carrier" ? "LOGISTICS"
    : "HOTEL";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [role, setRole] = useState<StakeholderRole>(initialRole);

  const [otpStep, setOtpStep] = useState<"phone" | "verify" | "details">("phone");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", otpCode: "",
    city: "", governorate: "", marketingConsent: false, termsAccepted: false,
  });

  useEffect(() => { if (otpCooldown > 0) { const t = setTimeout(() => setOtpCooldown((p) => p - 1), 1000); return () => clearTimeout(t); } }, [otpCooldown]);

  const update = (field: string, value: string | boolean) => setForm((p) => ({ ...p, [field]: value }));

  const activeRole = ROLES.find((r) => r.value === role)!;

  const handleSendOtp = async () => {
    if (!form.phone) { setOtpError("Enter your mobile number"); return; }
    setLoading(true); setOtpError("");
    try {
      const res = await fetch("/api/v1/auth/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: form.phone, purpose: "REGISTER" }) });
      const data = await res.json();
      if (data.success) { setOtpSent(true); setOtpStep("verify"); setOtpCooldown(60); if (data.devCode) setDevOtpCode(data.devCode); }
      else setOtpError(data.error || "Failed to send code");
    } catch { setOtpError("Network error. Try again."); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (form.otpCode.length !== 6) { setOtpError("Enter the 6-digit code"); return; }
    setLoading(true); setOtpError("");
    try {
      const res = await fetch("/api/v1/auth/verify-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: form.phone, code: form.otpCode, purpose: "REGISTER" }) });
      const data = await res.json();
      if (data.success) setOtpStep("details");
      else setOtpError(data.error || "Invalid or expired code");
    } catch { setOtpError("Network error. Try again."); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    if (!form.name) { setError("Name is required"); setLoading(false); return; }
    if (!form.email) { setError("Email is required"); setLoading(false); return; }
    if (!form.password) { setError("Password is required"); setLoading(false); return; }
    if (!form.termsAccepted) { setError("You must accept the Terms of Service"); setLoading(false); return; }
    if (otpStep !== "details") { setError("Please verify your mobile number first"); setLoading(false); return; }

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: role === "LOGISTICS" ? "SHIPPING" : role,
          name: form.name, email: form.email, password: form.password, phone: form.phone,
          otpCode: form.otpCode, city: form.city || undefined, governorate: form.governorate || undefined,
          accountType: "business", marketingConsent: form.marketingConsent, termsAccepted: form.termsAccepted,
        }),
      });
      const data = await res.json();
      if (data.success) { setRegistered(true); setTimeout(() => router.push("/onboarding"), 2000); }
      else setError(data.error || "Registration failed");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const fieldCls = "w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-accent-base/30 focus:outline-none focus:ring-1 focus:ring-accent-base/10 transition-all";

  if (registered) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="w-20 h-20 rounded-full border flex items-center justify-center mx-auto" style={{ borderColor: "var(--border-accent)", background: "var(--accent-muted)" }}>
          <CheckCircle2 size={40} style={{ color: "var(--accent-base)" }} />
        </div>
        <div>
          <h1 className="text-[24px] font-semibold text-white mb-2">Welcome, {form.name}!</h1>
          <p className="text-foreground-secondary text-[14px]">Your {role.toLowerCase()} account is being created. Redirecting to onboarding...</p>
        </div>
      </div>
    );
  }

  const RoleIcon = activeRole.icon;

  return (
    <div className="space-y-8">
      {/* Header — role-aware */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-[0.15em] mb-5" style={{ borderColor: `${activeRole.color}44`, background: `${activeRole.color}12`, color: activeRole.color }}>
          <RoleIcon size={11} />
          {role === "HOTEL" ? "Hotel Registration" : role === "SUPPLIER" ? "Supplier Registration" : role === "FACTORING" ? "Factoring Registration" : "Carrier Registration"}
        </div>
        <h1 className="text-[28px] font-semibold text-foreground tracking-[-0.02em]">{activeRole.title}</h1>
        <p className="mt-2 text-[14px] text-foreground-secondary">{activeRole.desc}</p>
      </div>

      <div className="rounded-2xl border border-subtle bg-surface-1 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-[13px]">{error}</div>}

          {/* Role selector — all 4 roles, always shown */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">I am a...</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.value;
                return (
                  <button
                    key={r.value} type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[13px] font-medium transition-all ${isSelected ? "text-surface border-transparent" : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.10]"}`}
                    style={isSelected ? { backgroundColor: r.color, borderColor: r.color } : {}}
                  >
                    <Icon size={14} /> {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-1">
            <RoleBenefits role={role === "FACTORING" ? "FACTOR" : role as "HOTEL" | "SUPPLIER" | "LOGISTICS"} />
          </div>

          {/* OTP steps indicator */}
          {otpStep === "phone" && <div className="flex items-center gap-2 text-[12px] text-foreground-muted"><div className="w-5 h-5 rounded-full bg-accent-base text-surface flex items-center justify-center">1</div><span>Verify your mobile number</span></div>}
          {otpStep === "verify" && <div className="flex items-center gap-2 text-[12px] text-foreground-muted"><div className="w-5 h-5 rounded-full bg-accent-base text-surface flex items-center justify-center">2</div><span>Enter the code sent to your phone</span></div>}
          {otpStep === "details" && <div className="flex items-center gap-2 text-[12px] text-success"><CheckCircle size={16} /><span>Mobile verified</span></div>}

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">Full Name <span className="text-red-400">*</span></label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" required className={fieldCls} />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">Mobile Number <span className="text-red-400">*</span></label>
            <div className="relative">
              <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input type="tel" inputMode="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+20 10 1234 5678" required className={fieldCls} />
            </div>
          </div>

          {otpStep === "phone" && (
            <button type="button" onClick={handleSendOtp} disabled={loading || !form.phone} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent-base/20 text-[13px] font-medium transition-all disabled:opacity-50">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send verification code
            </button>
          )}

          {otpStep === "verify" && (
            <>
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-foreground-secondary">Verification Code</label>
                <div className="flex gap-2">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={form.otpCode} onChange={(e) => update("otpCode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit code" maxLength={6} className={fieldCls} />
                  <button type="button" onClick={handleVerifyOtp} disabled={loading || form.otpCode.length !== 6} className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent-base/20 transition-all disabled:opacity-50">Verify</button>
                </div>
                {devOtpCode && <p className="text-[11px] text-foreground-muted">Dev code: <span className="font-mono text-accent-base">{devOtpCode}</span></p>}
                {otpError && <p className="text-[12px] text-red-400">{otpError}</p>}
              </div>
              <button type="button" onClick={handleSendOtp} disabled={loading || otpCooldown > 0} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-accent-base/20 text-accent-base text-[13px] font-medium hover:bg-accent-base/5 transition-all disabled:opacity-50">
                {otpCooldown > 0 ? <><Timer size={14} className="animate-pulse" /> Resend in {otpCooldown}s</> : <><Send size={14} /> Resend code</>}
              </button>
            </>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">Email <span className="text-red-400">*</span></label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" required className={fieldCls} />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">Password <span className="text-red-400">*</span></label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min 8 chars, 1 uppercase, 1 number" required minLength={8} className={fieldCls} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground-secondary transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={form.termsAccepted} onChange={(e) => update("termsAccepted", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/[0.03] text-accent-base focus:ring-accent-base/20" />
              <span className="text-[12px] text-foreground-secondary leading-relaxed">
                I agree to the <Link href="/terms" className="text-accent-base hover:opacity-80 underline underline-offset-2">Terms of Service</Link> and <Link href="/privacy" className="text-accent-base hover:opacity-80 underline underline-offset-2">Privacy Policy</Link><span className="text-red-400 ml-0.5">*</span>
              </span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold text-white disabled:opacity-50 transition-all" style={{ backgroundColor: activeRole.color }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>{activeRole.cta} <ArrowRight size={16} /></>}
          </button>
        </form>
      </div>

      <p className="text-center text-[13px] text-foreground-muted">
        Already have an account? <Link href="/login" className="text-accent-base hover:opacity-80 font-medium transition-opacity">Sign in</Link>
      </p>
    </div>
  );
}
