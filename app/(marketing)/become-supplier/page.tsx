"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  CreditCard,
  Landmark,
  Package,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Truck,
  Factory,
  ArrowLeft as ArrowLeftIcon,
  Store,
  ChevronDown,
} from "lucide-react";
import { RoleBenefits } from "@/components/auth/role-benefits";

interface FormData {
  name: string;
  legalName: string;
  taxId: string;
  commercialReg: string;
  description: string;
  address: string;
  city: string;
  governorate: string;
  phone: string;
  email: string;
  website: string;
  bankName: string;
  bankAccount: string;
  categories: string[];
  minOrderValue: string;
  deliveryAreas: string[];
  certifications: string[];
}

const STEPS = [
  { id: 1, label: "Company", icon: Building2 },
  { id: 2, label: "Contact", icon: MapPin },
  { id: 3, label: "Financial", icon: CreditCard },
  { id: 4, label: "Capabilities", icon: Package },
  { id: 5, label: "Review", icon: CheckCircle2 },
];

const GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Qalyubia", "Port Said", "Suez",
  "Sharqia", "Dakahlia", "Beheira", "Kafr El Sheikh", "Gharbia",
  "Monufia", "Damietta", "Ismailia", "Fayoum", "Beni Suef",
  "Minya", "Assiut", "Sohag", "Qena", "Luxor", "Aswan",
  "Red Sea", "New Valley", "Matrouh", "North Sinai", "South Sinai",
  "6th of October", "10th of Ramadan", "Sadat City",
];

const CATEGORIES = [
  "F&B", "Housekeeping", "Engineering", "Amenities",
  "Capital Equipment", "Linens & Textiles", "Chemicals & Cleaning",
  "IT & Electronics", "Security Equipment", "Outdoor & Pool",
];

const CERTIFICATIONS = [
  "ISO 9001", "ISO 22000", "HACCP", "GMP", "Organic Certified",
  "Fair Trade", "Halal Certified", "FDA Registered", "CE Marked",
];

const DELIVERY_AREAS = [
  "Cairo", "Giza", "Alexandria", "Hurghada", "Sharm El-Sheikh",
  "North Coast", "El Gouna", "Marsa Alam", "Ain Sokhna",
  "Fayoum", "Luxor", "Aswan",
];

