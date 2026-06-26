"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Keyboard,
  Package,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ScanLine,
  Truck,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { useRouter } from "next/navigation";

interface BarcodeDetectorResult {
  rawValue: string;
  format: string;
}
interface BarcodeDetectorInstance {
  detect(image: ImageBitmapSource): Promise<BarcodeDetectorResult[]>;
}

export default function DriverScannerPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [lookupType, setLookupType] = useState<"delivery" | "order" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<unknown>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Try DeliveryJob lookup first, then Order
  const deliveryUrl = lastScanned ? `/api/v1/deliveries?limit=1&jobNumber=${encodeURIComponent(lastScanned)}` : null;
  const { data: deliveryData } = useApi<{ deliveries: { id: string; jobNumber: string }[] }>(deliveryUrl || "");

  useEffect(() => {
    const w = window as unknown as { BarcodeDetector?: new (options?: { formats: string[] }) => BarcodeDetectorInstance };
    if (w.BarcodeDetector) {
      detectorRef.current = new w.BarcodeDetector({
        formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "qr_code"],
      });
    }
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);
      setManualEntry(false);
    } catch {
      setManualEntry(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }, []);

  const detectBarcode = useCallback(async () => {
    if (!scanning || !videoRef.current) return;

    // If BarcodeDetector available, use it
    if (detectorRef.current && videoRef.current) {
      const detector = detectorRef.current as BarcodeDetectorInstance;
      if (videoRef.current.readyState !== 4) {
        requestAnimationFrame(detectBarcode);
        return;
      }
      try {
        const barcodes = await detector.detect(videoRef.current);
        if (barcodes.length > 0 && barcodes[0].rawValue !== lastScanned) {
          setLastScanned(barcodes[0].rawValue);
          setScanning(false);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
          }
          return;
        }
      } catch {
        // fall through to canvas fallback
      }
    }

    // Canvas fallback: capture frame for visual (no native decode)
    if (canvasRef.current && videoRef.current.readyState === 4) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
      }
    }

    if (scanning) requestAnimationFrame(detectBarcode);
  }, [scanning, lastScanned]);

  useEffect(() => {
    if (scanning) detectBarcode();
  }, [scanning, detectBarcode]);

  const handleManualSubmit = () => {
    if (barcodeInput.length >= 3) {
      setLastScanned(barcodeInput.trim());
    }
  };

  const handleReset = () => {
    setLastScanned(null);
    setLookupType(null);
    setBarcodeInput("");
  };

  // Auto-navigate when lookup results come in
  useEffect(() => {
    if (lastScanned && deliveryData?.deliveries?.length) {
      setLookupType("delivery");
    }
  }, [lastScanned, deliveryData]);

  const handleNavigate = () => {
    if (lookupType === "delivery" && deliveryData?.deliveries?.[0]) {
      router.push(`/deliveries/${deliveryData.deliveries[0].id}`);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <ScanLine size={20} style={{ color: "var(--accent-base)" }} />
            Scanner
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Scan barcode or QR to look up jobs</p>
        </div>
        {lastScanned && (
          <button onClick={handleReset} className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft size={14} /> New Scan
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!lastScanned ? (
          <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {scanning ? (
              <div
                className="relative rounded-2xl overflow-hidden aspect-[4/3]"
                style={{ background: "var(--bg-canvas)" }}
              >
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                <canvas ref={canvasRef} className="hidden" />
                {/* Scan frame overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-40 border-2 rounded-xl" style={{ borderColor: "var(--accent-base)" }}>
                    <motion.div
                      className="absolute left-2 right-2 h-0.5"
                      style={{ background: "var(--accent-base)" }}
                      animate={{ top: ["20%", "80%", "20%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
                <button
                  onClick={stopCamera}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.5)" }}
                >
                  <XCircle size={20} style={{ color: "#fff" }} />
                </button>
              </div>
            ) : manualEntry ? (
              <div
                className="rounded-2xl p-6 space-y-4"
                style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
              >
                <div className="text-center">
                  <Keyboard size={32} className="mx-auto mb-2 opacity-20" style={{ color: "var(--text-muted)" }} />
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Enter code manually</p>
                </div>
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                  placeholder="Job number or order number..."
                  className="w-full px-4 py-3 rounded-xl text-center text-lg tracking-widest placeholder:opacity-20"
                  style={{
                    background: "var(--bg-canvas)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-subtle)",
                  }}
                  autoFocus
                />
                <button
                  onClick={handleManualSubmit}
                  disabled={barcodeInput.length < 3}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: "var(--accent-base)", color: "#000" }}
                >
                  Look Up
                </button>
                <button
                  onClick={() => { setManualEntry(false); startCamera(); }}
                  className="w-full text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Try camera instead
                </button>
              </div>
            ) : (
              <div
                className="rounded-2xl p-8 text-center space-y-4"
                style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
              >
                <Camera size={48} className="mx-auto opacity-15" style={{ color: "var(--text-muted)" }} />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Point camera at barcode or QR code</p>
                <button
                  onClick={startCamera}
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm"
                  style={{ background: "var(--accent-base)", color: "#000" }}
                >
                  Open Camera
                </button>
                <button
                  onClick={() => setManualEntry(true)}
                  className="block mx-auto text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Enter manually instead
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div
              className="rounded-2xl p-4 text-center"
              style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
            >
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Scanned</p>
              <p className="text-lg font-mono font-bold" style={{ color: "var(--text-primary)" }}>{lastScanned}</p>
            </div>

            {lookupType === "delivery" && deliveryData?.deliveries?.[0] ? (
              <div className="space-y-3">
                <div
                  className="rounded-2xl p-4 flex items-start gap-3"
                  style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "var(--accent-base)", color: "#000" }}
                  >
                    <Truck size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      Delivery Job
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {deliveryData.deliveries[0].jobNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleNavigate}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm"
                  style={{ background: "var(--accent-base)", color: "#000" }}
                >
                  Open Delivery Details
                </button>
              </div>
            ) : !deliveryData ? (
              <div className="rounded-2xl p-6 animate-pulse" style={{ background: "var(--bg-surface-1)" }}>
                <div className="h-4 w-32 rounded mb-2" style={{ background: "var(--border-subtle)" }} />
                <div className="h-3 w-48 rounded" style={{ background: "var(--border-subtle)" }} />
              </div>
            ) : (
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
              >
                <XCircle size={28} className="mx-auto mb-2" style={{ color: "var(--error)" }} />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  No matching delivery or order found
                </p>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl text-sm"
              style={{ background: "var(--bg-surface-1)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}
            >
              Scan Next
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
