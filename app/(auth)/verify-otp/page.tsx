"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Phone, Loader2, RefreshCw, ShieldCheck } from "lucide-react";

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get("userId") || "";
  const phone = searchParams.get("phone") || "";
  const devCode = searchParams.get("devCode") || "";

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const [expiryCountdown, setExpiryCountdown] = useState(600); // 10 min
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-fill dev code in development
  useEffect(() => {
    if (devCode && devCode.length === 6) {
      setDigits(devCode.split(""));
    }
  }, [devCode]);

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Expiry countdown
  useEffect(() => {
    if (expiryCountdown <= 0) return;
    const timer = setInterval(() => setExpiryCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [expiryCountdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (newDigits.every((d) => d !== "") && value) {
      handleVerify(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      const newDigits = paste.split("");
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
      handleVerify(paste);
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code || digits.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/staged-verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: otpCode }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Invalid code. Please try again.");
        setLoading(false);
        return;
      }

      // Success — redirect to dashboard
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/staged-resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to resend code.");
        setResending(false);
        return;
      }

      // Reset cooldown and expiry
      setCooldown(60);
      setExpiryCountdown(600);
      setDigits(["", "", "", "", "", ""]);

      // Auto-fill dev code if returned
      if (data.data?.devCode) {
        setDigits(data.data.devCode.split(""));
      }

      inputRefs.current[0]?.focus();
      setResending(false);
    } catch {
      setError("Network error. Please try again.");
      setResending(false);
    }
  };

  // Redirect if no userId
  if (!userId) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "var(--bg-canvas)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <div className="text-center">
          <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
            Invalid verification link.
          </p>
          <a
            href="/register"
            className="text-[13px] font-medium mt-2 inline-block"
            style={{ color: "var(--accent-base)" }}
          >
            Go to registration
          </a>
        </div>
      </div>
    );
  }

  const isExpired = expiryCountdown <= 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--bg-canvas)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-sm">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "rgba(34,197,94,0.1)" }}
            >
              <Phone size={28} style={{ color: "#22C55E" }} />
            </div>
            <h1
              className="text-[20px] font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Verify Your Phone
            </h1>
            <p
              className="text-[13px]"
              style={{ color: "var(--text-secondary)" }}
            >
              We sent a 6-digit code to
            </p>
            <p
              className="text-[14px] font-semibold mt-1"
              style={{ color: "var(--text-primary)" }}
            >
              {phone}
            </p>
          </motion.div>

          {/* OTP Input */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="flex justify-center gap-2.5 mb-6"
              onPaste={handlePaste}
            >
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={loading || isExpired}
                  className="w-11 h-14 text-center text-[20px] font-semibold rounded-xl outline-none transition-all"
                  style={{
                    backgroundColor: "var(--bg-surface-2)",
                    border: digit
                      ? "1.5px solid var(--accent-base)"
                      : "1px solid var(--border-visible)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-sans)",
                    caretColor: "var(--accent-base)",
                  }}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center mb-5">
              {isExpired ? (
                <p className="text-[12px] font-medium" style={{ color: "#EF4444" }}>
                  Code expired. Please request a new one.
                </p>
              ) : (
                <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
                  Code expires in{" "}
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {formatTime(expiryCountdown)}
                  </span>
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[12px] font-medium text-center mb-4"
                style={{ color: "#EF4444" }}
              >
                {error}
              </motion.p>
            )}

            {/* Verify Button */}
            <button
              onClick={() => handleVerify()}
              disabled={loading || isExpired || digits.some((d) => !d)}
              className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 mb-3"
              style={{
                backgroundColor:
                  loading || isExpired || digits.some((d) => !d)
                    ? "var(--bg-surface-2)"
                    : "var(--accent-base)",
                color:
                  loading || isExpired || digits.some((d) => !d)
                    ? "var(--text-secondary)"
                    : "#FFFFFF",
                border: "none",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Verify
                </>
              )}
            </button>

            {/* Resend */}
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || resending || isExpired}
              className="w-full py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer flex items-center justify-center gap-2"
              style={{
                backgroundColor: "transparent",
                color:
                  cooldown > 0 || resending
                    ? "var(--text-secondary)"
                    : "var(--accent-base)",
                border: "1px solid var(--border-visible)",
                opacity: cooldown > 0 || resending ? 0.5 : 1,
              }}
            >
              {resending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : cooldown > 0 ? (
                <>
                  <RefreshCw size={14} />
                  Resend in {cooldown}s
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  Resend OTP
                </>
              )}
            </button>
          </motion.div>

          {/* Back to register */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8"
          >
            <a
              href="/register"
              className="text-[12px] font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Wrong number?{" "}
              <span style={{ color: "var(--accent-base)" }}>
                Go back to registration
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            backgroundColor: "var(--bg-canvas)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
          }}
        />
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
