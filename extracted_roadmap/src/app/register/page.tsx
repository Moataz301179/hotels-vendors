"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogoFull } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteNav } from "@/components/marketing/site-nav";
import { Btn } from "@/components/ui";
import { ArrowRight, Loader2, Building2, Boxes, Landmark, Truck } from "lucide-react";

const types = [
  { id: "hotel", label: "Hotel", icon: Building2 },
  { id: "supplier", label: "Supplier", icon: Boxes },
  { id: "funder", label: "Funder", icon: Landmark },
  { id: "carrier", label: "Carrier", icon: Truck },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [type, setType] = useState<(typeof types)[number]["id"]>("hotel");
  const [form, setForm] = useState({ name: "", email: "", company: "", city: "Cairo", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  function upd(k: keyof typeof form, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, type }) });
    const data = await res.json();
    if (data.ok) { router.push("/dashboard"); router.refresh(); }
    else { setError(data.error || "Registration failed"); setLoading(false); }
  }

  const inp = "h-11 w-full rounded-xl border border-border-2 bg-bg px-3 text-sm outline-none focus:border-lime focus:ring-2 focus:ring-lime/20";

  return (
    <div className="min-h-screen relative">
      <SiteNav />
      <div className="absolute inset-0 -z-10">
        <Image src="/images/supplier-warehouse.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/80 to-bg" />
      </div>
      <div className="absolute top-5 right-5 z-10"><ThemeToggle /></div>
      <div className="flex min-h-screen items-center justify-center px-5 pt-28 pb-16">
        <div className="w-full max-w-md rounded-3xl border border-border bg-bg-1/95 backdrop-blur p-8 shadow-lift">
          <Link href="/"><LogoFull /></Link>
          <h1 className="mt-8 text-2xl font-semibold">Create your workspace</h1>
          <p className="mt-2 text-sm text-fg-3">Which layer will you operate in?</p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {types.map((t) => (
              <button key={t.id} type="button" onClick={() => setType(t.id)}
                className={`rounded-xl border p-3 text-left transition ${type === t.id ? "border-lime bg-lime-dim" : "border-border-2 text-fg-3 hover:text-fg"}`}>
                <t.icon className="h-4 w-4 text-lime" />
                <div className="mt-2 text-sm font-medium">{t.label}</div>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Full name" value={form.name} onChange={(e) => upd("name", e.target.value)} required className={inp} />
              <input placeholder="City" value={form.city} onChange={(e) => upd("city", e.target.value)} className={inp} />
            </div>
            <input placeholder="Company name" value={form.company} onChange={(e) => upd("company", e.target.value)} required className={inp} />
            <input type="email" placeholder="Work email" value={form.email} onChange={(e) => upd("email", e.target.value)} required className={inp} />
            <input type="password" placeholder="Password (min 6)" value={form.password} onChange={(e) => upd("password", e.target.value)} required minLength={6} className={inp} />
            {error && <p className="rounded-lg bg-red/10 p-2 text-sm text-red">{error}</p>}
            <button type="submit" disabled={loading} className="h-11 w-full rounded-xl bg-lime text-sm font-semibold text-bg transition hover:bg-lime-light disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create workspace <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
          <p className="mt-6 text-sm text-fg-3">Already have an account? <Link href="/login" className="text-lime hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
