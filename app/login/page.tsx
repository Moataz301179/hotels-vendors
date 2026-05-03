"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Client auth context removed — auth is server-side only per G2
import { Hotel, Factory, Landmark, Truck, ArrowRight } from "lucide-react";

const DEMO_ACCOUNTS = [
  { email: "owner@nilepalace.com", password: "password123", role: "Hotel Owner", icon: Hotel },
  { email: "gm@nilepalace.com", password: "password123", role: "Hotel GM", icon: Hotel },
  { email: "ops@alexresort.com", password: "password123", role: "Supplier", icon: Factory },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const json = await res.json();
      setLoading(false);
      if (json.success && json.data?.user) {
        // Redirect based on platform role
        const role = json.data.user.platformRole;
        const rolePaths: Record<string, string> = {
          HOTEL: "/hotel",
          SUPPLIER: "/supplier",
          FACTORING: "/factoring",
          SHIPPING: "/shipping",
          ADMIN: "/admin",
        };
        router.push(rolePaths[role] || "/hotel");
        router.refresh();
      } else {
        setError(json.error || "Login failed");
      }
    } catch {
      setLoading(false);
      setError("Network error");
    }
  }

  async function demoLogin(demoEmail: string, demoPassword: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: demoPassword }),
        credentials: "include",
      });
      const json = await res.json();
      setLoading(false);
      if (json.success && json.data?.user) {
        const role = json.data.user.platformRole;
        const rolePaths: Record<string, string> = {
          HOTEL: "/hotel",
          SUPPLIER: "/supplier",
          FACTORING: "/factoring",
          SHIPPING: "/shipping",
          ADMIN: "/admin",
        };
        router.push(rolePaths[role] || "/hotel");
        router.refresh();
      } else {
        setError(json.error || "Demo login failed");
      }
    } catch {
      setLoading(false);
      setError("Network error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0e12] px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-700/20 flex items-center justify-center">
            <img src="/logo-transparent.png" alt="Hotels Vendors" className="w-12 h-12 object-contain" />
          </div>
        </div>

        <div className="bg-[#13161c]/80 backdrop-blur border border-white/10 rounded-xl p-8">
          <h1 className="text-2xl font-semibold text-white mb-1 text-center">Welcome back</h1>
          <p className="text-white/50 text-sm mb-6 text-center">
            Sign in to your Hotels Vendors account
          </p>

          {error && (
            <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#b91c1c]"
                placeholder="you@hotel.com"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#b91c1c]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-lg px-4 py-2.5 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Signing in…" : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-xs text-white/40 text-center mb-3">Quick demo login</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((demo) => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.email}
                    onClick={() => demoLogin(demo.email, demo.password)}
                    disabled={loading}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-brand-500/30 hover:bg-white/[0.07] transition-colors disabled:opacity-50"
                  >
                    <Icon className="w-4 h-4 text-brand-400" />
                    <span className="text-[10px] text-white/70">{demo.role}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-white/50">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#b91c1c] hover:text-[#991b1b] font-medium">
              Register your business
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
