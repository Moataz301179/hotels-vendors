"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterEntityForm } from "@/components/auth/register-entity-form";

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    companyName: string;
    taxId: string;
    phone: string;
    sector: string;
    adminName: string;
    email: string;
    password: string;
  }) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/v1/auth/staged-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          name: data.adminName,
          companyName: data.companyName,
          taxId: data.taxId,
          phone: data.phone,
          platformRole: data.sector,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        setSubmitError(json.error || "Registration failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <RegisterEntityForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitError={submitError}
    />
  );
}
