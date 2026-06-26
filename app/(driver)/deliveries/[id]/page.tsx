"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Phone,
  CheckCircle,
  Truck,
  Package,
  Navigation,
  Camera,
  PenLine,
  KeyRound,
  AlertCircle,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { useRouter, useParams } from "next/navigation";

interface DeliveryJob {
  id: string;
  jobNumber: string;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryContact: string | null;
  deliveryPhone: string | null;
  deliveryDate: string | null;
  deliveredAt: string | null;
  podPhotoUrl: string | null;
  signatureUrl: string | null;
  order: { id: string; orderNumber: string };
  carrier: { id: string; name: string };
  tripStop: { id: string; hotel: { id: string; name: string } } | null;
}

const STATUS_STEPS = [
  "ASSIGNED",
  "ACCEPTED_BY_CARRIER",
  "PICKED_UP",
  "IN_TRANSIT",
  "ARRIVED",
  "DELIVERED",
] as const;

const STATUS_COLORS: Record<string, string> = {
  ASSIGNED: "var(--warning)",
  ACCEPTED_BY_CARRIER: "#60a5fa",
  PICKED_UP: "#c084fc",
  IN_TRANSIT: "var(--accent-base)",
  ARRIVED: "#fb923c",
  DELIVERED: "var(--success)",
};

