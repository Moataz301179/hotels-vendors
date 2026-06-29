"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Package,
} from "lucide-react";
import { useCart } from "./cart-context";
import { VAT_RATE, VAT_PERCENT } from "@/lib/constants";

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    totalItems,
  } = useCart();

  const vatAmount = subtotal * VAT_RATE;
  const total = subtotal + vatAmount;

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md flex flex-col border-l border-white/[0.06] bg-[#121212] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-base/20 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-accent-base" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Your Cart</h3>
                  <p className="text-[11px] text-white/30">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <Package size={28} className="text-white/15" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-white/60">
                      Your cart is empty
                    </h4>
                    <p className="text-xs text-white/25 mt-1">
                      Browse the catalog to add products
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      closeCart();
                      router.push("/marketplace");
                    }}
                    className="px-4 py-2 rounded-lg bg-accent-base hover:bg-accent-base/80 text-white text-xs font-medium transition-colors"
                  >
                    Browse Marketplace
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 px-5 py-4"
                    >
                      {/* Image */}
                      <div className="w-12 h-12 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <Package size={18} className="text-white/15" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-white/25">
                          {item.sku} · {item.supplierName}
                        </p>
                        <p className="text-[11px] font-semibold text-white/60 mt-0.5">
                          {item.unitPrice.toLocaleString()} EGP
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                        >
                          <Minus size={12} className="text-white/50" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                        >
                          <Plus size={12} className="text-white/50" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-white/15 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/[0.06] px-5 py-4 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Subtotal</span>
                    <span className="text-white/70">
                      {subtotal.toLocaleString()} EGP
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">VAT ({VAT_PERCENT}%)</span>
                    <span className="text-white/70">
                      {Math.round(vatAmount).toLocaleString()} EGP
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/[0.06] flex justify-between">
                    <span className="text-sm font-semibold text-white">
                      Total
                    </span>
                    <span className="text-sm font-bold text-white">
                      {Math.round(total).toLocaleString()} EGP
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    closeCart();
                    router.push("/dashboard/hotel/order");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-base hover:bg-accent-base/80 text-white text-sm font-medium transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => {
                    closeCart();
                    router.push("/marketplace");
                  }}
                  className="w-full text-center text-xs text-white/30 hover:text-white/60 transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
