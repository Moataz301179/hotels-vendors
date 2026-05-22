"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Truck, Check, AlertTriangle, ArrowRight, Building2, Phone, FileText, Users } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export default function LogisticsPartnerApplyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    fleetSize: "",
    regNumber: "",
    message: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.companyName || !form.contactName || !form.email || !form.phone) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // In production, POST to /api/v1/partners/apply
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black">
      <MarketingNav />

      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-2xl px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/partners" className="inline-flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors mb-6">
              <ArrowLeft size={13} />
              Back to Partner Programs
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center">
                <Truck size={20} className="text-cyan-400" />
              </div>
              <div>
                <h1 className="text-[22px] font-semibold text-white tracking-tight">Logistics Partner Application</h1>
                <p className="text-[11px] text-white/30">Apply to join our delivery network</p>
              </div>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center space-y-5">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <div>
                  <h3 className="text-[16px] font-semibold text-white">Application Submitted</h3>
                  <p className="text-[13px] text-white/40 mt-1 max-w-sm mx-auto">
                    Our partnership team will review your application and contact you within 2 business days.
                  </p>
                </div>
                <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white/70 transition-colors">
                  <ArrowLeft size={14} />
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[12px] text-red-400">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Company Name *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                      <input type="text" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Registered company name" required
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-white placeholder:text-white/15 outline-none focus:border-cyan-500/50 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Commercial Reg. # *</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                      <input type="text" value={form.regNumber} onChange={(e) => update("regNumber", e.target.value)} placeholder="Tax / commercial number" required
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-white placeholder:text-white/15 outline-none focus:border-cyan-500/50 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Contact Name *</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                      <input type="text" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} placeholder="Primary contact person" required
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-white placeholder:text-white/15 outline-none focus:border-cyan-500/50 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Fleet Size *</label>
                    <select value={form.fleetSize} onChange={(e) => update("fleetSize", e.target.value)} required
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-white outline-none focus:border-cyan-500/50 transition-all appearance-none">
                      <option value="" className="bg-[#111]">Select fleet size</option>
                      <option value="3-10" className="bg-[#111]">3–10 vehicles</option>
                      <option value="11-25" className="bg-[#111]">11–25 vehicles</option>
                      <option value="26-50" className="bg-[#111]">26–50 vehicles</option>
                      <option value="50+" className="bg-[#111]">50+ vehicles</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="partnerships@company.com" required
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-white placeholder:text-white/15 outline-none focus:border-cyan-500/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                      <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+20 1xx xxx xxxx" required
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-white placeholder:text-white/15 outline-none focus:border-cyan-500/50 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Additional Information</label>
                  <textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us about your coverage areas, specializations, or anything else..." rows={4}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-white placeholder:text-white/15 outline-none focus:border-cyan-500/50 transition-all resize-none" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-[13px] font-medium transition-all active:scale-[0.98] disabled:opacity-50">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Submit Application</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
