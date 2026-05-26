"use client";

import { useState } from "react";
import { ShoppingCart, ShieldCheck, FileSignature, CheckCircle2, AlertTriangle, Key, Loader2 } from "lucide-react";

export default function HotelOrderingMatrix() {
  const [cartState, setCartState] = useState<"REQUISITION" | "PURCHASING_REVIEW" | "FINANCE_FINAL">("REQUISITION");
  const [authCode, setAuthCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Mock Cart Data
  const cartValue = 125000;
  const supplierName = "Global Roasters SME";

  const handleAuthSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderConfirmed(true);
    }, 1500);
  };

  return (
    <div className="bg-[var(--bg-canvas,#000000)] min-h-screen text-[var(--text-primary,#f0f0f0)] p-8 font-sans">
      
      <header className="mb-8 border-b border-[var(--border-subtle,rgba(255,255,255,0.1))] pb-6">
        <h1 className="text-2xl font-black">Enterprise Procurement Matrix</h1>
        <p className="text-sm text-[var(--text-secondary,#a0a0a0)]">Strict 3-Level LPO Authorization Protocol</p>
      </header>

      {/* Progress Tracker */}
      <div className="flex items-center gap-4 mb-10 max-w-4xl mx-auto">
        <div className={`flex-1 p-4 rounded border transition-all ${cartState === "REQUISITION" ? "bg-[var(--crimson-glow,rgba(139, 92, 246,0.2))] border-[var(--brand-red,#bef264)]" : "bg-[var(--bg-surface-1,#0a0a0a)] border-[var(--border-invisible,rgba(255,255,255,0.06))]"}`}>
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-secondary,#a0a0a0)] font-bold mb-1">Step 1</div>
          <div className="text-sm font-bold flex items-center gap-2">
            <ShoppingCart size={16} /> Department Preparer
          </div>
        </div>
        
        <div className={`flex-1 p-4 rounded border transition-all ${cartState === "PURCHASING_REVIEW" ? "bg-[var(--crimson-glow,rgba(139, 92, 246,0.2))] border-[var(--brand-red,#bef264)]" : "bg-[var(--bg-surface-1,#0a0a0a)] border-[var(--border-invisible,rgba(255,255,255,0.06))]"}`}>
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-secondary,#a0a0a0)] font-bold mb-1">Step 2</div>
          <div className="text-sm font-bold flex items-center gap-2">
            <FileSignature size={16} /> Purchasing Manager
          </div>
        </div>

        <div className={`flex-1 p-4 rounded border transition-all ${cartState === "FINANCE_FINAL" ? "bg-[var(--crimson-glow,rgba(139, 92, 246,0.2))] border-[var(--brand-red,#bef264)]" : "bg-[var(--bg-surface-1,#0a0a0a)] border-[var(--border-invisible,rgba(255,255,255,0.06))]"}`}>
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-secondary,#a0a0a0)] font-bold mb-1">Step 3 (Master Authority)</div>
          <div className="text-sm font-bold flex items-center gap-2">
            <ShieldCheck size={16} /> Finance Manager
          </div>
        </div>
      </div>

      {!orderConfirmed ? (
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
          
          {/* Cart Summary */}
          <div className="col-span-1 bg-[var(--bg-surface-1,#0a0a0a)] border border-[var(--border-subtle,rgba(255,255,255,0.1))] p-6 rounded-lg h-fit">
            <h2 className="text-sm font-bold mb-4">Requisition Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary,#a0a0a0)]">Supplier</span>
                <span className="font-bold">{supplierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary,#a0a0a0)]">Items</span>
                <span>45 Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary,#a0a0a0)]">Delivery Type</span>
                <span className="text-[var(--warning,#ffbc33)] text-xs font-mono">Supplier In-House</span>
              </div>
              <div className="pt-4 border-t border-[var(--border-subtle,rgba(255,255,255,0.1))] flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[var(--gold-base,#e1a95f)]">{cartValue.toLocaleString()} EGP</span>
              </div>
            </div>
          </div>

          {/* Action Matrix */}
          <div className="col-span-2 bg-[var(--bg-surface-1,#0a0a0a)] border border-[var(--border-subtle,rgba(255,255,255,0.1))] p-6 rounded-lg">
            
            {cartState === "REQUISITION" && (
              <div>
                <h2 className="text-lg font-bold mb-2">Submit Department Requisition</h2>
                <p className="text-xs text-[var(--text-secondary,#a0a0a0)] mb-6">As a Preparer, you are submitting this cart to the Purchasing Manager for quantity audit.</p>
                <button onClick={() => setCartState("PURCHASING_REVIEW")} className="w-full py-3 rounded bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors">
                  Submit to Purchasing
                </button>
              </div>
            )}

            {cartState === "PURCHASING_REVIEW" && (
              <div>
                <h2 className="text-lg font-bold mb-2">Purchasing Manager Audit</h2>
                <p className="text-xs text-[var(--text-secondary,#a0a0a0)] mb-6">Review quantities. If approved, the cart is forwarded to the Finance Manager to establish the LPO.</p>
                <div className="flex gap-4">
                  <button onClick={() => setCartState("REQUISITION")} className="flex-1 py-3 rounded border border-red-500/50 text-red-400 font-bold text-sm hover:bg-red-500/10 transition-colors">
                    Reject to Preparer
                  </button>
                  <button onClick={() => setCartState("FINANCE_FINAL")} className="flex-1 py-3 rounded bg-[var(--brand-red,#bef264)] text-white font-bold text-sm hover:opacity-90 transition-colors">
                    Approve & Forward to Finance
                  </button>
                </div>
              </div>
            )}

            {cartState === "FINANCE_FINAL" && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-[var(--warning,#ffbc33)]">
                  <AlertTriangle size={20} />
                  <h2 className="text-lg font-bold">Master Authority Required</h2>
                </div>
                <p className="text-xs text-[var(--text-secondary,#a0a0a0)] mb-6">
                  Warning: The selected supplier uses IN_HOUSE shipping. HotelsVendors is not liable for transit delays. Payment remains in escrow until GRN is signed.
                </p>

                <div className="bg-[var(--bg-surface-2,#101010)] p-4 rounded border border-[var(--border-invisible,rgba(255,255,255,0.06))] mb-6">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary,#a0a0a0)] mb-3">
                    Enter Final Authorization OTP
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary,#707070)]" size={16} />
                    <input 
                      type="text"
                      maxLength={6}
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value.replace(/\\D/g, ''))}
                      placeholder="000000"
                      className="w-full bg-[var(--bg-surface-3,#1a1a1a)] border border-[var(--border-subtle,rgba(255,255,255,0.1))] text-white text-lg tracking-[0.5em] py-3 pl-10 rounded font-mono focus:outline-none focus:border-[var(--brand-red,#bef264)]"
                    />
                  </div>
                  <p className="text-[10px] text-[var(--text-tertiary,#707070)] mt-2">This code was sent securely to the designated Finance Manager's mobile device.</p>
                </div>

                <button 
                  onClick={handleAuthSubmit}
                  disabled={authCode.length !== 6 || isProcessing}
                  className="w-full py-4 rounded bg-[var(--brand-red,#bef264)] text-white font-bold shadow-lg disabled:opacity-50 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : "Post Final LPO to Supplier"}
                </button>
              </div>
            )}

          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto mt-20 text-center bg-green-500/10 border border-green-500/20 p-10 rounded-lg">
          <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-green-400 mb-2">LPO Irrevocably Transmitted</h2>
          <p className="text-sm text-green-200/70 mb-6">
            The supplier has acknowledged the order. The cancellation lock is now strictly enforced. Escrow funds are secured.
          </p>
          <button onClick={() => {setOrderConfirmed(false); setCartState("REQUISITION"); setAuthCode("");}} className="px-6 py-2 rounded bg-green-500/20 text-green-300 text-sm font-bold hover:bg-green-500/30">
            Return to Dashboard
          </button>
        </div>
      )}

    </div>
  );
}
