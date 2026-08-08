import { NextRequest, NextResponse } from "next/server";
import { authenticate, requirePermission, audit } from "@/lib/api-utils";

type ServiceStatus = "configured" | "missing";

interface ServiceSummary {
  service: string;
  name: string;
  type: string;
  status: ServiceStatus;
  requiredEnv: string[];
}

/**
 * Service catalog. Status is derived purely from presence of the required env
 * vars in the runtime — NOT from their values. We never expose actual secret
 * values over this endpoint.
 */
const SERVICES: ServiceSummary[] = [
  { service: "eta", name: "ETA E-Invoicing", type: "api_key", requiredEnv: ["ETA_API_KEY"], status: "missing" },
  { service: "paymob", name: "Paymob", type: "api_key", requiredEnv: ["PAYMOB_API_KEY"], status: "missing" },
  { service: "instapay", name: "InstaPay", type: "api_key", requiredEnv: ["INSTAPAY_API_KEY"], status: "missing" },
  { service: "fawry", name: "Fawry", type: "api_key", requiredEnv: ["FAWRY_API_KEY"], status: "missing" },
  { service: "oliv", name: "Oliv Finance", type: "api_key", requiredEnv: ["OLIV_API_KEY", "OLIV_WEBHOOK_SECRET"], status: "missing" },
  { service: "supabase", name: "Supabase", type: "env_var", requiredEnv: ["SUPABASE_SERVICE_ROLE_KEY"], status: "missing" },
  { service: "sentry", name: "Sentry", type: "env_var", requiredEnv: ["SENTRY_DSN"], status: "missing" },
  { service: "groq", name: "Groq AI", type: "api_key", requiredEnv: ["GROQ_API_KEY"], status: "missing" },
  { service: "openrouter", name: "OpenRouter", type: "api_key", requiredEnv: ["OPENROUTER_API_KEY"], status: "missing" },
  { service: "auth", name: "Session / Auth", type: "secret", requiredEnv: ["SESSION_SECRET"], status: "missing" },
  { service: "database", name: "Database (PostgreSQL)", type: "secret", requiredEnv: ["DATABASE_URL"], status: "missing" },
  { service: "cache", name: "Cache (Redis)", type: "secret", requiredEnv: ["REDIS_URL"], status: "missing" },
  { service: "email", name: "Email / SMTP", type: "secret", requiredEnv: ["SMTP_HOST"], status: "missing" },
];

function isConfigured(service: ServiceSummary): boolean {
  return service.requiredEnv.every((key) => Boolean(process.env[key]));
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticate(request);
    await requirePermission(auth, "admin:manage_credentials");

    await audit({
      entityType: "system",
      entityId: "credentials",
      action: "CREDENTIAL_ACCESS",
      tenantId: auth.tenantId,
      actorId: auth.userId,
      actorRole: auth.platformRole,
    });

    // Return only metadata + boolean presence flags. Secret values are never sent.
    const data = SERVICES.map((s) => ({
      service: s.service,
      name: s.name,
      type: s.type,
      status: isConfigured(s) ? ("configured" as const) : ("missing" as const),
      variables: s.requiredEnv.map((key) => ({ key, present: Boolean(process.env[key]) })),
    }));

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch credentials";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
