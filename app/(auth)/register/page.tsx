"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Building2, Phone, ArrowRight, Check, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, title: "Account", description: "Your credentials" },
  { id: 2, title: "Profile", description: "Your details" },
  { id: 3, title: "Business", description: "Company info" },
  { id: 4, title: "Verify", description: "Confirm & go" },
];

const ROLES = [
  { value: "HOTEL", label: "Hotel / Property", icon: Building2 },
  { value: "SUPPLIER", label: "Supplier / Vendor", icon: Building2 },
  { value: "FACTORING", label: "Factoring Company", icon: Building2 },
  { value: "LOGISTICS", label: "Logistics Provider", icon: Building2 },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "HOTEL",
    companyName: "",
    companyType: "HOTEL_GROUP",
    taxId: "",
    city: "",
    governorate: "",
  });

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
    if (step === 2 && (!form.phone || !form.name)) {
      setError("Please fill in all required fields");
      return;
    }
    if (step === 3 && (!form.companyName || !form.taxId)) {
      setError("Please fill in all required fields");
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/login");
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
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden py-12">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF5C00]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF5C00]/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg mx-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#FF5C00]/15 border border-[#FF5C00]/25 flex items-center justify-center">
              <Image src="/logo-horse-only.png" alt="Hotels Vendors" width={32} height={32} className="opacity-90" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Hotels Vendors</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Digital Procurement Hub</p>
            </div>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden"
        >
          {/* Stepper */}
          <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-6">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step > s.id
                        ? "bg-emerald-500 text-white"
                        : step === s.id
                        ? "bg-[#FF5C00] text-white shadow-[0_0_12px_rgba(255,92,0,0.3)]"
                        : "bg-white/[0.04] text-white/30 border border-white/[0.08]"
                    }`}
                  >
                    {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className={`text-[10px] font-medium ${step >= s.id ? "text-white/70" : "text-white/30"}`}>{s.title}</p>
                    <p className="text-[9px] text-white/20">{s.description}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="absolute left-0 right-0 top-4 h-px bg-white/[0.06] -z-10" style={{ marginLeft: `${(i + 0.5) * 25}%`, marginRight: `${(STEPS.length - i - 1.5) * 25}%` }} />
                  )}
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#FF5C00] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stepProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 mb-5"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Step 1: Account */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <h2 className="text-lg font-semibold">Create your account</h2>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      placeholder="Omar El-Sayed"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#FF5C00]/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      placeholder="omar@nilegrand.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#FF5C00]/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateForm("password", e.target.value)}
                      placeholder="Min 8 characters"
                      className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#FF5C00]/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Profile */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <h2 className="text-lg font-semibold">Your profile</h2>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      placeholder="+20 1XX XXX XXXX"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#FF5C00]/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Your Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => updateForm("role", role.value)}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                          form.role === role.value
                            ? "bg-[#FF5C00]/15 border-[#FF5C00]/40 text-[#ff7a33]"
                            : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:text-white/80 hover:border-white/[0.12]"
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            {/* Step 3: Business */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <h2 className="text-lg font-semibold">Business information</h2>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => updateForm("companyName", e.target.value)}
                    placeholder="Nile Grand Hotel"
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#FF5C00]/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Tax ID</label>
                  <input
                    type="text"
                    value={form.taxId}
                    onChange={(e) => updateForm("taxId", e.target.value)}
                    placeholder="123456789"
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#FF5C00]/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                      placeholder="Cairo"
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#FF5C00]/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider">Governorate</label>
                    <input
                      type="text"
                      value={form.governorate}
                      onChange={(e) => updateForm("governorate", e.target.value)}
                      placeholder="Cairo"
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#FF5C00]/50 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Verify */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <h2 className="text-lg font-semibold">Review & confirm</h2>
                <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  {[
                    { label: "Name", value: form.name },
                    { label: "Email", value: form.email },
                    { label: "Phone", value: form.phone },
                    { label: "Role", value: ROLES.find((r) => r.value === form.role)?.label },
                    { label: "Company", value: form.companyName },
                    { label: "Tax ID", value: form.taxId },
                    { label: "Location", value: `${form.city}, ${form.governorate}` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-white/40">{item.label}</span>
                      <span className="text-white/80 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/30">
                  By creating an account, you agree to our Terms of Service and Privacy Policy. Your data will be processed in compliance with Egyptian data protection laws and ETA e-invoicing requirements.
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="px-6 py-3 rounded-lg border border-white/[0.08] text-sm text-white/60 hover:text-white hover:border-white/[0.14] transition-colors"
                >
                  Back
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#FF5C00] hover:bg-[#e65100] text-white text-sm font-medium transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#FF5C00] hover:bg-[#e65100] text-white text-sm font-medium transition-all disabled:opacity-50"
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
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-white/30 mt-6"
        >
          Already have an account?{" "}
          <Link href="/login" className="text-[#ff7a33] hover:text-[#ff6666] font-medium transition-colors">
            Sign in
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
