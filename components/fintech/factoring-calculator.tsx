"use client";

import { useState, useMemo } from "react";

interface FactoringCalculatorProps {
  hotelRiskScore?: number;
  defaultAmount?: number;
  onCalculation?: (result: CalculatorResult) => void;
}

export interface CalculatorResult {
  invoiceAmount: number;
  advanceRate: number;
  advanceAmount: number;
  feeRate: number;
  fee: number;
  netAmount: number;
  repaymentDays: number;
}

function getAdvanceRate(score: number): number {
  if (score <= 30) return 0.70;
  if (score <= 50) return 0.80;
  if (score <= 70) return 0.85;
  return 0.90;
}

function getFeeRate(score: number): number {
  if (score <= 30) return 0.035;
  if (score <= 50) return 0.025;
  return 0.02;
}

function getRepaymentDays(score: number): number {
  if (score >= 70) return 90;
  if (score >= 50) return 60;
  return 45;
}

export function FactoringCalculator({
  hotelRiskScore = 50,
  defaultAmount = 100000,
  onCalculation,
}: FactoringCalculatorProps) {
  const [amount, setAmount] = useState(defaultAmount);

  const result = useMemo<CalculatorResult>(() => {
    const advanceRate = getAdvanceRate(hotelRiskScore);
    const feeRate = getFeeRate(hotelRiskScore);
    const advanceAmount = Math.round(amount * advanceRate);
    const fee = Math.round(advanceAmount * feeRate);
    const netAmount = advanceAmount - fee;
    const repaymentDays = getRepaymentDays(hotelRiskScore);
    return { invoiceAmount: amount, advanceRate, advanceAmount, feeRate, fee, netAmount, repaymentDays };
  }, [amount, hotelRiskScore]);

  const handleChange = (value: number) => {
    const clamped = Math.max(5000, Math.min(5000000, value));
    setAmount(clamped);
    onCalculation?.(result);
  };

  return (
    <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-5">
      <div>
        <h3 className="text-[15px] font-semibold text-white">Factoring Calculator</h3>
        <p className="text-[11px] text-white/30 mt-0.5">Adjust the invoice amount to see estimated advance terms</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[12px] font-medium text-white/50">Invoice Amount</label>
          <span className="text-[14px] font-bold text-white">EGP {amount.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={5000}
          max={5000000}
          step={5000}
          value={amount}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/[0.06] accent-accent-base [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-base [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-white/20 mt-1">
          <span>EGP 5,000</span>
          <span>EGP 5,000,000</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-white/[0.015] border border-white/[0.04]">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Advance Rate</p>
          <p className="text-[16px] font-bold text-white mt-0.5">{(result.advanceRate * 100).toFixed(0)}%</p>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.015] border border-white/[0.04]">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Fee Rate</p>
          <p className="text-[16px] font-bold text-white mt-0.5">{(result.feeRate * 100).toFixed(1)}%</p>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.015] border border-white/[0.04]">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Advance Amount</p>
          <p className="text-[16px] font-bold text-emerald-400 mt-0.5">EGP {result.advanceAmount.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.015] border border-white/[0.04]">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Fee</p>
          <p className="text-[16px] font-bold text-amber-400 mt-0.5">EGP {result.fee.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.015] border border-white/[0.04] col-span-2">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Net Amount You Receive</p>
          <p className="text-[22px] font-bold text-emerald-400 mt-0.5">EGP {result.netAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-white/[0.015] border border-white/[0.04]">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-white/40">Repayment Term</span>
          <span className="text-white font-medium">{result.repaymentDays} days</span>
        </div>
      </div>
    </div>
  );
}
