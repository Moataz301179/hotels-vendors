"use client";

import { useState, useEffect } from "react";
import {
  Key, Shield, Eye, EyeOff, Save, RefreshCw, Check, AlertTriangle,
  Lock, Database, Globe, Webhook, FileKey, Copy, Trash2, Plus
} from "lucide-react";

interface Credential {
  id: string;
  name: string;
  key: string;
  type: "api_key" | "webhook_secret" | "env_var" | "certificate";
  service: string;
  lastRotated: string;
  status: "active" | "expired" | "pending";
}

const SERVICES = [
  { id: "oliv", name: "Oliv Finance", color: "#4A7C59" },
  { id: "eta", name: "Egyptian Tax Authority", color: "#3b82f6" },
  { id: "supabase", name: "Supabase", color: "#10b981" },
  { id: "sentry", name: "Sentry", color: "#8b5cf6" },
  { id: "groq", name: "Groq AI", color: "#f59e0b" },
  { id: "openrouter", name: "OpenRouter", color: "#ec4899" },
];

const ENV_TEMPLATE = `# HotelsVendors Environment Configuration
# Last Updated: ${new Date().toISOString()}

# ── Database ──
DATABASE_URL="postgresql://hv_prod:hv_prod_pass@localhost:5433/hotelsvendors_prod?schema=public"

# ── Authentication ──
SESSION_SECRET="${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}"
NEXTAUTH_URL="https://www.hotelsvendors.com"

# ── Oliv Finance Integration ──
OLIV_API_URL="https://api.olivfinance.com"
OLIV_API_KEY="YOUR_OLIV_API_KEY_HERE"
OLIV_WEBHOOK_SECRET="YOUR_OLIV_WEBHOOK_SECRET_HERE"
HOTELSVENDORS_HMAC_SECRET="${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}"

# ── ETA E-Invoicing ──
ETA_API_URL="https://api.eta.gov.eg"
ETA_API_KEY="YOUR_ETA_API_KEY_HERE"
ETA_MERCHANT_ID="YOUR_ETA_MERCHANT_ID"

# ── AI / LLM ──
GROQ_API_KEY="YOUR_GROQ_API_KEY_HERE"
OPENROUTER_API_KEY="YOUR_OPENROUTER_API_KEY_HERE"
OLLAMA_URL="http://ollama:11434"
OLLAMA_MODEL="llama3.2:3b"

# ── Monitoring ──
SENTRY_DSN="YOUR_SENTRY_DSN_HERE"

# ── App ──
NEXT_PUBLIC_APP_URL="https://www.hotelsvendors.com"
NODE_ENV="production"
`;

