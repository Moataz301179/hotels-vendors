"use client";

import { useState, useEffect, useCallback } from "react";

interface PaymobIframeProps {
  paymentKey: string;
  iframeId: string;
  baseUrl?: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  className?: string;
}

export function PaymobIframe({
  paymentKey,
  iframeId,
  baseUrl = "https://accept.paymob.com",
  onSuccess,
  onError,
  onCancel,
  className = "",
}: PaymobIframeProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const iframeUrl = `${baseUrl}/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // Only accept messages from Paymob's domain
      if (!event.origin.includes("paymob.com")) return;

      const data = event.data;

      if (data.type === "payment:success") {
        onSuccess?.(data.transactionId);
      } else if (data.type === "payment:error") {
        setError(data.message || "Payment failed");
        onError?.(data.message || "Payment failed");
      } else if (data.type === "payment:cancel") {
        onCancel?.();
      }
    },
    [onSuccess, onError, onCancel]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  if (error) {
    return (
      <div className={`rounded-lg border border-red-200 bg-red-50 p-6 ${className}`}>
        <div className="flex items-center gap-3">
          <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="font-medium text-red-800">Payment Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
        <button
          onClick={() => setError(null)}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            <p className="text-sm text-gray-500">Loading secure payment form…</p>
          </div>
        </div>
      )}
      <iframe
        src={iframeUrl}
        title="Paymob Secure Payment"
        width="100%"
        height="600"
        frameBorder="0"
        allow="payment"
        sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
        className="min-h-[600px] w-full rounded-lg border-0"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError("Failed to load payment form");
          onError?.("Failed to load payment form");
        }}
      />
    </div>
  );
}

interface PaymobPaymentFlowProps {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  description?: string;
  referenceType?: "SUBSCRIPTION" | "DOCUMENT_FEE" | "MARKETPLACE_COMMISSION";
  referenceId?: string;
  iframeBaseUrl?: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export function PaymobPaymentFlow({
  amount,
  email,
  firstName,
  lastName,
  phone,
  description,
  referenceType,
  referenceId,
  iframeBaseUrl,
  onSuccess,
  onError,
  onCancel,
}: PaymobPaymentFlowProps) {
  const [paymentKey, setPaymentKey] = useState<string | null>(null);
  const [iframeId, setIframeId] = useState<string | null>(null);
  const [creating, setCreating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await fetch("/api/v1/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            email,
            firstName,
            lastName,
            phone,
            description,
            referenceType,
            referenceId,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to create payment");
        }

        const data = await res.json();
        setPaymentKey(data.paymentKey);
        // Extract iframe ID from the paymentUrl
        if (data.paymentUrl) {
          const match = data.paymentUrl.match(/iframes\/(\d+)/);
          if (match) setIframeId(match[1]);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Payment initialization failed";
        setError(message);
        onError?.(message);
      } finally {
        setCreating(false);
      }
    };

    createPaymentIntent();
  }, [amount, email, firstName, lastName, phone, description, referenceType, referenceId, onError]);

  if (creating) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-white p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="text-gray-600">Preparing your secure payment…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-red-800">Payment Setup Failed</h3>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-md bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!paymentKey || !iframeId) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8 text-center">
        <p className="text-yellow-800">Payment form not available. Please contact support.</p>
      </div>
    );
  }

  return (
    <PaymobIframe
      paymentKey={paymentKey}
      iframeId={iframeId}
      baseUrl={iframeBaseUrl}
      onSuccess={onSuccess}
      onError={onError}
      onCancel={onCancel}
    />
  );
}
