"use client";

import { useState, useTransition } from "react";
import { QrCode, CheckCircle2, Truck, AlertTriangle, Loader2 } from "lucide-react";
import { verifyDeliveryHandshake } from "./actions";

export default function DeliveryHandshake({
  poNumber = "PO-2026-X992A",
  supplierName = "Global Roasters SME",
  expectedItems = 50
}) {
  const [otpCode, setOtpCode] = useState("");
  const [status, setStatus] = useState("PENDING"); // PENDING, VERIFIED
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleVerify = () => {
    if (otpCode.length === 6) {
      setError("");
      startTransition(async () => {
        // Hardcoded tenantId 'hotel-tenant-1' for standalone demo wiring
        const res = await verifyDeliveryHandshake(poNumber, otpCode, "hotel-tenant-1");
        if (res.success) {
          setStatus("VERIFIED");
        } else {
          setError(res.error || "Verification Failed");
        }
      });
    }
  };

  return (
    <div className="bg-[#101010] border border-white/[0.08] p-6 rounded-lg text-[#f0f0f0] w-full max-w-md font-sans mx-auto">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-[#bef264]/20 flex items-center justify-center mx-auto mb-3">
          <Truck size={24} className="text-[#55b3ff]" />
        </div>
        <h2 className="text-xl font-bold text-white">GRN Handshake</h2>
        <p className="text-xs text-[#a0a0a0] mt-1">Cryptographic Goods Receipt Note verification.</p>
      </div>

      <div className="bg-[#000000] border border-white/[0.04] p-4 rounded mb-6 text-sm">
        <div className="flex justify-between mb-2">
          <span className="text-[#707070]">Purchase Order</span>
          <span className="font-mono text-white">{poNumber}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-[#707070]">Supplier</span>
          <span className="text-white">{supplierName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#707070]">Expected Units</span>
          <span className="text-[#e1a95f] font-bold">{expectedItems} Units</span>
        </div>
      </div>

      {status === "PENDING" ? (
        <>
          <div className="mb-6">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#707070] mb-2 text-center">
              Enter 6-Digit Driver OTP
            </label>
            <input 
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\\D/g, ''))}
              placeholder="000000"
              className="w-full bg-[#0a0a0a] border border-[#bef264] text-white text-center text-3xl tracking-[0.5em] py-4 rounded font-mono focus:outline-none focus:ring-1 focus:ring-[#55b3ff]"
            />
          </div>

          {error && <div className="text-red-400 text-xs text-center mb-4 font-bold">{error}</div>}

          <button 
            onClick={handleVerify}
            disabled={otpCode.length !== 6 || isPending}
            className="w-full py-3 rounded bg-white text-black text-sm font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            {isPending ? <Loader2 size={18} className="animate-spin text-black" /> : "Sign & Accept Delivery"}
          </button>
        </>
      ) : (
        <div className="text-center py-4 bg-green-500/10 border border-green-500/30 rounded">
          <CheckCircle2 size={32} className="text-green-400 mx-auto mb-2" />
          <h3 className="text-green-400 font-bold mb-1">Delivery Cryptographically Locked</h3>
          <p className="text-[10px] text-green-200/70 px-4">
            The 24-hour SLA window for Quality Dispute reporting has now officially commenced.
          </p>
        </div>
      )}

      {status === "PENDING" && (
        <div className="mt-4 flex items-start gap-2 text-[10px] text-[#707070]">
          <AlertTriangle size={12} className="shrink-0 mt-0.5 text-[#e1a95f]" />
          <p>By entering this code, the Hotel legally acknowledges physical receipt of the shipment. This action generates the immutable ETA E-Invoice mapping.</p>
        </div>
      )}
    </div>
  );
}
