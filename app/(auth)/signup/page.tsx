"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles, Eye, EyeOff, Loader2, Building2, Store } from "lucide-react"

type PlatformRole = "hotel" | "supplier"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<"role" | "form">("role")
  const [platformRole, setPlatformRole] = useState<PlatformRole>("hotel")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [phone, setPhone] = useState("")
  const [taxId, setTaxId] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const roles = [
    {
      value: "hotel" as PlatformRole,
      icon: Building2,
      title: "Hotel",
      description: "I work for a hotel or hotel group",
    },
    {
      value: "supplier" as PlatformRole,
      icon: Store,
      title: "Supplier",
      description: "I represent a supplier company",
    },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: platformRole,
          email,
          password,
          name,
          phone: phone || undefined,
          taxId: taxId || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Signup failed")
        return
      }

      setSuccess(true)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div
        className="w-full max-w-md mx-auto text-center"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "var(--accent-muted)" }}
        >
          <Sparkles className="w-6 h-6" style={{ color: "var(--accent-base)" }} />
        </div>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Check your email
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
          We sent a verification link to <strong>{email}</strong>
        </p>
        <p className="text-xs mt-4" style={{ color: "var(--text-tertiary)" }}>
          Didn&apos;t receive it? Check your spam folder or{" "}
          <a href="/signup" style={{ color: "var(--accent-base)" }}>try again</a>.
        </p>
      </div>
    )
  }

  return (
    <div
      className="w-full max-w-md mx-auto"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="text-center mb-8">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "var(--accent-muted)" }}
        >
          <Sparkles className="w-6 h-6" style={{ color: "var(--accent-base)" }} />
        </div>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Create your account
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Join HotelsVendors as a verified member
        </p>
      </div>

      {step === "role" ? (
        <div className="space-y-3">
          {roles.map((r) => {
            const Icon = r.icon
            const selected = platformRole === r.value
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => {
                  setPlatformRole(r.value)
                  setStep("form")
                }}
                className="w-full p-4 rounded-lg text-left transition-all"
                style={{
                  backgroundColor: selected ? "var(--accent-muted)" : "var(--bg-surface-1)",
                  border: `1px solid ${selected ? "var(--accent-base)" : "var(--border-subtle)"}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: selected ? "var(--accent-base)" : "var(--bg-surface-2)",
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{
                        color: selected ? "#fff" : "var(--text-secondary)",
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                      {r.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      {r.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <button
            type="button"
            onClick={() => setStep("role")}
            className="text-xs flex items-center gap-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            ← Change account type
          </button>

          {error && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "var(--error)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--bg-surface-1)" }}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--accent-muted)" }}
            >
              {platformRole === "hotel" ? (
                <Building2 className="w-4 h-4" style={{ color: "var(--accent-base)" }} />
              ) : (
                <Store className="w-4 h-4" style={{ color: "var(--accent-base)" }} />
              )}
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                {platformRole === "hotel" ? "Hotel Account" : "Supplier Account"}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-surface-1)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-base)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Company name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your company or hotel group"
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-surface-1)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-base)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-surface-1)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-base)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm outline-none transition-colors"
                style={{
                  backgroundColor: "var(--bg-surface-1)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-subtle)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-base)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-tertiary)" }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Phone <span style={{ color: "var(--text-tertiary)" }}>(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+20 100 000 0000"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-surface-1)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-base)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Tax ID <span style={{ color: "var(--text-tertiary)" }}>(optional)</span>
            </label>
            <input
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value.replace(/\D/g, "").slice(0, 15))}
              placeholder="Egyptian Tax Identification Number"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-surface-1)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-base)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
            />
            {taxId && taxId.length > 0 && (
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                {taxId.length >= 9 && taxId.length <= 15
                  ? "✓ Valid format"
                  : "9-15 digit Egyptian Tax ID"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
            style={{
              backgroundColor: "var(--accent-base)",
              color: "#fff",
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              "Create account"
            )}
          </button>
        </form>
      )}

      <p className="text-center text-sm mt-6" style={{ color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--accent-base)" }} className="hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
