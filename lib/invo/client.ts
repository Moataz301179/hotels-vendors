/**
 * INVO Bridge Client
 * Production-ready HTTP client for HV → INVO API calls.
 * All HV-to-INVO communication goes through this client.
 */

import { INVO_CONFIG } from "./config";
import type {
  CatalogItem,
  CatalogFilters,
  CatalogListResponse,
  DeliveryQuoteRequest,
  DeliveryQuote,
  RouteAssignment,
  SettlementRequest,
  Settlement,
  PartnerOnboardRequest,
  Partner,
  ApiResponse,
} from "./types";

/* ── Helpers ── */

function log(method: string, path: string, body?: unknown, response?: unknown) {
  if (INVO_CONFIG.ENV === "development") {
  console.log(`[INVO] ${method} ${path}`, body ? { body } : "", response ? { response } : "");
  }
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function invoFetch<T>(
  path: string,
  options: RequestInit = {},
  attempt = 1
): Promise<ApiResponse<T>> {
  const url = `${INVO_CONFIG.BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${INVO_CONFIG.SERVICE_KEY}`,
    ...(options.headers as Record<string, string>),
  };

  try {
    log(options.method || "GET", path, options.body);
    const res = await fetchWithTimeout(url, { ...options, headers }, INVO_CONFIG.TIMEOUT_MS);
    const json = await res.json().catch(() => ({ success: false, error: "Invalid JSON" }));
    log(options.method || "GET", path, undefined, json);

    if (!res.ok) {
      throw new Error(json.error || `HTTP ${res.status}`);
    }

    return json as ApiResponse<T>;
  } catch (error: any) {
    if (attempt < INVO_CONFIG.RETRIES) {
      await sleep(attempt * 500); // exponential backoff
      return invoFetch<T>(path, options, attempt + 1);
    }
    return { success: false, error: error.message };
  }
}

/* ── Client Methods ── */

export async function getHealth(): Promise<ApiResponse<{ status: string; uptime_seconds: number }>> {
  return invoFetch("/health", { method: "GET" });
}

export async function getCatalog(
  filters: CatalogFilters = {}
): Promise<ApiResponse<CatalogListResponse>> {
  const params = new URLSearchParams();
  if (filters.supplierId) params.set("supplierId", filters.supplierId);
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const query = params.toString();
  return invoFetch(`/catalog${query ? `?${query}` : ""}`, { method: "GET" });
}

export async function syncCatalogItem(
  item: Partial<CatalogItem> & { sku: string; name: string; supplierId: string }
): Promise<ApiResponse<CatalogItem>> {
  return invoFetch("/catalog", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export async function getDeliveryQuote(
  params: DeliveryQuoteRequest
): Promise<ApiResponse<DeliveryQuote>> {
  return invoFetch("/delivery/quote", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function assignRoute(params: {
  orderIds: string[];
  vehicleType?: string;
  consolidate?: boolean;
}): Promise<ApiResponse<RouteAssignment>> {
  return invoFetch("/delivery/route", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function executeSettlement(
  params: SettlementRequest
): Promise<ApiResponse<Settlement>> {
  return invoFetch("/settlement", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function onboardPartner(
  params: PartnerOnboardRequest
): Promise<ApiResponse<{ partnerId: string; status: string; submittedAt: string; reviewUrl: string }>> {
  return invoFetch("/partners/onboard", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function getPartnerStatus(partnerId: string): Promise<ApiResponse<Partner>> {
  return invoFetch(`/partners/status/${partnerId}`, { method: "GET" });
}

export async function getDocs(): Promise<ApiResponse<Record<string, any>>> {
  return invoFetch("/docs", { method: "GET" });
}
