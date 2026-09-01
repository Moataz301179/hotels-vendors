"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Smartphone,
  Building2,
  Package,
  Truck,
  CreditCard,
  Shield,
  Zap,
} from "lucide-react";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";

const FEATURES = [
  { icon: Smartphone, label: "Mobile Procurement", desc: "PO from any department, GRN signature, inventory ledger on the go" },
  { icon: Building2, label: "Multi-Dept POs", desc: "Admin-added users across housekeeping, F&B, engineering submit routed POs" },
  { icon: Package, label: "Smart Inventory", desc: "Qty in/out/ending balance with full ledger — low stock alerts auto-route to purchase" },
  { icon: Truck, label: "Shared Logistics", desc: "Coastal cluster route optimization — Sharm, Hurghada, Marsa Alam consolidation" },
  { icon: CreditCard, label: "Embedded Factoring", desc: "48-hour supplier payouts, non-recourse, credit line instant on onboarding" },
  { icon: Shield, label: "ETA E-Invoicing", desc: "Real-time Egyptian Tax Authority submission, CAdES-BES digital signatures" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const resolvedEmail = email.toLowerCase() === "admin" ? "admin@hotelsvendors.com" : email;
      const res = await fetch("/api/v1/mobile/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resolvedEmail, password }),
      });
      const data = await res.json();

      if (data.success) {
        const role = data.user?.platformRole;
        if (role === "ADMIN") router.push("/admin");
        else if (role === "SUPPLIER") router.push("/supplier");
        else if (role === "FACTORING") router.push("/factoring");
        else if (role === "SHIPPING") router.push("/shipping");
        else router.push("/hotel");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldCls =
    "w-full pl-11 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#FAFAFA] text-[14px] placeholder:text-white/30 focus:border-[#FF3D00]/50 focus:outline-none focus:ring-1 focus:ring-[#FF3D00]/20 transition-all";

  return (
    <>
      <SiteNav />
      <div className="relative min-h-screen bg-[#0A0A0A]">
        {/* Feature carousel background layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              className="absolute inset-0 opacity-0"
              style={{
                background: `radial-gradient(ellipse at ${i % 3 === 0 ? 'left' : i % 3 === 1 ? 'center' : 'right'} ${i < 3 ? 'top' : 'bottom'}, ${i % 2 === 0 ? '#FF3D00' : '#ffffff'}12, transparent 60%)`,
                animation: `featurePulse ${8 + i * 2}s ease-in-out ${i * 0.7}s infinite alternate`,
              }}
            />
          ))}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-auto" />
        </div>

        {/* Mobile app showcase */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: form */}
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF3D00]/30 bg-[#FF3D00]/10 text-[#FF3D00] text-[11px] font-medium uppercase tracking-[0.15em] mb-4">
                  <Lock size={11} />
                  Secure Access
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FAFAFA] tracking-[-0.03em] leading-tight">
                  Sign In to{" "}
                  <span className="text-[#FF3D00]">HotelsVendors</span>
                </h1>
                <p className="mt-3 text-base text-white/60 max-w-md">
                  Procurement portal for Egyptian hotel chains. Multi-department POs, inventory ledger, and ETA-compliant invoicing — one platform.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#0F0F0F]/80 p-6 sm:p-8 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-[#FF3D00]/20 bg-[#FF3D00]/5 text-[#FF3D00] text-[13px]">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">Email or Username</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        placeholder="you@hotel.com or admin"
                        required
                        className={fieldCls}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        placeholder="Min 6 characters"
                        required
                        minLength={6}
                        className={fieldCls}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-white/40 text-sm cursor-pointer hover:text-white/70 transition-colors">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#FF3D00]" />
                      Remember me
                    </label>
                    <Link href="/forgot-password" className="text-sm text-[#FF3D00] hover:opacity-80 transition-opacity font-medium">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#FF3D00] text-[#0A0A0A] text-sm font-semibold hover:bg-[#FF3D00]/90 disabled:opacity-50 transition-all"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <p className="text-center text-sm text-white/40">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-[#FF3D00] hover:underline font-medium">
                  Create one
                </Link>
              </p>
            </div>

            {/* Right: mobile app showcase */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#FF3D00]/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/[0.03] rounded-full blur-2xl" />

                <div className="relative mx-auto w-64 aspect-[9/19] rounded-[2.5rem] bg-[#0A0A0A] border-4 border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-7 bg-black/40 flex items-center justify-between px-6 text-white/60 text-[10px] font-medium z-10">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-2 rounded-sm border-2 border-white/40 border-t-0" />
                      <div className="w-2 h-2 rounded-full bg-white/40" />
                      <div className="flex gap-[2px]">
                        <div className="w-[3px] h-3 rounded-sm bg-white/40" />
                        <div className="w-[3px] h-3 rounded-sm bg-white/70" />
                        <div className="w-[3px] h-3 rounded-sm bg-white/40" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-xl z-20" />

                  <div className="absolute inset-0 top-8 bottom-2 overflow-hidden">
                    <div className="w-full h-full bg-[#0A0A0A]">
                      <div className="flex items-center justify-between px-5 pt-4">
                        <div className="w-6 h-6 rounded-md bg-[#FF3D00] flex items-center justify-center">
                          <span className="text-white text-[8px] font-bold">H</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-1 h-4 rounded-full bg-white/20" />
                          <div className="w-1 h-4 rounded-full bg-white/50" />
                          <div className="w-1 h-4 rounded-full bg-white/20" />
                        </div>
                      </div>
                      <div className="px-5 mt-6">
                        <h2 className="text-white text-xl font-extrabold leading-tight tracking-tight">Procurement<br />Command</h2>
                        <div className="w-16 h-1 bg-[#FF3D00] mt-3 rounded-full" />
                        <p className="text-white/40 text-xs mt-3 leading-relaxed">Real-time overview of your hotel procurement operations</p>
                      </div>
                      <div className="px-5 mt-5 grid grid-cols-3 gap-2">
                        {[
                          { value: "12", label: "ACTIVE" },
                          { value: "4", label: "PENDING" },
                          { value: "EGP 2.4M", label: "CREDIT" },
                        ].map((m) => (
                          <div key={m.label} className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5 text-center">
                            <div className="text-white text-sm font-extrabold">{m.value}</div>
                            <div className="text-[#FF3D00] text-[8px] font-bold tracking-widest mt-0.5">{m.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="px-5 mt-4 h-12 rounded-lg bg-white/[0.02] border border-white/5 flex items-end gap-1 justify-center py-2">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                          <div key={i} className="flex-1 bg-[#FF3D00]/40 rounded-sm" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#0D0D0D] border-t border-white/5 flex items-center justify-around px-4">
                        {["Home", "Orders", "Inventory", "Cash", "More"].map((t, i) => (
                          <div key={t} className="flex flex-col items-center gap-0.5">
                            <div className={`w-[4px] h-[4px] rounded-sm ${i === 0 ? "bg-[#FF3D00]" : "bg-transparent"}`} />
                            <span className="text-white/30 text-[8px]">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 top-10 bg-[#FF3D00] text-[#0A0A0A] text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg">
                  <Zap size={10} /> Live
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards strip */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-3 hover:border-[#FF3D00]/30 hover:bg-[#FF3D00]/5 transition-all group"
              >
                <f.icon size={14} className="text-[#FF3D00] mb-1.5" />
                <div className="text-white text-[11px] font-semibold leading-tight">{f.label}</div>
                <div className="text-white/40 text-[10px] mt-0.5 leading-tight line-clamp-2">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />

      <style>{`
        @keyframes featurePulse {
          0% { opacity: 0.2; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </>
  );
}
