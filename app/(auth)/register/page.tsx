"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  ArrowRight,
  Check,
  AlertTriangle,
  ArrowLeft,
  Hotel,
  Store,
  Landmark,
  Truck,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { RoleBenefits, type StakeholderRole } from "@/components/auth/role-benefits";

const STEPS = [
  { id: 1, title: "Account", description: "Your credentials" },
  { id: 2, title: "Profile", description: "Your details" },
  { id: 3, title: "Business", description: "Company info" },
  { id: 4, title: "Verify", description: "Confirm & go" },
];

const ROLES: { value: StakeholderRole; label: string; icon: React.ElementType }[] = [
  { value: "HOTEL", label: "Hotel / Property", icon: Hotel },
  { value: "SUPPLIER", label: "Supplier / Vendor", icon: Store },
  { value: "FACTORING", label: "Factoring Company", icon: Landmark },
  { value: "LOGISTICS", label: "Logistics Provider", icon: Truck },
];

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <RegisterPage />
    </Suspense>
  );
}

function RegisterSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-white/[0.04]" />
              </div>
            ))}
          </div>
        </div>
        <div className="p-8 space-y-5">
          <div className="h-6 bg-white/[0.04] rounded w-1/3" />
          <div className="h-12 bg-white/[0.04] rounded" />
          <div className="h-12 bg-white/[0.04] rounded" />
          <div className="h-12 bg-white/[0.04] rounded" />
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "HOTEL" as StakeholderRole,
    accountType: "individual" as "individual" | "business",
    companyName: "",
    companyType: "HOTEL_GROUP",
    taxId: "",
    city: "",
    governorate: "",
  });
  const [registered, setRegistered] = useState(false);

  // Pre-select role from URL ?role= param
  useEffect(() => {
    const roleParam = searchParams.get("role");
    const validRoles: StakeholderRole[] = ["HOTEL", "SUPPLIER", "FACTORING", "LOGISTICS"];
    if (roleParam && validRoles.includes(roleParam.toUpperCase() as StakeholderRole)) {
      setForm((prev) => ({ ...prev, role: roleParam.toUpperCase() as StakeholderRole }));
    }
  }, [searchParams]);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.email || !form.password || !form.name) {
        setError("Please fill in all required fields");
        return;
      }
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
    }
    if (step === 2 && !form.phone) {
      setError("Please fill in all required fields");
      return;
    }
    if (step === 3 && form.accountType === "business" && (!form.companyName || !form.taxId)) {
      setError("Business accounts require company name and Tax ID. You can also register as an individual and add these later.");
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        type: form.role.toLowerCase(),
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        city: form.city,
        governorate: form.governorate,
        address: "",
        taxId: form.taxId,
        commercialReg: "",
        accountType: form.accountType,
      };
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setRegistered(true);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepProgress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div>
      {/* Mobile-only brand header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:hidden flex items-center gap-3 mb-8 justify-center"
      >
        <BrandLogo variant="dark" size="md" />
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">Hotels Vendors</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">
            Digital Procurement Hub
          </p>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]"
      >
        {registered ? (
          <div className="p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto"
            >
              <Check className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <div>
              <h2 className="text-xl font-semibold text-white">Welcome aboard, {form.name}!</h2>
              <p className="text-sm text-white/50 mt-2 max-w-sm mx-auto">
                Your account has been created successfully. We have sent a verification email to{" "}
                <span className="text-white/70">{form.email}</span>. Please check your inbox and click the verification link to activate your account.
              </p>
            </div>
            <div className="space-y-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#8B0000] hover:bg-[#6B0000] text-white text-sm font-medium transition-colors"
              >
                Go to Sign In
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-white/30">
                Did not receive the email? Check your spam folder or{" "}
                <button
                  onClick={async () => {
                    await fetch("/api/v1/auth/resend-verification", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: form.email }),
                    });
                    alert("Verification email resent!");
                  }}
                  className="text-[#ff6b6b] hover:underline"
                >
                  resend it
                </button>
                .
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stepper */}
            <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-6 relative">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center gap-2 flex-1 relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > s.id
                      ? "bg-emerald-500 text-white"
                      : step === s.id
                      ? "bg-[#8B0000] text-white shadow-[0_0_12px_rgba(139,0,0,0.3)]"
                      : "bg-white/[0.04] text-white/30 border border-white/[0.08]"
                  }`}
                >
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <div className="text-center hidden sm:block">
                  <p
                    className={`text-[10px] font-medium ${
                      step >= s.id ? "text-white/70" : "text-white/30"
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="text-[9px] text-white/20">{s.description}</p>
                </div>
              </div>
            ))}

            {/* Connecting lines */}
            <div className="absolute top-4 left-0 right-0 h-px -translate-y-1/2 z-0">
              <div className="mx-[12.5%] h-full bg-white/[0.06] relative">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#8B0000] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stepProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 mb-5"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Main form area */}
            <div className="lg:col-span-3">
              {/* Step 1: Account */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <h2 className="text-lg font-semibold text-white">
                    Create your account
                  </h2>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8B0000]/60 focus:ring-1 focus:ring-[#8B0000]/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8B0000]/60 focus:ring-1 focus:ring-[#8B0000]/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => updateForm("password", e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8B0000]/60 focus:ring-1 focus:ring-[#8B0000]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Profile */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <h2 className="text-lg font-semibold text-white">Your profile</h2>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        placeholder="+20 1XX XXX XXXX"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8B0000]/60 focus:ring-1 focus:ring-[#8B0000]/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                      Your Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {ROLES.map((role) => {
                        const Icon = role.icon;
                        return (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => updateForm("role", role.value)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                              form.role === role.value
                                ? "bg-[#8B0000]/15 border-[#8B0000]/40 text-[#ff6b6b]"
                                : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:text-white/80 hover:border-white/[0.12]"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {role.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Business */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <h2 className="text-lg font-semibold text-white">
                    {form.accountType === "business" ? "Business information" : "Location"}
                  </h2>

                  {form.accountType === "business" && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                        Company Name <span className="text-[#8B0000]">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.companyName}
                        onChange={(e) => updateForm("companyName", e.target.value)}
                        placeholder="Your company name"
                        className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8B0000]/60 focus:ring-1 focus:ring-[#8B0000]/20 transition-all"
                      />
                    </div>
                  )}

                  {form.accountType === "business" && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                        Tax ID <span className="text-[#8B0000]">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.taxId}
                        onChange={(e) => updateForm("taxId", e.target.value)}
                        placeholder="9-digit Egyptian tax ID"
                        className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8B0000]/60 focus:ring-1 focus:ring-[#8B0000]/20 transition-all"
                      />
                      <p className="text-[10px] text-white/30">
                        Required for ETA e-invoicing compliance. You can add this later during your first transaction.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                        City
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => updateForm("city", e.target.value)}
                        placeholder="Cairo"
                        className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8B0000]/60 focus:ring-1 focus:ring-[#8B0000]/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
                        Governorate
                      </label>
                      <input
                        type="text"
                        value={form.governorate}
                        onChange={(e) => updateForm("governorate", e.target.value)}
                        placeholder="Cairo"
                        className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8B0000]/60 focus:ring-1 focus:ring-[#8B0000]/20 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Verify */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <h2 className="text-lg font-semibold text-white">Review & confirm</h2>
                  <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    {[
                      { label: "Name", value: form.name },
                      { label: "Email", value: form.email },
                      { label: "Phone", value: form.phone },
                      { label: "Account Type", value: form.accountType === "individual" ? "Individual" : "Business Entity" },
                      { label: "Role", value: ROLES.find((r) => r.value === form.role)?.label },
                      ...(form.accountType === "business" ? [
                        { label: "Company", value: form.companyName },
                        { label: "Tax ID", value: form.taxId },
                      ] : []),
                      { label: "Location", value: `${form.city}, ${form.governorate}` },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-white/40">{item.label}</span>
                        <span className="text-white/80 font-medium truncate ml-4 max-w-[60%] text-right">
                          {item.value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/30">
                    By creating an account, you agree to our Terms of Service and
                    Privacy Policy. Your data will be processed in compliance with
                    Egyptian data protection laws and ETA e-invoicing requirements.
                  </p>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="px-5 py-3 rounded-lg border border-white/[0.08] text-sm text-white/60 hover:text-white hover:border-white/[0.14] hover:bg-white/[0.02] transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#8B0000] hover:bg-[#6B0000] text-white text-sm font-medium transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(139,0,0,0.2)]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#8B0000] hover:bg-[#6B0000] text-white text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(139,0,0,0.2)]"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Benefits sidebar — visible on desktop from Step 2 onwards */}
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="hidden lg:block lg:col-span-2"
              >
                <div className="sticky top-8 max-h-[80vh] overflow-y-auto pr-1 custom-scrollbar">
                  <RoleBenefits
                    role={form.role}
                    variant={step === 2 ? "full" : "compact"}
                    theme="dark"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
          </>
        )}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-white/30 mt-6"
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#ff6b6b] hover:text-[#ff9999] font-medium transition-colors"
        >
          Sign in
        </Link>
      </motion.p>
    </div>
  );
}
