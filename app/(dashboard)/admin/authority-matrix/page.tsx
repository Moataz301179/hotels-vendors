"use client";

import { useState, useEffect } from "react";

interface AuthorityRule {
  id: string;
  name: string;
  priority: number;
  minValue: number;
  maxValue: number;
  hotelRiskTier: string | null;
  hotelTier: string | null;
  supplierTier: string | null;
  requesterRole: string | null;
  requiresPaymentGuarantee: boolean;
  requiresEtaValidation: boolean;
  requiresDualSignOff: boolean;
  action: string;
  routeToRole: string | null;
  tenantId: string | null;
  isActive: boolean;
}

const ACTION_OPTIONS = [
  "AUTO_APPROVE", "APPROVE", "ROUTE_TO_GM", "ROUTE_TO_FINANCIAL_CONTROLLER",
  "REQUIRE_OWNER", "DUAL_SIGN_OFF", "REJECT", "REQUIRE_PAYMENT_GUARANTEE", "SMART_FIX_REQUIRED",
];

const RISK_TIERS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const HOTEL_TIERS = ["ECONOMY", "STANDARD", "PREMIUM", "LUXURY", "CORE"];
const SUPPLIER_TIERS = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
const ROLES = ["CLERK", "DEPARTMENT_HEAD", "GM", "FINANCIAL_CONTROLLER", "ADMIN"];

function RuleCard({ rule, onToggle, onDelete }: {
  rule: AuthorityRule;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const actionColors: Record<string, string> = {
    AUTO_APPROVE: "bg-green-500/10 text-green-400 border-green-500/20",
    APPROVE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    REJECT: "bg-red-500/10 text-red-400 border-red-500/20",
    DUAL_SIGN_OFF: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    ROUTE_TO_GM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    ROUTE_TO_FINANCIAL_CONTROLLER: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    REQUIRE_OWNER: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    REQUIRE_PAYMENT_GUARANTEE: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    SMART_FIX_REQUIRED: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  };

  return (
    <div className={`rounded-xl border p-4 transition-all ${rule.isActive ? "border-white/10 bg-white/[0.03]" : "border-white/5 bg-white/[0.01] opacity-60"}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{rule.name}</h3>
          <p className="text-xs text-white/50 mt-0.5">Priority: {rule.priority}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(rule.id, !rule.isActive)}
            className={`w-9 h-5 rounded-full transition-colors relative ${rule.isActive ? "bg-indigo-500" : "bg-white/10"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${rule.isActive ? "left-[18px]" : "left-0.5"}`} />
          </button>
          {rule.tenantId && (
            <button onClick={() => onDelete(rule.id)} className="text-white/30 hover:text-red-400 text-xs">Delete</button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${actionColors[rule.action] ?? "bg-white/5 text-white/60 border-white/10"}`}>
          {rule.action.replace(/_/g, " ")}
        </span>
        {rule.hotelRiskTier && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Risk: {rule.hotelRiskTier}
          </span>
        )}
        {rule.hotelTier && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Hotel: {rule.hotelTier}
          </span>
        )}
        {rule.supplierTier && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Supplier: {rule.supplierTier}
          </span>
        )}
        {rule.requesterRole && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Role: {rule.requesterRole}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-[11px] text-white/40">
        <span>${rule.minValue.toLocaleString()} — ${rule.maxValue.toLocaleString()}</span>
        {rule.requiresDualSignOff && <span className="text-purple-400">Dual Sign-Off</span>}
        {!rule.tenantId && <span className="text-amber-400">Global</span>}
      </div>
    </div>
  );
}

