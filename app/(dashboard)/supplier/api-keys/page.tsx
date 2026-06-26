"use client";

import { useCallback, useEffect, useState } from "react";

interface ApiKey {
  id: string;
  name: string;
  description: string | null;
  prefix: string;
  scopes: string[];
  rateLimitPerMinute: number;
  status: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

interface CreatedKey extends ApiKey {
  key: string;
}

const BG = "#0D1119";
const SURFACE = "#111520";
const BORDER = "rgba(255,255,255,0.06)";
const ACCENT = "#FF6B00";
const TEXT_PRIMARY = "#F0F2F5";
const TEXT_SECONDARY = "rgba(161,168,184,0.85)";
const TEXT_MUTED = "rgba(107,115,132,0.70)";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createdKey, setCreatedKey] = useState<CreatedKey | null>(null);
  const [form, setForm] = useState({ name: "", description: "", expiresInDays: "90" });
  const [copied, setCopied] = useState(false);

  const loadKeys = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/supplier/api-keys");
      const data = await res.json();
      if (data.success) setKeys(data.keys);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadKeys();
  }, [loadKeys]);

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    try {
      const res = await fetch("/api/v1/supplier/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          expiresInDays: parseInt(form.expiresInDays) || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCreatedKey(data.key);
        setForm({ name: "", description: "", expiresInDays: "90" });
        setShowCreate(false);
        void loadKeys();
      }
    } catch {
      // silent
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this API key? Any application using it will lose access immediately.")) return;
    try {
      const res = await fetch(`/api/v1/supplier/api-keys/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: "REVOKED" } : k)));
      }
    } catch {
      // silent
    }
  };

  const handleCopy = async () => {
    if (!createdKey) return;
    try {
      await navigator.clipboard.writeText(createdKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY, margin: 0 }}>API Keys</h1>
          <p style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 4 }}>
            Manage programmatic access to your supplier account
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            backgroundColor: ACCENT,
            border: "none",
            cursor: "pointer",
          }}
        >
          Create Key
        </button>
      </div>

      {createdKey && (
        <div
          style={{
            backgroundColor: SURFACE,
            border: `1px solid ${ACCENT}`,
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: ACCENT, margin: "0 0 4px" }}>
                Key created — copy it now, it will not be shown again
              </p>
              <p style={{ fontSize: 12, color: TEXT_SECONDARY, margin: "0 0 8px" }}>{createdKey.name}</p>
              <code
                style={{
                  display: "block",
                  padding: "8px 12px",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: TEXT_PRIMARY,
                  wordBreak: "break-all",
                }}
              >
                {createdKey.key}
              </code>
            </div>
            <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
              <button
                onClick={handleCopy}
                style={{
                  padding: "6px 12px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 500,
                  color: copied ? "#4ADE80" : TEXT_SECONDARY,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={() => setCreatedKey(null)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 4,
                  fontSize: 12,
                  color: TEXT_MUTED,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowCreate(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: BG,
              borderRadius: 12,
              padding: 24,
              maxWidth: 420,
              width: "100%",
              border: `1px solid ${BORDER}`,
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY, margin: "0 0 16px" }}>
              Create API Key
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: TEXT_SECONDARY, display: "block", marginBottom: 4 }}>
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Production ERP"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    fontSize: 13,
                    color: TEXT_PRIMARY,
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1px solid ${BORDER}`,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: TEXT_SECONDARY, display: "block", marginBottom: 4 }}>
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="What this key is for"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    fontSize: 13,
                    color: TEXT_PRIMARY,
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1px solid ${BORDER}`,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: TEXT_SECONDARY, display: "block", marginBottom: 4 }}>
                  Expires in (days)
                </label>
                <input
                  type="number"
                  value={form.expiresInDays}
                  onChange={(e) => setForm((f) => ({ ...f, expiresInDays: e.target.value }))}
                  min="1"
                  max="365"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    fontSize: 13,
                    color: TEXT_PRIMARY,
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1px solid ${BORDER}`,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                <button
                  onClick={() => setShowCreate(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    fontSize: 13,
                    color: TEXT_SECONDARY,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!form.name.trim()}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    backgroundColor: form.name.trim() ? ACCENT : "rgba(255,107,0,0.3)",
                    border: "none",
                    cursor: form.name.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: TEXT_MUTED, fontSize: 13 }}>Loading...</div>
      ) : keys.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            backgroundColor: SURFACE,
            borderRadius: 8,
            border: `1px solid ${BORDER}`,
          }}
        >
          <p style={{ color: TEXT_MUTED, fontSize: 13, margin: 0 }}>No API keys yet. Create one to get started.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {keys.map((k) => (
            <div
              key={k.id}
              style={{
                backgroundColor: SURFACE,
                borderRadius: 8,
                border: `1px solid ${BORDER}`,
                padding: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY }}>{k.name}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: 3,
                        backgroundColor:
                          k.status === "ACTIVE" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        color: k.status === "ACTIVE" ? "#4ADE80" : "#F87171",
                      }}
                    >
                      {k.status}
                    </span>
                  </div>
                  {k.description && (
                    <p style={{ fontSize: 12, color: TEXT_MUTED, margin: "0 0 6px" }}>{k.description}</p>
                  )}
                  <code
                    style={{
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: TEXT_SECONDARY,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    {k.prefix}****...****
                  </code>
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: TEXT_MUTED }}>
                    <span>Scopes: {k.scopes.join(", ")}</span>
                    <span>Rate: {k.rateLimitPerMinute}/min</span>
                    <span>Created: {new Date(k.createdAt).toLocaleDateString()}</span>
                    {k.expiresAt && (
                      <span style={{ color: new Date(k.expiresAt) < new Date() ? "#F87171" : undefined }}>
                        Expires: {new Date(k.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {k.status === "ACTIVE" && (
                  <button
                    onClick={() => handleRevoke(k.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#F87171",
                      backgroundColor: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      cursor: "pointer",
                    }}
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: 24,
          padding: 16,
          backgroundColor: SURFACE,
          borderRadius: 8,
          border: `1px solid ${BORDER}`,
        }}
      >
        <h3 style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY, margin: "0 0 8px" }}>
          Usage
        </h3>
        <p style={{ fontSize: 12, color: TEXT_MUTED, margin: "0 0 4px", lineHeight: 1.5 }}>
          Include your API key in the <code style={{ color: ACCENT, fontFamily: "monospace" }}>Authorization</code> header:
        </p>
        <code
          style={{
            display: "block",
            padding: "8px 12px",
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: 4,
            fontSize: 11,
            fontFamily: "monospace",
            color: TEXT_SECONDARY,
          }}
        >
          Authorization: Bearer hv_live_****************
        </code>
      </div>
    </div>
  );
}
