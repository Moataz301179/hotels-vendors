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
} from "lucide-react";

type StakeholderRole = "HOTEL" | "SUPPLIER" | "FACTORING" | "LOGISTICS";
type PropertyType = "SINGLE" | "CHAIN" | "MANAGEMENT";
type OtpStep = "phone" | "verify" | "details";

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
  const initialRole = typeParam === "supplier" ? "SUPPLIER" : typeParam === "hotel" ? "HOTEL" : "HOTEL";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);

  // OTP flow state
  const [otpStep, setOtpStep] = useState<OtpStep>("phone");
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

  // Countdown timer for OTP cooldown
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

  // Send OTP code
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
        if (data.devCode) {
          setDevOtpCode(data.devCode);
        }
      } else {
        setOtpError(data.error || "Failed to send code");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and proceed
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

    if (!form.name) {
      setError("Name is required");
      setLoading(false);
      return;
    }
    if (!form.password) {
      setError("Password is required");
      setLoading(false);
      return;
    }
    if (!form.termsAccepted) {
      setError("You must accept the Terms of Service and Privacy Policy");
      setLoading(false);
      return;
    }
    if (otpStep !== "details") {
      setError("Please verify your mobile number first");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: form.role === "LOGISTICS" ? "SHIPPING" : form.role,
          name: form.name,
          email: form.email || undefined,
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
        setTimeout(() => router.push("/login"), 2000);
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

  if (registered) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="w-20 h-20 rounded-full border flex items-center justify-center mx-auto" style={{ borderColor: "var(--border-accent)", background: "var(--accent-muted)" }}>
          <CheckCircle2 size={40} style={{ color: "var(--accent-base)" }} />
        </div>
      <div>
        <h1 className="text-[24px] font-semibold text-white mb-2">Welcome aboard, {form.name}!</h1>
        <p className="text-foreground-secondary text-[14px]">
          Your account has been created successfully. Redirecting to sign in...
        </p>
      </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium uppercase tracking-[0.15em] mb-5" style={{ borderColor: "var(--border-accent)", background: "var(--accent-muted)", color: "var(--accent-base)" }}>
          {form.role === "HOTEL" ? <Hotel size={11} /> : form.role === "SUPPLIER" ? <Store size={11} /> : form.role === "FACTORING" ? <Landmark size={11} /> : <Truck size={11} />}
          {form.role === "HOTEL" ? "Hotel Registration" : form.role === "SUPPLIER" ? "Supplier Registration" : form.role === "FACTORING" ? "Factoring Registration" : "Logistics Registration"}
        </div>
        <h1 className="text-[28px] font-semibold text-foreground tracking-[-0.02em]">
          Create Account
        </h1>
        <p className="mt-2 text-[14px] text-foreground-secondary">
          {form.role === "HOTEL"
            ? "Join Egypt&apos;s leading B2B hospitality procurement platform. Net-60 terms via Oliv."
            : form.role === "SUPPLIER"
            ? "List your products, reach 480+ hotels, get paid in 48 hours via Oliv."
            : "Join Egypt&apos;s leading B2B hospitality procurement platform."}
        </p>
      </div>

       <div className="rounded-2xl border border-subtle bg-surface-1 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-[13px]">
              {error}
            </div>
          )}

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
            <RoleBenefits role={form.role === "FACTORING" ? "FACTOR" : form.role} />
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                placeholder="Your full name"
                required
                className={fieldCls}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                placeholder="+20 10 1234 5678"
                required
                className={fieldCls}
              />
            </div>
          </div>

          {otpStep === "verify" && (
            <>
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-foreground-secondary">
                  Verification Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={form.otpCode}
                    onChange={(e) => updateForm("otpCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit code"
                    maxLength={6}
                    className={fieldCls}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading || form.otpCode.length !== 6}
                    className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent-base/20 transition-all disabled:opacity-50"
                  >
                    Verify
                  </button>
                </div>
                {devOtpCode && (
                  <p className="text-[11px] text-foreground-muted">
                    Dev code: <span className="font-mono text-accent-base">{devOtpCode}</span>
                  </p>
                )}
                {otpError && (
                  <p className="text-[12px] text-red-400">{otpError}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || otpCooldown > 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-accent-base/20 text-accent-base text-[13px] font-medium hover:bg-accent-base/5 transition-all disabled:opacity-50"
              >
                {otpCooldown > 0 ? (
                  <>
                    <Timer size={14} className="animate-pulse" />
                    Resend in {otpCooldown}s
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Resend code
                  </>
                )}
              </button>
            </>
          )}

          {otpStep === "phone" && (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading || !form.phone}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent-base/20 text-[13px] font-medium transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Send verification code
            </button>
          )}

          {otpStep === "verify" && otpSent && !otpError && (
            <div className="flex items-center gap-2 text-[12px] text-success">
              <CheckCircle size={14} />
              <span>Phone number verified</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">
              Email <span className="text-foreground-muted">(optional)</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                placeholder="you@company.com"
                className={fieldCls}
              />
            </div>
            <p className="text-[11px] text-foreground-muted">
              Required for email verification and receipts. Can be added later in profile settings.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => updateForm("password", e.target.value)}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                required
                minLength={8}
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

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">
              City <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateForm("city", e.target.value)}
                placeholder="e.g. Cairo, Sharm El-Sheikh"
                required
                className={fieldCls}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-foreground-secondary">
              Governorate <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <select
                value={form.governorate}
                onChange={(e) => updateForm("governorate", e.target.value)}
                required
                className={`${fieldCls} appearance-none`}
              >
                <option value="" className="bg-surface-1 text-foreground-secondary">Select governorate</option>
                {GOVERNORATES.map((g) => (
                  <option key={g} value={g} className="bg-surface-1 text-white">{g}</option>
                ))}
              </select>
            </div>
          </div>

          {form.role === "HOTEL" && (
            <>
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-foreground-secondary">
                  Property Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "SINGLE", label: "Single Property", icon: Home, color: "var(--accent-base)" },
                    { value: "CHAIN", label: "Hotel Chain", icon: Building, color: "var(--success)" },
                    { value: "MANAGEMENT", label: "Management Co.", icon: Users, color: "var(--purple-base)" },
                  ].map((pt) => {
                    const Icon = pt.icon;
                    const isSelected = form.propertyType === pt.value;
                    return (
                      <button
                        key={pt.value}
                        type="button"
                        onClick={() => updateForm("propertyType", pt.value)}
                        className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-[11px] font-medium transition-all ${
                          isSelected ? "text-surface border-transparent" : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.10]"
                        }`}
                        style={isSelected ? { backgroundColor: pt.color, borderColor: pt.color } : {}}
                      >
                        <Icon size={16} />
                        {pt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {(form.propertyType === "CHAIN" || form.propertyType === "MANAGEMENT") && (
                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-foreground-secondary">
                    Number of Properties <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
                    <select
                      value={form.numberOfProperties}
                      onChange={(e) => updateForm("numberOfProperties", e.target.value)}
                      required
                      className={`${fieldCls} appearance-none`}
                    >
                      <option value="1" className="bg-surface-1 text-foreground-secondary">1 property</option>
                      <option value="2-5" className="bg-surface-1 text-white">2-5 properties</option>
                      <option value="6-10" className="bg-surface-1 text-white">6-10 properties</option>
                      <option value="11-20" className="bg-surface-1 text-white">11-20 properties</option>
                      <option value="20+" className="bg-surface-1 text-white">20+ properties</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(var(--success-rgb),0.05)", border: "1px solid rgba(var(--success-rgb),0.13)" }}>
                <p className="text-[12px] text-foreground-secondary leading-relaxed">
                  <strong style={{ color: "var(--success)" }}>After registration:</strong> Connect your ETA token for compliant invoicing, then set up Oliv financing for Net-60 payment terms. Suppliers get paid instantly.
                </p>
              </div>
            </>
          )}

          {form.role === "SUPPLIER" && (
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,126,26,0.05)", border: "1px solid rgba(255,126,26,0.13)" }}>
              <p className="text-[12px] text-foreground-secondary leading-relaxed">
                <strong style={{ color: "var(--orange-base)" }}>7-day free trial:</strong> Full access to all features — list products, receive orders, apply for Oliv financing. <strong>Transactional fees</strong> (factoring, commissions) still apply during trial. No commitment required.
              </p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(e) => updateForm("termsAccepted", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/[0.03] text-accent-base focus:ring-accent-base/20"
              />
              <span className="text-[12px] text-foreground-secondary leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-accent-base hover:opacity-80 underline underline-offset-2">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-accent-base hover:opacity-80 underline underline-offset-2">Privacy Policy</Link>
                <span className="text-red-400 ml-0.5">*</span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.marketingConsent}
                onChange={(e) => updateForm("marketingConsent", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/[0.03] text-accent-base focus:ring-accent-base/20"
              />
              <span className="text-[12px] text-foreground-secondary leading-relaxed">
                I agree to receive marketing communications about products, services, and promotions. You can withdraw consent at any time.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold disabled:opacity-50 transition-all hover:shadow-accent"
            style={{
              backgroundColor: roleColorMap[form.role],
              color: "#ffffff",
            }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="rounded-xl p-4 bg-white/[0.02] border border-white/[0.06]">
        <p className="text-[12px] text-foreground-secondary leading-relaxed">
          Tax ID and Commercial Registry can be added after registration in your dashboard settings.
        </p>
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