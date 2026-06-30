"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Loader2, MailCheck, ArrowRight } from "lucide-react";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [emailInput, setEmailInput] = useState(emailParam);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    fetch("/api/v1/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.success) {
          setStatus("success");
          setMessage("Your email has been verified successfully.");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed. The link may have expired.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error. Please try again.");
      });
  }, [token]);

  const handleResend = async () => {
    setResending(true);
    setResendMsg("");
    try {
      const res = await fetch("/api/v1/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });
      const data = await res.json();
      setResendMsg(data.data?.message || "Verification email sent if account exists.");
    } catch {
      setResendMsg("Failed to send. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      {/* Mobile-only brand header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:hidden flex items-center gap-3 mb-8 justify-center"
      >
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">HotelsVendors</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">
            B2B Procurement Egypt
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)]"
      >
        <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-white">Email Verification</h2>
          <p className="text-sm text-white/40 mt-1">
            Confirming your email address.
          </p>
        </div>

        <div className="p-8">
          <div className="text-center space-y-5">
            {status === "loading" && (
              <>
                <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto animate-pulse">
                  <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                </div>
                <p className="text-white/60">{message}</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Email Verified</h3>
                  <p className="text-white/40 text-sm mt-1">{message}</p>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-base)] hover:opacity-90 text-[var(--accent-text)] text-sm font-medium transition-all"
                >
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Verification Failed</h3>
                  <p className="text-white/40 text-sm mt-1">{message}</p>
                </div>
                <div className="space-y-3">
                  {!emailInput && (
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-colors"
                      style={{
                        backgroundColor: "var(--bg-surface-2)",
                        border: "1px solid var(--border-visible)",
                        color: "var(--text-primary)",
                      }}
                    />
                  )}
                  <button
                    onClick={handleResend}
                    disabled={resending || !emailInput}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.04] transition-colors disabled:opacity-50"
                  >
                    <MailCheck className="w-4 h-4" />
                    {resending ? "Sending..." : "Resend Verification Email"}
                  </button>
                  {resendMsg && (
                    <p className="text-xs text-emerald-400">{resendMsg}</p>
                  )}
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
                >
                  Back to Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="animate-pulse">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/[0.04] mx-auto mb-4" />
          <div className="h-5 bg-white/[0.04] rounded w-1/2 mx-auto" />
        </div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
