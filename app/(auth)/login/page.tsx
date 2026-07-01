"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

const REDIRECT_MAP: Record<string, string> = {
  HOTEL: "/marketplace",
  SUPPLIER: "/marketplace",
  FACTORING: "/factoring-service",
  SHIPPING: "/tracking",
  ADMIN: "/admin",
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      const platformRole = json.data?.user?.platformRole;
      const redirect = REDIRECT_MAP[platformRole] || "/marketplace";
      router.push(redirect);
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <LoginForm onSubmit={handleLogin} error={error} isLoading={isLoading} />
  );
}
