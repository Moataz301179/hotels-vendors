"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaymobPaymentFlow } from "@/components/fintech/PaymobIframe";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const amount = parseFloat(searchParams.get("amount") || "0");
  const email = searchParams.get("email") || "";
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const phone = searchParams.get("phone") || "";
  const description = searchParams.get("description") || undefined;
  const referenceType = (searchParams.get("referenceType") || undefined) as
    | "SUBSCRIPTION"
    | "DOCUMENT_FEE"
    | "MARKETPLACE_COMMISSION"
    | undefined;
  const referenceId = searchParams.get("referenceId") || undefined;

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [transactionId, setTransactionId] = useState<string>("");

  const handleSuccess = (txId: string) => {
    setTransactionId(txId);
    setStatus("success");
  };

  const handleError = (error: string) => {
    console.error("Payment error:", error);
    setStatus("error");
  };

  const handleCancel = () => {
    router.back();
  };

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Successful</h1>
        <p className="mt-2 text-gray-600">
          Transaction ID: <span className="font-mono text-sm">{transactionId}</span>
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Amount: <span className="font-medium">EGP {amount.toFixed(2)}</span>
        </p>
        <button
          onClick={() => router.push("/payments")}
          className="mt-8 rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Back to Payments
        </button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
        <p className="mt-2 text-gray-600">Something went wrong. Please try again.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-8 rounded-md bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
        <p className="mt-1 text-gray-500">Complete your payment securely via Paymob</p>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <span className="text-gray-600">Amount</span>
          <span className="text-xl font-bold text-gray-900">EGP {amount.toFixed(2)}</span>
        </div>
        {description && (
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <span className="text-gray-600">Description</span>
            <span className="text-gray-900">{description}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-4">
          <span className="text-gray-600">Payment Method</span>
          <div className="flex items-center gap-2">
            <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">Card</span>
            <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">Wallet</span>
          </div>
        </div>
      </div>

      <PaymobPaymentFlow
        amount={amount}
        email={email}
        firstName={firstName}
        lastName={lastName}
        phone={phone}
        description={description}
        referenceType={referenceType}
        referenceId={referenceId}
        onSuccess={handleSuccess}
        onError={handleError}
        onCancel={handleCancel}
        iframeBaseUrl="https://accept-alpha.paymob.com"
      />

      <p className="mt-6 text-center text-xs text-gray-400">
        Powered by Paymob · Your payment is secured with 256-bit SSL encryption
      </p>
    </div>
  );
}
