"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Search, Mic, Camera, Plus, Minus, ShoppingCart, ArrowLeft, Check } from "lucide-react";

const CATALOG_ITEMS = [
  { id: "1", name: "Whole Chicken (Halal, 1.2kg)", category: "Poultry", price: 95, unit: "kg", supplier: "Cairo Poultry Company" },
  { id: "2", name: "Full Cream Milk (1L UHT)", category: "Dairy", price: 28, unit: "carton", supplier: "Obour Land" },
  { id: "3", name: "Egyptian Cotton Towels", category: "Housekeeping", price: 285, unit: "pc", supplier: "Egyptian Linen & Textile" },
  { id: "4", name: "Orange Juice (1L Fresh)", category: "Beverages", price: 55, unit: "bottle", supplier: "Juhayna" },
  { id: "5", name: "Nile Perch Fillet", category: "Seafood", price: 195, unit: "kg", supplier: "National Fisheries" },
  { id: "6", name: "LED Panel Light (60x60)", category: "Engineering", price: 285, unit: "pc", supplier: "El Araby Group" },
  { id: "7", name: "All-Purpose Cleaner (5L)", category: "Cleaning", price: 185, unit: "bottle", supplier: "Dakahlia Cleaning" },
  { id: "8", name: "Guest Amenities Set", category: "Amenities", price: 65, unit: "set", supplier: "Sharm Amenities" },
];

export default function MobileOrderFlow() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [step, setStep] = useState<"browse" | "review" | "confirm">("browse");

  const filtered = CATALOG_ITEMS.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = CATALOG_ITEMS.find((i) => i.id === id)!;
      return { ...item, qty, lineTotal: item.price * qty };
    });

  const cartTotal = cartItems.reduce((s, i) => s + i.lineTotal, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  function addToCart(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }

  function removeFromCart(id: string) {
    setCart((c) => {
      const next = { ...c };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  }

  if (step === "review") {
    return (
      <DashboardShell role="hotel">
        <div className="max-w-md mx-auto pb-20">
          <button onClick={() => setStep("browse")} className="flex items-center gap-2 text-sm text-foreground-muted mb-4">
            <ArrowLeft size={16} /> Back to catalog
          </button>
          <h1 className="text-xl font-bold mb-4">Review Order</h1>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="glass-card p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-foreground-faint">{item.supplier}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{item.lineTotal.toLocaleString()} EGP</p>
                  <p className="text-xs text-foreground-faint">{item.qty} × {item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card p-4 mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-foreground-muted">Subtotal</span>
              <span className="text-sm">{cartTotal.toLocaleString()} EGP</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-foreground-muted">VAT (14%)</span>
              <span className="text-sm">{Math.round(cartTotal * 0.14).toLocaleString()} EGP</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border-subtle">
              <span className="font-bold">Total</span>
              <span className="font-bold text-brand-400">{Math.round(cartTotal * 1.14).toLocaleString()} EGP</span>
            </div>
          </div>
          <button onClick={() => setStep("confirm")} className="w-full h-12 mt-4 rounded-xl bg-brand-700 text-white font-semibold hover:bg-brand-600 transition-colors">
            Submit Purchase Order
          </button>
        </div>
      </DashboardShell>
    );
  }

  if (step === "confirm") {
    return (
      <DashboardShell role="hotel">
        <div className="max-w-md mx-auto text-center pt-12">
          <div className="w-16 h-16 rounded-full bg-accent-emerald/20 flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-accent-emerald" />
          </div>
          <h1 className="text-xl font-bold mb-2">Order Submitted!</h1>
          <p className="text-sm text-foreground-muted mb-6">PO-2026-1245 sent for approval</p>
          <div className="glass-card p-4 text-left mb-6">
            <p className="text-xs text-foreground-faint mb-1">Total</p>
            <p className="text-lg font-bold">{Math.round(cartTotal * 1.14).toLocaleString()} EGP</p>
          </div>
          <button onClick={() => { setCart({}); setStep("browse"); }} className="w-full h-12 rounded-xl bg-surface-raised text-foreground font-semibold hover:bg-surface-hover transition-colors">
            Place Another Order
          </button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="hotel">
      <div className="max-w-md mx-auto pb-24">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl pb-3 pt-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-faint" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-20 rounded-xl bg-surface-raised border border-border-subtle text-sm focus:outline-none focus:border-brand-700"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button className="p-2 rounded-lg bg-surface-hover"><Mic size={14} className="text-foreground-faint" /></button>
              <button className="p-2 rounded-lg bg-surface-hover"><Camera size={14} className="text-foreground-faint" /></button>
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-2">
          {filtered.map((item) => (
            <div key={item.id} className="glass-card p-4 flex justify-between items-start">
              <div className="flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-faint bg-surface-raised px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <p className="text-sm font-medium mt-1">{item.name}</p>
                <p className="text-xs text-foreground-faint">{item.supplier}</p>
                <p className="text-sm font-bold text-brand-400 mt-1">{item.price} EGP/{item.unit}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {cart[item.id] ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center"><Minus size={14} /></button>
                    <span className="text-sm font-bold w-6 text-center">{cart[item.id]}</span>
                    <button onClick={() => addToCart(item.id)} className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center"><Plus size={14} /></button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(item.id)} className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center">
                    <Plus size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {cartCount > 0 && (
          <button
            onClick={() => setStep("review")}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-14 rounded-2xl bg-brand-700 text-white font-semibold flex items-center justify-center gap-2 shadow-xl shadow-brand-900/30 z-50"
          >
            <ShoppingCart size={18} />
            Review Order ({cartCount} items) — {Math.round(cartTotal * 1.14).toLocaleString()} EGP
          </button>
        )}
      </div>
    </DashboardShell>
  );
}