export default function AdminCredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"api_keys" | "webhooks" | "env" | "docs">("api_keys");
  const [envContent, setEnvContent] = useState(ENV_TEMPLATE);
  const [envPassword, setEnvPassword] = useState("");
  const [envUnlocked, setEnvUnlocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCredential, setNewCredential] = useState({ name: "", key: "", service: "oliv", type: "api_key" as const });

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const res = await fetch("/api/v1/admin/credentials");
      const json = await res.json();
      if (json.success) setCredentials(json.data);
    } catch {
      // Use mock data
      setCredentials([
        { id: "1", name: "Oliv API Key", key: "oliv_live_xxxxxxxxxxxx", type: "api_key", service: "oliv", lastRotated: "2026-07-15T10:00:00Z", status: "active" },
        { id: "2", name: "Oliv Webhook Secret", key: "whsec_xxxxxxxxxxxx", type: "webhook_secret", service: "oliv", lastRotated: "2026-07-15T10:00:00Z", status: "active" },
        { id: "3", name: "ETA API Key", key: "eta_xxxxxxxxxxxx", type: "api_key", service: "eta", lastRotated: "2026-07-10T10:00:00Z", status: "active" },
        { id: "4", name: "HMAC Secret", key: "hmac_xxxxxxxxxxxx", type: "api_key", service: "oliv", lastRotated: "2026-07-15T10:00:00Z", status: "active" },
        { id: "5", name: "Groq API Key", key: "gsk_xxxxxxxxxxxx", type: "api_key", service: "groq", lastRotated: "2026-07-01T10:00:00Z", status: "active" },
        { id: "6", name: "Sentry DSN", key: "https://xxx@sentry.io/xxx", type: "api_key", service: "sentry", lastRotated: "2026-06-15T10:00:00Z", status: "active" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleKey = (id: string) => setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));

  const maskKey = (key: string) => key.substring(0, 8) + "••••••••" + key.substring(key.length - 4);

  const unlockEnv = () => {
    if (envPassword === "panda3011") {
      setEnvUnlocked(true);
    } else {
      alert("Invalid password");
    }
  };

  const saveEnv = async () => {
    setSaving(true);
    try {
      await fetch("/api/v1/admin/env", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Password": envPassword },
        body: JSON.stringify({ content: envContent }),
      });
      alert("Environment saved successfully");
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const typeIcon = (type: string) => {
    switch (type) {
      case "api_key": return <Key className="w-4 h-4 text-blue-400" />;
      case "webhook_secret": return <Webhook className="w-4 h-4 text-purple-400" />;
      case "env_var": return <Database className="w-4 h-4 text-green-400" />;
      default: return <FileKey className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="border-b border-white/[0.06] mb-8">
        <div className="py-6">
          <h1 className="text-[24px] font-bold tracking-tight text-white flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#39ff7e]" />
            Credentials & Secrets Manager
          </h1>
          <p className="text-[13px] text-white/40 mt-1">Manage API keys, webhook secrets, and environment configuration</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-white/[0.02] rounded-xl border border-white/[0.06] w-fit">
        {[
          { id: "api_keys" as const, label: "API Keys", icon: Key },
          { id: "webhooks" as const, label: "Webhook Secrets", icon: Webhook },
          { id: "env" as const, label: ".env Configuration", icon: Database },
          { id: "docs" as const, label: "Documentation", icon: FileKey },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#39ff7e]/10 text-[#39ff7e] border border-[#39ff7e]/20"
                : "text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* API Keys Tab */}
      {activeTab === "api_keys" && (
        <div className="space-y-4">
          {SERVICES.map((service) => {
            const serviceCreds = credentials.filter(c => c.service === service.id);
            if (serviceCreds.length === 0) return null;
            return (
              <div key={service.id} className="rounded-xl border border-white/[0.06] bg-[#0f0f0f]">
                <div className="p-4 border-b border-white/[0.04] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${service.color}15` }}>
                    <Globe className="w-4 h-4" style={{ color: service.color }} />
                  </div>
                  <h3 className="text-sm font-semibold text-white/80">{service.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/30">{serviceCreds.length} keys</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {serviceCreds.map((cred) => (
                    <div key={cred.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.01] transition-colors">
                      {typeIcon(cred.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/70">{cred.name}</p>
                        <p className="text-[11px] text-white/30 font-mono">
                          {showKeys[cred.id] ? cred.key : maskKey(cred.key)}
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${
                        cred.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {cred.status}
                      </span>
                      <span className="text-[10px] text-white/20">
                        Rotated: {new Date(cred.lastRotated).toLocaleDateString()}
                      </span>
                      <button onClick={() => toggleKey(cred.id)} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-white/30 hover:text-white/60 transition-colors">
                        {showKeys[cred.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => copyToClipboard(cred.key)} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-white/30 hover:text-white/60 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Webhook Secrets Tab */}
      {activeTab === "webhooks" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.06] bg-[#0f0f0f] p-6">
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
              <Webhook className="w-4 h-4 text-purple-400" />
              Oliv Finance Webhook Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Callback URL</label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <code className="text-[12px] text-[#39ff7e] font-mono flex-1">https://www.hotelsvendors.com/api/v1/oliv/payout-callback</code>
                  <button onClick={() => copyToClipboard("https://www.hotelsvendors.com/api/v1/oliv/payout-callback")} className="p-1 rounded hover:bg-white/[0.05] text-white/30 hover:text-white/60">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Webhook Signing Secret</label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <code className="text-[12px] text-white/60 font-mono flex-1">
                    {showKeys["webhook"] ? "whsec_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" : "whsec••••••••••••••••••••••••••••••••"}
                  </code>
                  <button onClick={() => toggleKey("webhook")} className="p-1 rounded hover:bg-white/[0.05] text-white/30 hover:text-white/60">
                    {showKeys["webhook"] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => copyToClipboard("whsec_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6")} className="p-1 rounded hover:bg-white/[0.05] text-white/30 hover:text-white/60">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-wider mb-1.5 block">Required Headers (Oliv must send)</label>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                  {["x-oliv-signature: HMAC-SHA256(timestamp.body)", "x-oliv-timestamp: ISO timestamp", "x-idempotency-key: Unique per transaction"].map((h) => (
                    <code key={h} className="block text-[11px] text-white/40 font-mono">{h}</code>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* .env Tab */}
      {activeTab === "env" && (
        <div className="space-y-4">
          {!envUnlocked ? (
            <div className="rounded-xl border border-white/[0.06] bg-[#0f0f0f] p-8 max-w-md mx-auto text-center">
              <Lock className="w-12 h-12 text-[#39ff7e]/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white/80 mb-2">Password Protected</h3>
              <p className="text-[12px] text-white/30 mb-4">Enter admin password to view and edit .env configuration</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={envPassword}
                  onChange={(e) => setEnvPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && unlockEnv()}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#39ff7e]/30"
                  placeholder="Enter password"
                />
                <button onClick={unlockEnv} className="px-6 py-2.5 rounded-lg bg-[#39ff7e] text-black font-semibold text-sm hover:bg-[#39ff7e]/90 transition-colors">
                  Unlock
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.06] bg-[#0f0f0f]">
              <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-green-400" />
                  <h3 className="text-sm font-semibold text-white/80">.env Configuration</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">Unlocked</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copyToClipboard(envContent)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 text-[11px] hover:bg-white/[0.08] transition-colors">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                  <button onClick={saveEnv} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#39ff7e] text-black text-[11px] font-medium hover:bg-[#39ff7e]/90 transition-colors disabled:opacity-50">
                    <Save className="w-3 h-3" /> {saving ? "Saving..." : "Save to Server"}
                  </button>
                </div>
              </div>
              <textarea
                value={envContent}
                onChange={(e) => setEnvContent(e.target.value)}
                className="w-full h-[600px] p-4 bg-transparent text-[12px] text-[#39ff7e] font-mono resize-none focus:outline-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          )}
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === "docs" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-white/[0.06] bg-[#0f0f0f] p-6">
            <h3 className="text-sm font-semibold text-white/80 mb-4">Essential Credentials Reference</h3>
            <div className="space-y-4">
              {[
                { name: "Oliv Finance API", url: "https://api.olivfinance.com", auth: "Bearer Token", env: "OLIV_API_KEY", docs: "https://docs.olivfinance.com" },
                { name: "Oliv Webhooks", url: "POST /api/v1/oliv/payout-callback", auth: "HMAC-SHA256", env: "OLIV_WEBHOOK_SECRET", docs: "Webhook must echo referral token" },
                { name: "ETA E-Invoicing", url: "https://api.eta.gov.eg", auth: "API Key + Merchant ID", env: "ETA_API_KEY", docs: "https://eta.gov.eg/en/api-docs" },
                { name: "Groq AI", url: "https://api.groq.com", auth: "API Key", env: "GROQ_API_KEY", docs: "https://console.groq.com/docs" },
              ].map((api) => (
                <div key={api.name} className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white/70">{api.name}</h4>
                    <a href={api.docs} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#39ff7e] hover:underline">Docs →</a>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="text-white/30">URL:</span> <span className="text-white/60 font-mono">{api.url}</span></div>
                    <div><span className="text-white/30">Auth:</span> <span className="text-white/60">{api.auth}</span></div>
                    <div><span className="text-white/30">Env Var:</span> <span className="text-white/60 font-mono">{api.env}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
