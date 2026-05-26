"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, User, ArrowLeft, ArrowRight, Check, AlertTriangle,
  Hotel, Building2, MapPin, Phone, Star, FileText, ChevronRight, ChevronLeft,
} from "lucide-react";

const GOVERNORATES = [
  "Cairo", "Alexandria", "Giza", "Qalyubia", "Port Said", "Suez", "Sharqia",
  "Dakahlia", "Beheira", "Gharbia", "Kafr El Sheikh", "Monufia", "Minya",
  "Beni Suef", "Faiyum", "Asyut", "Sohag", "Qena", "Luxor", "Aswan",
  "Red Sea", "South Sinai", "North Sinai", "Matruh", "New Valley", "Damietta",
];

const STAR_RATINGS = [
  { value: "1", label: "1 Star" },
  { value: "2", label: "2 Star" },
  { value: "3", label: "3 Star" },
  { value: "4", label: "4 Star" },
  { value: "5", label: "5 Star" },
  { value: "7", label: "7 Star" },
  { value: "boutique", label: "Boutique" },
  { value: "resort", label: "Resort" },
];

interface FormData {
  name: string;
  email: string;
  password: string;
  hotelName: string;
  taxId: string;
  commercialReg: string;
  governorate: string;
  city: string;
  address: string;
  starRating: string;
  phone: string;
}

export default function HotelRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "", email: "", password: "",
    hotelName: "", taxId: "", commercialReg: "",
    governorate: "", city: "", address: "",
    starRating: "", phone: "",
  });

  const update = (field: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setError("");
  };

  const validateStep1 = () => {
    if (!form.hotelName.trim()) return "Property name is required";
    if (!form.taxId.trim()) return "Tax ID is required";
    if (!form.commercialReg.trim()) return "Commercial registration number is required";
    if (!form.governorate) return "Governorate is required";
    if (!form.city.trim()) return "City is required";
    if (!form.address.trim()) return "Address is required";
    if (!form.starRating) return "Star rating is required";
    if (!form.phone.trim()) return "Contact phone is required";
    return "";
  };

  const validateStep2 = () => {
    if (!form.name.trim()) return "Manager name is required";
    if (!form.email.trim()) return "Business email is required";
    if (!form.email.includes("@")) return "Please enter a valid email";
    if (!form.password || form.password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const next = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setStep(2);
    setError("");
  };

  const back = () => { setStep(1); setError(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hotel",
          name: form.name,
          email: form.email,
          password: form.password,
          taxId: form.taxId,
          commercialReg: form.commercialReg,
          governorate: form.governorate,
          city: form.city,
          address: form.address,
          phone: form.phone,
          accountType: "business",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRegistered(true);
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-white/15 outline-none focus:border-[#bef264]/40 focus:ring-1 focus:ring-[#bef264]/10 transition-all";
  const selectCls = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[13px] text-white outline-none focus:border-[#bef264]/40 focus:ring-1 focus:ring-[#bef264]/10 transition-all appearance-none";
  const labelCls = "text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5 block";

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/register" className="inline-flex items-center gap-1.5 text-[12px] text-white/25 hover:text-white/50 transition-colors mb-6">
          <ArrowLeft size={13} />
          Back
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#bef264]/10 border border-[#bef264]/15 flex items-center justify-center">
            <Hotel size={18} className="text-[#bef264]" />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-white tracking-tight">Register Your Property</h2>
            <p className="text-[11px] text-white/25">Step {step} of 2 — {step === 1 ? "Business Details" : "Account Setup"}</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-[#bef264]" : "bg-white/[0.06]"}`} />
          <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-[#bef264]" : "bg-white/[0.06]"}`} />
        </div>

        {registered ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-white">Welcome aboard, {form.name}!</h3>
              <p className="text-[13px] text-white/30 mt-1">Your hotel account has been created. Redirecting to sign in...</p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); next(); }} className="space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[12px] text-red-400">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                  <div>
                    <label className={labelCls}>Property / Hotel Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                      <input type="text" value={form.hotelName} onChange={(e) => update("hotelName", e.target.value)} placeholder="Nile Grand Hotel" className={inputCls} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Tax ID</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                        <input type="text" value={form.taxId} onChange={(e) => update("taxId", e.target.value)} placeholder="123456789" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Commercial Reg. No.</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                        <input type="text" value={form.commercialReg} onChange={(e) => update("commercialReg", e.target.value)} placeholder="105300900196948" className={inputCls} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Governorate</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                        <select value={form.governorate} onChange={(e) => update("governorate", e.target.value)} className={selectCls}>
                          <option value="" className="bg-[#111]">Select governorate</option>
                          {GOVERNORATES.map((g) => <option key={g} value={g} className="bg-[#111]">{g}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>City</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                        <input type="text" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Downtown" className={inputCls} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Street Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                      <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="123 Nile Corniche, Cairo" className={inputCls} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Star Rating</label>
                      <div className="relative">
                        <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                        <select value={form.starRating} onChange={(e) => update("starRating", e.target.value)} className={selectCls}>
                          <option value="" className="bg-[#111]">Select rating</option>
                          {STAR_RATINGS.map((s) => <option key={s.value} value={s.value} className="bg-[#111]">{s.label}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Contact Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                        <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+20 100 000 0000" className={inputCls} />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#bef264] hover:bg-[#6d28d9] text-white text-[13px] font-medium transition-all active:scale-[0.98]">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div>
                    <label className={labelCls}>Manager Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                      <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ahmed Hassan" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Business Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                      <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="manager@hotel.com" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                      <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min 8 characters" className={inputCls} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button type="button" onClick={back} className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.08] text-white/40 text-[13px] font-medium hover:bg-white/[0.03] transition-all">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button type="submit" disabled={loading} className="flex-[2] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#bef264] hover:bg-[#6d28d9] text-white text-[13px] font-medium transition-all active:scale-[0.98] disabled:opacity-50">
                      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Create Hotel Account</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        )}
      </motion.div>
    </div>
  );
}
