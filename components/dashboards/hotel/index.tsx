"use client";

/**
 * Hotel Buyer Procurement Portal & Treasury Dashboard
 * Hotels Vendors Secure Operations UI — Layer 4 Portal Assistants
 */

import React, { useState, useEffect } from "react";
import { CreditCard, Layers, CheckCircle2, Loader2, Play, ShieldAlert, Sparkles } from "lucide-react";
import { PipelineTraceLog } from "@/lib/swarm/types/ui-spec";

export default function HotelPortalDashboard({ tenantId }: { tenantId: string }) {
  // UI State
  const [selectedReceivables, setSelectedReceivables] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [traceLogs, setTraceLogs] = useState<PipelineTraceLog[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Mock Receivables data for Workbench
  const pendingReceivables = [
    { id: "REC-A1", supplier: "6th of October F&B Group", amount: 45000, date: "2026-05-15", discount: "3%" },
    { id: "REC-B2", supplier: "Alexandria Linen Mills", amount: 120000, date: "2026-05-16", discount: "3.5%" },
    { id: "REC-C3", supplier: "Red Sea Amenities Co.", amount: 35000, date: "2026-05-17", discount: "3%" },
  ];

  // SSE Stream handler for Live Pipeline Tracing
  const triggerAggregationFlow = () => {
    setIsProcessing(true);
    setTraceLogs([]);
    setCurrentStep(0);

    const eventSource = new EventSource("/api/v1/pipelines/trace");

    eventSource.onmessage = (event) => {
      const data: PipelineTraceLog = JSON.parse(event.data);
      setTraceLogs((prev) => [...prev, data]);
      setCurrentStep(data.stepNumber);

      if (data.eventCode === "COMPLETED") {
        eventSource.close();
        setIsProcessing(false);
        setSelectedReceivables([]);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsProcessing(false);
    };
  };

  const handleCheckboxToggle = (id: string) => {
    setSelectedReceivables((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 p-6 text-slate-100 min-h-screen bg-slate-950 font-sans">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-rose-400 to-white bg-clip-text text-transparent">
            Corporate Treasury Clearance Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Debtor Authority Matrix Routing • Tenant: <span className="text-rose-400 font-mono">{tenantId}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
          <Sparkles className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
          Egyptian FRA Compliant Dual attestation
        </div>
      </div>

      {/* Credit Pool Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Active Corporate Credit Pool</span>
            <CreditCard className="h-5 w-5 text-red-500" />
          </div>
          <h2 className="text-3xl font-black mt-4 font-mono">EGP 15,000,000</h2>
          <div className="mt-3 flex justify-between items-center text-xs">
            <span className="text-slate-500">Unconditional debtor liability</span>
            <span className="text-rose-400 font-semibold font-mono">100% Available</span>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Aggregated Debt Packages (Unfunded)</span>
            <Layers className="h-5 w-5 text-rose-500" />
          </div>
          <h2 className="text-3xl font-black mt-4 font-mono">EGP 2,450,000</h2>
          <div className="mt-3 flex justify-between items-center text-xs">
            <span className="text-slate-500">Awaiting Four-Eyes Attestation</span>
            <span className="text-rose-400 font-semibold font-mono">18 Days Avg. Tenor</span>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-700 transition duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Settlement Disbursals cleared</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black mt-4 font-mono">EGP 4,890,500</h2>
          <div className="mt-3 flex justify-between items-center text-xs">
            <span className="text-slate-500">Q2 Audited General Ledger volume</span>
            <span className="text-emerald-400 font-semibold font-mono">0 Default Invariant</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Workbench and SSE Live Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Aggregation Workbench */}
        <div className="lg:col-span-7 bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="h-4 w-4 text-red-500" /> Pending SME Aggregation Workbench
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Select outstanding property-level Receivables to package into structured multi-vendor debt instruments.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/30">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900/80 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <span className="sr-only">Select</span>
                  </th>
                  <th className="px-4 py-3 text-left">Receivable ID</th>
                  <th className="px-4 py-3 text-left">Creditor Supplier</th>
                  <th className="px-4 py-3 text-right">Discount</th>
                  <th className="px-4 py-3 text-right">Face Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {pendingReceivables.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-900/50 transition">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedReceivables.includes(rec.id)}
                        onChange={() => handleCheckboxToggle(rec.id)}
                        disabled={isProcessing}
                        className="rounded border-slate-700 bg-slate-950 text-red-600 focus:ring-red-500/50 h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-rose-400 font-semibold">{rec.id}</td>
                    <td className="px-4 py-3">{rec.supplier}</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-semibold font-mono">{rec.discount}</td>
                    <td className="px-4 py-3 text-right font-semibold font-mono text-slate-100">
                      {rec.amount.toLocaleString()} EGP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Trigger Block (Four-Eyes State Initialization) */}
          <div className="flex justify-between items-center bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400">
              <span className="font-semibold text-slate-200 block">
                {selectedReceivables.length} Receivables Selected
              </span>
              Total Consolidation: <span className="font-mono text-slate-200">
                {selectedReceivables.reduce((sum, id) => {
                  const item = pendingReceivables.find(r => r.id === id);
                  return sum + (item ? item.amount : 0);
                }, 0).toLocaleString()} EGP
              </span>
            </div>
            <button
              onClick={triggerAggregationFlow}
              disabled={selectedReceivables.length === 0 || isProcessing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white shadow-lg transition duration-200 active:scale-95"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Consolidating...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" /> Initialize Attestation Transition
                </>
              )}
            </button>
          </div>
        </div>

        {/* SSE Live Tracking Console */}
        <div className="lg:col-span-5 bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-6 flex flex-col justify-between h-[450px]">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" /> Real-time Pipeline Attestation Console
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Live stream log exposing raw compliance validations and general ledger transactions.
            </p>
          </div>

          {/* Log Stream Area */}
          <div className="flex-1 bg-slate-950 border border-slate-900 rounded-xl p-4 my-4 font-mono text-[11px] overflow-y-auto space-y-2.5 max-h-[260px] scrollbar-thin">
            {traceLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center space-y-2">
                <Loader2 className="h-5 w-5 animate-pulse" />
                <span>Console offline. Initialize an attestation state transition to view logs.</span>
              </div>
            ) : (
              traceLogs.map((log, idx) => (
                <div key={log.id} className="flex justify-between items-start border-l border-slate-800 pl-2 leading-relaxed">
                  <div>
                    <span className="text-slate-500 text-[10px] mr-2">[{log.timestamp.slice(11, 19)}]</span>
                    <span className={`font-semibold mr-1.5 ${
                      log.level === "SUCCESS" ? "text-emerald-400" : log.level === "CRITICAL" ? "text-red-500 animate-pulse" : "text-sky-400"
                    }`}>
                      {log.eventCode}:
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                  <span className="text-slate-600 text-[10px] font-semibold">{log.stepNumber}/{log.totalSteps}</span>
                </div>
              ))
            )}
          </div>

          {/* Progress Indicator */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Attestation Engine State</span>
              <span className="font-mono">{currentStep ? Math.round((currentStep / 6) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-600 to-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${currentStep ? (currentStep / 6) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
