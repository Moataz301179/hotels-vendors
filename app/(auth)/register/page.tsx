"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2, Store, Landmark, Truck, ArrowRight, Shield, Zap, Clock, Banknote, Sparkles, Loader2, Users,
} from "lucide-react";

const SECTORS = [
  {
    key: "HOTEL" as const,
    icon: Building2,
    label: "Hotel / Resort",
    labelAr: "فندق / منتجع",
    color: "#22C55E",
    description: "AI procurement, budget control, ETA compliance, embedded factoring",
    benefits: [
      "AI demand forecasting",
      "ETA e-invoicing built-in",
      "Reverse factoring for suppliers",
      "Multi-property budget control",
    ],
  },
  {
    key: "SUPPLIER" as const,
    icon: Store,
    label: "Supplier / Vendor",
    labelAr: "مورد / بائع",
    color: "#F97316",
    description: "Receive POs, issue ETA invoices, get paid in 24-48 hours",
    benefits: [
      "Access to 680+ hotel buyers",
      "ETA-compliant invoicing",
      "48-hour factoring payout",
      "Real-time order notifications",
    ],
  },
  {
    key: "FACTORING" as const,
    icon: Landmark,
    label: "Factoring Company",
    labelAr: "شركة تمويل",
    color: "#A855F7",
    description: "Access pre-verified invoices, competitive bidding, bank-direct settlement",
    benefits: [
      "Pre-verified ETA invoices",
      "Competitive bidding dashboard",
      "Bank-direct settlement",
      "FRA anti-fraud compliance",
    ],
  },
  {
    key: "SHIPPING" as const,
    icon: Truck,
    label: "Logistics Provider",
    labelAr: "شركة لوجستيات",
    color: "#3B82F6",
    description: "Shared-route optimization, GPS tracking, auto-settlement on delivery",
    benefits: [
      "Shared-route cost reduction",
      "GPS tracking for deliveries",
      "Auto-settlement on POD",
      "Coastal hub model",
    ],
  },
];

type PlatformRole = "HOTEL" | "SUPPLIER" | "FACTORING" | "SHIPPING";

