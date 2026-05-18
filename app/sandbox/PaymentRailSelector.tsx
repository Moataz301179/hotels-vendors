"use client";

import { useState, useTransition } from "react";
import { CreditCard, Wallet, Zap, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { authorizeSettlement } from "./actions";

export default function PaymentRailSelector({ 
  netPayable = 90000, 
  currency = "EGP", 
  walletBalance = 150000 
}) {
  const [activeRail, setActiveRail] = useState("WALLET");
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{type: "error"|"success", text: string} | null>(null);

  const handleAuthorize = () => {
    setStatusMsg(null);
    startTransition(async () => {
      // Hardcoded 'invoice-1' and 'hotel-tenant-1' for standalone wiring
      const res = await authorizeSettlement("invoice-1", activeRail, "hotel-tenant-1", netPayable);
      if (res.success) {
        setStatusMsg({ type: "success", text: res.message || "Authorized" });
      } else {
        setStatusMsg({ type: "error", text: res.error || "Authorization Failed" });
      }
    });
  };

  const paymentMethods = [
    {
      id: "WALLET",
      label: "Internal Treasury Wallet",
      icon: Wallet,
      description: `Available Balance: ${walletBalance.toLocaleString()} ${currency}`,
      fee: "0.5% Platform Fee",
      instant: true,
      enabled: walletBalance >= netPayable
    },
    {
      id: "INSTAPAY",
      label: "InstaPay B2B (EBC Rail)",
      icon: Zap,
      description: "Instant A2A Transfer",
      fee: "Flat EGP 10",
      instant: true,
      enabled: true
    },
    {
      id: "SWYPEX",
      label: "Swypex Corporate Card",
      icon: CreditCard,
      description: "Issue a locked virtual card",
      fee: "1.5% Acquiring Fee",
      instant: true,
      enabled: true
    },
    {
      id: "FACTORING",
      label: "Request Factoring",
      icon: ShieldCheck,
      description: "Extend 90-day credit",
      fee: "Subject to Underwriting",
      instant: false,
      enabled: true
    }
  ];

  return (
    <div className="bg-[#0a0a0a] border border-white/[0.08] p-6 rounded-lg text-[#f0f0f0] w-full max-w-2xl font-sans">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Financial Settlement</h2>
          <p className="text-xs text-[#a0a0a0]">Select your authorized payment rail to clear the consolidated PO.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-[#707070] uppercase tracking-widest font-bold">Net Payable</div>
          <div className="text-2xl font-black text-[#e1a95f]">{netPayable.toLocaleString()} {currency}</div>
        </div>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => method.enabled && setActiveRail(method.id)}
            disabled={!method.enabled}
            className={`w-full flex items-center justify-between p-4 rounded border transition-all ${
              activeRail === method.id
                ? "bg-[#011e3a] border-[#1a4a7c] ring-1 ring-[#1a4a7c]"
                : "bg-[#101010] border-white/[0.05] hover:bg-white/[0.02]"
            } ${!method.enabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded ${activeRail === method.id ? "bg-[#1a4a7c]/40 text-[#55b3ff]" : "bg-white/[0.04] text-[#707070]"}`}>
                <method.icon size={20} />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  {method.label}
                  {method.instant && (
                    <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[8px] uppercase tracking-wider font-bold">Instant</span>
                  )}
                </div>
                <div className="text-xs text-[#a0a0a0] mt-0.5">{method.description}</div>
              </div>
            </div>
            <div className="text-right">
              {activeRail === method.id ? (
                <CheckCircle2 size={20} className="text-[#55b3ff]" />
              ) : (
                <div className="text-[10px] font-mono text-[#505050] bg-white/[0.02] px-2 py-1 rounded">{method.fee}</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {activeRail === "FACTORING" && (
        <div className="mt-4 p-3 rounded bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
          <AlertCircle size={16} className="text-orange-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-orange-200">
            Factoring requests require our AI Compliance Scanner to verify your Hotel Tier and the Supplier's ETA records before submitting to EFG Hermes. This may take up to 60 seconds.
          </p>
        </div>
      )}

      {statusMsg && (
        <div className={`mt-4 p-3 rounded text-xs font-bold text-center ${statusMsg.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
          {statusMsg.text}
        </div>
      )}

      <button 
        onClick={handleAuthorize}
        disabled={isPending}
        className="w-full mt-6 py-3 rounded bg-[#8B0000] text-white text-sm font-bold shadow-lg shadow-black/50 hover:bg-[#a00000] transition-colors border border-[#a00000]/50 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        Authorize {activeRail} Settlement
      </button>
    </div>
  );
}