export default function DeliveryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, loading, refetch } = useApi<{ deliveryJob: DeliveryJob }>(`/api/v1/deliveries/${id}`);
  const job = data?.deliveryJob;

  const [updating, setUpdating] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Signature pad touch handlers
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

  const endDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

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

  const updateStatus = async (newStatus: string, extras?: Record<string, string>) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/deliveries/${id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, ...extras }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Update failed");
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleCompleteDelivery = async () => {
    if (otpValue.length !== 6) {
      setError("Enter 6-digit OTP");
      return;
    }
    await updateStatus("DELIVERED", {
      otpCode: otpValue,
      signatureUrl: signatureData || "",
      podPhotoUrl: photoFile ? URL.createObjectURL(photoFile) : "",
    });
    setShowOtp(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        <div className="rounded-2xl p-8 animate-pulse" style={{ background: "var(--bg-surface-1)" }}>
          <div className="h-6 w-40 rounded mb-4" style={{ background: "var(--border-subtle)" }} />
          <div className="h-4 w-64 rounded mb-2" style={{ background: "var(--border-subtle)" }} />
          <div className="h-4 w-48 rounded" style={{ background: "var(--border-subtle)" }} />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-8 text-center">
        <p style={{ color: "var(--text-muted)" }}>Delivery job not found</p>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(job.status as typeof STATUS_STEPS[number]);
  const isTerminal = ["DELIVERED", "FAILED", "CANCELLED", "RETURNED"].includes(job.status);

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
          <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{job.jobNumber}</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{job.order.orderNumber}</p>
        </div>
      </div>

      {/* Status progress bar */}
      {!isTerminal && (
        <div
          className="rounded-2xl p-4 overflow-x-auto"
          style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-1 min-w-[320px]">
            {STATUS_STEPS.map((step, i) => {
              const isComplete = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={step} className="flex items-center gap-1 flex-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                    style={{
                      background: isComplete ? STATUS_COLORS[step] : "var(--border-subtle)",
                      color: isComplete ? "#000" : "var(--text-muted)",
                      boxShadow: isCurrent ? `0 0 8px ${STATUS_COLORS[step]}50` : "none",
                    }}
                  >
                    {i + 1}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className="flex-1 h-0.5 rounded-full"
                      style={{ background: isComplete ? STATUS_COLORS[step] : "var(--border-subtle)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs font-medium mt-2" style={{ color: STATUS_COLORS[job.status] || "var(--text-muted)" }}>
            {job.status.replace(/_/g, " ")}
          </p>
        </div>
      )}

      {/* Job info */}
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
      >
        <div>
          <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Pickup</p>
          <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-primary)" }}>
            <MapPin size={14} style={{ color: "var(--accent-base)" }} />
            <span>{job.pickupAddress}</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Delivery</p>
          <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-primary)" }}>
            <MapPin size={14} style={{ color: "var(--success)" }} />
            <span>{job.deliveryAddress}</span>
          </div>
          {job.deliveryContact && (
            <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              <Phone size={12} />
              <span>{job.deliveryContact}</span>
              {job.deliveryPhone && <span>{job.deliveryPhone}</span>}
            </div>
          )}
        </div>
        {job.tripStop && (
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Hotel</p>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>{job.tripStop.hotel.name}</p>
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ background: "var(--error)", color: "#fff" }}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Action buttons based on current status */}
      {!isTerminal && (
        <div className="space-y-3">
          {job.status === "ASSIGNED" && (
            <button
              onClick={() => updateStatus("ACCEPTED_BY_CARRIER")}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all"
              style={{ background: "var(--accent-base)", color: "#000" }}
            >
              <CheckCircle size={18} />
              {updating ? "Accepting..." : "Accept Job"}
            </button>
          )}

          {job.status === "ACCEPTED_BY_CARRIER" && (
            <button
              onClick={() => {
                setShowPhoto(true);
              }}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all"
              style={{ background: "var(--accent-base)", color: "#000" }}
            >
              <Package size={18} />
              {updating ? "Updating..." : "Mark Picked Up"}
            </button>
          )}

          {job.status === "PICKED_UP" && (
            <button
              onClick={() => updateStatus("IN_TRANSIT")}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all"
              style={{ background: "var(--accent-base)", color: "#000" }}
            >
              <Truck size={18} />
              {updating ? "Updating..." : "Start Transit"}
            </button>
          )}

          {job.status === "IN_TRANSIT" && (
            <button
              onClick={() => updateStatus("ARRIVED")}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all"
              style={{ background: "var(--accent-base)", color: "#000" }}
            >
              <Navigation size={18} />
              {updating ? "Updating..." : "Mark Arrived"}
            </button>
          )}

          {job.status === "ARRIVED" && (
            <>
              {/* Signature capture */}
              <button
                onClick={() => setShowSignature(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm transition-all"
                style={{ background: "var(--bg-surface-1)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
              >
                <PenLine size={18} style={{ color: "var(--accent-base)" }} />
                {signatureData ? "Signature captured" : "Capture Signature"}
              </button>

              {/* Photo capture */}
              <label className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm cursor-pointer transition-all"
                style={{ background: "var(--bg-surface-1)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
              >
                <Camera size={18} style={{ color: "var(--accent-base)" }} />
                {photoFile ? "Photo attached" : "Take Proof of Delivery Photo"}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setPhotoFile(e.target.files[0]);
                  }}
                />
              </label>

              {/* Verify OTP to complete */}
              <button
                onClick={() => setShowOtp(true)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all"
                style={{ background: "var(--success)", color: "#000" }}
              >
                <KeyRound size={18} />
                Complete Delivery
              </button>
            </>
          )}
        </div>
      )}

      {isTerminal && (
        <div
          className="rounded-2xl p-5 text-center"
          style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <CheckCircle size={32} className="mx-auto mb-2" style={{ color: "var(--success)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Job {job.status.replace(/_/g, " ")}
          </p>
          {job.deliveredAt && (
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {new Date(job.deliveredAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setShowOtp(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-md rounded-t-3xl p-6"
              style={{ background: "var(--bg-surface-1)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>Verify Delivery</h3>
              <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                Enter the 6-digit OTP shared by the receiver at {job.deliveryAddress}.
              </p>
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3.5 rounded-xl text-center text-2xl tracking-[0.5em] placeholder:opacity-20"
                style={{
                  background: "var(--bg-canvas)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-subtle)",
                }}
                maxLength={6}
                autoFocus
              />
              <button
                onClick={handleCompleteDelivery}
                disabled={otpValue.length !== 6 || updating}
                className="w-full py-3.5 rounded-xl font-semibold text-sm mt-4 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "var(--success)", color: "#000" }}
              >
                {updating ? "Verifying..." : "Verify & Complete"}
              </button>
              <button
                onClick={() => setShowOtp(false)}
                className="w-full py-2 text-xs mt-2"
                style={{ color: "var(--text-muted)" }}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signature Modal */}
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
              <h3 className="text-base font-bold mb-3" style={{ color: "var(--text-primary)" }}>Customer Signature</h3>
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

      {/* Photo modal for pickup */}
      <AnimatePresence>
        {showPhoto && (
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
              <h3 className="text-base font-bold mb-3" style={{ color: "var(--text-primary)" }}>Proof of Pickup</h3>
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                Take a photo of the picked-up goods
              </p>
              <label className="w-full flex items-center justify-center gap-2 py-6 rounded-xl cursor-pointer"
                style={{ background: "var(--bg-canvas)", border: "1px solid var(--border-subtle)" }}
              >
                <Camera size={24} style={{ color: "var(--accent-base)" }} />
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>Take Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setPhotoFile(e.target.files[0]);
                      setShowPhoto(false);
                      updateStatus("PICKED_UP", { podPhotoUrl: URL.createObjectURL(e.target.files[0]) });
                    }
                  }}
                />
              </label>
              <button
                onClick={() => { setShowPhoto(false); updateStatus("PICKED_UP"); }}
                className="w-full py-2 text-xs mt-3"
                style={{ color: "var(--text-muted)" }}
              >
                Skip photo & mark picked up
              </button>
              <button
                onClick={() => setShowPhoto(false)}
                className="w-full py-2 text-xs mt-1"
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
