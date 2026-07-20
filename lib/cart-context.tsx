"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/global';
import { MarketplaceProduct } from '@/lib/marketplace/category-mapper';

interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  checkout: (params: {
    address: {
      address: string;
      city: string;
      governorate: string;
      label?: string;
      lat?: number;
      lng?: number;
    };
    shippingMethod: "express" | "standard" | "self";
    paymentMethod: string;
    poNumber?: string;
    costCenter?: string;
    procurementNotes?: string;
  }) => Promise<{ orders: Array<{ id: string; orderNumber: string; supplier: string; total: number; status: string }>; checkoutGroupId: string; orderCount: number }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('hotelsvendors_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('hotelsvendors_cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hotelsvendors_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product | MarketplaceProduct, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // For marketplace products, we need to convert to full product details
      // For now, we'll store minimal info and fetch details at checkout
      return [...prev, { 
        productId: product.id, 
        quantity, 
        unitPrice: typeof product === 'object' && 'unitPrice' in product 
          ? product.unitPrice 
          : 0 
      }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const checkout = useCallback(async (params: {
    address: {
      address: string;
      city: string;
      governorate: string;
      label?: string;
      lat?: number;
      lng?: number;
    };
    shippingMethod: "express" | "standard" | "self";
    paymentMethod: string;
    poNumber?: string;
    costCenter?: string;
    procurementNotes?: string;
  }) => {
    if (items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Fetch full product details for all items in cart
    const productIds = items.map(item => item.productId);
    const productsResponse = await fetch(`/api/v1/products?productId=${productIds.join(',')}&status=ACTIVE`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!productsResponse.ok) {
      throw new Error('Failed to fetch product details');
    }
    
    const productsData = await productsResponse.json();
    if (!productsData.success || !productsData.data?.products) {
      throw new Error('Invalid product data response');
    }
    
    // Build items array for checkout API
    const checkoutItems = items.map(cartItem => {
      const productDetails = productsData.data.products.find(p => p.id === cartItem.productId);
      if (!productDetails) {
        throw new Error(`Product not found: ${cartItem.productId}`);
      }
      
      return {
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        unitPrice: parseFloat(productDetails.unitPrice), // Use actual price from DB
        notes: '' // Could be customized later
      };
    });

    // Call checkout API
    const response = await fetch('/api/v1/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: checkoutItems,
        ...params
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Checkout failed');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Checkout failed');
    }

    // Clear cart after successful checkout
    clearCart();
    
    return result.data;
  }, [items, clearCart]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getItemCount,
        isOpen,
        setIsOpen,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context as CartContextType & { checkout: (params: { address: {
    address: string;
    city: string;
    governorate: string;
    label?: string;
    lat?: number;
    lng?: number;
  }; shippingMethod: "express" | "standard" | "self"; paymentMethod: string; poNumber?: string; costCenter?: string; procurementNotes?: string; }) };
}