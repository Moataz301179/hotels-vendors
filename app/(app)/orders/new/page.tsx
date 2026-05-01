"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

interface Product {
  id: string;
  sku: string;
  name: string;
  unitPrice: number;
  unitOfMeasure: string;
}

interface Supplier {
  id: string;
  name: string;
}

interface Hotel {
  id: string;
  name: string;
  properties?: { id: string; name: string }[];
}

interface Outlet {
  id: string;
  name: string;
  propertyId: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export default function NewOrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [hotelId, setHotelId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, sRes, hRes] = await Promise.all([
          fetch("/api/products?limit=100"),
          fetch("/api/suppliers?limit=100"),
          fetch("/api/hotels?limit=10"),
        ]);
        const pData = await pRes.json();
        const sData = await sRes.json();
        const hData = await hRes.json();
        if (pData.success) setProducts(pData.data);
        if (sData.success) setSuppliers(sData.data);
        if (hData.success) setHotels(hData.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!propertyId) {
      setOutlets([]);
      setOutletId("");
      return;
    }
    fetch(`/api/properties/${propertyId}/outlets`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setOutlets(d.data);
      });
  }, [propertyId]);

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, unitPrice: 0 }]);
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const next = [...items];
    if (field === "productId") {
      const product = products.find((p) => p.id === value);
      next[index] = { ...next[index], productId: value as string, unitPrice: product?.unitPrice || 0 };
    } else {
      next[index] = { ...next[index], [field]: value };
    }
    setItems(next);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((s, item) => s + item.unitPrice * item.quantity, 0);
  const vat = subtotal * 0.14;
  const total = subtotal + vat;

  const handleSubmit = async () => {
    if (!hotelId || !supplierId || items.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: `ORD-${Date.now()}`,
          hotelId,
          propertyId: propertyId || undefined,
          outletId: outletId || undefined,
          supplierId,
          requesterId: "system",
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          deliveryDate: deliveryDate || undefined,
          deliveryInstructions: deliveryInstructions || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/orders");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedHotel = hotels.find((h) => h.id === hotelId);
  const filteredProperties = selectedHotel?.properties || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-xs text-foreground-muted">
        <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">New Purchase Order</h1>
          <p className="text-[11px] text-foreground-muted">Create a new order with outlet delivery</p>
        </div>
      </div>

      <div className="bg-[#13161c]/80 backdrop-blur border border-white/10 rounded-lg p-4 space-y-4">
        {/* Header Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-medium text-foreground-muted mb-1 block">Hotel</label>
            <select
              value={hotelId}
              onChange={(e) => {
                setHotelId(e.target.value);
                setPropertyId("");
                setOutletId("");
              }}
              className="w-full text-[11px] rounded-md bg-background border border-border-subtle px-2 py-[5px] focus:border-brand-500/50 focus:outline-none"
            >
              <option value="">Select hotel...</option>
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-foreground-muted mb-1 block">Supplier</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full text-[11px] rounded-md bg-background border border-border-subtle px-2 py-[5px] focus:border-brand-500/50 focus:outline-none"
            >
              <option value="">Select supplier...</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-foreground-muted mb-1 block">Property (optional)</label>
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full text-[11px] rounded-md bg-background border border-border-subtle px-2 py-[5px] focus:border-brand-500/50 focus:outline-none"
            >
              <option value="">Select property...</option>
              {filteredProperties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-foreground-muted mb-1 block">Outlet (optional)</label>
            <select
              value={outletId}
              onChange={(e) => setOutletId(e.target.value)}
              disabled={!propertyId}
              className="w-full text-[11px] rounded-md bg-background border border-border-subtle px-2 py-[5px] focus:border-brand-500/50 focus:outline-none disabled:opacity-40"
            >
              <option value="">{propertyId ? "Select outlet..." : "Select property first"}</option>
              {outlets.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-foreground-muted mb-1 block">Delivery Date</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full text-[11px] rounded-md bg-background border border-border-subtle px-2 py-[5px] focus:border-brand-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-medium text-foreground-muted mb-1 block">Instructions</label>
            <input
              type="text"
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              placeholder="Delivery instructions..."
              className="w-full text-[11px] rounded-md bg-background border border-border-subtle px-2 py-[5px] focus:border-brand-500/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-border-subtle pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-foreground-muted">Line Items</span>
            <button
              onClick={addItem}
              className="flex items-center gap-1 text-[10px] text-brand-400 hover:text-brand-300 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-surface rounded-md p-2 border border-border-subtle/50">
                <div className="col-span-5">
                  <select
                    value={item.productId}
                    onChange={(e) => updateItem(idx, "productId", e.target.value)}
                    className="w-full text-[11px] rounded-md bg-background border border-border-subtle px-2 py-[5px] focus:border-brand-500/50 focus:outline-none"
                  >
                    <option value="">Select product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (EGP {p.unitPrice})</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)}
                    className="w-full text-[11px] rounded-md bg-background border border-border-subtle px-2 py-[5px] focus:border-brand-500/50 focus:outline-none"
                  />
                </div>
                <div className="col-span-2 text-right text-[11px] font-mono">
                  EGP {(item.unitPrice * item.quantity).toLocaleString()}
                </div>
                <div className="col-span-2 text-right text-[10px] text-foreground-muted">
                  EGP {item.unitPrice.toLocaleString()} / unit
                </div>
                <div className="col-span-1 flex justify-end">
                  <button onClick={() => removeItem(idx)} className="p-1 rounded hover:bg-red-500/10 text-red-400 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center text-[11px] text-foreground-muted py-4 border border-dashed border-border-subtle rounded-md">
                No items added yet
              </div>
            )}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-border-subtle pt-3 flex justify-end">
          <div className="w-48 space-y-1 text-[11px]">
            <div className="flex justify-between text-foreground-muted">
              <span>Subtotal</span>
              <span className="font-mono">EGP {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-foreground-muted">
              <span>VAT (14%)</span>
              <span className="font-mono">EGP {vat.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-foreground pt-1 border-t border-border-subtle">
              <span>Total</span>
              <span className="font-mono">EGP {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={() => router.push("/orders")}
            className="px-3 py-1.5 text-[11px] rounded-md text-foreground-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!hotelId || !supplierId || items.length === 0 || submitting}
            className="px-3 py-1.5 text-[11px] rounded-md bg-brand-600 hover:bg-brand-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
