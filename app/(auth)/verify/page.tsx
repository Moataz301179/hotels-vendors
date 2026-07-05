"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles, CheckCircle2, XCircle, Loader2 } from "lucide-react"

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")
    const email = searchParams.get("email")

    if (!token) {
      setStatus("error")
      setMessage("Missing verification token")
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}${email ? `&email=${encodeURIComponent(email)}` : ""}`)
        const data = await res.json()

        if (res.ok) {
          setStatus("success")
          setMessage(data.message || "Email verified successfully!")
        } else {
          setStatus("error")
          setMessage(data.error || "Verification failed")
        }
      } catch {
        setStatus("error")
        setMessage("Network error. Please try again.")
      }
    }

    verify()
  }, [searchParams])

  return (
    <div
      className="w-full max-w-md mx-auto text-center"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
        style={{
          backgroundColor:
            status === "loading"
              ? "var(--accent-muted)"
              : status === "success"
                ? "rgba(52, 211, 153, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
        }}
      >
        {status === "loading" ? (
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent-base)" }} />
        ) : status === "success" ? (
          <CheckCircle2 className="w-8 h-8" style={{ color: "var(--success)" }} />
        ) : (
          <XCircle className="w-8 h-8" style={{ color: "var(--error)" }} />
        )}
      </div>

      <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
        {status === "loading"
          ? "Verifying..."
          : status === "success"
            ? "Verified!"
            : "Verification failed"}
      </h1>

      <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
        {message}
      </p>

      {status === "success" && (
        <button
          onClick={() => router.push("/login")}
          className="mt-6 px-6 py-2.5 rounded-lg text-sm font-medium transition-opacity"
          style={{
            backgroundColor: "var(--accent-base)",
            color: "#fff",
          }}
        >
          Sign in to your account
        </button>
      )}

      {status === "error" && (
        <Link
          href="/login"
          className="inline-block mt-6 px-6 py-2.5 rounded-lg text-sm font-medium transition-opacity"
          style={{
            backgroundColor: "var(--accent-base)",
            color: "#fff",
          }}
        >
          Back to login
        </Link>
      )}
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md mx-auto text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "var(--accent-base)" }} />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
