"use client";

/**
 * Supplier Partner Portal
 * Hotels Vendors Secure Operations UI — Layer 4 Portal Assistants
 */

import React from "react";
import { Calendar, Receipt, Landmark, CheckCircle, Clock } from "lucide-react";

export default function SupplierPortalDashboard({ tenantId }: { tenantId: string }) {
  // Mock Verified Receivables General Ledger
  const receivablesLedger = [
    {
      id: "INV-8910",
      invoiceNumber: "INV/2026/05/112",
      hotel: "Royal Savoy Resort & Spa",
      amount: 45000,
      discountRate: "3%",
      disbursedAmount: 43650,
      settlementDate: "2026-05-19", // Next Tuesday
      status: "SETTLED",
    },
    {
      id: "INV-4401",
      invoiceNumber: "INV/2026/05/143",
      hotel: "Steigenberger Coastal Nile",
      amount: 120000,
      discountRate: "3.5%",
      disbursedAmount: 115800,
      settlementDate: "2026-05-21", // Next Thursday
      status: "PROCESSING",
    },
  ];

  return (
    <div className="space-y-8 p-6 text-slate-100 min-h-screen bg-slate-950 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-rose-400 to-white bg-clip-text text-transparent">
            Supplier Central Ledger & Payouts
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Accelerated Capital Liquidations • Verified Receivables Ledgers
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-850 text-xs font-semibold text-rose-400 font-mono">
          <Landmark className="h-4 w-4 text-rose-500" />
          Escrow Custody Clearings Enabled
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 relative">
          <span className="text-slate-400 text-xs font-semibold uppercase">Total Liquidated Volume</span>
          <h2 className="text-2xl font-black mt-2 font-mono text-slate-100">EGP 1,245,000</h2>
          <span className="text-[10px] text-slate-500 block mt-2">Accelerated cash disbursement ledger total</span>
        </div>

        <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 relative">
          <span className="text-slate-400 text-xs font-semibold uppercase">Next Payout Cleared Pool</span>
          <h2 className="text-2xl font-black mt-2 font-mono text-emerald-450">EGP 159,450</h2>
          <span className="text-[10px] text-emerald-500/80 font-medium block mt-2">Scheduled for Tuesday Settlement Window</span>
        </div>

        <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 relative">
          <span className="text-slate-400 text-xs font-semibold uppercase">Active Discount Delta</span>
          <h2 className="text-2xl font-black mt-2 font-mono text-rose-400">EGP 42,000</h2>
          <span className="text-[10px] text-slate-500 block mt-2">Combined early liquidation spreads</span>
        </div>
      </div>

      {/* Main Grid: settlement windows and read-only ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Verified Receivables General Ledger (Read-Only) */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-850 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Receipt className="h-4.5 w-4.5 text-rose-500" /> Verified Receivables General Ledger
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Read-only list of outstanding credit invoices cleared and verified by our partner hotels.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/30">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900/80 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Invoice Code</th>
                  <th className="px-4 py-3 text-left">Property Debtor</th>
                  <th className="px-4 py-3 text-right">Face Amount</th>
                  <th className="px-4 py-3 text-right">Discount Rate</th>
                  <th className="px-4 py-3 text-right">Accelerated Cash</th>
                  <th className="px-4 py-3 text-center">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-350 font-medium">
                {receivablesLedger.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/50 transition">
                    <td className="px-4 py-3 font-mono text-rose-450 font-bold">{row.invoiceNumber}</td>
                    <td className="px-4 py-3 text-slate-200">{row.hotel}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400">{row.amount.toLocaleString()} EGP</td>
                    <td className="px-4 py-3 text-right text-emerald-450 font-mono">{row.discountRate}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-100 font-bold">
                      {row.disbursedAmount.toLocaleString()} EGP
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        row.status === "SETTLED" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-900/50" : "bg-sky-950/80 text-sky-400 border border-sky-900/50"
                      }`}>
                        {row.status === "SETTLED" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout Calendar Dashboard */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-slate-850 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-rose-500" /> Accelerated Settlement Windows
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Fixed twice-a-week clearance windows. Liquidation balances are settled directly into escrow accounts.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-xs space-y-4 flex-1 my-4 flex flex-col justify-center">
            <div className="border-l-2 border-emerald-500 pl-3">
              <div className="text-slate-450 text-[10px] uppercase font-bold">Tuesday Settlement Clearance</div>
              <div className="text-slate-200 font-bold mt-1 text-sm">Tuesday, May 19, 2026</div>
              <div className="text-emerald-400 text-[11px] mt-0.5">Clearing Window: 09:00 - 14:00 EET</div>
            </div>

            <div className="border-l-2 border-sky-500 pl-3 border-dashed">
              <div className="text-slate-450 text-[10px] uppercase font-bold">Thursday Settlement Clearance</div>
              <div className="text-slate-200 font-bold mt-1 text-sm">Thursday, May 21, 2026</div>
              <div className="text-sky-400 text-[11px] mt-0.5">Clearing Window: 09:00 - 14:00 EET</div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 italic text-center">
            As a read-only portal view, no command triggers or action inputs are permitted. Direct clearance inquiries must route through corporate help desks.
          </div>
        </div>

      </div>
    </div>
  );
}
