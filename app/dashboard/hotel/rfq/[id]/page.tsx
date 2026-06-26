"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Clock,
  Truck,
  Package,
  Loader2,
  Building2,
  Award,
} from "lucide-react";

interface RfqItemResponse {
  id: string;
  unitPrice: number;
  availableQuantity: number;
  totalPrice: number;
  deliveryDays: number;
  notes: string | null;
  isPartial: boolean;
  rfqItem?: { id: string; productName: string };
}

interface RfqResponse {
  id: string;
  status: string;
  totalPrice: number;
  currency: string;
  deliveryDays: number;
  shippingMethod: string;
  notes: string | null;
  validUntil: string;
  submittedAt: string | null;
  supplier: { id: string; name: string; tier?: string; city?: string };
  items: RfqItemResponse[];
}

interface RfqItem {
  id: string;
  productName: string;
  productCategory: string;
  quantity: number;
  unitOfMeasure: string;
  targetPrice: number | null;
}

interface Rfq {
  id: string;
  rfqNumber: string;
  title: string;
  description: string | null;
  status: string;
  responseDeadline: string;
  expectedDeliveryDate: string | null;
  createdAt: string;
  publishedAt: string | null;
  hotel?: { id: string; name: string; city?: string };
  items: RfqItem[];
  responses: RfqResponse[];
  selectedResponseId: string | null;
  selectedResponse?: { id: string; supplier: { id: string; name: string } } | null;
}

const BG_SURFACE = "#111520";
const BORDER = "rgba(255,255,255,0.06)";
const TEXT_PRIMARY = "#F0F2F5";
const TEXT_SECONDARY = "rgba(161,168,184,0.85)";
const ACCENT = "#FF6B00";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  DRAFT: { bg: "rgba(148,163,184,0.2)", color: "#94a3b8" },
  PUBLISHED: { bg: "rgba(59,130,246,0.2)", color: "#3b82f6" },
  OPEN: { bg: "rgba(34,197,94,0.2)", color: "#22c55e" },
  CLOSED: { bg: "rgba(148,163,184,0.2)", color: "#94a3b8" },
  AWARDED: { bg: "rgba(168,85,247,0.2)", color: "#a855f7" },
  CONVERTED_TO_PO: { bg: "rgba(249,115,22,0.2)", color: "#f97316" },
  CANCELLED: { bg: "rgba(239,68,68,0.2)", color: "#ef4444" },
  EXPIRED: { bg: "rgba(239,68,68,0.2)", color: "#ef4444" },
  SUBMITTED: { bg: "rgba(59,130,246,0.2)", color: "#3b82f6" },
  SHORTLISTED: { bg: "rgba(168,85,247,0.2)", color: "#a855f7" },
  ACCEPTED: { bg: "rgba(34,197,94,0.2)", color: "#22c55e" },
  REJECTED: { bg: "rgba(239,68,68,0.2)", color: "#ef4444" },
  WITHDRAWN: { bg: "rgba(148,163,184,0.2)", color: "#94a3b8" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || { bg: "rgba(148,163,184,0.2)", color: "#94a3b8" };
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 4,
        backgroundColor: c.bg,
        color: c.color,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-EG", { style: "currency", currency }).format(amount);
}

