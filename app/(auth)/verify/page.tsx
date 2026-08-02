"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

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
        const res = await fetch(`/api/v1/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })
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
    <div className="text-center space-y-6 py-4">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
        status === "loading" ? "bg-accent-base/10 border border-accent-base/20" :
        status === "success" ? "bg-accent-base/10 border border-accent-base/20" :
        "bg-red-500/10 border border-red-500/20"
      }`}>
        {status === "loading" ? (
          <Loader2 className="w-8 h-8 text-accent-base animate-spin" />
        ) : status === "success" ? (
          <CheckCircle2 className="w-8 h-8 text-accent-base" />
        ) : (
          <XCircle className="w-8 h-8 text-red-400" />
        )}
      </div>

      <div>
        <h1 className="text-[24px] font-semibold text-white">
          {status === "loading" ? "Verifying..." : status === "success" ? "Verified!" : "Verification failed"}
        </h1>
        <p className="text-[14px] text-white/40 mt-2">{message}</p>
      </div>

      {status === "success" && (
        <button onClick={() => router.push("/login")}
          className="px-6 py-3 rounded-xl text-[13px] font-semibold bg-accent-base text-surface hover:bg-accent-base/90 transition-all hover:shadow-accent">
          Sign in to your account
        </button>
      )}

      {status === "error" && (
        <Link href="/login"
          className="inline-block px-6 py-3 rounded-xl text-[13px] font-semibold bg-accent-base text-surface hover:bg-accent-base/90 transition-all hover:shadow-accent">
          Back to login
        </Link>
      )}
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="w-full text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-accent-base" /></div>}>
      <VerifyContent />
    </Suspense>
  )
}
