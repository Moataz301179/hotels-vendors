"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Upload, Building2, Package, Banknote, Loader2 } from "lucide-react";

export default function SupplierOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    legalName: "",
    taxId: "",
    email: "",
    phone: "",
    city: "",
    governorate: "",
    address: "",
    bankName: "",
    bankAccount: "",
    description: "",
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  async function submit() {
    setLoading(true);
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        platformRole: "SUPPLIER",
        password: Math.random().toString(36).slice(2) + "A1!",
      }),
    });
    setLoading(false);
    if (res.ok) {
      setStep(4);
    }
  }

  const steps = [
    { num: 1, label: "Business", icon: Building2 },
    { num: 2, label: "Catalog", icon: Package },
    { num: 3, label: "Banking", icon: Banknote },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold gradient-text-animated">Supplier Onboarding</h1>
          <p className="text-sm text-foreground-muted mt-1">Join Egypt's hospitality procurement network</p>
        </div>

        {step < 4 && (
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s.num ? "bg-brand-700 text-white" : "bg-surface-raised text-foreground-faint"
                }`}>
                  {step > s.num ? <Check size={18} /> : <s.icon size={18} />}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${step > s.num ? "bg-brand-700" : "bg-border-subtle"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Business Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-foreground-faint mb-1 block">Company Name</label>
                <input value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full h-10 px-3 rounded-lg bg-surface-raised border border-border-subtle text-sm" placeholder="Al-Doha Food Industries" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-foreground-faint mb-1 block">Legal Name</label>
                <input value={form.legalName} onChange={(e) => update("legalName", e.target.value)} className="w-full h-10 px-3 rounded-lg bg-surface-raised border border-border-subtle text-sm" placeholder="Al-Doha Food Industries S.A.E." />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground-faint mb-1 block">Tax ID</label>
                <input value={form.taxId} onChange={(e) => update("taxId", e.target.value)} className="w-full h-10 px-3 rounded-lg bg-surface-raised border border-border-subtle text-sm" placeholder="500-111-222" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground-faint mb-1 block">Email</label>
                <input value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full h-10 px-3 rounded-lg bg-surface-raised border border-border-subtle text-sm" placeholder="contact@company.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground-faint mb-1 block">Phone</label>
                <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full h-10 px-3 rounded-lg bg-surface-raised border border-border-subtle text-sm" placeholder="+20 10 xxx xxxx" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground-faint mb-1 block">City</label>
                <input value={form.city} onChange={(e) => update("city", e.target.value)} className="w-full h-10 px-3 rounded-lg bg-surface-raised border border-border-subtle text-sm" placeholder="6th of October" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground-faint mb-1 block">Governorate</label>
                <input value={form.governorate} onChange={(e) => update("governorate", e.target.value)} className="w-full h-10 px-3 rounded-lg bg-surface-raised border border-border-subtle text-sm" placeholder="Giza" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-foreground-faint mb-1 block">Address</label>
                <input value={form.address} onChange={(e) => update("address", e.target.value)} className="w-full h-10 px-3 rounded-lg bg-surface-raised border border-border-subtle text-sm" placeholder="Industrial Zone B, 6th of October City" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-foreground-faint mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="w-full h-20 px-3 py-2 rounded-lg bg-surface-raised border border-border-subtle text-sm" placeholder="What do you supply to hotels?" />
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full h-11 rounded-xl bg-brand-700 text-white font-semibold flex items-center justify-center gap-2 hover:bg-brand-600 transition-colors">
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Product Catalog</h2>
            <p className="text-sm text-foreground-muted">Upload your product catalog as a CSV file, or add products manually later.</p>
            <div className="border-2 border-dashed border-border-subtle rounded-xl p-8 text-center hover:border-brand-700 transition-colors cursor-pointer">
              <Upload size={32} className="mx-auto text-foreground-faint mb-2" />
              <p className="text-sm font-medium">Drop CSV file here</p>
              <p className="text-xs text-foreground-faint mt-1">or click to browse</p>
            </div>
            <div className="bg-surface-raised rounded-lg p-3">
              <p className="text-xs font-medium text-foreground-faint mb-1">Expected CSV format:</p>
              <code className="text-[10px] text-foreground-muted block">
                sku,name,category,unitPrice,unitOfMeasure,stockQuantity
              </code>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 h-11 rounded-xl bg-surface-raised text-foreground font-semibold hover:bg-surface-hover transition-colors">
                Back
              </button>
              <button onClick={() => setStep(3)} className="flex-1 h-11 rounded-xl bg-brand-700 text-white font-semibold flex items-center justify-center gap-2 hover:bg-brand-600 transition-colors">
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Banking Details</h2>
            <p className="text-sm text-foreground-muted">For factoring payouts and direct transfers.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground-faint mb-1 block">Bank Name</label>
                <input value={form.bankName} onChange={(e) => update("bankName", e.target.value)} className="w-full h-10 px-3 rounded-lg bg-surface-raised border border-border-subtle text-sm" placeholder="Commercial International Bank (CIB)" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground-faint mb-1 block">Account Number (IBAN)</label>
                <input value={form.bankAccount} onChange={(e) => update("bankAccount", e.target.value)} className="w-full h-10 px-3 rounded-lg bg-surface-raised border border-border-subtle text-sm" placeholder="EG89 0018 0010 0000 0000 0000 001" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 h-11 rounded-xl bg-surface-raised text-foreground font-semibold hover:bg-surface-hover transition-colors">
                Back
              </button>
              <button onClick={submit} disabled={loading} className="flex-1 h-11 rounded-xl bg-brand-700 text-white font-semibold flex items-center justify-center gap-2 hover:bg-brand-600 transition-colors disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {loading ? "Submitting..." : "Complete Registration"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-accent-emerald/20 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-accent-emerald" />
            </div>
            <h2 className="text-xl font-bold mb-2">Registration Complete!</h2>
            <p className="text-sm text-foreground-muted mb-6">
              Your application is under review. You will receive an email within 24 hours with your login credentials.
            </p>
            <button onClick={() => router.push("/login")} className="w-full h-11 rounded-xl bg-brand-700 text-white font-semibold hover:bg-brand-600 transition-colors">
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
