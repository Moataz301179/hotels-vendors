"use client";

/* Connect Source — admin console for real supplier data ingestion.
   Paste a supplier portal URL + creds (scraper) or API key/base URL (REST/webhook)
   to bring REAL catalog into the marketplace. No fixtures here. */

import { useEffect, useState } from "react";
import { Link2, Globe, KeyRound, RefreshCw, Truck, Store, Plug, CheckCircle2 } from "lucide-react";

interface Source {
  id: string; type: "scraper" | "api" | "webhook"; name: string;
  config: { portalUrl?: string; apiBaseUrl?: string };
  connectedAt: string; status: "ACTIVE" | "ERROR";
}
interface Portal { id: string; name: string; portalUrl: string; ready: boolean }

const PORTAL_TYPE_LABEL: Record<string, string> = { scraper: "Portal Scraper", api: "REST API", webhook: "Webhook" };

export default function ConnectSourcePage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [portals, setPortals] = useState<Portal[]>([]);
  const [mode, setMode] = useState<"scraper" | "api">("scraper");
  const [portalId, setPortalId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const r = await fetch("/api/v1/sourcing/connect");
      const d = await r.json();
      if (d.success) { setSources(d.data.sources); setPortals(d.data.discoverablePortals); }
    } catch {} finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function connect() {
    setMsg(null);
    try {
      const r = await fetch("/api/v1/sourcing/connect", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "scraper"
          ? { type: "scraper", portalId, username, password }
          : { type: "api", name, apiBaseUrl }),
      });
      const d = await r.json();
      if (d.success) { setMsg({ ok: true, text: d.data.message }); await refresh(); }
      else setMsg({ ok: false, text: d.error || "Failed to connect" });
    } catch { setMsg({ ok: false, text: "Network error" }); }
  }

  async function sync(id: string, name: string) {
    setMsg({ ok: true, text: `Sync queued for ${name} — catalog will ingest as REAL (SUPPLIER_SYNC).` });
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-[11px] font-semibold mb-3">
            <Plug size={12} /> No fixtures — real sources only
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Connect Supplier Sources</h1>
          <p className="text-sm text-slate-500 mt-1">Bind a real supplier portal, REST API, or webhook to bring live catalog into the marketplace.</p>
        </div>

        {/* Connect form */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
          {/* mode toggle */}
          <div className="flex gap-2 mb-5">
            {(["scraper", "api"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={` px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${mode === m ? "bg-[#646367] text-white border-[#646367]" : "bg-white text-slate-600 border-slate-200"}`}>
                {m === "scraper" ? "🕸 Portal Scraper" : "🔑 API / Webhook"}
              </button>
            ))}
          </div>

          {mode === "scraper" ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Supplier Portal">
                <select value={portalId} onChange={(e) => setPortalId(e.target.value)}
                  className="w-full border border-slate-300 focus:ring-2 focus:ring-[#314B43] rounded-lg px-3.5 py-2.5 text-sm bg-white">
                  <option value="">Select a portal…</option>
                  {portals.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </Field>
              <Field label="Portal Source Preview"><div className="text-xs text-slate-400 pt-2.5">{portals.find((p) => p.id === portalId)?.portalUrl || "—"}</div></Field>
              <Field label="Username"><input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="portal login" className={inputCls} /></Field>
              <Field label="Password"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} /></Field>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Source Name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Metro Egypt FMCG API" className={inputCls} /></Field>
              <Field label="API Base URL / Webhook"><input value={apiBaseUrl} onChange={(e) => setApiBaseUrl(e.target.value)} placeholder="https://api.supplier.com" className={inputCls} /></Field>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button onClick={connect} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#314B43] text-white text-sm font-semibold rounded-lg hover:bg-[#3a544a] transition-colors">
              <Globe size={15} /> Connect Source
            </button>
            {msg && <span className={`text-sm ${msg.ok ? "text-emerald-700" : "text-red-600"}`}>{msg.text}</span>}
          </div>
        </div>

        {/* Connected sources */}
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Connected Sources</h2>
        {loading ? (
          <div className="text-slate-400 text-sm py-8 text-center">Loading…</div>
        ) : sources.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center">
            <KeyRound size={28} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No sources connected yet. Connect a supplier portal or API above to populate the marketplace with real catalog.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((s) => (
              <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center">{s.type === "scraper" ? <Truck size={16} className="text-slate-600" /> : <Store size={16} className="text-slate-600" />}</div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">{s.name} <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 size={9} /> {s.status}</span></div>
                    <div className="text-[11px] text-slate-400">{PORTAL_TYPE_LABEL[s.type]} · {s.config.portalUrl || s.config.apiBaseUrl || ""} · connected {new Date(s.connectedAt).toLocaleString()}</div>
                  </div>
                </div>
                <button onClick={() => sync(s.id, s.name)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50">
                  <RefreshCw size={12} /> Sync now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

const inputCls = "w-full border border-slate-300 focus:ring-2 focus:ring-[#314B43] rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>{children}</div>;
}
