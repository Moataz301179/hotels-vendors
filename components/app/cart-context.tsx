"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface CartItem {
  id: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product: {
    id: string;
    name: string;
    sku: string;
    unitPrice: number;
    images: string | null;
    category: string;
    supplier: { id: string; name: string } | null;
  };
}

interface CartSummary {
  subtotal: number;
  vatAmount: number;
  total: number;
  itemCount: number;
}

interface CartData {
  id: string;
  items: CartItem[];
  summary: CartSummary;
}

interface CartContextValue {
  cart: CartData | null;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      const json = await res.json();
      if (json.success) {
        setCart(json.data);
      }
    } catch (e) {
      console.error("Failed to refresh cart", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (productId: string, quantity: number) => {
    const res = await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to add to cart");
    await refreshCart();
  }, [refreshCart]);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to update item");
    await refreshCart();
  }, [refreshCart]);

  const removeItem = useCallback(async (itemId: string) => {
    const res = await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to remove item");
    await refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider
      value={{ cart, loading, refreshCart, addToCart, updateItem, removeItem, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