export default function RfqDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [rfq, setRfq] = useState<Rfq | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    loadRfq();
  }, [params.id]);

  async function loadRfq() {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/rfq/${params.id}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setRfq(json.data.rfq);
      } else {
        setError(json.error || "Failed to load RFQ");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
        <Loader2 size={24} style={{ color: ACCENT }} />
        <span style={{ marginLeft: 8, color: TEXT_SECONDARY }}>Loading RFQ...</span>
      </div>
    );
  }

  if (error || !rfq) {
    return (
      <div>
        <button
          onClick={() => router.push("/hotel/rfq")}
          style={{
            background: "none",
            border: `1px solid ${BORDER}`,
            borderRadius: 6,
            padding: "6px 10px",
            cursor: "pointer",
            color: TEXT_SECONDARY,
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div
          style={{
            padding: "16px 20px",
            backgroundColor: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 6,
            color: "#ef4444",
            fontSize: 13,
          }}
        >
          {error || "RFQ not found"}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => router.push("/hotel/rfq")}
          style={{
            background: "none",
            border: `1px solid ${BORDER}`,
            borderRadius: 6,
            padding: "6px 10px",
            cursor: "pointer",
            color: TEXT_SECONDARY,
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
          }}
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>
              {rfq.title}
            </h1>
            <StatusBadge status={rfq.status} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 6 }}>
            <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "monospace" }}>
              {rfq.rfqNumber}
            </span>
            {rfq.hotel && (
              <span style={{ fontSize: 12, color: TEXT_SECONDARY, display: "flex", alignItems: "center", gap: 4 }}>
                <Building2 size={11} />
                {rfq.hotel.name}
              </span>
            )}
            <span style={{ fontSize: 12, color: TEXT_SECONDARY, display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={11} />
              Deadline: {formatDate(rfq.responseDeadline)}
            </span>
          </div>
        </div>
      </div>

      {rfq.description && (
        <div
          style={{
            padding: "14px 18px",
            backgroundColor: BG_SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 13,
            color: TEXT_SECONDARY,
            lineHeight: 1.6,
          }}
        >
          {rfq.description}
        </div>
      )}

      {/* Items */}
      <div
        style={{
          backgroundColor: BG_SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          marginBottom: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${BORDER}`,
            fontSize: 15,
            fontWeight: 600,
            color: TEXT_PRIMARY,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Package size={16} style={{ color: ACCENT }} />
          Requested Items ({rfq.items.length})
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Category</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Qty</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Target Price</th>
            </tr>
          </thead>
          <tbody>
            {rfq.items.map((item) => (
              <tr key={item.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                <td style={{ ...tdStyle, color: TEXT_PRIMARY, fontWeight: 500 }}>
                  {item.productName}
                </td>
                <td style={tdStyle}>{item.productCategory.replace(/_/g, " & ")}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {item.quantity} {item.unitOfMeasure}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {item.targetPrice ? `${item.targetPrice} EGP` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Responses */}
      <div
        style={{
          backgroundColor: BG_SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${BORDER}`,
            fontSize: 15,
            fontWeight: 600,
            color: TEXT_PRIMARY,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FileText size={16} style={{ color: ACCENT }} />
          Supplier Responses ({rfq.responses.length})
        </div>

        {rfq.responses.length === 0 ? (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: TEXT_SECONDARY,
              fontSize: 13,
            }}
          >
            No supplier responses yet. Share your RFQ to invite bids.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}>
            {rfq.responses.map((resp) => {
              const isSelected = rfq.selectedResponseId === resp.id;
              return (
                <div
                  key={resp.id}
                  style={{
                    padding: 16,
                    backgroundColor: isSelected ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isSelected ? "rgba(168,85,247,0.4)" : BORDER}`,
                    borderRadius: 6,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY }}>
                        {resp.supplier.name}
                      </span>
                      {resp.supplier.tier && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            borderRadius: 3,
                            backgroundColor: "rgba(255,107,0,0.12)",
                            color: ACCENT,
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {resp.supplier.tier}
                        </span>
                      )}
                      <StatusBadge status={resp.status} />
                      {isSelected && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 11,
                            color: "#a855f7",
                            fontWeight: 600,
                          }}
                        >
                          <Award size={12} />
                          Awarded
                        </span>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY }}>
                        {formatCurrency(resp.totalPrice, resp.currency)}
                      </div>
                      <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginTop: 2 }}>
                        {resp.deliveryDays} days · {resp.shippingMethod.replace(/_/g, " ")}
                      </div>
                    </div>
                  </div>

                  {/* Response items */}
                  {resp.items.length > 0 && (
                    <div
                      style={{
                        fontSize: 12,
                        color: TEXT_SECONDARY,
                        borderTop: `1px solid ${BORDER}`,
                        paddingTop: 10,
                        marginTop: 4,
                      }}
                    >
                      {resp.items.map((ri) => (
                        <div
                          key={ri.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "4px 0",
                          }}
                        >
                          <span style={{ color: TEXT_PRIMARY }}>
                            {ri.rfqItem?.productName || "Item"}
                            {ri.isPartial && (
                              <span style={{ color: ACCENT, fontSize: 10, marginLeft: 6 }}>
                                PARTIAL
                              </span>
                            )}
                          </span>
                          <span>
                            {ri.availableQuantity} × {ri.unitPrice} ={" "}
                            <span style={{ color: TEXT_PRIMARY, fontWeight: 600 }}>
                              {ri.totalPrice} EGP
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {resp.notes && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: "8px 12px",
                        backgroundColor: "rgba(255,255,255,0.02)",
                        borderRadius: 4,
                        fontSize: 12,
                        color: TEXT_SECONDARY,
                        fontStyle: "italic",
                      }}
                    >
                      "{resp.notes}"
                    </div>
                  )}

                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, marginTop: 8 }}>
                    Valid until: {formatDate(resp.validUntil)}
                    {resp.submittedAt && ` · Submitted ${formatDate(resp.submittedAt)}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "10px 16px",
  fontSize: 11,
  fontWeight: 600,
  color: TEXT_SECONDARY,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 16px",
  fontSize: 13,
  color: TEXT_SECONDARY,
};
