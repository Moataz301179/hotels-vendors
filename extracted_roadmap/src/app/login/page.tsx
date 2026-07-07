"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogoFull } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteNav } from "@/components/marketing/site-nav";
import { Btn } from "@/components/ui";
import { ArrowRight, Loader2, Building2, Boxes, Landmark, Truck, Fingerprint } from "lucide-react";

const demos = [
  { email: "hotel@hotelsvendors.demo", label: "Hotel", icon: Building2 },
  { email: "supplier@hotelsvendors.demo", label: "Supplier", icon: Boxes },
  { email: "funder@hotelsvendors.demo", label: "Funder", icon: Landmark },
  { email: "carrier@hotelsvendors.demo", label: "Carrier", icon: Truck },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("hotel@hotelsvendors.demo");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [autoLoading, setAutoLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function ensureSeed() {
    try { await fetch("/api/seed", { method: "POST" }); } catch {}
  }

  async function doLogin(loginEmail: string, loginPassword: string) {
    await ensureSeed();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const data = await res.json();
    if (data.ok) {
      router.push("/dashboard");
      router.refresh();
      return true;
    }
    setError(data.error || "Login failed");
    return false;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    await doLogin(email, password);
    setLoading(false);
  }

  async function autoEnter(roleEmail: string) {
    setAutoLoading(roleEmail);
    setError("");
    const ok = await doLogin(roleEmail, "demo1234");
    if (!ok) setAutoLoading(null);
  }

  return (
    <div className="min-h-screen relative">
      <SiteNav />
      <div className="absolute inset-0 -z-10">
        <Image src="/images/hero-hotel.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/80 to-bg" />
      </div>
      <div className="absolute top-5 right-5 z-10"><ThemeToggle /></div>
      <div className="flex min-h-screen items-center justify-center px-5 pt-28 pb-16">
        <div className="w-full max-w-md rounded-3xl border border-border bg-bg-1/95 backdrop-blur p-8 shadow-lift">
          <Link href="/"><LogoFull /></Link>
          <h1 className="mt-8 text-2xl font-semibold">Sandbox access</h1>
          <p className="mt-2 text-sm text-fg-3">
            Two layers, one sandbox. Enter any password, or click a role below to auto-enter that workspace.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {demos.map((d) => (
              <button key={d.email} type="button" onClick={() => { setEmail(d.email); setPassword("demo1234"); }}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${email === d.email ? "border-lime bg-lime-dim text-lime" : "border-border-2 text-fg-3 hover:text-fg"}`}>
                <d.icon className="h-4 w-4" /> {d.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5 h-11 w-full rounded-xl border border-border-2 bg-bg px-3 text-sm outline-none focus:border-lime focus:ring-2 focus:ring-lime/20" />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1.5 h-11 w-full rounded-xl border border-border-2 bg-bg px-3 text-sm outline-none focus:border-lime focus:ring-2 focus:ring-lime/20" />
              <p className="mt-1 text-[11px] text-fg-4">Sandbox: any password works. Demo data is auto-seeded.</p>
            </div>
            {error && <p className="rounded-lg bg-red/10 p-2 text-sm text-red">{error}</p>}
            <button type="submit" disabled={loading} className="h-11 w-full rounded-xl bg-lime text-sm font-semibold text-bg transition hover:bg-lime-light disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="mt-4 rounded-2xl border border-border bg-bg p-4">
            <p className="text-xs text-fg-3 mb-3 flex items-center gap-2"><Fingerprint className="h-3.5 w-3.5 text-lime" /> One-click workspace entry</p>
            <div className="grid grid-cols-2 gap-2">
              {demos.map((d) => (
                <button key={d.email} type="button" onClick={() => autoEnter(d.email)} disabled={autoLoading !== null}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border-2 bg-bg px-2 py-2 text-xs font-medium text-fg transition hover:border-lime hover:text-lime disabled:opacity-50">
                  {autoLoading === d.email ? <Loader2 className="h-3 w-3 animate-spin" /> : <d.icon className="h-3.5 w-3.5" />}
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-fg-3">New to HotelsVendors? <Link href="/register" className="text-lime hover:underline">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}
