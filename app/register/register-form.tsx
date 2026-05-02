"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Factory,
  Landmark,
  Truck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileCheck,
  Shield,
  Sparkles,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

type RegisterType = "hotel" | "supplier" | "factoring" | "shipping";
type Step = "role" | "details" | "documents" | "verify" | "success";

const ROLE_CONFIG: Record<RegisterType, { label: string; icon: React.ComponentType<{ className?: string; size?: number }>; color: string; desc: string }> = {
  hotel: { label: "Hotel", icon: Building2, color: "text-blue-400", desc: "Streamline procurement across all your properties" },
  supplier: { label: "Supplier", icon: Factory, color: "text-emerald-400", desc: "Reach 500+ hotels with your product catalog" },
  factoring: { label: "Factoring Company", icon: Landmark, color: "text-amber-400", desc: "Provide working capital against hotel invoices" },
  shipping: { label: "Logistics Partner", icon: Truck, color: "text-cyan-400", desc: "Optimize last-mile delivery for hospitality" },
};

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("role");
  const [type, setType] = useState<RegisterType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [commercialReg, setCommercialReg] = useState("");
  const [crFile, setCrFile] = useState<File | null>(null);
  const [taxFile, setTaxFile] = useState<File | null>(null);

  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const t = searchParams.get("type") as RegisterType | null;
    if (t && ROLE_CONFIG[t]) {
      setType(t);
      setStep("details");
    }
  }, [searchParams]);

  const verifyData = useCallback(async () => {
    setVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, taxId, commercialReg }),
      });
      const data = await res.json();
      if (data.data?.emailExists) {
        setError("This email is already registered. Try logging in instead.");
      } else if (data.data?.taxIdExists) {
        setError("This Tax ID is already linked to an existing account.");
      } else {
        setStep("documents");
      }
    } catch {
      setError("Verification service temporarily unavailable. Please try again.");
    } finally {
      setVerifying(false);
    }
  }, [email, taxId, commercialReg]);

  const uploadFile = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Upload failed");
    return data.data.url;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      let crUrl = "";
      let taxUrl = "";
      if (crFile) crUrl = await uploadFile(crFile);
      if (taxFile) taxUrl = await uploadFile(taxFile);

      const body = {
        type,
        name,
        email,
        password,
        phone,
        city,
        governorate,
        address,
        taxId,
        commercialReg,
        crDocumentUrl: crUrl,
        taxDocumentUrl: taxUrl,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      setStep("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const renderRoleStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white text-center">Register your business</h2>
      <p className="text-sm text-white/50 text-center mb-6">Select how you want to join the Hotels Vendors network</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(Object.entries(ROLE_CONFIG) as [RegisterType, typeof ROLE_CONFIG["hotel"]][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button
              key={key}
              onClick={() => { setType(key); setStep("details"); }}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-500/30 hover:bg-white/[0.07] transition-colors text-left"
            >
              <div className={`w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0 ${cfg.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{cfg.label}</div>
                <div className="text-xs text-white/50 mt-0.5">{cfg.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-center text-sm text-white/50 mt-4">
        Already have an account? <Link href="/login" className="text-[#b91c1c] hover:text-[#991b1b] font-medium">Sign in</Link>
      </p>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setStep("role")} className="text-xs text-white/50 hover:text-white">← Back</button>
      </div>
      <h2 className="text-xl font-semibold text-white">
        {type && ROLE_CONFIG[type].label} Registration
      </h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-white/70 mb-1">{type === "hotel" ? "Hotel Name" : type === "supplier" ? "Company Name" : "Organization Name"}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#b91c1c]" placeholder="e.g. Sunrise Resorts" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#b91c1c]" placeholder="you@company.com" />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 pr-9 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#b91c1c]" placeholder="Min 6 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-1">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#b91c1c]" placeholder="+20 10 1234 5678" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">City</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#b91c1c]" placeholder="e.g. Sharm El-Sheikh" />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Governorate</label>
            <input value={governorate} onChange={(e) => setGovernorate(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#b91c1c]" placeholder="e.g. South Sinai" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-1">Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#b91c1c]" placeholder="Full street address" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">Tax ID (ETA)</label>
            <input value={taxId} onChange={(e) => setTaxId(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#b91c1c]" placeholder="9-digit Tax Reg No" />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Commercial Reg</label>
            <input value={commercialReg} onChange={(e) => setCommercialReg(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#b91c1c]" placeholder="Commercial Register No" />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <button
        onClick={verifyData}
        disabled={verifying || !name || !email || !password || !city || !governorate || !taxId}
        className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-lg px-4 py-2.5 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {verifying ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : <><Sparkles className="w-4 h-4" /> Verify & Continue</>}
      </button>
    </div>
  );

  const renderDocumentsStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setStep("details")} className="text-xs text-white/50 hover:text-white">← Back</button>
      </div>
      <h2 className="text-xl font-semibold text-white">Upload Documents</h2>
      <p className="text-sm text-white/50">Upload your Commercial Registration and Tax ID for ETA verification.</p>

      <div className="space-y-4">
        <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.03] p-5 text-center hover:border-brand-500/30 transition-colors">
          <input type="file" id="cr-file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setCrFile(e.target.files?.[0] || null)} />
          <label htmlFor="cr-file" className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="w-6 h-6 text-brand-400" />
            <span className="text-sm text-white font-medium">Commercial Registration</span>
            <span className="text-xs text-white/40">{crFile ? crFile.name : "PDF, JPG or PNG up to 5MB"}</span>
          </label>
        </div>

        <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.03] p-5 text-center hover:border-brand-500/30 transition-colors">
          <input type="file" id="tax-file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setTaxFile(e.target.files?.[0] || null)} />
          <label htmlFor="tax-file" className="cursor-pointer flex flex-col items-center gap-2">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            <span className="text-sm text-white font-medium">Tax ID Card / ETA Certificate</span>
            <span className="text-xs text-white/40">{taxFile ? taxFile.name : "PDF, JPG or PNG up to 5MB"}</span>
          </label>
        </div>
      </div>

      <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-start gap-2">
        <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-400">
          <span className="font-medium">Secure upload:</span> Your documents are encrypted and only used for ETA account linking and supplier verification.
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-lg px-4 py-2.5 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating your account...</> : <><CheckCircle2 className="w-4 h-4" /> Complete Registration</>}
      </button>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-5 py-4">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Registration Successful!</h2>
        <p className="text-sm text-white/50">
          Your {type && ROLE_CONFIG[type].label} account has been created and submitted for verification.
        </p>
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3 text-left">
        <div className="flex items-center gap-2 text-emerald-400">
          <FileCheck className="w-4 h-4" />
          <span className="text-sm font-medium">ETA Account Linked</span>
        </div>
        <p className="text-xs text-white/60">
          Your Tax ID <span className="text-white font-mono">{taxId}</span> has been registered with ETA. Electronic invoicing is now active on your account.
        </p>
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Ready for e-invoicing and tax submission
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => router.push("/login")}
          className="px-5 py-2.5 text-sm font-medium rounded-lg bg-[#b91c1c] text-white hover:bg-[#991b1b] transition-colors flex items-center gap-2"
        >
          Go to Login <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0e12] px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-700/20 flex items-center justify-center">
            <img src="/logo-transparent.png" alt="Hotels Vendors" className="w-12 h-12 object-contain" />
          </div>
        </div>
        <div className="bg-[#13161c]/80 backdrop-blur border border-white/10 rounded-xl p-8">
          {step === "role" && renderRoleStep()}
          {step === "details" && renderDetailsStep()}
          {step === "documents" && renderDocumentsStep()}
          {step === "success" && renderSuccessStep()}
        </div>
      </div>
    </div>
  );
}