export default function SupplierOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    name: "", legalName: "", taxId: "", commercialReg: "", description: "",
    address: "", city: "", governorate: "", phone: "", email: "", website: "",
    bankName: "", bankAccount: "", categories: [], minOrderValue: "",
    deliveryAreas: [], certifications: [],
  });

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const toggleArray = (field: "categories" | "deliveryAreas" | "certifications", value: string) => {
    setForm((prev) => {
      const arr = prev[field];
      const exists = arr.includes(value);
      return { ...prev, [field]: exists ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!form.name.trim()) return setError("Company name is required"), false;
        if (!form.taxId.trim()) return setError("Tax ID is required"), false;
        if (form.taxId.length < 9) return setError("Tax ID must be at least 9 digits"), false;
        return true;
      case 2:
        if (!form.city.trim()) return setError("City is required"), false;
        if (!form.governorate) return setError("Governorate is required"), false;
        if (!form.phone.trim()) return setError("Phone number is required"), false;
        if (!form.email.trim()) return setError("Email is required"), false;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Invalid email address"), false;
        return true;
      case 3:
        if (!form.bankName.trim()) return setError("Bank name is required"), false;
        if (!form.bankAccount.trim()) return setError("Bank account is required"), false;
        return true;
      case 4:
        if (form.categories.length === 0) return setError("Select at least one category"), false;
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => { if (validateStep()) { setStep((s) => Math.min(s + 1, 5)); setError(""); } };
  const prevStep = () => { setStep((s) => Math.max(s - 1, 1)); setError(""); };

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/v1/supplier/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, certifications: form.certifications.join(", ") }),
      });
      const json = await res.json();
      if (json.success) { setSubmitted(true); }
      else { setError(json.error || "Submission failed. Please try again."); }
    } catch { setError("Network error. Please check your connection and try again."); }
    finally { setSubmitting(false); }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeftIcon size={16} />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
            <p className="text-gray-500 mt-2">Thank you for applying to join Hotels Vendors. Our team will review your application within 2-3 business days.</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-left space-y-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider">What happens next?</p>
            <div className="flex items-start gap-3"><ShieldCheck size={16} className="text-[#8B0000] mt-0.5 shrink-0" /><p className="text-sm text-gray-600">Document verification by our compliance team</p></div>
            <div className="flex items-start gap-3"><Factory size={16} className="text-[#8B0000] mt-0.5 shrink-0" /><p className="text-sm text-gray-600">Factory/site visit for PREMIER tier applicants</p></div>
            <div className="flex items-start gap-3"><Truck size={16} className="text-[#8B0000] mt-0.5 shrink-0" /><p className="text-sm text-gray-600">Onboarding call to set up your product catalog</p></div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors">Back to Home</Link>
            <button onClick={() => { setSubmitted(false); setStep(1); setForm({ name: "", legalName: "", taxId: "", commercialReg: "", description: "", address: "", city: "", governorate: "", phone: "", email: "", website: "", bankName: "", bankAccount: "", categories: [], minOrderValue: "", deliveryAreas: [], certifications: [] }); }} className="px-5 py-2.5 rounded-xl bg-[#8B0000] hover:bg-[#8B0000]/80 text-white text-sm font-medium transition-colors">Apply Another</button>
          </div>
        </motion.div>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeftIcon size={16} />
          <span className="text-sm">Back to Home</span>
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <Store size={18} className="text-[#8B0000]" />
          <span className="text-sm font-semibold text-gray-900">Hotels Vendors</span>
        </Link>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Become a Supplier</h1>
              <p className="text-sm text-gray-500 mt-1">Join Egypt&apos;s leading hospitality procurement platform</p>
            </div>

            {/* Mobile benefits toggle */}
            <MobileBenefitsToggle />

            {/* Stepper */}
            <div className="flex items-center justify-between mb-8 px-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isCompleted = s.id < step;
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? "bg-[#8B0000] text-white ring-2 ring-[#8B0000]/30" : isCompleted ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-gray-50 text-gray-400 border border-gray-100"}`}>
                  {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                </div>
                <span className={`text-[10px] mt-1.5 font-medium ${isActive ? "text-gray-900" : isCompleted ? "text-emerald-400/60" : "text-gray-400"}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-[2px] mx-2 rounded-full ${isCompleted ? "bg-emerald-500/30" : "bg-gray-50"}`} />}
            </div>
          );
        })}
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="p-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><Building2 size={16} className="text-[#8B0000]" />Company Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Company Name <span className="text-red-400">*</span></label>
                    <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Nile Fresh Foods" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Legal Name</label>
                    <input type="text" value={form.legalName} onChange={(e) => updateField("legalName", e.target.value)} placeholder="Registered legal entity name" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Tax ID <span className="text-red-400">*</span></label>
                    <input type="text" value={form.taxId} onChange={(e) => updateField("taxId", e.target.value.replace(/\D/g, ""))} placeholder="9-digit Egyptian tax ID" maxLength={9} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Commercial Reg. No.</label>
                    <input type="text" value={form.commercialReg} onChange={(e) => updateField("commercialReg", e.target.value)} placeholder="Commercial registration number" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Company Description</label>
                    <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Briefly describe your company, products, and target market..." rows={3} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm resize-none" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={16} className="text-[#8B0000]" />Location & Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Street Address</label>
                    <input type="text" value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="Full street address" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">City <span className="text-red-400">*</span></label>
                    <input type="text" value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="e.g. 6th of October" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Governorate <span className="text-red-400">*</span></label>
                    <select value={form.governorate} onChange={(e) => updateField("governorate", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm appearance-none">
                      <option value="" className="bg-white">Select governorate</option>
                      {GOVERNORATES.map((g) => (<option key={g} value={g} className="bg-white">{g}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Phone <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+20 1XX XXX XXXX" className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Email <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="contact@company.com" className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Website</label>
                    <div className="relative">
                      <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="url" value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://www.company.com" className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><Landmark size={16} className="text-[#8B0000]" />Banking Details</h3>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-4">
                  <p className="text-xs text-amber-400/70 flex items-start gap-2"><AlertCircle size={14} className="mt-0.5 shrink-0" />This information is encrypted and only used for payment processing. We never share your banking details with third parties.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Bank Name <span className="text-red-400">*</span></label>
                    <input type="text" value={form.bankName} onChange={(e) => updateField("bankName", e.target.value)} placeholder="e.g. National Bank of Egypt" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">IBAN / Account Number <span className="text-red-400">*</span></label>
                    <input type="text" value={form.bankAccount} onChange={(e) => updateField("bankAccount", e.target.value)} placeholder="EGXXXXXXXXXXXXXXXXXXXXXXXX" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm" />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><Package size={16} className="text-[#8B0000]" />Product Capabilities</h3>
                <div>
                  <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-2 block">Product Categories <span className="text-red-400">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const selected = form.categories.includes(cat);
                      return (<button key={cat} onClick={() => toggleArray("categories", cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selected ? "bg-[#8B0000]/20 text-[#8B0000] border border-[#8B0000]/30" : "bg-gray-50 text-gray-500 border border-gray-100 hover:border-gray-200"}`}>{cat}</button>);
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-2 block">Delivery Areas</label>
                  <div className="flex flex-wrap gap-2">
                    {DELIVERY_AREAS.map((area) => {
                      const selected = form.deliveryAreas.includes(area);
                      return (<button key={area} onClick={() => toggleArray("deliveryAreas", area)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selected ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-gray-50 text-gray-500 border border-gray-100 hover:border-gray-200"}`}>{area}</button>);
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-2 block">Certifications</label>
                  <div className="flex flex-wrap gap-2">
                    {CERTIFICATIONS.map((cert) => {
                      const selected = form.certifications.includes(cert);
                      return (<button key={cert} onClick={() => toggleArray("certifications", cert)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selected ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-gray-50 text-gray-500 border border-gray-100 hover:border-gray-200"}`}>{cert}</button>);
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">Minimum Order Value (EGP)</label>
                  <input type="number" value={form.minOrderValue} onChange={(e) => updateField("minOrderValue", e.target.value)} placeholder="e.g. 5000" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-[#8B0000]/40 focus:outline-none transition-colors text-sm" />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><FileText size={16} className="text-[#8B0000]" />Review Your Application</h3>
                <div className="space-y-3">
                  <ReviewSection title="Company" icon={Building2}>
                    <ReviewRow label="Name" value={form.name} />
                    <ReviewRow label="Legal Name" value={form.legalName || "—"} />
                    <ReviewRow label="Tax ID" value={form.taxId} />
                    <ReviewRow label="Commercial Reg." value={form.commercialReg || "—"} />
                    <ReviewRow label="Description" value={form.description || "—"} />
                  </ReviewSection>
                  <ReviewSection title="Contact" icon={MapPin}>
                    <ReviewRow label="Address" value={form.address || "—"} />
                    <ReviewRow label="City" value={form.city} />
                    <ReviewRow label="Governorate" value={form.governorate} />
                    <ReviewRow label="Phone" value={form.phone} />
                    <ReviewRow label="Email" value={form.email} />
                    <ReviewRow label="Website" value={form.website || "—"} />
                  </ReviewSection>
                  <ReviewSection title="Banking" icon={Landmark}>
                    <ReviewRow label="Bank" value={form.bankName} />
                    <ReviewRow label="Account" value={form.bankAccount} />
                  </ReviewSection>
                  <ReviewSection title="Capabilities" icon={Package}>
                    <ReviewRow label="Categories" value={form.categories.join(", ") || "—"} />
                    <ReviewRow label="Delivery Areas" value={form.deliveryAreas.join(", ") || "—"} />
                    <ReviewRow label="Certifications" value={form.certifications.join(", ") || "—"} />
                    <ReviewRow label="Min. Order" value={form.minOrderValue ? `${form.minOrderValue} EGP` : "—"} />
                  </ReviewSection>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-gray-200 bg-gray-50 text-[#8B0000] focus:ring-[#8B0000]/20" />
                    <span className="text-xs text-gray-500">I confirm that all information provided is accurate and I agree to the <a href="#" className="text-[#8B0000] hover:underline">Terms of Service</a> and <a href="#" className="text-[#8B0000] hover:underline">Supplier Agreement</a>.</span>
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-xs">
              <AlertCircle size={14} />{error}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <button onClick={prevStep} disabled={step === 1} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm">
            <ArrowLeft size={16} />Back
          </button>
          {step < 5 ? (
            <button onClick={nextStep} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8B0000] hover:bg-[#8B0000]/80 text-white text-sm font-medium transition-colors">
              Continue<ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8B0000] hover:bg-[#8B0000]/80 disabled:opacity-50 text-white text-sm font-medium transition-colors">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Right: Benefits sidebar (desktop) */}
    <div className="hidden lg:block">
      <div className="sticky top-8">
        <RoleBenefits role="SUPPLIER" variant="full" theme="light" />
      </div>
    </div>
  </div>
</div>
</div>
  );
}

function MobileBenefitsToggle() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#8B0000]/5 border border-[#8B0000]/10 text-[#8B0000] text-sm font-semibold"
      >
        <span>Why join as a Supplier?</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              <RoleBenefits role="SUPPLIER" variant="compact" theme="light" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2"><Icon size={13} className="text-[#8B0000]" />{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-600 text-right max-w-[60%]">{value}</span>
    </div>
  );
}
