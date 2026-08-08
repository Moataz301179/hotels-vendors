"use client";

import { useEffect, useState } from "react";
import {
  Shield, Key, Webhook, Database, Globe, FileKey,
  Check, AlertTriangle, Lock, Loader2, RefreshCw,
} from "lucide-react";

interface CredentialVariable {
  key: string;
  present: boolean;
}

interface ServiceCredential {
  service: string;
  name: string;
  type: string;
  status: "configured" | "missing";
  variables: CredentialVariable[];
}

interface ApiResponse {
  success?: boolean;
  data?: ServiceCredential[];
  error?: string;
}

// Visual metadata for each known service (display-only — never secret data).
const SERVICE_META: Record<string, { icon: typeof Webhook; color: string }> = {
  eta: { icon: FileKey, color: "#38bdf8" },
  paymob: { icon: Globe, color: "#f59e0b" },
  instapay: { icon: Globe, color: "#8b5cf6" },
  fawry: { icon: Globe, color: "#ec4899" },
  oliv: { icon: Webhook, color: "#22d3ee" },
  supabase: { icon: Globe, color: "#10b981" },
  sentry: { icon: Globe, color: "#8b5cf6" },
  groq: { icon: Key, color: "#f59e0b" },
  openrouter: { icon: Globe, color: "#ec4899" },
  auth: { icon: Lock, color: "#38bdf8" },
  database: { icon: Database, color: "#22c55e" },
  cache: { icon: Database, color: "#f43f5e" },
  email: { icon: Webhook, color: "#a78bfa" },
};

const DEFAULT_ICON: typeof Globe = Globe;
const DEFAULT_COLOR = "#64748b";

