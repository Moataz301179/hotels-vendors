"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, RefreshCw, Sparkles } from "lucide-react";

const accent = "var(--accent-base, #FF6B00)";
const surface = "var(--surface, #0A0F1B)";
const borderSubtle = "var(--border-subtle, rgba(255,255,255,0.06))";

interface ForecastDay {
  day: string;
  predicted: number;
  confidence: number;
}

interface ForecastData {
  forecast: {
    sku: string;
    predictedQuantity: number;
    confidence: number;
    breakdown: ForecastDay[];
    recommendedOrder: {
      quantity: number;
      urgency: "low" | "medium" | "high";
      reason: string;
    };
  };
  demo?: boolean;
  generatedAt: string;
}

export function ForecastWidget() {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/ai/forecast?hotelId=demo&sku=linens-towel-set");
      if (!res.ok) throw new Error("Forecast unavailable");
      const json = await res.json();
      setData(json);
    } catch {
      setError("AI forecast temporarily unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  if (loading) {
    return (
      <div className="rounded-xl p-5" style={{ backgroundColor: surface, border: `1px solid ${borderSubtle}` }}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} style={{ color: accent }} />
          <h3 className="text-[13px] font-medium text-white/80">AI Demand Forecast</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <RefreshCw size={18} className="animate-spin text-white/20" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl p-5" style={{ backgroundColor: surface, border: `1px solid ${borderSubtle}` }}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} style={{ color: accent }} />
          <h3 className="text-[13px] font-medium text-white/80">AI Demand Forecast</h3>
        </div>
        <p className="text-[12px] text-white/30 text-center py-4">{error}</p>
        <button onClick={fetchForecast} className="w-full text-[11px] py-2 rounded-lg transition-all" style={{ backgroundColor: accent + "10", color: accent }}>
          Retry
        </button>
      </div>
    );
  }

  const { forecast } = data;
  const maxPredicted = Math.max(...forecast.breakdown.map((d) => d.predicted), 1);
  const avgConfidence = forecast.confidence;

  const urgencyColor =
    forecast.recommendedOrder.urgency === "high"
      ? "#EF4444"
      : forecast.recommendedOrder.urgency === "medium"
        ? accent
        : "#22C55E";

  const urgencyIcon =
    forecast.recommendedOrder.urgency === "high"
      ? AlertTriangle
      : forecast.recommendedOrder.urgency === "medium"
        ? TrendingUp
        : Minus;

  const UrgencyIcon = urgencyIcon;

  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: surface, border: `1px solid ${borderSubtle}` }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: accent }} />
          <h3 className="text-[13px] font-medium text-white/80">AI Demand Forecast</h3>
          {data.demo && (
            <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: accent + "15", color: accent }}>DEMO</span>
          )}
        </div>
        <button onClick={fetchForecast} className="p-1.5 rounded-lg transition-all hover:bg-white/5">
          <RefreshCw size={12} className="text-white/30" />
        </button>
      </div>

      {/* SKU + Total */}
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[11px] text-white/40 uppercase tracking-wider">{forecast.sku}</span>
        <span className="text-[20px] font-semibold text-white">{forecast.predictedQuantity.toLocaleString()}</span>
      </div>
      <p className="text-[10px] text-white/25 mb-4">predicted units · 14 days · {Math.round(avgConfidence * 100)}% confidence</p>

      {/* Mini bar chart */}
      <div className="flex items-end gap-[3px] h-16 mb-4">
        {forecast.breakdown.map((day) => {
          const height = Math.max(4, (day.predicted / maxPredicted) * 100);
          const isHigh = day.predicted > maxPredicted * 0.8;
          return (
            <div
              key={day.day}
              className="flex-1 rounded-t-sm transition-all"
              style={{
                height: `${height}%`,
                backgroundColor: isHigh ? accent : accent + "40",
                opacity: 0.5 + day.confidence * 0.5,
              }}
              title={`${day.day}: ${day.predicted} units (${Math.round(day.confidence * 100)}% conf)`}
            />
          );
        })}
      </div>
      <div className="flex justify-between mb-4">
        <span className="text-[9px] text-white/20">Day 1</span>
        <span className="text-[9px] text-white/20">Day 14</span>
      </div>

      {/* Recommended order */}
      <div className="rounded-lg p-3" style={{ backgroundColor: urgencyColor + "08", border: `1px solid ${urgencyColor}20` }}>
        <div className="flex items-center gap-2 mb-1">
          <UrgencyIcon size={13} style={{ color: urgencyColor }} />
          <span className="text-[11px] font-medium" style={{ color: urgencyColor }}>
            {forecast.recommendedOrder.urgency === "high" ? "Reorder Now" : forecast.recommendedOrder.urgency === "medium" ? "Plan Reorder" : "Stock OK"}
          </span>
        </div>
        <p className="text-[11px] text-white/40 leading-relaxed">{forecast.recommendedOrder.reason}</p>
        <p className="text-[12px] text-white/60 mt-1">
          Suggested: <span className="font-medium text-white/80">{forecast.recommendedOrder.quantity.toLocaleString()} units</span>
        </p>
      </div>
    </div>
  );
}
