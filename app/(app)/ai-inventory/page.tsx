"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Brain, AlertTriangle, Package } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stockQuantity: number;
  reorderPoint: number;
  reorderQty: number;
  avgDailyUsage: number;
  projectedDays: number;
  isLow: boolean;
  supplierName: string;
  unitPrice: number;
  forecast: number[];
  aiSuggestion: { reorderQty: number; reason: string; confidence: number } | null;
  lastCountedAt: string | null;
}

export default function AiInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai-inventory")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setItems(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-xs text-foreground-muted">
        <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
        Running AI forecast models...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold flex items-center gap-2">
            <Brain className="w-4 h-4 text-brand-400" />
            AI Inventory Forecast
          </h1>
          <p className="text-[11px] text-foreground-muted">Demand prediction based on historical orders, seasonality, and occupancy trends</p>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400">Model v1.0</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: "Products Analyzed", value: items.length, icon: <Package className="w-3.5 h-3.5 text-blue-400" /> },
          { label: "Low Stock Alerts", value: items.filter((f) => f.isLow).length, icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> },
          { label: "Avg Confidence", value: `${Math.round(items.reduce((s, f) => s + (f.aiSuggestion?.confidence || 0), 0) / (items.length || 1))}%`, icon: <Brain className="w-3.5 h-3.5 text-violet-400" /> },
          { label: "Suggested Orders", value: items.filter((f) => f.aiSuggestion).length, icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> },
        ].map((k) => (
          <div key={k.label} className="rounded-md border border-border-subtle bg-surface p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] uppercase tracking-wider text-foreground-muted font-medium">{k.label}</span>
              {k.icon}
            </div>
            <div className="text-sm font-semibold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border-subtle text-foreground-muted bg-surface-raised/50">
              <th className="text-left px-3 py-1.5 font-medium">Product</th>
              <th className="text-left px-3 py-1.5 font-medium">SKU</th>
              <th className="text-right px-3 py-1.5 font-medium">Current</th>
              <th className="text-right px-3 py-1.5 font-medium">Projected Days</th>
              <th className="text-right px-3 py-1.5 font-medium">Reorder Qty</th>
              <th className="text-left px-3 py-1.5 font-medium">AI Reason</th>
              <th className="text-right px-3 py-1.5 font-medium">Confidence</th>
              <th className="text-left px-3 py-1.5 font-medium">Risk</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-foreground-muted">No forecast data available yet.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-border-subtle/40 hover:bg-surface-raised/40 transition-colors">
                  <td className="px-3 py-1.5 font-medium">{item.name}</td>
                  <td className="px-3 py-1.5 font-mono text-foreground-muted">{item.sku}</td>
                  <td className="px-3 py-1.5 text-right font-mono">{item.stockQuantity}</td>
                  <td className="px-3 py-1.5 text-right font-mono">{item.projectedDays}d</td>
                  <td className="px-3 py-1.5 text-right font-mono text-brand-400">{item.aiSuggestion?.reorderQty || 0}</td>
                  <td className="px-3 py-1.5 text-foreground-muted max-w-[200px] truncate">{item.aiSuggestion?.reason || "—"}</td>
                  <td className="px-3 py-1.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-10 h-1 rounded-full bg-surface overflow-hidden">
                        <div className="h-full rounded-full bg-violet-500" style={{ width: `${(item.aiSuggestion?.confidence || 0) * 100}%` }} />
                      </div>
                      <span className="text-[9px]">{Math.round((item.aiSuggestion?.confidence || 0) * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className={`text-[9px] px-1.5 py-[1px] rounded-full ${item.isLow ? "bg-red-500/10 text-red-400" : item.projectedDays < 14 ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                      {item.isLow ? "critical" : item.projectedDays < 14 ? "low" : "ok"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
