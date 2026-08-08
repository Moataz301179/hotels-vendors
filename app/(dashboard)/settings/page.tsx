"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, KeyRound, Save, User } from "lucide-react";

// ─── Types ───────────────────────────────────────────────

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
}

interface Preferences {
  orderAlerts: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

interface PasswordForm {
  current: string;
  next: string;
  confirm: string;
}

const DEFAULT_PROFILE: ProfileForm = { name: "", email: "", phone: "" };
const DEFAULT_PREFS: Preferences = {
  orderAlerts: true,
  marketingEmails: false,
  securityAlerts: true,
};
const DEFAULT_PASSWORD: PasswordForm = { current: "", next: "", confirm: "" };

const inputClass =
  "w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 " +
  "placeholder:text-slate-400 shadow-sm transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Card({
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

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

// ─── Page ────────────────────────────────────────────────

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState<ProfileForm>(DEFAULT_PROFILE);
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [password, setPassword] = useState<PasswordForm>(DEFAULT_PASSWORD);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Pre-fill profile from the authenticated user (graceful on failure)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/auth/me", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
        const me = json.data ?? json;
        if (!cancelled && me) {
          setProfile({
            name: me.name ?? "",
            email: me.email ?? "",
            phone: me.phone ?? "",
          });
        }
      } catch {
        // keep anonymous defaults; user can still edit
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setProfileField = useCallback(
    <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) =>
      setProfile((prev) => ({ ...prev, [key]: value })),
    []
  );

  const setPrefField = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
      setPrefs((prev) => ({ ...prev, [key]: value })),
    []
  );

  const setPasswordField = useCallback(
    <K extends keyof PasswordForm>(key: K, value: PasswordForm[K]) =>
      setPassword((prev) => ({ ...prev, [key]: value })),
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setToast(null);
    try {
        const body: Record<string, unknown> = {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          preferences: prefs,
        };
        if (password.next) {
          if (password.next !== password.confirm) {
            throw new Error("New password and confirmation do not match");
          }
          body.currentPassword = password.current;
          body.newPassword = password.next;
        }
        const res = await fetch("/api/v1/auth/me", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
        setToast("Account settings saved successfully");
        setPassword(DEFAULT_PASSWORD);
        window.setTimeout(() => setToast(null), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save settings");
      } finally {
        setSaving(false);
      }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Account Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your profile, notification preferences and password
            </p>
          </div>
          {loading ? (
            <span className="text-xs text-slate-400">Loading…</span>
          ) : null}
        </div>

        {/* Status feedback */}
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
          {/* Profile */}
          <Card
            icon={<User size={18} />}
            title="Profile"
            description="Your personal account details"
          >
            <Field label="Full name">
              <input
                className={inputClass}
                value={profile.name}
                onChange={(e) => setProfileField("name", e.target.value)}
                placeholder="Your name"
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Email">
                <input
                  type="email"
                  className={inputClass}
                  value={profile.email}
                  onChange={(e) => setProfileField("email", e.target.value)}
                  placeholder="you@company.com"
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  className={inputClass}
                  value={profile.phone}
                  onChange={(e) => setProfileField("phone", e.target.value)}
                  placeholder="+20 10 0000 0000"
                />
              </Field>
            </div>
          </Card>

          {/* Notifications */}
          <Card
            icon={<Bell size={18} />}
            title="Notification Preferences"
            description="Choose how we keep you informed"
          >
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
                <span>
                  <span className="block text-sm font-medium text-slate-700">
                    Order alerts
                  </span>
                  <span className="block text-xs text-slate-500">
                    Notify me about order updates and receipts
                  </span>
                </span>
                <Toggle
                  checked={prefs.orderAlerts}
                  onChange={(v) => setPrefField("orderAlerts", v)}
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
                <span>
                  <span className="block text-sm font-medium text-slate-700">
                    Security alerts
                  </span>
                  <span className="block text-xs text-slate-500">
                    Notify me about sign-ins and password changes
                  </span>
                </span>
                <Toggle
                  checked={prefs.securityAlerts}
                  onChange={(v) => setPrefField("securityAlerts", v)}
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
                <span>
                  <span className="block text-sm font-medium text-slate-700">
                    Marketing emails
                  </span>
                  <span className="block text-xs text-slate-500">
                    Occasional product news and offers
                  </span>
                </span>
                <Toggle
                  checked={prefs.marketingEmails}
                  onChange={(v) => setPrefField("marketingEmails", v)}
                />
              </label>
            </div>
          </Card>

          {/* Security */}
          <Card
            icon={<KeyRound size={18} />}
            title="Security"
            description="Update your password (leave blank to keep current)"
          >
            <Field label="Current password">
              <input
                type="password"
                className={inputClass}
                value={password.current}
                onChange={(e) => setPasswordField("current", e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="New password">
                <input
                  type="password"
                  className={inputClass}
                  value={password.next}
                  onChange={(e) => setPasswordField("next", e.target.value)}
                  placeholder="New password"
                  autoComplete="new-password"
                />
              </Field>
              <Field label="Confirm new password">
                <input
                  type="password"
                  className={inputClass}
                  value={password.confirm}
                  onChange={(e) => setPasswordField("confirm", e.target.value)}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
              </Field>
            </div>
          </Card>

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