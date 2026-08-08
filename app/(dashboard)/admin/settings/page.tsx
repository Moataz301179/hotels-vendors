"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, Save, Settings, Shield, FileCheck } from "lucide-react";

// ─── Types ───────────────────────────────────────────────

interface AdminSettings {
  platformName: string;
  defaultCurrency: string;
  locale: string;
  taxId: string;
  eInvoicingEnabled: boolean;
  factoringMinRate: number;
  factoringMaxRate: number;
}

const DEFAULT_SETTINGS: AdminSettings = {
  platformName: "Hotels Vendors",
  defaultCurrency: "EGP",
  locale: "en",
  taxId: "",
  eInvoicingEnabled: false,
  factoringMinRate: 1.5,
  factoringMaxRate: 5,
};

// ─── Small presentational helpers ───────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 " +
  "placeholder:text-slate-400 shadow-sm transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60";

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [form, setForm] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Load existing settings (graceful: keep defaults on failure)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/admin/settings", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
        const data = (json.data ?? json) as Partial<AdminSettings>;
        if (!cancelled) {
          setForm((prev) => ({ ...prev, ...data }));
        }
      } catch {
        // ignore load failures; defaults let the user still edit & save
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(
    <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError(null);
      setToast(null);
      try {
        const res = await fetch("/api/v1/admin/settings", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
        setToast("Settings saved successfully");
        window.setTimeout(() => setToast(null), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save settings");
      } finally {
        setSaving(false);
      }
    },
    [form]
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Admin Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Platform configuration, ETA compliance and factoring rates
            </p>
          </div>
          {loading ? (
            <span className="text-xs text-slate-400">Loading…</span>
          ) : null}
        </div>

        {/* Toast */}
        <div aria-live="polite" className="mb-6">
          {toast ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              <Save size={16} />
              {toast}
            </div>
          ) : error ? (
            <div className="flex items-center rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General */}
          <SectionCard
            icon={<Settings size={18} />}
            title="General"
            description="Core platform identity and regional defaults"
          >
            <Field label="Platform name">
              <input
                className={inputClass}
                value={form.platformName}
                onChange={(e) => update("platformName", e.target.value)}
                placeholder="e.g. Hotels Vendors"
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Default currency">
                <select
                  className={inputClass}
                  value={form.defaultCurrency}
                  onChange={(e) => update("defaultCurrency", e.target.value)}
                >
                  <option value="EGP">EGP — Egyptian Pound</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                </select>
              </Field>
              <Field label="Locale">
                <select
                  className={inputClass}
                  value={form.locale}
                  onChange={(e) => update("locale", e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                </select>
              </Field>
            </div>
          </SectionCard>

          {/* ETA Compliance */}
          <SectionCard
            icon={<Shield size={18} />}
            title="ETA Compliance"
            description="Egyptian Tax Authority e-invoicing configuration"
          >
            <Field label="Tax ID" hint="Vendor tax registration number (optional)">
              <input
                className={inputClass}
                value={form.taxId}
                onChange={(e) => update("taxId", e.target.value)}
                placeholder="e.g. 123-456-789"
              />
            </Field>
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
              <span className="flex items-center gap-3">
                <FileCheck size={18} className="text-slate-400" />
                <span>
                  <span className="block text-sm font-medium text-slate-700">
                    E-Invoicing
                  </span>
                  <span className="block text-xs text-slate-500">
                    Submit invoices to the ETA in real time
                  </span>
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={form.eInvoicingEnabled}
                onClick={() => update("eInvoicingEnabled", !form.eInvoicingEnabled)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  form.eInvoicingEnabled ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    form.eInvoicingEnabled ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </label>
          </SectionCard>

          {/* Factor Rates */}
          <SectionCard
            icon={<Building2 size={18} />}
            title="Factor Rates"
            description="Liquidity discount range offered to factoring partners (48h)"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Min factoring % (48h)">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className={inputClass}
                  value={form.factoringMinRate}
                  onChange={(e) =>
                    update("factoringMinRate", Number(e.target.value))
                  }
                />
              </Field>
              <Field label="Max factoring % (48h)">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className={inputClass}
                  value={form.factoringMaxRate}
                  onChange={(e) =>
                    update("factoringMaxRate", Number(e.target.value))
                  }
                />
              </Field>
            </div>
            <p className="text-xs text-slate-400">
              Rates are shown as a percentage discount applied to 48-hour
              factoring settlements.
            </p>
          </SectionCard>

          {/* Save */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}