const VALID_SECTORS: PlatformRole[] = ["HOTEL", "SUPPLIER", "FACTORING", "SHIPPING"];

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectorParam = searchParams.get("sector");

  const preselectedRole = VALID_SECTORS.includes(sectorParam as PlatformRole)
    ? (sectorParam as PlatformRole)
    : null;

  const [selectedRole, setSelectedRole] = useState<PlatformRole | null>(preselectedRole);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userCount, setUserCount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedRole) {
      setError("Please select your role");
      return;
    }
    if (!companyName || companyName.length < 2) {
      setError("Company name must be at least 2 characters");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        name: companyName,
        email,
        platformRole: selectedRole,
        numberOfUsers: userCount,
      };

      if (phone) {
        body.phone = `+20${phone.replace(/[^0-9]/g, "")}`;
      } else {
        body.phone = "0000000000";
      }

      const res = await fetch("/api/v1/auth/staged-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setRegistered(true);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundColor: "var(--bg-canvas)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-sm"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "rgba(34,197,94,0.12)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2
              className="text-xl font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Account Created
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              Registration successful! Check your email to verify your account.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: "var(--accent-base)",
                color: "#FFFFFF",
                border: "none",
              }}
            >
              Sign In
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--bg-canvas)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-lg">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium mb-4"
              style={{
                backgroundColor: "var(--accent-muted)",
                border: "1px solid rgba(232,168,56,0.15)",
                color: "var(--accent-base)",
              }}
            >
              <Sparkles size={12} />
              Create your account in 2 minutes
            </div>
            <h1
              className="text-[20px] md:text-[24px] font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Join Hotels Vendors
            </h1>
            <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
              {selectedRole
                ? "Enter your company details to get started."
                : "Select your role and enter your details to get started."}
            </p>
          </motion.div>

          {/* Role Selector — hidden when sector is preselected from URL */}
          {!preselectedRole && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <label
                className="block text-[12px] font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {SECTORS.map((sector) => {
                  const Icon = sector.icon;
                  const isSelected = selectedRole === sector.key;
                  return (
                    <button
                      key={sector.key}
                      type="button"
                      onClick={() => setSelectedRole(sector.key)}
                      className="rounded-xl p-3 text-left transition-all cursor-pointer"
                      style={{
                        backgroundColor: isSelected
                          ? sector.color + "15"
                          : "var(--bg-surface-1)",
                        border: isSelected
                          ? `1.5px solid ${sector.color}`
                          : "1px solid var(--border-subtle)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={18} style={{ color: sector.color }} />
                        <span
                          className="text-[13px] font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {sector.label}
                        </span>
                      </div>
                      {isSelected && (
                        <ul className="space-y-0.5 mt-1">
                          {sector.benefits.slice(0, 2).map((b) => (
                            <li
                              key={b}
                              className="flex items-center gap-1.5 text-[10px]"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <span
                                className="w-1 h-1 rounded-full shrink-0"
                                style={{ backgroundColor: sector.color }}
                              />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Company Name */}
            <div>
              <label
                className="block text-[12px] font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Company Ltd."
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-colors"
                style={{
                  backgroundColor: "var(--bg-surface-1)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-sans)",
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-[12px] font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmed@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-colors"
                style={{
                  backgroundColor: "var(--bg-surface-1)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-sans)",
                }}
              />
            </div>

            {/* Phone — optional */}
            <div>
              <label
                className="block text-[12px] font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Phone Number{" "}
                <span
                  className="text-[11px]"
                  style={{ color: "var(--text-secondary)", opacity: 0.6 }}
                >
                  (optional)
                </span>
              </label>
              <div className="flex">
                <div
                  className="flex items-center px-3.5 py-2.5 rounded-l-xl text-[14px] font-medium"
                  style={{
                    backgroundColor: "var(--bg-surface-1)",
                    border: "1px solid var(--border-subtle)",
                    borderRight: "none",
                    color: "var(--text-secondary)",
                  }}
                >
                  +20
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="1001234567"
                  className="flex-1 px-3.5 py-2.5 rounded-r-xl text-[14px] outline-none transition-colors"
                  style={{
                    backgroundColor: "var(--bg-surface-1)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-sans)",
                  }}
                />
              </div>
            </div>

            {/* Number of Users */}
            <div>
              <label
                className="block text-[12px] font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Number of Users Who Need Access
              </label>
              <div className="relative">
                <select
                  value={userCount}
                  onChange={(e) => setUserCount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-surface-1)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <option value="1">Just me (1)</option>
                  <option value="2">Small team (2-10)</option>
                  <option value="11">Growing team (11-25)</option>
                  <option value="26">Large team (26-100)</option>
                  <option value="100">Enterprise (100+)</option>
                </select>
                <Users
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--text-secondary)" }}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[12px] font-medium px-1"
                style={{ color: "#EF4444" }}
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !selectedRole}
              className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
              style={{
                backgroundColor:
                  loading || !selectedRole
                    ? "var(--bg-surface-1)"
                    : "var(--accent-base)",
                color:
                  loading || !selectedRole
                    ? "var(--text-secondary)"
                    : "#FFFFFF",
                border: "none",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </motion.form>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-5"
          >
            {[
              { icon: Shield, label: "Bank-grade security", color: "#22C55E" },
              { icon: Zap, label: "Free to start", color: "var(--accent-base)" },
              { icon: Clock, label: "2 min registration", color: "#3B82F6" },
              { icon: Banknote, label: "No credit card", color: "#A855F7" },
            ].map((t) => (
              <span
                key={t.label}
                className="flex items-center gap-1.5 text-[10px]"
                style={{ color: "var(--text-secondary)" }}
              >
                <t.icon size={12} style={{ color: t.color }} />
                {t.label}
              </span>
            ))}
          </motion.div>

          {/* Sign in link */}
          <p
            className="text-center text-[12px] mt-5"
            style={{ color: "var(--text-secondary)" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="hover:underline font-medium"
              style={{ color: "var(--accent-base)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            backgroundColor: "var(--bg-canvas)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
          }}
        />
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
