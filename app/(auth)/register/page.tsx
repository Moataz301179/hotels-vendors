"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RoleBenefits } from "@/components/auth/role-benefits";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Hotel,
  Store,
  Landmark,
  Truck,
  Loader2,
  CheckCircle2,
  MapPin,
  Building2,
  Home,
  Building,
  Users,
  Smartphone,
  Send,
  Timer,
  CheckCircle,
  Download,
  QrCode,
  Shield,
  Zap,
} from "lucide-react";

type StakeholderRole = "HOTEL" | "SUPPLIER" | "FACTORING" | "LOGISTICS";
type PropertyType = "SINGLE" | "CHAIN" | "MANAGEMENT";

const ROLES: { value: StakeholderRole; label: string; icon: React.ElementType; color: string }[] = [
  { value: "HOTEL", label: "Hotel / Property", icon: Hotel, color: "var(--accent-base)" },
  { value: "SUPPLIER", label: "Supplier / Vendor", icon: Store, color: "var(--orange-base)" },
  { value: "FACTORING", label: "Factoring Company", icon: Landmark, color: "var(--purple-base)" },
  { value: "LOGISTICS", label: "Logistics Provider", icon: Truck, color: "var(--info)" },
];

const GOVERNORATES = [
  "Cairo", "Alexandria", "Giza", "Sharm El-Sheikh", "Hurghada", "Luxor", "Aswan",
  "Port Said", "Suez", "Ismailia", "Dakahlia", "Sharqia", "Qalyubia", "Gharbia",
  "Monufia", "Beheira", "Kafr El Sheikh", "Damietta", "North Sinai",
  "South Sinai", "Red Sea", "New Valley", "Matruh", "Fayoum", "Beni Suef",
  "Minya", "Assiut", "Sohag", "Qena",
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
  const sectorParam = searchParams.get("sector");
  const initialRole = typeParam === "supplier" ? "SUPPLIER" : typeParam === "hotel" ? "HOTEL" : typeParam === "factoring" ? "FACTORING" : typeParam === "logistics" ? "LOGISTICS" : "HOTEL";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);

  // OTP flow state
  const [otpStep, setOtpStep] = useState<"phone" | "verify" | "details">("phone");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: initialRole as StakeholderRole,
    city: "",
    governorate: "",
    propertyType: "SINGLE" as PropertyType,
    numberOfProperties: "1",
    marketingConsent: false,
    termsAccepted: false,
    otpCode: "",
  });

  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const updateForm = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setOtpError("");
  };

  const handleSendOtp = async () => {
    if (!form.phone) {
      setOtpError("Please enter your mobile number");
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const res = await fetch("/api/v1/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, purpose: "REGISTER" }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setOtpStep("verify");
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

  const handleVerifyOtp = async () => {
    if (!form.otpCode || form.otpCode.length !== 6) {
      setOtpError("Please enter the 6-digit code");
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const res = await fetch("/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, code: form.otpCode, purpose: "REGISTER" }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpStep("details");
        setOtpError("");
      } else {
        setOtpError(data.error || "Invalid or expired code");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name) { setError("Name is required"); setLoading(false); return; }
    if (!form.email) { setError("Email is required"); setLoading(false); return; }
    if (!form.password) { setError("Password is required"); setLoading(false); return; }
    if (!form.termsAccepted) { setError("You must accept the Terms of Service and Privacy Policy"); setLoading(false); return; }
    if (otpStep !== "details") { setError("Please verify your mobile number first"); setLoading(false); return; }

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: form.role === "LOGISTICS" ? "SHIPPING" : form.role,
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          otpCode: form.otpCode,
          city: form.city || undefined,
          governorate: form.governorate || undefined,
          accountType: "business",
          marketingConsent: form.marketingConsent,
          termsAccepted: form.termsAccepted,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRegistered(true);
        setTimeout(() => router.push("/onboarding"), 2000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldCls = "w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-accent-base/30 focus:outline-none focus:ring-1 focus:ring-accent-base/10 transition-all";

  const roleColorMap: Record<StakeholderRole, string> = {
    HOTEL: "var(--accent-base)",
    SUPPLIER: "var(--orange-base)",
    FACTORING: "var(--purple-base)",
    LOGISTICS: "var(--info)",
  };

  const ptColorMap: Record<string, string> = {
    SINGLE: "var(--accent-base)",
    CHAIN: "var(--success)",
    MANAGEMENT: "var(--purple-base)",
  };

  // ═══════════════════════════════════════════
  // NON-FACTORING ROLES → Show "Download INVO App" page
  // ═══════════════════════════════════════════
  if (form.role !== "FACTORING") {
    return (
      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium uppercase tracking-[0.15em] mb-5" style={{ borderColor: "var(--border-accent)", background: "var(--accent-muted)", color: "var(--accent-base)" }}>
            {form.role === "HOTEL" ? <Hotel size={11} /> : form.role === "SUPPLIER" ? <Store size={11} /> : <Truck size={11} />}
            {form.role === "HOTEL" ? "Hotel Registration" : form.role === "SUPPLIER" ? "Supplier Registration" : "Logistics Registration"}
          </div>
          <h1 className="text-[28px] font-semibold text-foreground tracking-[-0.02em]">
            Register on the INVO App
          </h1>
          <p className="mt-2 text-[14px] text-foreground-secondary">
            {form.role === "HOTEL"
              ? "Hotel and supplier accounts are created through the INVO mobile app. Download it to get started."
              : form.role === "SUPPLIER"
              ? "Supplier accounts are created through the INVO mobile app. List your products and reach 480+ hotels."
              : "Logistics accounts are created through the INVO mobile app. Start delivering to Egypt's top hotels."}
          </p>
        </div>

        {/* Role selector */}
        <div className="rounded-2xl border border-subtle bg-surface-1 p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-foreground-secondary">I am a...</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = form.role === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => updateForm("role", role.value)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[13px] font-medium transition-all ${
                        isSelected
                          ? "text-surface border-transparent"
                          : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.10]"
                      }`}
                      style={isSelected ? { backgroundColor: role.color, borderColor: role.color } : {}}
                    >
                      <Icon size={14} />
                      {role.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* INVO App Download Card */}
        <div className="rounded-2xl border border-subtle bg-surface-1 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "var(--accent-muted)" }}>
            <Zap size={32} style={{ color: "var(--accent-base)" }} />
          </div>
          <h2 className="text-[20px] font-semibold text-foreground mb-2">Download INVO</h2>
          <p className="text-[13px] text-foreground-secondary mb-6 max-w-sm mx-auto">
            Create your account on the INVO mobile app, then pair it with HotelsVendors to access the full procurement platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
            <a
              href="https://apps.apple.com/app/invo/id000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] transition-all"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div className="text-left">
                <p className="text-[9px] text-white/40 uppercase tracking-wider">Download on the</p>
                <p className="text-[14px] font-semibold text-white">App Store</p>
              </div>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.hotelsvendors.invo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] transition-all"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.3 2.302-8.636-8.634z"/></svg>
              <div className="text-left">
                <p className="text-[9px] text-white/40 uppercase tracking-wider">Get it on</p>
                <p className="text-[14px] font-semibold text-white">Google Play</p>
              </div>
            </a>
          </div>

          <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: "rgba(var(--accent-base-rgb),0.05)", border: "1px solid rgba(var(--accent-base-rgb),0.12)" }}>
            <p className="text-[12px] text-foreground-secondary leading-relaxed">
              <strong style={{ color: "var(--accent-base)" }}>After creating your account on INVO:</strong> Open HotelsVendors web and enter the pairing number shown on your INVO app to link your accounts.
            </p>
          </div>
        </div>

        <p className="text-center text-[13px] text-foreground-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-accent-base hover:opacity-80 font-medium transition-opacity">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // FACTORING → Full web registration form
  // ═══════════════════════════════════════════
  if (registered) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="w-20 h-20 rounded-full border flex items-center justify-center mx-auto" style={{ borderColor: "var(--border-accent)", background: "var(--accent-muted)" }}>
          <CheckCircle2 size={40} style={{ color: "var(--accent-base)" }} />
        </div>
        <div>
          <h1 className="text-[24px] font-semibold text-white mb-2">Welcome aboard, {form.name}!</h1>
          <p className="text-foreground-secondary text-[14px]">
            Your factoring account has been created. Redirecting to onboarding...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium uppercase tracking-[0.15em] mb-5" style={{ borderColor: "rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.08)", color: "var(--purple-base)" }}>
          <Landmark size={11} />
          Factoring Registration
        </div>
        <h1 className="text-[28px] font-semibold text-foreground tracking-[-0.02em]">
          Create Factoring Account
        </h1>
        <p className="mt-2 text-[14px] text-foreground-secondary">
          Join Egypt&apos;s leading B2B hospitality procurement platform as a factoring partner. Provide liquidity and earn returns.
        </p>
      </div>

      <div className="rounded-2xl border border-subtle bg-surface-1 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-[13px]">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">I am a...</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = form.role === role.value;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => updateForm("role", role.value)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[13px] font-medium transition-all ${
                      isSelected
                        ? "text-surface border-transparent"
                        : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.10]"
                    }`}
                    style={isSelected ? { backgroundColor: role.color, borderColor: role.color } : {}}
                  >
                    <Icon size={14} />
                    {role.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-1">
            <RoleBenefits role="FACTOR" />
          </div>

          {/* OTP steps */}
          {otpStep === "phone" && (
            <div className="flex items-center gap-2 text-[12px] text-foreground-muted">
              <div className="w-5 h-5 rounded-full bg-accent-base text-surface flex items-center justify-center">1</div>
              <span>Verify your mobile number</span>
            </div>
          )}
          {otpStep === "verify" && (
            <div className="flex items-center gap-2 text-[12px] text-foreground-muted">
              <div className="w-5 h-5 rounded-full bg-accent-base text-surface flex items-center justify-center">2</div>
              <span>Enter the code sent to your phone</span>
            </div>
          )}
          {otpStep === "details" && (
            <div className="flex items-center gap-2 text-[12px] text-success">
              <CheckCircle size={16} />
              <span>Mobile verified</span>
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Your full name" required className={fieldCls} />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input type="tel" inputMode="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="+20 10 1234 5678" required className={fieldCls} />
            </div>
          </div>

          {/* OTP verify step */}
          {otpStep === "verify" && (
            <>
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-foreground-secondary">Verification Code</label>
                <div className="flex gap-2">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={form.otpCode} onChange={(e) => updateForm("otpCode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit code" maxLength={6} className={fieldCls} />
                  <button type="button" onClick={handleVerifyOtp} disabled={loading || form.otpCode.length !== 6} className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent-base/20 transition-all disabled:opacity-50">
                    Verify
                  </button>
                </div>
                {devOtpCode && <p className="text-[11px] text-foreground-muted">Dev code: <span className="font-mono text-accent-base">{devOtpCode}</span></p>}
                {otpError && <p className="text-[12px] text-red-400">{otpError}</p>}
              </div>
              <button type="button" onClick={handleSendOtp} disabled={loading || otpCooldown > 0} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-accent-base/20 text-accent-base text-[13px] font-medium hover:bg-accent-base/5 transition-all disabled:opacity-50">
                {otpCooldown > 0 ? <><Timer size={14} className="animate-pulse" /> Resend in {otpCooldown}s</> : <><Send size={14} /> Resend code</>}
              </button>
            </>
          )}

          {/* Send OTP button */}
          {otpStep === "phone" && (
            <button type="button" onClick={handleSendOtp} disabled={loading || !form.phone} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent-base/20 text-[13px] font-medium transition-all disabled:opacity-50">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Send verification code
            </button>
          )}

          {/* Email — REQUIRED */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">
              Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="you@company.com" required className={fieldCls} />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => updateForm("password", e.target.value)} placeholder="Min 8 chars, 1 uppercase, 1 number" required minLength={8} className={fieldCls} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground-secondary transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={form.termsAccepted} onChange={(e) => updateForm("termsAccepted", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/[0.03] text-accent-base focus:ring-accent-base/20" />
              <span className="text-[12px] text-foreground-secondary leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-accent-base hover:opacity-80 underline underline-offset-2">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-accent-base hover:opacity-80 underline underline-offset-2">Privacy Policy</Link>
                <span className="text-red-400 ml-0.5">*</span>
              </span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold disabled:opacity-50 transition-all hover:shadow-accent" style={{ backgroundColor: "var(--purple-base)", color: "#ffffff" }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Create Factoring Account</span> <ArrowRight size={16} /></>}
          </button>
        </form>
      </div>

      <p className="text-center text-[13px] text-foreground-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent-base hover:opacity-80 font-medium transition-opacity">
          Sign in
        </Link>
      </p>
    </div>
  );
}
