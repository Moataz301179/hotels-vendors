"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  User,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Users,
  Mail,
  Phone,
  CreditCard,
  Lock,
} from "lucide-react";
import Link from "next/link";

type Sector = "HOTEL" | "SUPPLIER" | "FACTORING" | "SHIPPING";

interface FormData {
  companyName: string;
  taxId: string;
  phone: string;
  sector: Sector;
  adminName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  companyName?: string;
  taxId?: string;
  phone?: string;
  sector?: string;
  adminName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SECTOR_OPTIONS: { value: Sector; label: string }[] = [
  { value: "HOTEL", label: "Hotel Group" },
  { value: "SUPPLIER", label: "Supplier" },
  { value: "FACTORING", label: "Factoring Company" },
  { value: "SHIPPING", label: "Logistics Provider" },
];

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "var(--error)" };
  if (score <= 3) return { score, label: "Fair", color: "var(--accent-base)" };
  return { score, label: "Strong", color: "var(--success)" };
}

function validateStep1(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.companyName.trim() || data.companyName.trim().length < 2)
    errors.companyName = "Company name must be at least 2 characters";
  if (!/^\d{9}$/.test(data.taxId))
    errors.taxId = "Tax ID must be exactly 9 digits";
  if (!data.phone.trim() || data.phone.replace(/\D/g, "").length < 10)
    errors.phone = "Enter a valid phone number (minimum 10 digits)";
  if (!data.sector) errors.sector = "Select a sector";
  return errors;
}

function validateStep2(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.adminName.trim() || data.adminName.trim().length < 2)
    errors.adminName = "Name must be at least 2 characters";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address";
  if (data.password.length < 8)
    errors.password = "Password must be at least 8 characters";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords do not match";
  return errors;
}

