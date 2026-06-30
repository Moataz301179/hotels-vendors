"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Copy, Check, ArrowLeft, Users, Send } from "lucide-react";
import Link from "next/link";

const BG_SURFACE = "var(--surface-raised)";
const BORDER = "var(--border-subtle)";
const TEXT_PRIMARY = "var(--foreground)";
const TEXT_SECONDARY = "var(--foreground-secondary)";
const ACCENT = "var(--accent-base)";

export default function InviteSupplierPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ inviteLink: string; id: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/v1/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, companyName, type: "SUPPLIER", message: message || undefined }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create invite");

      setResult(data.data);
      setEmail("");
      setCompanyName("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = result.inviteLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 16px" }}>
      <Link
        href="/dashboard/hotel"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: TEXT_SECONDARY, fontSize: 14, marginBottom: 24, textDecoration: "none" }}
      >
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${ACCENT}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Users size={20} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>Invite a Supplier</h1>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, margin: "2px 0 0" }}>
            Send an invite link for a supplier to join the platform
          </p>
        </div>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#ef4444", fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {!result ? (
        <form onSubmit={handleSubmit} style={{ background: BG_SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY, marginBottom: 6 }}>
              Supplier email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="supplier@example.com"
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${BORDER}`,
                background: "var(--background)", color: TEXT_PRIMARY, fontSize: 14, outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY, marginBottom: 6 }}>
              Company name
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Supplies Co."
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${BORDER}`,
                background: "var(--background)", color: TEXT_PRIMARY, fontSize: 14, outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY, marginBottom: 6 }}>
              Personal message <span style={{ color: TEXT_SECONDARY, fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, we'd love to have you on HotelsVendors..."
              rows={3}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${BORDER}`,
                background: "var(--background)", color: TEXT_PRIMARY, fontSize: 14, outline: "none",
                resize: "vertical", fontFamily: "inherit", boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "12px 24px", borderRadius: 10, border: "none",
              background: ACCENT, color: "#000", fontSize: 14, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={16} />}
            {loading ? "Creating invite..." : "Generate Invite Link"}
          </button>
        </form>
      ) : (
        <div style={{ background: BG_SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28, textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Check size={24} style={{ color: "#22c55e" }} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY, margin: "0 0 4px" }}>Invite created!</h2>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, margin: "0 0 20px" }}>
            Share this link with your supplier to get them onboarded
          </p>

          <div style={{
            background: "var(--background)", border: `1px solid ${BORDER}`, borderRadius: 10,
            padding: "12px 16px", fontSize: 12, color: TEXT_PRIMARY, wordBreak: "break-all",
            textAlign: "left", marginBottom: 16, fontFamily: "monospace", lineHeight: 1.5,
          }}>
            {result.inviteLink}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={copyToClipboard}
              style={{
                flex: 1, padding: "12px 24px", borderRadius: 10, border: "none",
                background: ACCENT, color: "#000", fontSize: 14, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button
              onClick={() => setResult(null)}
              style={{
                padding: "12px 24px", borderRadius: 10, border: `1px solid ${BORDER}`,
                background: "transparent", color: TEXT_PRIMARY, fontSize: 14, fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Invite another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
