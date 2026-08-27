/**
 * Webhook IP Whitelist
 * Hotels Vendors Security Layer (SEC-04)
 *
 * Validates that incoming webhook callbacks originate from known,
 * trusted IP ranges for each payment/logistics provider.
 *
 * STRICT MODE:
 *  - Enabled when process.env.NODE_ENV === "production" OR WEBHOOK_STRICT_MODE === "true".
 *  - In strict mode, requests from non-whitelisted IPs are rejected (403 by callers).
 *  - Dev-permissive behavior is ONLY allowed when NODE_ENV !== "production"
 *    AND WEBHOOK_STRICT_MODE !== "true".
 *
 * SOURCE OF TRUTH = ENVIRONMENT VARIABLES.
 * The constants below are documented provider CIDR defaults so the app works
 * out of the box, but ops can override any provider without a redeploy via:
 *
 *   WEBHOOK_IP_RANGES_PAYMOB="196.216.2.0/24,196.216.3.0/24,..."
 *   WEBHOOK_IP_RANGES_FAWRY="..."
 *   WEBHOOK_IP_RANGES_="..."
 *   WEBHOOK_IP_RANGES_ETA="..."
 *   WEBHOOK_IP_RANGES_INSTAPAY="..."
 *   WEBHOOK_IP_RANGES_GENERIC="..."   # must be set explicitly in production
 *
 * An empty/missing env var falls back to the documented defaults below.
 * A literal "-" clears the list (deny-all for that provider).
 */

// Documented IP ranges for payment/logistics webhook sources.
// Sources: provider documentation + observed production IPs.
export const WEBHOOK_IP_RANGES: Record<string, string[]> = {
  paymob: [
    // Paymob docs: callback/transaction IPs (update per provider docs)
    "196.216.2.0/24",    // Paymob primary
    "196.216.3.0/24",    // Paymob secondary
    "41.206.188.0/24",   // Paymob Egypt POP
  ],
  fawry: [
    "41.196.128.0/24",   // Fawry primary
    "41.196.129.0/24",   // Fawry secondary
  ],
  : [
    //  hosts on GCP - narrow to their published egress ranges when available
    "34.0.0.0/8",
  ],
  eta: [
    // Egyptian Tax Authority e-invoicing (docs.eta.gov.eg):
    // preprod uses internal ranges; prod publishes dedicated egress IPs.
    "10.0.0.0/8",        // ETA preprod / VPN
  ],
  instapay: [
    "34.0.0.0/8",        // GCP range (InstaPay hosts on GCP)
  ],
  generic: [
    // No blanket allow-all. Generic ERP/PMS senders must be configured via
    // WEBHOOK_IP_RANGES_GENERIC. Empty by default => deny-all in strict mode.
  ],
};

/** Read a provider's ranges from env, falling back to documented defaults. */
function resolveRanges(provider: string): string[] {
  const envKey = `WEBHOOK_IP_RANGES_${provider.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
  const raw = process.env[envKey];
  if (raw === undefined || raw.trim() === "") {
    return WEBHOOK_IP_RANGES[provider] ?? [];
  }
  const trimmed = raw.trim();
  if (trimmed === "-") return []; // explicit deny-all
  return trimmed
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Strict mode: enforced when running in production OR explicitly requested
 * via WEBHOOK_STRICT_MODE=true. Dev-permissive only outside production and
 * when strict mode has not been forced on.
 */
export function isWebhookStrictMode(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.WEBHOOK_STRICT_MODE === "true"
  );
}

/**
 * Convert a CIDR notation range to a numeric IP range.
 * Standard masks (/1 through /32). /0 allow-all is rejected by design.
 */
function cidrToRange(cidr: string): { start: number; end: number } | null {
  const parts = cidr.split("/");
  if (parts.length !== 2) return null;

  const ipParts = parts[0].split(".").map(Number);
  if (ipParts.length !== 4 || ipParts.some((p) => isNaN(p) || p < 0 || p > 255)) return null;

  const mask = parseInt(parts[1], 10);
  if (isNaN(mask) || mask < 1 || mask > 32) return null; // reject /0 allow-all

  const ipNum = ((ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3]) >>> 0;
  const maskNum = (~0 << (32 - mask)) >>> 0;

  return {
    start: (ipNum & maskNum) >>> 0,
    end: (ipNum | ~maskNum) >>> 0,
  };
}

/**
 * Check if an IPv4 address falls within a CIDR range.
 */
function ipInRange(ip: string, cidr: string): boolean {
  const ipParts = ip.split(".").map(Number);
  if (ipParts.length !== 4 || ipParts.some((p) => isNaN(p) || p < 0 || p > 255)) return false;

  const ipNum =
    ((ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3]) >>> 0;
  const range = cidrToRange(cidr);
  if (!range) return false;

  return ipNum >= range.start && ipNum <= range.end;
}

/**
 * Validate a client IP against the whitelist for a given provider.
 */
export function isWebhookIpAllowed(clientIp: string | null, provider: string): boolean {
  if (!clientIp) return false;

  // Handle x-forwarded-for chain: take the first (client) IP
  const ip = clientIp.split(",")[0].trim();

  // Dev-permissive ONLY outside production and without forced strict mode.
  if (!isWebhookStrictMode()) return true;

  const ranges = resolveRanges(provider);
  if (ranges.length === 0) return false;

  return ranges.some((cidr) => ipInRange(ip, cidr));
}

/**
 * Guard helper for route handlers: returns a 403 descriptor when the source
 * IP is not allowed in strict mode, otherwise null. Logs the rejected IP.
 */
export function guardWebhookIp(
  request: Request,
  provider: string,
  logTag: string
): { status: number; body: Record<string, unknown> } | null {
  const clientIp = getClientIp(request);
  if (isWebhookIpAllowed(clientIp, provider)) return null;

  console.error(
    `[${logTag}] Rejected webhook from untrusted IP: ${clientIp ?? "<unknown>"} (strict mode: ${isWebhookStrictMode()}, provider: ${provider})`
  );
  return {
    status: 403,
    body: { received: false, error: "Forbidden: untrusted webhook source" },
  };
}

/**
 * Extract the real client IP from request headers.
 * Handles x-forwarded-for (Vercel/Cloudflare), x-real-ip (nginx), and direct.
 */
export function getClientIp(request: Request): string | null {
  // x-forwarded-for: first entry is the original client
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // x-real-ip: nginx reverse proxy
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // Direct connection (dev/testing)
  // @ts-expect-error -- Request may have `.ip` from some runtimes
  return request.ip || null;
}