interface RegisterEntityFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export function RegisterEntityForm({ onSubmit, isSubmitting, submitError }: RegisterEntityFormProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    taxId: "",
    phone: "",
    sector: "" as Sector,
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FieldErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof FieldErrors];
        return next;
      });
    }
  };

  const handleNext = () => {
    const errs = step === 1 ? validateStep1(formData) : validateStep2(formData);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateStep2(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    await onSubmit(formData);
    setSubmitted(true);
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: "var(--success)" }}>
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Entity created successfully!
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Your account has been created and your entity is being set up.
        </p>

        <div
          className="mt-6 rounded-xl p-5 text-left"
          style={{ backgroundColor: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Building2 size={18} style={{ color: "var(--accent-base)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {formData.companyName}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck size={18} style={{ color: "var(--accent-base)" }} />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Admin: {formData.adminName} · {formData.email}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Users size={18} style={{ color: "var(--accent-base)" }} />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              10 users included in your plan
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href="/login"
            className="cta-glow block w-full rounded-lg py-3 px-4 text-sm font-semibold text-center transition-all"
            style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text)" }}
          >
            Invite your team
          </Link>
          <Link
            href="/login"
            className="block text-sm transition-colors"
            style={{ color: "var(--text-tertiary)" }}
          >
            Go to login
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          {step === 1 ? "Create your organization" : step === 2 ? "Admin account" : "Almost done"}
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          {step === 1
            ? "Tell us about your company to get started"
            : "Set up the administrator account for your organization"}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors"
              style={{
                backgroundColor: s <= step ? "var(--accent-base)" : "var(--bg-surface-2)",
                color: s <= step ? "var(--accent-text)" : "var(--text-muted)",
              }}
            >
              {s < step ? <CheckCircle2 size={16} /> : s}
            </div>
            <div
              className="h-px flex-1 transition-colors"
              style={{
                backgroundColor: s < step ? "var(--accent-base)" : "var(--border-subtle)",
              }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-5">
              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Company name
                </label>
                <div className="relative">
                  <Building2
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Your company name"
                    className="surface-input w-full"
                    style={{
                      backgroundColor: "var(--bg-surface-1)",
                      border: `1px solid ${errors.companyName ? "var(--error)" : "var(--border-subtle)"}`,
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-primary)",
                      padding: "14px 18px 14px 42px",
                      fontSize: "14px",
                      width: "100%",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      if (!errors.companyName) e.target.style.borderColor = "var(--accent-base)";
                    }}
                    onBlur={(e) => {
                      if (!errors.companyName) e.target.style.borderColor = "var(--border-subtle)";
                    }}
                  />
                </div>
                {errors.companyName && (
                  <p className="text-xs" style={{ color: "var(--error)" }}>{errors.companyName}</p>
                )}
              </div>

              {/* Tax ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Tax ID (ETA Registration Number)
                </label>
                <div className="relative">
                  <CreditCard
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => updateField("taxId", e.target.value.replace(/\D/g, "").slice(0, 9))}
                    placeholder="123456789"
                    maxLength={9}
                    className="surface-input w-full"
                    style={{
                      backgroundColor: "var(--bg-surface-1)",
                      border: `1px solid ${errors.taxId ? "var(--error)" : "var(--border-subtle)"}`,
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-primary)",
                      padding: "14px 18px 14px 42px",
                      fontSize: "14px",
                      width: "100%",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      if (!errors.taxId) e.target.style.borderColor = "var(--accent-base)";
                    }}
                    onBlur={(e) => {
                      if (!errors.taxId) e.target.style.borderColor = "var(--border-subtle)";
                    }}
                  />
                </div>
                {errors.taxId && (
                  <p className="text-xs" style={{ color: "var(--error)" }}>{errors.taxId}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Phone number
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+20 100 000 0000"
                    className="surface-input w-full"
                    style={{
                      backgroundColor: "var(--bg-surface-1)",
                      border: `1px solid ${errors.phone ? "var(--error)" : "var(--border-subtle)"}`,
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-primary)",
                      padding: "14px 18px 14px 42px",
                      fontSize: "14px",
                      width: "100%",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      if (!errors.phone) e.target.style.borderColor = "var(--accent-base)";
                    }}
                    onBlur={(e) => {
                      if (!errors.phone) e.target.style.borderColor = "var(--border-subtle)";
                    }}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs" style={{ color: "var(--error)" }}>{errors.phone}</p>
                )}
              </div>

              {/* Sector */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Sector
                </label>
                <div className="relative">
                  <select
                    value={formData.sector}
                    onChange={(e) => updateField("sector", e.target.value as Sector)}
                    className="surface-input w-full appearance-none"
                    style={{
                      backgroundColor: "var(--bg-surface-1)",
                      border: `1px solid ${errors.sector ? "var(--error)" : "var(--border-subtle)"}`,
                      borderRadius: "var(--radius-md)",
                      color: formData.sector ? "var(--text-primary)" : "var(--text-muted)",
                      padding: "14px 18px",
                      fontSize: "14px",
                      width: "100%",
                      outline: "none",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => {
                      if (!errors.sector) e.target.style.borderColor = "var(--accent-base)";
                    }}
                    onBlur={(e) => {
                      if (!errors.sector) e.target.style.borderColor = "var(--border-subtle)";
                    }}
                  >
                    <option value="" disabled>Select your sector</option>
                    {SECTOR_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--text-muted)" }}
                  />
                </div>
                {errors.sector && (
                  <p className="text-xs" style={{ color: "var(--error)" }}>{errors.sector}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-5">
              {/* Admin Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Full name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => updateField("adminName", e.target.value)}
                    placeholder="Your full name"
                    className="surface-input w-full"
                    style={{
                      backgroundColor: "var(--bg-surface-1)",
                      border: `1px solid ${errors.adminName ? "var(--error)" : "var(--border-subtle)"}`,
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-primary)",
                      padding: "14px 18px 14px 42px",
                      fontSize: "14px",
                      width: "100%",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      if (!errors.adminName) e.target.style.borderColor = "var(--accent-base)";
                    }}
                    onBlur={(e) => {
                      if (!errors.adminName) e.target.style.borderColor = "var(--border-subtle)";
                    }}
                  />
                </div>
                {errors.adminName && (
                  <p className="text-xs" style={{ color: "var(--error)" }}>{errors.adminName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="admin@company.com"
                    className="surface-input w-full"
                    style={{
                      backgroundColor: "var(--bg-surface-1)",
                      border: `1px solid ${errors.email ? "var(--error)" : "var(--border-subtle)"}`,
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-primary)",
                      padding: "14px 18px 14px 42px",
                      fontSize: "14px",
                      width: "100%",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      if (!errors.email) e.target.style.borderColor = "var(--accent-base)";
                    }}
                    onBlur={(e) => {
                      if (!errors.email) e.target.style.borderColor = "var(--border-subtle)";
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs" style={{ color: "var(--error)" }}>{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="Create a strong password"
                    className="surface-input w-full"
                    style={{
                      backgroundColor: "var(--bg-surface-1)",
                      border: `1px solid ${errors.password ? "var(--error)" : "var(--border-subtle)"}`,
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-primary)",
                      padding: "14px 18px 14px 42px",
                      paddingRight: "44px",
                      fontSize: "14px",
                      width: "100%",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      if (!errors.password) e.target.style.borderColor = "var(--accent-base)";
                    }}
                    onBlur={(e) => {
                      if (!errors.password) e.target.style.borderColor = "var(--border-subtle)";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                          key={bar}
                          className="h-1 flex-1 rounded-full transition-colors"
                          style={{
                            backgroundColor:
                              bar <= passwordStrength.score
                                ? passwordStrength.color
                                : "var(--bg-surface-2)",
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </p>
                  </div>
                )}
                {errors.password && (
                  <p className="text-xs" style={{ color: "var(--error)" }}>{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Confirm password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    className="surface-input w-full"
                    style={{
                      backgroundColor: "var(--bg-surface-1)",
                      border: `1px solid ${errors.confirmPassword ? "var(--error)" : "var(--border-subtle)"}`,
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-primary)",
                      padding: "14px 18px 14px 42px",
                      paddingRight: "44px",
                      fontSize: "14px",
                      width: "100%",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      if (!errors.confirmPassword) e.target.style.borderColor = "var(--accent-base)";
                    }}
                    onBlur={(e) => {
                      if (!errors.confirmPassword) e.target.style.borderColor = "var(--border-subtle)";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs" style={{ color: "var(--error)" }}>{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {submitError && (
        <div
          className="mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "var(--error)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <span>{submitError}</span>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="cta-glow flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all"
            style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text)" }}
          >
            Continue
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="cta-glow flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all"
            style={{
              backgroundColor: "var(--accent-base)",
              color: "var(--accent-text)",
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create account
                <ArrowRight size={16} />
              </>
            )}
          </button>
        )}
      </div>

      {step === 1 && (
        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium transition-colors"
            style={{ color: "var(--accent-base)" }}
          >
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
