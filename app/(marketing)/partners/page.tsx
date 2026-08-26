/**
 * Partner Portal — separate onboarding for FACTORING COMPANIES & LOGISTICS PROVIDERS.
 * Deliberately NOT part of /register: hotels & suppliers sign up on the main flow;
 * institutional partners come here from the footer ("Partner Portal") and get their
 * own dashboard + commercial terms.
 *
 * Bold Typography: black canvas, vermillion accent, sharp edges, type-as-hero.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Landmark, Truck, CheckCircle2, ShieldCheck, Building2 } from "lucide-react";

type PartnerRole = "FACTORING" | "LOGISTICS";

const PARTNER_TYPES: { value: PartnerRole; label: string; icon: React.ElementType; blurb: string }[] = [
  {
    value: "FACTORING",
    label: "Factoring / Funding Partner",
    icon: Landmark,
    blurb: "Purchase verified e-invoices (ETA-validated) from Egyptian hospitality suppliers. Non-recourse. Deal flow with zero sourcing effort.",
  },
  {
    value: "LOGISTICS",
    label: "Logistics / Carrier Partner",
    icon: Truck,
    blurb: "Fulfill shared-route hotel deliveries across Cairo, Giza & coastal clusters. Consolidated drops, POD-verified, paid per completed stop.",
  },
];

export default function PartnerPortalPage() {
  const router = useRouter();
  const [role, setRole] = useState<PartnerRole>("FACTORING");
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "", city: "Cairo", governorate: "Cairo" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (!form.name || !form.email || !form.password || !form.company) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: role === "FACTORING" ? "factoring" : "logistics",
          name: form.name,
          email: form.email,
          password: form.password,
          city: form.city,
          governorate: form.governorate,
          accountType: "business",
          marketingConsent: false,
          termsAccepted: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(role === "FACTORING" ? "/factoring" : "/shipping");
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const active = PARTNER_TYPES.find((p) => p.value === role)!;

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        {/* Kicker */}
        <p className="type-label text-[var(--accent)] mb-6">Partner Portal — Institutional</p>

        {/* Hero */}
        <h1 className="type-h1 text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.04em] font-semibold mb-6">
          Run capital or wheels,<br />not sales calls.
        </h1>
        <p className="text-foreground-secondary text-lg max-w-2xl mb-12 leading-relaxed">
          HotelsVendors routes verified hospitality transactions to funding and
          logistics partners. Hotels &amp; suppliers use the{" "}
          <Link href="/register" className="text-[var(--accent)] underline underline-offset-4 decoration-2 hover:decoration-[3px]">main registration</Link>.
          This portal is for institutions.
        </p>

        {/* Partner type selection — 2 large cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {PARTNER_TYPES.map((p) => (
            <button
              key={p.value}
              onClick={() => setRole(p.value)}
              className={`text-left border p-8 transition-colors duration-150 ${
                role === p.value
                  ? "border-[var(--accent)] bg-[var(--accent-muted,rgba(255,61,0,0.06))]"
                  : "border-border hover:border-foreground-secondary"
              }`}
            >
              <p.icon size={24} className={role === p.value ? "text-[var(--accent)]" : "text-foreground-secondary"} />
              <p className="mt-4 font-semibold text-lg tracking-[-0.01em]">{p.label}</p>
              <p className="mt-2 text-sm text-foreground-muted leading-relaxed">{p.blurb}</p>
            </button>
          ))}
        </div>

        {/* Commercial framing per partner */}
        <div className="border-t border-b border-border py-8 mb-10 grid md:grid-cols-3 gap-8">
          <div>
            <p className="type-label text-foreground-muted mb-2">Pricing</p>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              {role === "FACTORING"
                ? "Negotiated discount-rate share per funded invoice. No platform fees to you."
                : "Per-stop + per-km matrix by cluster. Volume tiers from week one."}
            </p>
          </div>
          <div>
            <p className="type-label text-foreground-muted mb-2">Dashboard</p>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              {role === "FACTORING"
                ? "Invoice pipeline, ETA validation status, portfolio yield, risk heatmap."
                : "Route planner, fleet, POD tracking, earnings per stop."}
            </p>
          </div>
          <div>
            <p className="type-label text-foreground-muted mb-2">Integration</p>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              Webhooks + REST API. ETA-validated invoices only. Idempotent, audit-logged.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-xl">
          <p className="type-label text-[var(--accent)] mb-6">Apply — {active.label}</p>

          {error && (
            <div className="border border-[var(--accent)] px-4 py-3 mb-6 text-sm text-[var(--accent)]">{error}</div>
          )}

          <div className="space-y-5">
            <Field label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} placeholder="Legal entity name" />
            <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Your full name" />
            <Field label="Work Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="name@company.com" type="email" />
            <Field label="Password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} placeholder="Minimum 8 characters" type="password" />

            <button
              onClick={submit}
              disabled={loading}
              className="w-full h-14 bg-foreground text-canvas font-semibold uppercase tracking-[0.1em] text-sm hover:bg-white/5 transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? "Submitting…" : "Request Partner Access"}
            </button>

            <p className="text-xs text-foreground-muted flex items-center gap-2 pt-2">
              <ShieldCheck size={14} className="text-[var(--accent)]" />
              Institutional onboarding includes KYB verification and a partnership agreement call.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <label className="block">
      <span className="type-label text-foreground-muted mb-2 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 bg-surface-input border border-border px-4 text-foreground placeholder:text-foreground-muted outline-none focus:border-[var(--accent)] transition-colors"
      />
    </label>
  );
}
