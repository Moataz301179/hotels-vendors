"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, Loader2, MailCheck, ArrowRight } from "lucide-react";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

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
        body: JSON.stringify({ email: "" }),
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
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39ff7e]/[0.08] border border-[#39ff7e]/15 text-[#39ff7e] text-[11px] font-medium uppercase tracking-[0.15em] mb-5">
          Email Verification
        </div>
        <h1 className="text-[28px] font-semibold text-white tracking-[-0.02em]">Confirming your email</h1>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#12121a] p-8">
        <div className="text-center space-y-5">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto animate-pulse">
                <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
              </div>
              <p className="text-white/50 text-[14px]">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-[#39ff7e]/10 border border-[#39ff7e]/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#39ff7e]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[16px]">Email Verified</h3>
                <p className="text-white/40 text-[14px] mt-1">{message}</p>
              </div>
              <Link href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#39ff7e] text-[#07090f] text-[13px] font-semibold hover:bg-[#39ff7e]/90 transition-all hover:shadow-[0_0_20px_rgba(57,255,126,0.15)]">
                Sign In <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[16px]">Verification Failed</h3>
                <p className="text-white/40 text-[14px] mt-1">{message}</p>
              </div>
              <div className="space-y-3">
                <button onClick={handleResend} disabled={resending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.08] text-white text-[13px] font-medium hover:bg-white/[0.04] transition-colors disabled:opacity-50">
                  <MailCheck className="w-4 h-4" />
                  {resending ? "Sending..." : "Resend Verification Email"}
                </button>
                {resendMsg && <p className="text-xs text-[#39ff7e]">{resendMsg}</p>}
              </div>
              <Link href="/login" className="inline-flex items-center gap-2 text-[13px] text-white/35 hover:text-white/60 transition-colors">
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="animate-pulse">
        <div className="rounded-2xl border border-white/[0.06] bg-[#12121a] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/[0.04] mx-auto mb-4" />
          <div className="h-5 bg-white/[0.04] rounded w-1/2 mx-auto" />
        </div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
