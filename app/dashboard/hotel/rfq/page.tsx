"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, FileText, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface RfqItem {
  id: string;
  productName: string;
  quantity: number;
  unitOfMeasure: string;
}

interface Rfq {
  id: string;
  rfqNumber: string;
  title: string;
  status: string;
  responseDeadline: string;
  createdAt: string;
  hotel?: { id: string; name: string };
  _count?: { items: number; responses: number };
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "rgba(148,163,184,0.2)",
  PUBLISHED: "rgba(59,130,246,0.2)",
  OPEN: "rgba(34,197,94,0.2)",
  CLOSED: "rgba(148,163,184,0.2)",
  AWARDED: "rgba(168,85,247,0.2)",
  CONVERTED_TO_PO: "rgba(249,115,22,0.2)",
  CANCELLED: "rgba(239,68,68,0.2)",
  EXPIRED: "rgba(239,68,68,0.2)",
};

const STATUS_TEXT_COLORS: Record<string, string> = {
  DRAFT: "#94a3b8",
  PUBLISHED: "#3b82f6",
  OPEN: "#22c55e",
  CLOSED: "#94a3b8",
  AWARDED: "#a855f7",
  CONVERTED_TO_PO: "#f97316",
  CANCELLED: "#ef4444",
  EXPIRED: "#ef4444",
};

const BG_SURFACE = "var(--surface-raised)";
const BORDER = "var(--border-subtle)";
const TEXT_PRIMARY = "var(--foreground)";
const TEXT_SECONDARY = "var(--foreground-secondary)";
const ACCENT = "var(--accent-base)";

export default function RfqListPage() {
  const router = useRouter();
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRfqs();
  }, []);

  async function loadRfqs() {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/rfq?limit=50", { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setRfqs(json.data.rfqs);
      } else {
        setError(json.error || "Failed to load RFQs");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function StatusBadge({ status }: { status: string }) {
    const bg = STATUS_COLORS[status] || "rgba(148,163,184,0.2)";
    const color = STATUS_TEXT_COLORS[status] || "#94a3b8";
    return (
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          padding: "3px 8px",
          borderRadius: 4,
          backgroundColor: bg,
          color,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {status.replace(/_/g, " ")}
      </span>
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
        <Loader2 size={24} style={{ color: ACCENT }} />
        <span style={{ marginLeft: 8, color: TEXT_SECONDARY }}>Loading RFQs...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>
            Request for Quotes
          </h1>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, margin: "4px 0 0 0" }}>
            Create and manage procurement requests for supplier quotes
          </p>
        </div>
        <button
          onClick={() => router.push("/hotel/rfq/new")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 500,
            padding: "10px 18px",
            backgroundColor: ACCENT,
            color: "#ffffff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          <Plus size={14} />
          New RFQ
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 6,
            color: "#ef4444",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {/* Table */}
      {rfqs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: BG_SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
          }}
        >
          <FileText size={32} style={{ color: TEXT_SECONDARY, marginBottom: 12 }} />
          <p style={{ color: TEXT_SECONDARY, fontSize: 14, margin: 0 }}>
            No RFQs yet. Create your first Request for Quote to start receiving supplier bids.
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: BG_SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 2fr 1fr 1fr 1fr 0.8fr",
              padding: "12px 16px",
              borderBottom: `1px solid ${BORDER}`,
              fontSize: 11,
              fontWeight: 600,
              color: TEXT_SECONDARY,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            <div>RFQ #</div>
            <div>Title</div>
            <div>Status</div>
            <div>Deadline</div>
            <div>Items / Bids</div>
            <div>Created</div>
          </div>

          {/* Rows */}
          {rfqs.map((rfq) => (
            <Link
              key={rfq.id}
              href={`/hotel/rfq/${rfq.id}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 2fr 1fr 1fr 1fr 0.8fr",
                padding: "14px 16px",
                borderBottom: `1px solid ${BORDER}`,
                textDecoration: "none",
                color: TEXT_PRIMARY,
                fontSize: 13,
                cursor: "pointer",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div style={{ fontWeight: 600, fontFamily: "monospace" }}>{rfq.rfqNumber}</div>
              <div style={{ color: TEXT_PRIMARY }}>{rfq.title}</div>
              <div>
                <StatusBadge status={rfq.status} />
              </div>
              <div style={{ color: TEXT_SECONDARY, fontSize: 12 }}>
                {formatDate(rfq.responseDeadline)}
              </div>
              <div style={{ color: TEXT_SECONDARY, fontSize: 12 }}>
                {rfq._count?.items ?? 0} items / {rfq._count?.responses ?? 0} bids
              </div>
              <div style={{ color: TEXT_SECONDARY, fontSize: 12 }}>
                {formatDate(rfq.createdAt)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
