"use client";

import { useEffect, useState } from "react";

interface SessionData {
  userId: string;
  platformRole: string;
  tenantId: string;
}

export function useSession() {
  const [data, setData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/v1/auth/session", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setData(json.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { data, isLoading, error: null };
}

export async function useSessionAsync(): Promise<{ userId: string; platformRole: string; tenantId: string } | null> {
  try {
    const res = await fetch("/api/v1/auth/session", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        return json.data;
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }
}