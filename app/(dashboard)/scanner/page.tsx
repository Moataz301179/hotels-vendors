"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Keyboard, Package, CheckCircle, AlertTriangle, XCircle, ArrowLeft, Zap } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  unitOfMeasure: string;
  supplier: { id: string; name: string };
}

type ScanAction = "received" | "damaged" | "missing" | null;

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [scanAction, setScanAction] = useState<ScanAction>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<BarcodeDetector | null>(null);

  const barcodeUrl = lastScanned ? `/api/v1/products/barcode?barcode=${encodeURIComponent(lastScanned)}` : null;
  const { data: scanResult, loading: scanLoading } = useApi<{ product: Product }>(barcodeUrl || "");
  const product = scanResult?.product;

  useEffect(() => {
    if ("BarcodeDetector" in window) {
      detectorRef.current = new BarcodeDetector({
        formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "qr_code"],
      });
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
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
    if (!scanning || !videoRef.current || !detectorRef.current) return;
    if (videoRef.current.readyState !== 4) {
      requestAnimationFrame(detectBarcode);
      return;
    }
    try {
      const barcodes = await detectorRef.current.detect(videoRef.current);
      if (barcodes.length > 0) {
        const value = barcodes[0].rawValue;
        if (value !== lastScanned) {
          setLastScanned(value);
          setScanAction(null);
          setScanning(false);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
          }
        }
      }
    } catch {
      // detection failed
    }
    if (scanning) {
      requestAnimationFrame(detectBarcode);
    }
  }, [scanning, lastScanned]);

  useEffect(() => {
    if (scanning && detectorRef.current) {
      detectBarcode();
    }
  }, [scanning, detectBarcode]);

  const handleManualSubmit = () => {
    if (barcodeInput.length >= 3) {
      setLastScanned(barcodeInput);
      setScanAction(null);
    }
  };

  const handleReset = () => {
    setLastScanned(null);
    setScanAction(null);
    setBarcodeInput("");
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap size={20} className="text-amber-400" />
            Barcode Scanner
          </h1>
          <p className="text-xs text-white/40 mt-0.5">Scan products at receiving dock</p>
        </div>
        {lastScanned && (
          <button onClick={handleReset} className="text-xs text-white/50 hover:text-white flex items-center gap-1">
            <ArrowLeft size={14} /> New Scan
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!lastScanned ? (
          <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {scanning ? (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-40 border-2 border-amber-400/60 rounded-xl relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-amber-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-amber-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-amber-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-amber-400 rounded-br-lg" />
                    <motion.div
                      className="absolute left-2 right-2 h-0.5 bg-amber-400/80"
                      animate={{ top: ["20%", "80%", "20%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
                <button onClick={stopCamera} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                  <XCircle size={18} className="text-white" />
                </button>
              </div>
            ) : manualEntry ? (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-4">
                <div className="text-center">
                  <Keyboard size={32} className="text-white/20 mx-auto mb-2" />
                  <p className="text-sm text-white/50">Enter barcode manually</p>
                </div>
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                  placeholder="Type barcode number..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-center text-lg tracking-widest placeholder:text-white/20 focus:outline-none focus:border-amber-400/50"
                  autoFocus
                />
                <button
                  onClick={handleManualSubmit}
                  disabled={barcodeInput.length < 3}
                  className="w-full py-3 rounded-xl bg-amber-500 text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Look Up Product
                </button>
                <button onClick={() => { setManualEntry(false); startCamera(); }} className="w-full text-xs text-white/30 hover:text-white/50">
                  Try camera instead
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center space-y-4">
                <Camera size={48} className="text-white/15 mx-auto" />
                <p className="text-sm text-white/40">Point camera at product barcode</p>
                <button onClick={startCamera} className="px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold">
                  Open Camera
                </button>
                <button onClick={() => setManualEntry(true)} className="block mx-auto text-xs text-white/30 hover:text-white/50">
                  Enter manually instead
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {scanLoading ? (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 animate-pulse">
                <div className="h-4 w-32 bg-white/10 rounded mb-3" />
                <div className="h-6 w-48 bg-white/10 rounded mb-2" />
                <div className="h-3 w-24 bg-white/10 rounded" />
              </div>
            ) : product ? (
              <>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Package size={24} className="text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-mono text-white/30 mb-0.5">{product.sku}</p>
                      <h3 className="text-base font-semibold text-white truncate">{product.name}</h3>
                      <p className="text-xs text-white/40 mt-0.5">{product.supplier.name}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-white/30">{product.category}</span>
                        <span className="text-xs font-semibold text-amber-400">{product.unitPrice} EGP/{product.unitOfMeasure}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {!scanAction ? (
                  <div className="space-y-2">
                    <p className="text-xs text-white/40 text-center mb-3">Select action:</p>
                    <button onClick={() => setScanAction("received")} className="w-full flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">
                      <CheckCircle size={20} className="text-emerald-400" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-emerald-400">Log as Received</p>
                        <p className="text-[11px] text-white/30">Item received in good condition</p>
                      </div>
                    </button>
                    <button onClick={() => setScanAction("damaged")} className="w-full flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors">
                      <AlertTriangle size={20} className="text-red-400" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-red-400">Report Damaged</p>
                        <p className="text-[11px] text-white/30">Item is damaged or defective</p>
                      </div>
                    </button>
                    <button onClick={() => setScanAction("missing")} className="w-full flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                      <XCircle size={20} className="text-amber-400" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-amber-400">Report Missing</p>
                        <p className="text-[11px] text-white/30">Item not in delivery</p>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-center space-y-3">
                    <p className="text-sm text-white/60">
                      {scanAction === "received" && `Confirm "${product.name}" received?`}
                      {scanAction === "damaged" && `Report "${product.name}" as damaged?`}
                      {scanAction === "missing" && `Report "${product.name}" as missing?`}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => setScanAction(null)} className="flex-1 py-2.5 rounded-xl border border-white/[0.1] text-white/60 text-sm">
                        Cancel
                      </button>
                      <button onClick={handleReset} className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black font-semibold text-sm">
                        Confirm
                      </button>
                    </div>
                  </div>
                )}

                <button onClick={handleReset} className="w-full py-3 rounded-xl border border-white/[0.08] text-white/40 text-sm hover:text-white/60 transition-colors">
                  Scan Next Item
                </button>
              </>
            ) : (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center space-y-3">
                <XCircle size={32} className="text-red-400 mx-auto" />
                <p className="text-sm text-red-400">Product not found for barcode: {lastScanned}</p>
                <button onClick={handleReset} className="px-4 py-2 rounded-lg bg-white/[0.05] text-white/60 text-sm">
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
