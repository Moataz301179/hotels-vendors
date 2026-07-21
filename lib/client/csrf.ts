/**
 * Client-side CSRF token helper.
 *
 * Reads the `hv_csrf` cookie set by middleware on page routes and returns
 * it so it can be sent as the `x-csrf-token` header on state-changing
 * requests (POST/PUT/DELETE/PATCH). The middleware's double-submit
 * pattern requires the cookie value and header value to match.
 */

const CSRF_COOKIE = "hv_csrf";
const CSRF_HEADER = "x-csrf-token";

/** Read the CSRF token from the cookie (client-side only). */
export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CSRF_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

/**
 * Build the fetch headers for a state-changing request, automatically
 * including the CSRF token if the method requires it.
 */
export function withCsrfHeaders(
  method: string,
  headers: Record<string, string> = {}
): Record<string, string> {
  const isStateChanging = ["POST", "PUT", "DELETE", "PATCH"].includes(
    method.toUpperCase()
  );
  if (!isStateChanging) return headers;

  const token = getCsrfToken();
  if (!token) return headers;

  return { ...headers, [CSRF_HEADER]: token };
}