export default function AdminCredentialsPage() {
  const [services, setServices] = useState<ServiceCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"services" | "webhooks" | "env" | "docs">("services");

  const loadCredentials = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/v1/admin/credentials");
      const json = (await res.json()) as ApiResponse;
      if (json.success && json.data) {
        setServices(json.data);
      } else {
        setLoadError(json.error ?? "Unable to load connection status.");
      }
    } catch {
      setLoadError("Unable to load connection status. Check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  const configuredCount = services.filter((s) => s.status === "configured").length;

  const webhookSecret = services.find((s) => s.service === "oliv")?.variables.find((v) => v.key === "OLIV_WEBHOOK_SECRET");

  return (
    <div className="min-h-screen">
      <div className="border-b border-border-subtle mb-8">
        <div className="py-6">
          <h1 className="text-[24px] font-bold tracking-tight text-white flex items-center gap-3">
            <Shield className="w-6 h-6 text-accent-base" />
            Credentials & Connections
          </h1>
          <p className="text-[13px] text-foreground-muted mt-1">
            Live connection status for integrations. Secret values are never shown or stored here.
          </p>
        </div>
      </div>

      {/* Learn how to enable */}
      <div className="rounded-xl border border-border-subtle bg-surface-1 p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div className="text-[12px] text-foreground-muted leading-relaxed">
          A service is <span className="text-emerald-400 font-medium">Configured</span> only when its required environment
          credentials are present on the server. <span className="text-foreground-secondary font-medium">Connecting a service is what enables it</span> —
          once the API key / secret is set in the environment, the integration turns on automatically. No toggle on
          this page can enable a service without its credentials.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-surface-1 rounded-xl border border-border-subtle w-fit">
        {[
          { id: "services" as const, label: "Connections", icon: Key },
          { id: "webhooks" as const, label: "Webhook Endpoints", icon: Webhook },
          { id: "env" as const, label: "Environment", icon: Database },
          { id: "docs" as const, label: "Documentation", icon: FileKey },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-all ${
              activeTab === tab.id
                ? "bg-accent-base/10 text-accent-base border border-accent-base/20"
                : "text-foreground-muted hover:text-foreground-secondary hover:bg-surface-2"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Connections Tab */}
      {activeTab === "services" && (
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-xl border border-border-subtle bg-surface-1 p-8 flex items-center gap-3 text-foreground-muted">
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking connection status…
            </div>
          ) : loadError ? (
            <div className="rounded-xl border border-border-subtle bg-surface-1 p-8 text-center">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <p className="text-sm text-foreground-secondary mb-1">Could not load connection status</p>
              <p className="text-[12px] text-foreground-muted mb-4">{loadError}</p>
              <button
                onClick={() => loadCredentials()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-base text-white text-[12px] font-medium hover:bg-accent-base/90 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-foreground-muted">
                  {configuredCount} of {services.length} services connected
                </p>
                <button
                  onClick={() => loadCredentials()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-border-subtle text-foreground-tertiary text-[11px] hover:bg-surface-2 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => {
                  const meta = SERVICE_META[service.service];
                  const Icon = meta?.icon ?? DEFAULT_ICON;
                  const color = meta?.color ?? DEFAULT_COLOR;
                  const configured = service.status === "configured";
                  return (
                    <div key={service.service} className="rounded-xl border border-border-subtle bg-surface-1 p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${color}15` }}
                        >
                          <Icon className="w-4 h-4" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground-secondary truncate">{service.name}</h3>
                          {configured ? (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                              <Check className="w-3 h-3" /> Configured
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-surface-2 text-foreground-muted border border-white/[0.06] font-medium">
                              Not configured
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[12px] text-foreground-muted leading-relaxed">
                        {configured
                          ? "Connected and ready to use."
                          : "Not configured — connect to enable."}
                      </p>
                      <div className="mt-3 pt-3 border-t border-white/[0.04] space-y-1">
                        {service.variables.map((v) => (
                          <div key={v.key} className="flex items-center justify-between gap-2">
                            <code className="text-[11px] text-foreground-muted font-mono truncate">{v.key}</code>
                            {v.present ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                                Set
                              </span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 text-foreground-muted border border-white/[0.06] shrink-0">
                                Missing
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Webhook Endpoints Tab */}
      {activeTab === "webhooks" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border-subtle bg-surface-1 p-6">
            <h3 className="text-sm font-semibold text-foreground-secondary mb-1 flex items-center gap-2">
              <Webhook className="w-4 h-4 text-cyan-400" />
              Oliv Finance Webhook
            </h3>
            <p className="text-[12px] text-foreground-muted mb-4">
              This endpoint receives payout callbacks. The signing secret is the{" "}
              <code className="font-mono text-foreground-secondary">OLIV_WEBHOOK_SECRET</code> value set in the server
              environment. No secret is displayed here.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-foreground-muted uppercase tracking-wider mb-1.5 block">Callback URL</label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-1 border border-border-subtle">
                  <code className="text-[12px] text-accent-base font-mono flex-1">
                    https://www.hotelsvendors.com/api/v1/oliv/payout-callback
                  </code>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-foreground-muted">
                Signing secret:
                {webhookSecret ? (
                  webhookSecret.present ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      <Check className="w-3 h-3" /> Configured
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-surface-2 text-foreground-muted border border-white/[0.06]">
                      Not configured
                    </span>
                  )
                ) : (
                  <span className="text-foreground-muted">unknown</span>
                )}
              </div>
              <div>
                <label className="text-[11px] text-foreground-muted uppercase tracking-wider mb-1.5 block">Required Headers (Oliv must send)</label>
                <div className="p-3 rounded-lg bg-surface-1 border border-border-subtle space-y-1">
                  {["x-oliv-signature: HMAC-SHA256(timestamp.body)", "x-oliv-timestamp: ISO timestamp", "x-idempotency-key: Unique per transaction"].map((h) => (
                    <code key={h} className="block text-[11px] text-foreground-muted font-mono">{h}</code>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Environment Tab */}
      {activeTab === "env" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border-subtle bg-surface-1 p-6">
            <h3 className="text-sm font-semibold text-foreground-secondary mb-1 flex items-center gap-2">
              <Database className="w-4 h-4 text-green-400" />
              Server Environment Configuration
            </h3>
            <p className="text-[12px] text-foreground-muted mb-4">
              Presence of required variables on the server. Values are never exposed here. Set or update credentials in
              the server environment (e.g. the VPS <code className="font-mono">.env</code> or your hosting provider) to
              enable a service.
            </p>
            {loading ? (
              <div className="flex items-center gap-3 text-foreground-muted">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : loadError ? (
              <p className="text-[12px] text-foreground-muted">{loadError}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {services
                  .flatMap((s) => s.variables.map((v) => ({ service: s.service, key: v.key, present: v.present })))
                  .map((item) => (
                    <div key={item.key} className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-1 border border-border-subtle">
                      <code className="font-mono text-[12px] text-foreground-secondary flex-1 truncate">{item.key}</code>
                      {item.present ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                          Set
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 text-foreground-muted border border-white/[0.06] shrink-0">
                          Missing
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === "docs" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border-subtle bg-surface-1 p-6">
            <h3 className="text-sm font-semibold text-foreground-secondary mb-1">Integration Reference</h3>
            <p className="text-[12px] text-foreground-muted mb-4">Official endpoints and documentation. No credentials shown.</p>
            <div className="space-y-4">
              {[
                { name: "Oliv Finance API", env: "OLIV_API_KEY / OLIV_WEBHOOK_SECRET", docs: "https://docs.olivfinance.com", note: "Payouts & settlement provider." },
                { name: "ETA E-Invoicing", env: "ETA_API_KEY / ETA_MERCHANT_ID", docs: "https://eta.gov.eg/en/api-docs", note: "Egyptian Tax Authority e-invoicing (production)." },
                { name: "Paymob", env: "PAYMOB_API_KEY / PAYMOB_HMAC_SECRET", docs: "https://docs.paymob.com", note: "Online payment processing." },
                { name: "InstaPay", env: "INSTAPAY_API_KEY", docs: "https://www.instapay.eg", note: "Instant payment network." },
                { name: "Fawry", env: "FAWRY_API_KEY", docs: "https://www.fawry.com", note: "Cash-based payment network." },
                { name: "Supabase", env: "SUPABASE_SERVICE_ROLE_KEY", docs: "https://supabase.com/docs", note: "Postgres + auth backend." },
                { name: "Groq AI", env: "GROQ_API_KEY", docs: "https://console.groq.com/docs", note: "LLM fallback provider." },
                { name: "OpenRouter", env: "OPENROUTER_API_KEY", docs: "https://openrouter.ai/docs", note: "LLM fallback provider." },
              ].map((api) => (
                <div key={api.name} className="p-4 rounded-lg bg-surface-1 border border-border-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground-secondary">{api.name}</h4>
                    <a href={api.docs} target="_blank" rel="noopener noreferrer" className="text-[11px] text-accent-base hover:underline">Docs →</a>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    <div><span className="text-foreground-muted">Env vars:</span> <code className="text-foreground-secondary font-mono">{api.env}</code></div>
                    <div><span className="text-foreground-muted">{api.note}</span></div>
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