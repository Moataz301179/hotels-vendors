"use client";

import { useState, useEffect } from "react";
import {
  Wallet, Percent, CalendarClock, Building2,
  Save, RotateCcw, Loader2, CheckCircle2, AlertTriangle,
  Tag, Gift, ChevronDown, ChevronUp,
} from "lucide-react";

interface BillingSettings {
  fees: {
    platformFeeRate: number;
    minOrderFee: number;
    maxOrderFee: number;
  };
  supplierTiers: {
    tierB: number;
    tierA: number;
    tierS: number;
  };
  referral: {
    enabled: boolean;
    refereeDiscountPct: number;
    referrerBonusEgp: number;
    maxReferralUses: number;
  };
  payout: {
    day: number;
    currency: string;
    autoPayoutEnabled: boolean;
    minPayoutThreshold: number;
  };
  bank: {
    name: string | null;
    accountName: string | null;
    accountNumber: string | null;
    iban: string | null;
    swiftCode: string | null;
    branch: string | null;
  };
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Section({ icon, title, subtitle, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex items-center gap-3 hover:bg-surface-1 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-foreground-secondary">{title}</h2>
          <p className="text-[11px] text-foreground-muted">{subtitle}</p>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-foreground-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-foreground-muted" />
        )}
      </button>
      {open && <div className="px-5 pb-5 border-t border-border-invisible">{children}</div>}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  prefix,
  suffix,
  hint,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  prefix?: string;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div>
      {label && <label className="block text-[11px] text-foreground-muted mb-1.5">{label}</label>}
      <div className="flex items-center">
        {prefix && (
          <span className="text-[12px] text-foreground-muted pr-2 border-r border-border-subtle shrink-0">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-surface-1 border border-border-subtle text-sm text-white placeholder-foreground-muted focus:outline-none focus:border-accent-base/50 transition-colors"
        />
        {suffix && (
          <span className="text-[12px] text-foreground-muted pl-2 border-l border-border-subtle shrink-0">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-[10px] text-foreground-muted mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm text-foreground-secondary">{label}</p>
        {desc && <p className="text-[10px] text-foreground-muted">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors shrink-0 ${
          checked ? "bg-accent-base/20" : "bg-surface-2"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
            checked ? "right-0.5 bg-accent-base" : "left-0.5 bg-surface-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function AdminBillingPage() {
  const [settings, setSettings] = useState<BillingSettings | null>(null);
  const [draft, setDraft] = useState<BillingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/v1/admin/billing")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setSettings(json.data);
          setDraft(json.data);
        }
      })
      .catch(() => setToast({ type: "error", msg: "Failed to load billing settings" }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const update = (path: string, value: unknown) => {
    if (!draft) return;
    const keys = path.split(".");
    const next = JSON.parse(JSON.stringify(draft)) as Record<string, unknown>;
    let obj: Record<string, unknown> = next;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]] as Record<string, unknown>;
    obj[keys[keys.length - 1]] = value;
    setDraft(next as unknown as BillingSettings);
  };

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(settings);

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        platformFeeRate: draft.fees.platformFeeRate,
        minOrderFee: draft.fees.minOrderFee,
        maxOrderFee: draft.fees.maxOrderFee,
        supplierTierBRate: draft.supplierTiers.tierB,
        supplierTierARate: draft.supplierTiers.tierA,
        supplierTierSRate: draft.supplierTiers.tierS,
        referralEnabled: draft.referral.enabled,
        refereeDiscountPct: draft.referral.refereeDiscountPct,
        referrerBonusEgp: draft.referral.referrerBonusEgp,
        maxReferralUses: draft.referral.maxReferralUses,
        payoutDay: draft.payout.day,
        payoutCurrency: draft.payout.currency,
        autoPayoutEnabled: draft.payout.autoPayoutEnabled,
        minPayoutThreshold: draft.payout.minPayoutThreshold,
        bankName: draft.bank.name,
        bankAccountName: draft.bank.accountName,
        bankAccountNumber: draft.bank.accountNumber,
        bankIban: draft.bank.iban,
        bankSwiftCode: draft.bank.swiftCode,
        bankBranch: draft.bank.branch,
      };
      const res = await fetch("/api/v1/admin/billing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setSettings(draft);
        setToast({ type: "success", msg: "Billing settings saved" });
      } else {
        setToast({ type: "error", msg: json.error || "Failed to save" });
      }
    } catch {
      setToast({ type: "error", msg: "Network error" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (settings) setDraft(JSON.parse(JSON.stringify(settings)));
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-border-subtle mb-8">
          <div className="py-6">
            <div className="h-7 w-48 bg-surface-2 rounded animate-pulse" />
            <div className="h-3 w-64 bg-surface-1 rounded mt-2 animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-surface-1 border border-border-subtle animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          Failed to load billing settings
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in-up">
          <div
            className={`px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {toast.msg}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border-subtle mb-8">
        <div className="py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-white flex items-center gap-3">
              <Wallet className="w-6 h-6 text-accent-base" />
              Billing & Payouts
            </h1>
            <p className="text-[13px] text-foreground-muted mt-1">
              Configure platform fees, commissions, referral program, and payout schedules
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={!hasChanges}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border-subtle text-foreground-secondary hover:bg-surface-1 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="btn-accent text-xs px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4 max-w-[900px]">
        {/* Platform Fees */}
        <Section
          icon={<Percent className="w-4 h-4 text-accent-base" />}
          title="Platform Fee"
          subtitle="Base transaction fee charged on every completed order"
        >
          <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Fee Rate (%)"
              suffix="%"
              type="number"
              value={draft.fees.platformFeeRate}
              onChange={(v) => update("fees.platformFeeRate", parseFloat(v) || 0)}
            />
            <Input
              label="Min Fee (EGP)"
              prefix="EGP"
              type="number"
              value={draft.fees.minOrderFee}
              onChange={(v) => update("fees.minOrderFee", parseFloat(v) || 0)}
            />
            <Input
              label="Max Fee Cap (EGP)"
              prefix="EGP"
              type="number"
              value={draft.fees.maxOrderFee}
              onChange={(v) => update("fees.maxOrderFee", parseFloat(v) || 0)}
              hint="0 = no cap"
            />
          </div>
          <p className="text-[10px] text-foreground-muted mt-3">
            Orders below min fee are not charged. Max fee caps the total platform fee per order.
          </p>
        </Section>

        {/* Supplier Tier Commissions */}
        <Section
          icon={<Tag className="w-4 h-4 text-[#f59e0b]" />}
          title="Supplier Tier Commissions"
          subtitle="Commission rates override the base fee per supplier tier"
        >
          <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "tierB" as const, label: "Tier B (Standard)", desc: "New & small suppliers", color: "#f59e0b" },
              { key: "tierA" as const, label: "Tier A (Established)", desc: "Proven track record", color: "var(--info)" },
              { key: "tierS" as const, label: "Tier S (Premium)", desc: "Top-volume partners", color: "var(--accent-base)" },
            ].map((tier) => (
              <div key={tier.key} className="p-4 rounded-lg bg-surface-1 border border-border-invisible">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tier.color }} />
                  <div>
                    <p className="text-xs font-medium text-foreground-secondary">{tier.label}</p>
                    <p className="text-[10px] text-foreground-muted">{tier.desc}</p>
                  </div>
                </div>
                <Input
                  label=""
                  suffix="%"
                  type="number"
                  value={draft.supplierTiers[tier.key]}
                  onChange={(v) => update(`supplierTiers.${tier.key}`, parseFloat(v) || 0)}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Referral Program */}
        <Section
          icon={<Gift className="w-4 h-4 text-purple-base" />}
          title="Referral Program"
          subtitle="Discounts and bonuses for the supplier/hotel referral loop"
          defaultOpen={false}
        >
          <div className="pt-4 space-y-4">
            <Toggle
              checked={draft.referral.enabled}
              onChange={(v) => update("referral.enabled", v)}
              label="Referral Program"
              desc="Enable supplier and hotel referral rewards"
            />
            {draft.referral.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Referee Discount"
                  suffix="%"
                  type="number"
                  value={draft.referral.refereeDiscountPct}
                  onChange={(v) => update("referral.refereeDiscountPct", parseFloat(v) || 0)}
                  hint="Discount the new user gets on first order"
                />
                <Input
                  label="Referrer Bonus (EGP)"
                  prefix="EGP"
                  type="number"
                  value={draft.referral.referrerBonusEgp}
                  onChange={(v) => update("referral.referrerBonusEgp", parseFloat(v) || 0)}
                  hint="Credit the referring account receives"
                />
                <Input
                  label="Max Referral Uses"
                  type="number"
                  value={draft.referral.maxReferralUses}
                  onChange={(v) => update("referral.maxReferralUses", parseInt(v) || 0)}
                  hint="0 = unlimited"
                />
              </div>
            )}
          </div>
        </Section>

        {/* Payout Schedule */}
        <Section
          icon={<CalendarClock className="w-4 h-4 text-[#06b6d4]" />}
          title="Payout Schedule"
          subtitle="Settlement day and minimum payout thresholds"
          defaultOpen={false}
        >
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Settlement Day (1-28)"
                suffix="of each month"
                type="number"
                value={draft.payout.day}
                onChange={(v) => update("payout.day", parseInt(v) || 1)}
              />
              <div>
                <label className="block text-[11px] text-foreground-muted mb-1.5">Currency</label>
                <select
                  value={draft.payout.currency}
                  onChange={(e) => update("payout.currency", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-1 border border-border-subtle text-sm text-white focus:outline-none focus:border-accent-base/50 transition-colors"
                >
                  <option value="EGP">EGP — Egyptian Pound</option>
                  <option value="USD">USD — US Dollar</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Min Payout Threshold (EGP)"
                prefix="EGP"
                type="number"
                value={draft.payout.minPayoutThreshold}
                onChange={(v) => update("payout.minPayoutThreshold", parseFloat(v) || 0)}
                hint="Balance below this rolls to next cycle"
              />
              <div className="flex items-end pb-1">
                <Toggle
                  checked={draft.payout.autoPayoutEnabled}
                  onChange={(v) => update("payout.autoPayoutEnabled", v)}
                  label="Auto-Payout"
                  desc="Automatically trigger payouts on settlement day"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Bank Account */}
        <Section
          icon={<Building2 className="w-4 h-4 text-foreground-muted" />}
          title="Bank Account Details"
          subtitle="Platform receiving account for supplier payouts"
          defaultOpen={false}
        >
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-foreground-muted mb-1.5">Bank Name</label>
              <input
                type="text"
                value={draft.bank.name ?? ""}
                onChange={(e) => update("bank.name", e.target.value || null)}
                placeholder="e.g. National Bank of Egypt"
                className="w-full px-3 py-2 rounded-lg bg-surface-1 border border-border-subtle text-sm text-white placeholder-foreground-muted focus:outline-none focus:border-accent-base/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-foreground-muted mb-1.5">Account Name</label>
              <input
                type="text"
                value={draft.bank.accountName ?? ""}
                onChange={(e) => update("bank.accountName", e.target.value || null)}
                placeholder="e.g. Hotels Vendors Ltd."
                className="w-full px-3 py-2 rounded-lg bg-surface-1 border border-border-subtle text-sm text-white placeholder-foreground-muted focus:outline-none focus:border-accent-base/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-foreground-muted mb-1.5">Account Number</label>
              <input
                type="text"
                value={draft.bank.accountNumber ?? ""}
                onChange={(e) => update("bank.accountNumber", e.target.value || null)}
                placeholder="Account number"
                className="w-full px-3 py-2 rounded-lg bg-surface-1 border border-border-subtle text-sm text-white placeholder-foreground-muted focus:outline-none focus:border-accent-base/50 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-foreground-muted mb-1.5">IBAN</label>
              <input
                type="text"
                value={draft.bank.iban ?? ""}
                onChange={(e) => update("bank.iban", e.target.value || null)}
                placeholder="EG..."
                className="w-full px-3 py-2 rounded-lg bg-surface-1 border border-border-subtle text-sm text-white placeholder-foreground-muted focus:outline-none focus:border-accent-base/50 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-foreground-muted mb-1.5">SWIFT Code</label>
              <input
                type="text"
                value={draft.bank.swiftCode ?? ""}
                onChange={(e) => update("bank.swiftCode", e.target.value || null)}
                placeholder="SWIFT/BIC"
                className="w-full px-3 py-2 rounded-lg bg-surface-1 border border-border-subtle text-sm text-white placeholder-foreground-muted focus:outline-none focus:border-accent-base/50 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-foreground-muted mb-1.5">Branch</label>
              <input
                type="text"
                value={draft.bank.branch ?? ""}
                onChange={(e) => update("bank.branch", e.target.value || null)}
                placeholder="Branch name or code"
                className="w-full px-3 py-2 rounded-lg bg-surface-1 border border-border-subtle text-sm text-white placeholder-foreground-muted focus:outline-none focus:border-accent-base/50 transition-colors"
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
