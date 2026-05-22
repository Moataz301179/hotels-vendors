"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileCheck, Building2, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

interface BusinessDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { taxId: string; commercialReg: string; saveForFuture: boolean }) => Promise<void>;
  entityName?: string;
}

export function BusinessDocsModal({ isOpen, onClose, onSubmit, entityName = "your business" }: BusinessDocsModalProps) {
  const [taxId, setTaxId] = useState("");
  const [commercialReg, setCommercialReg] = useState("");
  const [saveForFuture, setSaveForFuture] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!taxId.trim() || taxId.length < 9) {
      setError("Please enter a valid 9-digit Egyptian Tax ID");
      return;
    }
    if (!commercialReg.trim()) {
      setError("Please enter your Commercial Registration number");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ taxId, commercialReg, saveForFuture });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#0f0f0f] shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-[#8b5cf6]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Business Verification Required</h3>
                  <p className="text-[10px] text-white/40">ETA Compliance — One-time setup</p>
                </div>
              </div>
              {!loading && (
                <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-6">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Documents Saved</h4>
                    <p className="text-white/40 text-xs mt-1">
                      Your Tax ID and Commercial Registration have been saved. You can now proceed with your transaction.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-lg bg-[#8b5cf6] hover:bg-[#6d28d9] text-white text-sm font-medium transition-colors"
                  >
                    Continue
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Info banner */}
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-400/70 leading-relaxed">
                      As a business entity, Egyptian Tax Authority (ETA) regulations require a valid Tax ID and Commercial Registration before processing transactions. Individual accounts are exempt.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-[#8b5cf6]" />
                      Tax ID <span className="text-[#8b5cf6]">*</span>
                    </label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value.replace(/\D/g, ""))}
                      placeholder="9-digit Egyptian tax ID"
                      maxLength={9}
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8b5cf6]/60 focus:ring-1 focus:ring-[#8b5cf6]/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                      <FileCheck className="w-3.5 h-3.5 text-[#8b5cf6]" />
                      Commercial Registration <span className="text-[#8b5cf6]">*</span>
                    </label>
                    <input
                      type="text"
                      value={commercialReg}
                      onChange={(e) => setCommercialReg(e.target.value)}
                      placeholder="Commercial registration number"
                      className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8b5cf6]/60 focus:ring-1 focus:ring-[#8b5cf6]/20 transition-all"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveForFuture}
                      onChange={(e) => setSaveForFuture(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.04] text-[#8b5cf6] focus:ring-[#8b5cf6]/20"
                    />
                    <span className="text-xs text-white/40 leading-relaxed">
                      Save these details for future transactions. You can update them anytime in your account settings.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#8b5cf6] hover:bg-[#6d28d9] text-white text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(139, 92, 246,0.2)]"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Save & Continue</span>
                        <FileCheck className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
