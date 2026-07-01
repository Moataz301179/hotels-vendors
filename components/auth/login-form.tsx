"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, error, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  const isFormValid = email.trim() && password.length >= 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Welcome back
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "var(--error)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="8" r="7" />
              <line x1="8" y1="5" x2="8" y2="9" />
              <line x1="8" y1="11" x2="8.01" y2="11" />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="login-email"
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            autoComplete="email"
            className="surface-input w-full"
            style={{
              backgroundColor: "var(--bg-surface-1)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              padding: "14px 18px",
              fontSize: "14px",
              width: "100%",
              outline: "none",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent-base)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="login-password"
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="surface-input w-full"
              style={{
                backgroundColor: "var(--bg-surface-1)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                padding: "14px 18px",
                paddingRight: "44px",
                fontSize: "14px",
                width: "100%",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-base)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm transition-colors"
            style={{ color: "var(--accent-base)" }}
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="cta-glow w-full flex items-center justify-center gap-2 rounded-lg py-3 px-4 text-sm font-semibold transition-all duration-200"
          style={{
            backgroundColor: isFormValid ? "var(--accent-base)" : "var(--bg-surface-2)",
            color: isFormValid ? "var(--accent-text)" : "var(--text-muted)",
            cursor: isFormValid && !isLoading ? "pointer" : "not-allowed",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={18} />
              Sign in
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium transition-colors"
          style={{ color: "var(--accent-base)" }}
        >
          Create account
        </Link>
      </p>
    </motion.div>
  );
}
