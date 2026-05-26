"use client";

import { useState } from "react";
import { Scale, AlertTriangle, ShieldCheck, UserX, Receipt, Gavel, Truck } from "lucide-react";

export default function ArbitrationDashboard({
  disputeId = "DSP-2026-X99",
  poNumber = "PO-2026-X992A",
  hotelName = "Four Seasons Cairo",
  supplierName = "Global Roasters SME",
  disputedAmount = 5000,
  reason = "Temperature breach during transit. Meat arrived at 12°C.",
  escrowBalance = 100000 // Total invoice amount held
}) {
  const [liability, setLiability] = useState("PENDING"); // HOTEL, SUPPLIER, LOGISTICS, SPLIT
  const [resolution, setResolution] = useState("");

  return (
    <div className="bg-[#000000] min-h-screen text-[#f0f0f0] p-8 font-sans">
      
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#bef264] rounded-lg flex items-center justify-center">
            <Scale className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Platform Arbitration Protocol</h1>
            <p className="text-sm text-[#707070]">Consumer Protection Agency (CPA) Dispute Resolution Matrix</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-[#e1a95f] uppercase tracking-widest font-bold">Escrow Holding</div>
          <div className="text-2xl font-mono text-white">{escrowBalance.toLocaleString()} EGP</div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* Dispute Context */}
        <div className="col-span-1 bg-[#101010] border border-white/[0.05] p-6 rounded-lg">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Receipt size={16} className="text-[#a0a0a0]"/> Ticket Context
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-[#707070] text-[10px] uppercase">Dispute ID</div>
              <div className="font-mono text-white">{disputeId}</div>
            </div>
            <div>
              <div className="text-[#707070] text-[10px] uppercase">Purchase Order</div>
              <div className="text-[#55b3ff] hover:underline cursor-pointer">{poNumber}</div>
            </div>
            <div className="pt-4 border-t border-white/[0.05]">
              <div className="text-[#707070] text-[10px] uppercase">Buyer (Plaintiff)</div>
              <div className="font-bold">{hotelName}</div>
            </div>
            <div>
              <div className="text-[#707070] text-[10px] uppercase">Seller (Defendant)</div>
              <div className="font-bold">{supplierName}</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded">
            <div className="flex gap-2 text-red-400 font-bold text-xs mb-2">
              <AlertTriangle size={14} /> Claim Reason
            </div>
            <p className="text-xs text-red-200">{reason}</p>
            <div className="mt-3 text-xs font-mono text-red-300 bg-red-900/40 p-2 rounded inline-block">
              Disputed: {disputedAmount.toLocaleString()} EGP
            </div>
          </div>
        </div>

        {/* Arbitration Workbench */}
        <div className="col-span-2 bg-[#101010] border border-white/[0.05] p-6 rounded-lg">
          <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <Gavel size={16} className="text-[#e1a95f]"/> Assign Liability
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button 
              onClick={() => setLiability("SUPPLIER")}
              className={`p-4 rounded border text-left transition-all ${liability === "SUPPLIER" ? "bg-red-500/10 border-red-500 ring-1 ring-red-500" : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]"}`}
            >
              <div className="font-bold text-white mb-1 flex items-center gap-2">
                Supplier Fault <UserX size={14} className="text-red-400" />
              </div>
              <div className="text-xs text-[#a0a0a0]">Route Escrow back to Hotel Wallet. Debits Supplier Account.</div>
            </button>

            <button 
              onClick={() => setLiability("LOGISTICS")}
              className={`p-4 rounded border text-left transition-all ${liability === "LOGISTICS" ? "bg-[#e1a95f]/10 border-[#e1a95f] ring-1 ring-[#e1a95f]" : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]"}`}
            >
              <div className="font-bold text-white mb-1 flex items-center gap-2">
                Logistics Fault <Truck size={14} className="text-[#e1a95f]" />
              </div>
              <div className="text-xs text-[#a0a0a0]">Deduct from 3PL Hub payout. Refund Hotel. Pay Supplier net.</div>
            </button>

            <button 
              onClick={() => setLiability("HOTEL")}
              className={`p-4 rounded border text-left transition-all ${liability === "HOTEL" ? "bg-[#55b3ff]/10 border-[#55b3ff] ring-1 ring-[#55b3ff]" : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]"}`}
            >
              <div className="font-bold text-white mb-1 flex items-center gap-2">
                Hotel Fault (Frivolous) <ShieldCheck size={14} className="text-[#55b3ff]" />
              </div>
              <div className="text-xs text-[#a0a0a0]">Deny claim. Release Escrow to Supplier Factoring.</div>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-[#a0a0a0] mb-2 uppercase tracking-wider">Arbitrator Resolution Notes (CPA Legal Log)</label>
            <textarea 
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Detail the evidentiary basis for this liability assignment..."
              className="w-full h-32 bg-[#0a0a0a] border border-white/[0.1] rounded p-3 text-sm text-white focus:outline-none focus:border-[#e1a95f] resize-none"
            />
          </div>

          <button 
            disabled={liability === "PENDING" || resolution.length < 10}
            className="w-full py-4 rounded bg-[#bef264] text-white font-bold shadow-lg disabled:opacity-50 hover:bg-[#a00000] transition-colors"
          >
            Execute Ruling & Release Escrow
          </button>
        </div>

      </div>
    </div>
  );
}
