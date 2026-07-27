"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Building2, Store, Sparkles, CheckCircle2 } from "lucide-react"

type PlatformRole = "hotel" | "supplier"

export default function SignupPage() {
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
    { value: "hotel" as PlatformRole, icon: Building2, title: "Hotel", description: "I work for a hotel or hotel group", color: "#39ff7e" },
    { value: "supplier" as PlatformRole, icon: Store, title: "Supplier", description: "I represent a supplier company", color: "#ff7e1a" },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: platformRole, email, password, name, phone: phone || undefined, taxId: taxId || undefined, accountType: "individual" }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Signup failed"); return }
      setSuccess(true)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="w-16 h-16 rounded-full bg-[#39ff7e]/10 border border-[#39ff7e]/20 flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} className="text-[#39ff7e]" />
        </div>
        <div>
          <h1 className="text-[24px] font-semibold text-white mb-2">Check your email</h1>
          <p className="text-white/40 text-[14px]">
            We sent a verification link to <strong className="text-white/60">{email}</strong>
          </p>
        </div>
        <p className="text-[13px] text-white/25">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <a href="/signup" className="text-[#39ff7e] hover:opacity-80">try again</a>.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39ff7e]/[0.08] border border-[#39ff7e]/15 text-[#39ff7e] text-[11px] font-medium uppercase tracking-[0.15em] mb-5">
          <Sparkles size={11} />
          Quick Signup
        </div>
        <h1 className="text-[28px] font-semibold text-white tracking-[-0.02em]">Create Account</h1>
        <p className="mt-2 text-[14px] text-white/40">Join HotelsVendors as a verified member.</p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#12121a] p-6 sm:p-8">
        {step === "role" ? (
          <div className="space-y-3">
            {roles.map((r) => {
              const Icon = r.icon
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => { setPlatformRole(r.value); setStep("form"); }}
                  className="w-full p-4 rounded-xl text-left border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${r.color}10` }}>
                      <Icon className="w-5 h-5" style={{ color: r.color }} />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white">{r.title}</p>
                      <p className="text-xs mt-0.5 text-white/40">{r.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <button type="button" onClick={() => setStep("role")} className="text-xs text-white/30 hover:text-white/50 transition-colors">
              &larr; Change account type
            </button>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-sm text-red-400">{error}</div>
            )}

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${roles.find(r => r.value === platformRole)?.color}10` }}>
                {platformRole === "hotel" ? <Building2 className="w-4 h-4 text-[#39ff7e]" /> : <Store className="w-4 h-4 text-[#ff7e1a]" />}
              </div>
              <p className="text-xs font-medium text-white">{platformRole === "hotel" ? "Hotel Account" : "Supplier Account"}</p>
            </div>

            {[
              { label: "Full name", type: "text", value: name, onChange: setName, placeholder: "Your full name", required: true },
              { label: "Company name", type: "text", value: companyName, onChange: setCompanyName, placeholder: "Your company or hotel group", required: true },
              { label: "Email", type: "email", value: email, onChange: setEmail, placeholder: "you@company.com", required: true },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-[13px] font-medium text-white/50 mb-1.5">{field.label}</label>
                <input type={field.type} value={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder={field.placeholder} required={field.required}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/15 outline-none focus:border-[#39ff7e]/30 focus:ring-1 focus:ring-[#39ff7e]/10 transition-all" />
              </div>
            ))}

            <div>
              <label className="block text-[13px] font-medium text-white/50 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/15 outline-none focus:border-[#39ff7e]/30 focus:ring-1 focus:ring-[#39ff7e]/10 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {[
              { label: "Phone", sub: "(optional)", type: "tel", value: phone, onChange: setPhone, placeholder: "+20 100 000 0000" },
              { label: "Tax ID", sub: "(optional)", type: "text", value: taxId, onChange: setTaxId, placeholder: "Egyptian Tax Identification Number" },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-[13px] font-medium text-white/50 mb-1.5">{field.label} <span className="text-white/25">{field.sub}</span></label>
                <input type={field.type} value={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/15 outline-none focus:border-[#39ff7e]/30 focus:ring-1 focus:ring-[#39ff7e]/10 transition-all" />
                {field.label === "Tax ID" && taxId && (
                  <p className="text-xs mt-1 text-white/25">{taxId.length >= 9 && taxId.length <= 15 ? "Valid format" : "9-15 digit Egyptian Tax ID"}</p>
                )}
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-[13px] font-semibold bg-[#39ff7e] text-[#07090f] hover:bg-[#39ff7e]/90 disabled:opacity-50 transition-all hover:shadow-[0_0_20px_rgba(57,255,126,0.15)]">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create account"}
            </button>
          </form>
        )}
      </div>

      <p className="text-center text-[13px] text-white/30">
        Already have an account?{" "}
        <Link href="/login" className="text-[#39ff7e] hover:opacity-80 font-medium transition-opacity">Sign in</Link>
      </p>
    </div>
  )
}
