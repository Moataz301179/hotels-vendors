"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, LogOut, Building2, Users, Star, Loader2 } from "lucide-react"

type UserData = {
  user: {
    id: string
    email: string
    name: string
    companyName: string
    platformRole: string
    isVerified: boolean
  }
  tenant: {
    id: string
    name: string
    maxUsers: number
    seatCount: number
    rating?: number | null
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated")
        return res.json()
      })
      .then((d) => setData(d))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false))
  }, [router])

  async function handleLogout() {
    await fetch("/api/auth/me", { method: "POST" })
    router.push("/login")
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-canvas)" }}
      >
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--accent-base)" }} />
      </div>
    )
  }

  if (!data) return null

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg-canvas)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <header
        className="h-16 flex items-center justify-between px-6"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--accent-base)" }}
          >
            <Sparkles className="w-4 h-4" style={{ color: "var(--bg-canvas)" }} />
          </div>
          <span className="font-semibold text-lg">HotelProcure</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            Welcome, {data.user.name}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {data.user.companyName} &middot; {data.user.platformRole}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
          >
            <Building2 className="w-5 h-5 mb-2" style={{ color: "var(--accent-base)" }} />
            <p className="text-2xl font-semibold">{data.tenant.name}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Company</p>
          </div>
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
          >
            <Users className="w-5 h-5 mb-2" style={{ color: "var(--accent-base)" }} />
            <p className="text-2xl font-semibold">{data.tenant.maxUsers}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Max Users</p>
          </div>
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
          >
            <Star className="w-5 h-5 mb-2" style={{ color: "var(--accent-base)" }} />
            <p className="text-2xl font-semibold">
              {data.tenant.rating ? data.tenant.rating.toFixed(1) : "—"}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Rating</p>
          </div>
        </div>
      </main>
    </div>
  )
}
