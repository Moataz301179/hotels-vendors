"use client";

import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "./cart-context";
import { useToast } from "./toast";
import Link from "next/link";

function ProductImage({ images, category }: { images: string | null; category: string }) {
  const [error, setError] = useState(false);
  const initial = category?.[0] || "?";

  let src = "";
  if (images) {
    try {
      const arr = JSON.parse(images);
      if (Array.isArray(arr) && arr.length > 0) src = arr[0];
    } catch {}
  }

  if (error || !src) {
    return (
      <div className="w-12 h-12 rounded-md bg-surface-raised flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-foreground-faint">{initial}</span>
      </div>
    );
  }

  return (
    <div className="w-12 h-12 rounded-md bg-surface-raised overflow-hidden shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="w-full h-full object-cover" onError={() => setError(true)} />
    </div>
  );
}

export function CartSidebar() {
  const { cart, isOpen, setIsOpen, updateItem, removeItem, loading } = useCart();
  const { showToast } = useToast();
  const [checkingOut, setCheckingOut] = useState(false);

  const items = cart?.items ?? [];
  const summary = cart?.summary;

  const handleCheckout = async () => {
    if (!items.length) return;
    // Determine supplier from first item
    const supplierId = items[0]?.product.supplier?.id;
    if (!supplierId) {
      showToast("Cannot determine supplier", "error");
      return;
    }
    setCheckingOut(true);
    try {
      const res = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierId }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Order created successfully!");
        setIsOpen(false);
      } else {
        showToast(json.error || "Checkout failed", "error");
      }
    } catch {
      showToast("Checkout failed", "error");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#13161c] border-l border-white/10 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-semibold">Your Cart</h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {summary?.itemCount ?? 0}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-md text-foreground-muted hover:bg-surface-raised hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-12 h-12 rounded-md bg-surface-raised shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-24 bg-surface-raised rounded" />
                    <div className="h-2 w-16 bg-surface-raised rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="w-10 h-10 text-foreground-faint mb-3" />
              <p className="text-sm text-foreground-muted">Your cart is empty</p>
              <p className="text-[11px] text-foreground-faint mt-1">Browse the catalog to add items</p>
              <Link
                href="/catalog"
                onClick={() => setIsOpen(false)}
                className="mt-4 text-xs px-3 py-1.5 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition-colors"
              >
                Go to Catalog
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-2.5 rounded-lg bg-[#13161c]/80 border border-white/10"
              >
                <ProductImage images={item.product.images} category={item.product.category} />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/catalog/${item.product.id}`}
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-medium text-foreground hover:text-brand-400 transition-colors line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <div className="text-[10px] text-foreground-muted mt-0.5">
                    {item.product.supplier?.name} · EGP {item.unitPrice.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateItem(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="p-1 rounded bg-white/5 border border-white/10 text-foreground-muted hover:text-foreground transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="p-1 rounded bg-white/5 border border-white/10 text-foreground-muted hover:text-foreground transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-400">
                        EGP {item.total.toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 rounded text-foreground-faint hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && summary && (
          <div className="border-t border-white/10 px-4 py-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground-muted">Subtotal</span>
              <span className="text-foreground">EGP {summary.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground-muted">VAT (14%)</span>
              <span className="text-foreground">EGP {summary.vatAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold pt-1 border-t border-white/10">
              <span>Total</span>
              <span className="text-emerald-400">EGP {summary.total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-lg bg-brand-700 text-white text-xs font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {checkingOut ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
