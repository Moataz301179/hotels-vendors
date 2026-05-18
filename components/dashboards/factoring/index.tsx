"use client";

/**
 * Factoring Underwriter & Liquidity Partner Portal
 * Hotels Vendors Secure Operations UI — Layer 4 Portal Assistants
 */

import React, { useState } from "react";
import { ShieldCheck, TrendingUp, Key, Search, FileSpreadsheet, Lock } from "lucide-react";

export default function FactoringPortalDashboard({ tenantId }: { tenantId: string }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock Active Assets
  const portfolioAssets = [
    {
      id: "PKG-7798",
      hotel: "Royal Savoy Resort & Spa",
      amount: 1650000,
      factorFee: 33000, // 2%
      commission: 24750, // 1.5%
      status: "FULLY_ATTESTED",
      originatorHash: "0x78ab91c893deef012019ab7823bc991a",
      verifierHash: "0x12dc55a901abcf8823ee7721cc0912ad",
      etaUuid: "EG-11A89-9801C-E7E7A-F809E",
    },
    {
      id: "PKG-3011",
      hotel: "Steigenberger Coastal Nile",
      amount: 800000,
      factorFee: 16000,
      commission: 12000,
      status: "FULLY_ATTESTED",
      originatorHash: "0xbc890e1189acdf012028fa23cc9943bb",
      verifierHash: "0xfa1188dc22abce0019ee7723cc09249e",
      etaUuid: "EG-33B02-4412F-D6D6C-C901D",
    },
  ];

  const filteredAssets = portfolioAssets.filter(
    (asset) =>
      asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.hotel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 text-slate-100 min-h-screen bg-slate-950 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-rose-400 to-white bg-clip-text text-transparent">
            Underwriter Portfolio Exposure Explorer
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Risk Mitigation & Cryptographic Ledger Tracking • Partner View
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-850 text-xs font-semibold text-rose-400 font-mono">
          <ShieldCheck className="h-4 w-4 text-rose-500" />
          Non-Repudiation Immutable Ledger
        </div>
      </div>

      {/* Portfolio Exposure Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 relative overflow-hidden">
          <span className="text-slate-400 text-xs font-semibold uppercase">Total Active Exposure</span>
          <h2 className="text-2xl font-black mt-2 font-mono text-slate-100">EGP 24,500,000</h2>
          <span className="text-[10px] text-slate-500 block mt-2">Aggregate corporate risk limit</span>
        </div>

        <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 relative overflow-hidden">
          <span className="text-slate-400 text-xs font-semibold uppercase">Accrued Underwriting Profit</span>
          <h2 className="text-2xl font-black mt-2 font-mono text-emerald-450">EGP 490,000</h2>
          <span className="text-[10px] text-emerald-500/80 font-medium block mt-2">2% Flat dynamic yield spread</span>
        </div>

        <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 relative overflow-hidden">
          <span className="text-slate-400 text-xs font-semibold uppercase">Fintech Commission Delta</span>
          <h2 className="text-2xl font-black mt-2 font-mono text-rose-400">EGP 367,500</h2>
          <span className="text-[10px] text-slate-500 block mt-2">1.5% Platform origination fee</span>
        </div>

        <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 relative overflow-hidden">
          <span className="text-slate-400 text-xs font-semibold uppercase">Underwriter Risk Tier</span>
          <h2 className="text-2xl font-black mt-2 font-mono text-slate-100">CORE_SECURE</h2>
          <span className="text-[10px] text-slate-500 block mt-2">Egyptian sovereign backing</span>
        </div>
      </div>

      {/* Asset Explorer & Non-Repudiation Audit Logs */}
      <div className="bg-slate-900/30 border border-slate-850 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="h-4.5 w-4.5 text-rose-500" /> Asset Risk Explorer & Verification Blocks
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Verify non-repudiation audit structures, remote PKCS#11 signatures, and ETA invoices.
            </p>
          </div>
          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by Package ID or Hotel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500/50 transition font-mono"
            />
          </div>
        </div>

        {/* Crypto Validation Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 hover:border-slate-750 transition duration-300 relative">
              <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-[10px] font-bold font-mono text-emerald-400 uppercase">
                <Lock className="h-3 w-3" /> {asset.status}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Basic Metrics */}
                <div className="space-y-1.5">
                  <h4 className="text-xs text-slate-450 font-bold uppercase">Asset Package ID</h4>
                  <div className="font-mono text-rose-400 font-extrabold text-sm">{asset.id}</div>
                  <div className="text-xs text-slate-300 font-semibold">{asset.hotel}</div>
                  <div className="text-xs text-slate-400 mt-2">
                    Face Value: <span className="text-slate-100 font-mono font-bold">{asset.amount.toLocaleString()} EGP</span>
                  </div>
                </div>

                {/* Split Margins */}
                <div className="space-y-1.5 border-l border-slate-800 pl-6">
                  <h4 className="text-xs text-slate-450 font-bold uppercase">Liquidation Split Details</h4>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Underwriting Yield Spread (2%):</span>
                      <span className="font-mono text-slate-200 font-semibold">{asset.factorFee.toLocaleString()} EGP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Commission (1.5%):</span>
                      <span className="font-mono text-slate-200 font-semibold">{asset.commission.toLocaleString()} EGP</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1 mt-1 text-slate-300">
                      <span>Net Asset Settlement pool:</span>
                      <span className="font-mono font-bold text-slate-100">{(asset.amount - asset.factorFee).toLocaleString()} EGP</span>
                    </div>
                  </div>
                </div>

                {/* Cryptographic Signature Block */}
                <div className="space-y-1.5 border-l border-slate-800 pl-6 text-[10.5px]">
                  <h4 className="text-xs text-slate-450 font-bold uppercase flex items-center gap-1">
                    <Key className="h-3.5 w-3.5 text-rose-500" /> Non-Repudiation Proofs
                  </h4>
                  <div className="space-y-1 text-slate-400 font-mono">
                    <div className="truncate">
                      <span className="text-slate-500">Originator (Sig A):</span> <span className="text-slate-350">{asset.originatorHash}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-slate-500">Verifier (Sig B):</span> <span className="text-slate-350">{asset.verifierHash}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-slate-500">ETA Document UUID:</span> <span className="text-rose-400 font-semibold">{asset.etaUuid}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
