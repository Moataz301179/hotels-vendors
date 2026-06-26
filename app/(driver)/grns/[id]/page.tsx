"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileCheck,
  Package,
  Camera,
  PenLine,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { useRouter, useParams } from "next/navigation";

interface GrnItem {
  id: string;
  productId: string;
  product: { id: string; name: string; sku: string };
  expectedQuantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
}

interface Grn {
  id: string;
  grnNumber: string;
  status: string;
  notes: string | null;
  photoUrl: string | null;
  signatureUrl: string | null;
  order: { id: string; orderNumber: string; supplier: { name: string } };
  grnItems: GrnItem[];
}

export default function GrnDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, loading, refetch } = useApi<{ grn: Grn }>(`/api/v1/grns/${id}`);
  const grn = data?.grn;

  const [itemQuantities, setItemQuantities] = useState<Record<string, { received: number; rejected: number; reason: string }>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Initialize quantities from fetched data
  if (grn && Object.keys(itemQuantities).length === 0) {
    const initial: Record<string, { received: number; rejected: number; reason: string }> = {};
    grn.grnItems.forEach((item) => {
      initial[item.id] = {
        received: item.receivedQuantity,
        rejected: item.rejectedQuantity,
        reason: "",
      };
    });
    setItemQuantities(initial);
  }

  // Signature handlers
  const startDraw = useCallback((x: number, y: number) => {
    isDrawing.current = true;
    lastPos.current = { x, y };
  }, []);

  const draw = useCallback((x: number, y: number) => {
    if (!isDrawing.current || !sigCanvasRef.current) return;
    const ctx = sigCanvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#FF8A33";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPos.current = { x, y };
  }, []);

  const endDraw = useCallback(() => { isDrawing.current = false; }, []);

  const clearSignature = useCallback(() => {
    if (!sigCanvasRef.current) return;
    const ctx = sigCanvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);
    setSignatureData(null);
  }, []);

  const saveSignature = useCallback(() => {
    if (!sigCanvasRef.current) return;
    setSignatureData(sigCanvasRef.current.toDataURL("image/png"));
    setShowSignature(false);
  }, []);

  const hasRejections = grn
    ? grn.grnItems.some((item) => (itemQuantities[item.id]?.rejected || 0) > 0)
    : false;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const items = grn!.grnItems.map((item) => ({
        id: item.id,
        receivedQuantity: itemQuantities[item.id]?.received ?? item.receivedQuantity,
        rejectedQuantity: itemQuantities[item.id]?.rejected ?? item.rejectedQuantity,
      }));

      const res = await fetch(`/api/v1/grns/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          status: hasRejections ? "DISPUTED" : "VERIFIED",
          signatureUrl: signatureData || "",
          photoUrl: photoFile ? URL.createObjectURL(photoFile) : "",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Submit failed");
      refetch();
      setShowConfirm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        <div className="rounded-2xl p-8 animate-pulse" style={{ background: "var(--bg-surface-1)" }}>
          <div className="h-6 w-40 rounded mb-4" style={{ background: "var(--border-subtle)" }} />
          <div className="h-4 w-64 rounded" style={{ background: "var(--border-subtle)" }} />
        </div>
      </div>
    );
  }

  if (!grn) {
    return (
      <div className="pt-8 text-center">
        <p style={{ color: "var(--text-muted)" }}>GRN not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--text-primary)" }} />
        </button>
        <div>
          <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{grn.grnNumber}</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {grn.order.orderNumber} &middot; {grn.order.supplier.name}
          </p>
        </div>
      </div>

      {/* Items list */}
      <div
        className="rounded-2xl p-4 space-y-4"
        style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
      >
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Items ({grn.grnItems.length})
        </p>

        {grn.grnItems.map((item) => (
          <div
            key={item.id}
            className="pb-4"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {item.product.name}
                </p>
                <p className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>{item.product.sku}</p>
              </div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Expected: {item.expectedQuantity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: "var(--text-muted)" }}>
                  Received
                </label>
                <input
                  type="number"
                  min={0}
                  value={itemQuantities[item.id]?.received ?? item.receivedQuantity}
                  onChange={(e) =>
                    setItemQuantities((prev) => ({
                      ...prev,
                      [item.id]: { ...prev[item.id], received: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl text-sm"
                  style={{
                    background: "var(--bg-canvas)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-subtle)",
                  }}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: "var(--text-muted)" }}>
                  Rejected
                </label>
                <input
                  type="number"
                  min={0}
                  value={itemQuantities[item.id]?.rejected ?? item.rejectedQuantity}
                  onChange={(e) =>
                    setItemQuantities((prev) => ({
                      ...prev,
                      [item.id]: { ...prev[item.id], rejected: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl text-sm"
                  style={{
                    background: "var(--bg-canvas)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-subtle)",
                  }}
                />
              </div>
            </div>

            {(itemQuantities[item.id]?.rejected || 0) > 0 && (
              <div className="mt-2">
                <label className="text-[10px] uppercase tracking-wider mb-1 block" style={{ color: "var(--warning)" }}>
                  Rejection reason
                </label>
                <input
                  type="text"
                  placeholder="e.g. Damaged packaging, expired..."
                  value={itemQuantities[item.id]?.reason || ""}
                  onChange={(e) =>
                    setItemQuantities((prev) => ({
                      ...prev,
                      [item.id]: { ...prev[item.id], reason: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl text-xs"
                  style={{
                    background: "var(--bg-canvas)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-subtle)",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rejection warning */}
      {hasRejections && (
        <div
          className="flex items-start gap-2 p-3 rounded-xl text-xs"
          style={{ background: "var(--warning)", color: "#000" }}
        >
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>Items with rejected quantities will flag this GRN as DISPUTED for supplier resolution.</span>
        </div>
      )}

      {/* Photo capture */}
      <label
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm cursor-pointer"
        style={{ background: "var(--bg-surface-1)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
      >
        <Camera size={18} style={{ color: "var(--accent-base)" }} />
        {photoFile ? "Photo attached" : "Capture Received Goods"}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) setPhotoFile(e.target.files[0]); }}
        />
      </label>

      {/* Signature capture */}
      <button
        onClick={() => setShowSignature(true)}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm"
        style={{ background: "var(--bg-surface-1)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
      >
        <PenLine size={18} style={{ color: "var(--accent-base)" }} />
        {signatureData ? "Signature captured" : "Customer Signature"}
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ background: "var(--error)", color: "#fff" }}>
          <XCircle size={14} /> {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={() => setShowConfirm(true)}
        disabled={submitting || !signatureData}
        className="w-full py-4 rounded-2xl font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ background: "var(--success)", color: "#000" }}
      >
        Submit GRN
      </button>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)" }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md rounded-2xl p-5"
              style={{ background: "var(--bg-surface-1)" }}
            >
              <h3 className="text-base font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                Confirm GRN Submission
              </h3>
              <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                {hasRejections
                  ? "This GRN will be marked as DISPUTED due to rejected items."
                  : "This GRN will be marked as VERIFIED."}
              </p>
              <p className="text-[10px] mt-3 p-2 rounded-lg" style={{ background: "var(--bg-canvas)", color: "var(--text-muted)" }}>
                Restaurants for E-Marketing operates strictly as a technical data orchestrator. Zero liability for counterparty collection defaults.
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl text-sm"
                  style={{ background: "var(--bg-canvas)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: "var(--success)", color: "#000" }}
                >
                  {submitting ? "Submitting..." : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signature modal */}
      <AnimatePresence>
        {showSignature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)" }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md rounded-2xl p-5"
              style={{ background: "var(--bg-surface-1)" }}
            >
              <h3 className="text-base font-bold mb-3" style={{ color: "var(--text-primary)" }}>Hotel Representative Signature</h3>
              <div
                className="rounded-xl overflow-hidden"
                style={{ background: "var(--bg-canvas)", border: "1px solid var(--border-subtle)" }}
              >
                <canvas
                  ref={sigCanvasRef}
                  width={340}
                  height={180}
                  className="w-full touch-none"
                  style={{ cursor: "crosshair" }}
                  onMouseDown={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const scaleX = 340 / rect.width;
                    const scaleY = 180 / rect.height;
                    startDraw((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const scaleX = 340 / rect.width;
                    const scaleY = 180 / rect.height;
                    draw((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
                  }}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    const scaleX = 340 / rect.width;
                    const scaleY = 180 / rect.height;
                    startDraw((touch.clientX - rect.left) * scaleX, (touch.clientY - rect.top) * scaleY);
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    const scaleX = 340 / rect.width;
                    const scaleY = 180 / rect.height;
                    draw((touch.clientX - rect.left) * scaleX, (touch.clientY - rect.top) * scaleY);
                  }}
                  onTouchEnd={endDraw}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={clearSignature}
                  className="flex-1 py-3 rounded-xl text-sm"
                  style={{ background: "var(--bg-canvas)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}
                >
                  Clear
                </button>
                <button
                  onClick={saveSignature}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: "var(--accent-base)", color: "#000" }}
                >
                  Confirm
                </button>
              </div>
              <button
                onClick={() => setShowSignature(false)}
                className="w-full py-2 text-xs mt-2"
                style={{ color: "var(--text-muted)" }}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
