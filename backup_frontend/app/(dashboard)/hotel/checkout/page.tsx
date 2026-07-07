"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  CreditCard,
  MapPin,
  CheckCircle,
  Package,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-context";

interface Address {
  label?: string;
  address: string;
  city: string;
  governorate: string;
  phone: string;
}

const STEPS = [
  { id: 1, label: "Address", icon: MapPin },
  { id: 2, label: "Shipping", icon: Truck },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Confirm", icon: CheckCircle },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  const [address, setAddress] = useState<Address>({
    address: "",
    city: "Cairo",
    governorate: "Cairo",
    phone: "",
  });

  const [shippingMethod, setShippingMethod] = useState<"express" | "standard" | "self">("standard");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [poNumber, setPoNumber] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [notes, setNotes] = useState("");

  const vatRate = 0.14;
  const vatAmount = subtotal * vatRate;
  const shippingCost = shippingMethod === "express" ? 150 : shippingMethod === "standard" ? 75 : 0;
  const grandTotal = subtotal + vatAmount + shippingCost;

  // Group by supplier
  const supplierGroups = items.reduce((acc, item) => {
    if (!acc[item.supplierName]) acc[item.supplierName] = [];
    acc[item.supplierName].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
          address,
          shippingMethod,
          paymentMethod,
          poNumber: poNumber || undefined,
          costCenter: costCenter || undefined,
          procurementNotes: notes || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setOrders(json.data.orders);
        setPlaced(true);
        clearCart();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully</h1>
        <p className="text-gray-500 mb-6">Your orders have been submitted for approval.</p>
        <div className="space-y-3 mb-8">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-xl border border-gray-200 p-4 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{o.orderNumber}</p>
                  <p className="text-xs text-gray-500">{o.supplier}</p>
                </div>
                <span className="text-sm font-bold text-accent-base">EGP {o.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => router.push("/hotel/order")}
          className="px-6 py-3 rounded-xl bg-accent-base text-white font-medium hover:bg-[#6B0512] transition-colors"
        >
          Track Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = step >= s.id;
          const isCurrent = step === s.id;
          return (
            <div key={s.id} className="flex items-center gap-2 shrink-0">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isCurrent
                    ? "bg-accent-base text-white"
                    : isActive
                    ? "bg-accent-base/10 text-accent-base"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon size={14} />
                {s.label}
              </div>
              {i < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-300" />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
              >
                <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                    <input
                      value={address.address}
                      onChange={(e) => setAddress({ ...address, address: e.target.value })}
                      placeholder="Street address"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-accent-base/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                    <input
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-accent-base/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Governorate</label>
                    <input
                      value={address.governorate}
                      onChange={(e) => setAddress({ ...address, governorate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-accent-base/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                    <input
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="+20 10..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-accent-base/40"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!address.address || !address.phone}
                  className="w-full py-3 rounded-xl bg-accent-base text-white font-medium hover:bg-[#6B0512] disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                >
                  Continue to Shipping
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
              >
                <h2 className="text-lg font-semibold text-gray-900">Shipping Method</h2>
                <div className="space-y-3">
                  {[
                    { id: "express", label: "Express (48 hours)", cost: 150, desc: "Coastal & industrial clusters" },
                    { id: "standard", label: "Standard (3-5 days)", cost: 75, desc: "All of Egypt" },
                    { id: "self", label: "Supplier Self-Shipping", cost: 0, desc: "Arranged directly with supplier" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setShippingMethod(method.id as any)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors text-left ${
                        shippingMethod === method.id
                          ? "border-accent-base bg-accent-base/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                        <p className="text-xs text-gray-500">{method.desc}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {method.cost === 0 ? "Free" : `EGP ${method.cost}`}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-xl bg-accent-base text-white font-medium hover:bg-[#6B0512]"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
              >
                <h2 className="text-lg font-semibold text-gray-900">Review & Payment</h2>

                {/* B2B Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">PO Number</label>
                    <input
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-accent-base/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Cost Center</label>
                    <input
                      value={costCenter}
                      onChange={(e) => setCostCenter(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-accent-base/40"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "bank_transfer", label: "Bank Transfer" },
                      { id: "invoice", label: "Invoice (Net 30)" },
                      { id: "factoring", label: "Non-Recourse Factoring" },
                      { id: "credit_terms", label: "Credit Terms" },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                          paymentMethod === pm.id
                            ? "border-accent-base bg-accent-base/5 text-accent-base"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-accent-base/40 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-accent-base text-white font-medium hover:bg-[#6B0512] disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Placing Order..." : `Place Order · EGP ${grandTotal.toFixed(2)}`}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cart Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Items</h3>
            {Object.entries(supplierGroups).map(([supplierName, supplierItems]) => (
              <div key={supplierName} className="mb-4 last:mb-0">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                  <Package size={14} className="text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">{supplierName}</span>
                </div>
                <div className="space-y-3">
                  {supplierItems.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-300 shrink-0">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.sku}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium text-gray-900 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-20 text-right">
                        EGP {(item.quantity * item.unitPrice).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>EGP {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT (14%)</span>
                <span>EGP {vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `EGP ${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-gray-900">
                <span>Grand Total</span>
                <span>EGP {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {Object.keys(supplierGroups).length > 1 && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Your order will be split into {Object.keys(supplierGroups).length} separate orders for optimal fulfillment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