function NewRuleForm({ onSubmit, onCancel }: { onSubmit: (data: Partial<AuthorityRule>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: "",
    priority: 500,
    minValue: 0,
    maxValue: 999999999,
    action: "APPROVE",
    hotelRiskTier: "",
    hotelTier: "",
    supplierTier: "",
    requesterRole: "",
    requiresDualSignOff: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      hotelRiskTier: form.hotelRiskTier || null,
      hotelTier: form.hotelTier || null,
      supplierTier: form.supplierTier || null,
      requesterRole: form.requesterRole || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-white">New Authority Rule</h3>

      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Rule name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="col-span-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50"
          required
        />
        <input
          type="number"
          placeholder="Priority (0-9999)"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50"
        />
        <select
          value={form.action}
          onChange={(e) => setForm({ ...form, action: e.target.value })}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
        >
          {ACTION_OPTIONS.map((a) => <option key={a} value={a}>{a.replace(/_/g, " ")}</option>)}
        </select>
        <input
          type="number"
          placeholder="Min value"
          value={form.minValue}
          onChange={(e) => setForm({ ...form, minValue: parseInt(e.target.value) || 0 })}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50"
        />
        <input
          type="number"
          placeholder="Max value"
          value={form.maxValue}
          onChange={(e) => setForm({ ...form, maxValue: parseInt(e.target.value) || 999999999 })}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50"
        />
        <select value={form.hotelRiskTier} onChange={(e) => setForm({ ...form, hotelRiskTier: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50">
          <option value="">Any Risk Tier</option>
          {RISK_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={form.hotelTier} onChange={(e) => setForm({ ...form, hotelTier: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50">
          <option value="">Any Hotel Tier</option>
          {HOTEL_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={form.supplierTier} onChange={(e) => setForm({ ...form, supplierTier: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50">
          <option value="">Any Supplier Tier</option>
          {SUPPLIER_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={form.requesterRole} onChange={(e) => setForm({ ...form, requesterRole: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50">
          <option value="">Any Role</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
        <input
          type="checkbox"
          checked={form.requiresDualSignOff}
          onChange={(e) => setForm({ ...form, requiresDualSignOff: e.target.checked })}
          className="rounded border-white/20 bg-white/5"
        />
        Require dual sign-off
      </label>

      <div className="flex gap-2 pt-1">
        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg font-medium transition-colors">
          Create Rule
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-sm rounded-lg transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AuthorityMatrixPage() {
  const [rules, setRules] = useState<AuthorityRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    fetch("/api/v1/authority/rules")
      .then((r) => r.json())
      .then((d) => { setRules(d.data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleRule = async (id: string, active: boolean) => {
    await fetch(`/api/v1/authority/rules/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: active }),
    });
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, isActive: active } : r));
  };

  const deleteRule = async (id: string) => {
    if (!confirm("Delete this rule?")) return;
    await fetch(`/api/v1/authority/rules/${id}`, { method: "DELETE" });
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const createRule = async (data: Partial<AuthorityRule>) => {
    const res = await fetch("/api/v1/authority/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const d = await res.json();
    if (d.data) setRules((prev) => [d.data, ...prev]);
    setShowNew(false);
  };

  const filtered = rules.filter((r) =>
    filter === "all" ? true : filter === "active" ? r.isActive : !r.isActive
  );

  const stats = {
    total: rules.length,
    active: rules.filter((r) => r.isActive).length,
    global: rules.filter((r) => !r.tenantId).length,
    tenant: rules.filter((r) => !!r.tenantId).length,
  };

  return (
    <div className="min-h-screen bg-[#0c0c12] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">Authority Matrix</h1>
            <p className="text-sm text-white/50 mt-1">Configure approval workflows and governance rules</p>
          </div>
          <button
            onClick={() => setShowNew(!showNew)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg font-medium transition-colors"
          >
            {showNew ? "Cancel" : "+ New Rule"}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Rules", value: stats.total },
            { label: "Active", value: stats.active, color: "text-green-400" },
            { label: "Global", value: stats.global, color: "text-amber-400" },
            { label: "Tenant-Specific", value: stats.tenant, color: "text-blue-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/50">{s.label}</p>
              <p className={`text-2xl font-semibold mt-1 ${s.color ?? "text-white"}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {showNew && <div className="mb-6"><NewRuleForm onSubmit={createRule} onCancel={() => setShowNew(false)} /></div>}

        <div className="flex gap-2 mb-4">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${filter === f ? "bg-indigo-600 text-white" : "bg-white/5 text-white/50 hover:text-white/70"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/30">Loading rules...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">No rules found</div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((rule) => (
              <RuleCard key={rule.id} rule={rule} onToggle={toggleRule} onDelete={deleteRule} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
