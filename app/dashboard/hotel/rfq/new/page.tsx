"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { ProductCategory } from "@prisma/client";

const BG_SURFACE = "#111520";
const BORDER = "rgba(255,255,255,0.06)";
const TEXT_PRIMARY = "#F0F2F5";
const TEXT_SECONDARY = "rgba(161,168,184,0.85)";
const ACCENT = "#FF6B00";

const CATEGORIES = [
  { value: "F_AND_B", label: "F&B — Food & Beverage" },
  { value: "CONSUMABLES", label: "Consumables" },
  { value: "GUEST_SUPPLIES", label: "Guest Supplies" },
  { value: "FFE", label: "FF&E — Furniture, Fixtures & Equipment" },
  { value: "SERVICES", label: "Services" },
];

interface ItemForm {
  productCategory: string;
  productName: string;
  description: string;
  quantity: string;
  unitOfMeasure: string;
  qualitySpecs: string;
  targetPrice: string;
}

export default function NewRfqPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responseDeadline, setResponseDeadline] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [items, setItems] = useState<ItemForm[]>([
    {
      productCategory: "F_AND_B",
      productName: "",
      description: "",
      quantity: "",
      unitOfMeasure: "kg",
      qualitySpecs: "",
      targetPrice: "",
    },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        productCategory: "F_AND_B",
        productName: "",
        description: "",
        quantity: "",
        unitOfMeasure: "kg",
        qualitySpecs: "",
        targetPrice: "",
      },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof ItemForm, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!responseDeadline) {
      setError("Response deadline is required");
      return;
    }

    // Validate items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.productName.trim()) {
        setError(`Item ${i + 1}: Product name is required`);
        return;
      }
      if (!item.quantity || Number(item.quantity) <= 0) {
        setError(`Item ${i + 1}: Quantity must be positive`);
        return;
      }
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/v1/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          responseDeadline: new Date(responseDeadline).toISOString(),
          expectedDeliveryDate: expectedDeliveryDate
            ? new Date(expectedDeliveryDate).toISOString()
            : undefined,
          items: items.map((item) => ({
            productCategory: item.productCategory as ProductCategory,
            productName: item.productName.trim(),
            description: item.description.trim() || undefined,
            quantity: Number(item.quantity),
            unitOfMeasure: item.unitOfMeasure,
            qualitySpecs: item.qualitySpecs.trim() || undefined,
            targetPrice: item.targetPrice ? Number(item.targetPrice) : undefined,
            currency: "EGP",
          })),
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.rfq?.id) {
        router.push(`/hotel/rfq/${json.data.rfq.id}`);
      } else {
        setError(json.error || "Failed to create RFQ");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
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
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>
            New Request for Quote
          </h1>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, margin: "4px 0 0 0" }}>
            Define the products you need and invite suppliers to bid
          </p>
        </div>
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

      <form onSubmit={handleSubmit}>
        {/* General Info */}
        <div
          style={{
            backgroundColor: BG_SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, margin: "0 0 16px 0" }}>
            General Information
          </h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: TEXT_SECONDARY, marginBottom: 6 }}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monthly F&B Supply for Hurghada Property"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                backgroundColor: "rgba(255,255,255,0.03)",
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                color: TEXT_PRIMARY,
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: TEXT_SECONDARY, marginBottom: 6 }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional context for suppliers..."
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                backgroundColor: "rgba(255,255,255,0.03)",
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                color: TEXT_PRIMARY,
                fontSize: 13,
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: TEXT_SECONDARY, marginBottom: 6 }}>
                Response Deadline *
              </label>
              <input
                type="datetime-local"
                value={responseDeadline}
                onChange={(e) => setResponseDeadline(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 6,
                  color: TEXT_PRIMARY,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  colorScheme: "dark",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: TEXT_SECONDARY, marginBottom: 6 }}>
                Expected Delivery Date
              </label>
              <input
                type="datetime-local"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 6,
                  color: TEXT_PRIMARY,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  colorScheme: "dark",
                }}
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div
          style={{
            backgroundColor: BG_SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 }}>
              Line Items ({items.length})
            </h2>
            <button
              type="button"
              onClick={addItem}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 500,
                padding: "6px 12px",
                backgroundColor: "rgba(255,107,0,0.12)",
                color: ACCENT,
                border: `1px solid rgba(255,107,0,0.3)`,
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              <Plus size={12} />
              Add Item
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: 16,
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY }}>
                    Item #{index + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        padding: 4,
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: TEXT_SECONDARY, marginBottom: 4 }}>
                      Category
                    </label>
                    <select
                      value={item.productCategory}
                      onChange={(e) => updateItem(index, "productCategory", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: `1px solid ${BORDER}`,
                        borderRadius: 4,
                        color: TEXT_PRIMARY,
                        fontSize: 12,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: TEXT_SECONDARY, marginBottom: 4 }}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={item.productName}
                      onChange={(e) => updateItem(index, "productName", e.target.value)}
                      placeholder="e.g. Fresh Salmon Fillet"
                      required
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: `1px solid ${BORDER}`,
                        borderRadius: 4,
                        color: TEXT_PRIMARY,
                        fontSize: 12,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 11, color: TEXT_SECONDARY, marginBottom: 4 }}>
                    Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    placeholder="Optional details"
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 4,
                      color: TEXT_PRIMARY,
                      fontSize: 12,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: TEXT_SECONDARY, marginBottom: 4 }}>
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      placeholder="0"
                      min="1"
                      required
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: `1px solid ${BORDER}`,
                        borderRadius: 4,
                        color: TEXT_PRIMARY,
                        fontSize: 12,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: TEXT_SECONDARY, marginBottom: 4 }}>
                      Unit
                    </label>
                    <select
                      value={item.unitOfMeasure}
                      onChange={(e) => updateItem(index, "unitOfMeasure", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: `1px solid ${BORDER}`,
                        borderRadius: 4,
                        color: TEXT_PRIMARY,
                        fontSize: 12,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="l">litre</option>
                      <option value="piece">piece</option>
                      <option value="box">box</option>
                      <option value="carton">carton</option>
                      <option value="dozen">dozen</option>
                      <option value="pair">pair</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: TEXT_SECONDARY, marginBottom: 4 }}>
                      Target Price (EGP)
                    </label>
                    <input
                      type="number"
                      value={item.targetPrice}
                      onChange={(e) => updateItem(index, "targetPrice", e.target.value)}
                      placeholder="Optional"
                      min="0"
                      step="0.01"
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: `1px solid ${BORDER}`,
                        borderRadius: 4,
                        color: TEXT_PRIMARY,
                        fontSize: 12,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: TEXT_SECONDARY, marginBottom: 4 }}>
                      Quality Specs
                    </label>
                    <input
                      type="text"
                      value={item.qualitySpecs}
                      onChange={(e) => updateItem(index, "qualitySpecs", e.target.value)}
                      placeholder="Optional"
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: `1px solid ${BORDER}`,
                        borderRadius: 4,
                        color: TEXT_PRIMARY,
                        fontSize: 12,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            type="button"
            onClick={() => router.push("/hotel/rfq")}
            style={{
              padding: "10px 20px",
              backgroundColor: "transparent",
              color: TEXT_SECONDARY,
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              backgroundColor: ACCENT,
              color: "#ffffff",
              border: "none",
              borderRadius: 6,
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: 13,
              fontWeight: 500,
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
            {submitting ? "Publishing..." : "Publish RFQ"}
          </button>
        </div>
      </form>
    </div>
  );
}
