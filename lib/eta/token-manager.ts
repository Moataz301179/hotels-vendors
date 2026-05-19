import type { EtaTokenResponse } from "@/types/eta";

/**
 * ETA OAuth 2.0 Token Manager
 * Hotels Vendors Secure Integration Layer
 *
 * Implements standard OAuth 2.0 Client Credentials flow with the Egyptian Tax Authority (ETA)
 * Identity Server. Fetches tenant credentials dynamically from HashiCorp Vault KV-v2,
 * executes token requests to official endpoints, and implements an in-memory cache
 * scoped by Tenant ID and environment type.
 */

interface CachedToken {
  accessToken: string;
  expiresAt: number; // millisecond timestamp
}

interface EtaCredentials {
  ETA_CLIENT_ID: string;
  ETA_CLIENT_SECRET: string;
  ETA_HARDWARE_PIN: string;
}

// Scoped by: `${tenantId}:${isProduction ? 'prod' : 'sandbox'}`
const tokenCache = new Map<string, CachedToken>();

/**
 * Fetches tenant credentials dynamically from HashiCorp Vault kv-v2 or developmental fallback.
 */
export async function getTenantCredentials(tenantId: string): Promise<EtaCredentials> {
  const vaultAddr = process.env.VAULT_ADDR;
  const vaultToken = process.env.VAULT_TOKEN;

  if (vaultAddr && vaultToken) {
    try {
      const response = await fetch(`${vaultAddr}/v1/secret/data/tenants/${tenantId}/eta-credentials`, {
        method: "GET",
        headers: {
          "X-Vault-Token": vaultToken,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Vault API error: ${response.statusText} (${response.status})`);
      }

      const payload = await response.json() as { data?: { data?: Record<string, string> } };
      const credentials = payload.data?.data;

      if (!credentials?.ETA_CLIENT_ID || !credentials?.ETA_CLIENT_SECRET || !credentials?.ETA_HARDWARE_PIN) {
        throw new Error(
          `Incomplete ETA credentials stored in Vault for tenant ${tenantId}. Required: ETA_CLIENT_ID, ETA_CLIENT_SECRET, ETA_HARDWARE_PIN.`
        );
      }

      return {
        ETA_CLIENT_ID: credentials.ETA_CLIENT_ID,
        ETA_CLIENT_SECRET: credentials.ETA_CLIENT_SECRET,
        ETA_HARDWARE_PIN: credentials.ETA_HARDWARE_PIN,
      };
    } catch (error) {
      console.warn(`[Vault Warning] Failed to fetch secrets from vault for tenant ${tenantId}:`, error);
      // Fall through to local environment check
    }
  }

  // Local development configurations fallback
  const localClientId = process.env.ETA_CLIENT_ID;
  const localClientSecret = process.env.ETA_CLIENT_SECRET;
  const localHardwarePin = process.env.ETA_HARDWARE_PIN;

  if (localClientId && localClientSecret && localHardwarePin) {
    return {
      ETA_CLIENT_ID: localClientId,
      ETA_CLIENT_SECRET: localClientSecret,
      ETA_HARDWARE_PIN: localHardwarePin,
    };
  }

  throw new Error(
    `ETA credentials could not be resolved for Tenant "${tenantId}". Set VAULT_ADDR/VAULT_TOKEN or local environment variables.`
  );
}

/**
 * Retrieves a valid OAuth 2.0 access token for the given tenant and environment.
 * Utilizes in-memory caching to eliminate redundant remote calls.
 */
export async function getEtaAccessToken(tenantId: string, isProduction: boolean = false): Promise<string> {
  const cacheKey = `${tenantId}:${isProduction ? "prod" : "sandbox"}`;
  const now = Date.now();

  // 1. Verify in-memory cache validity (with a 30-second buffer to prevent edge expiry)
  const cached = tokenCache.get(cacheKey);
  if (cached && cached.expiresAt > now + 30000) {
    return cached.accessToken;
  }

  // 2. Fetch secure credentials dynamically
  const credentials = await getTenantCredentials(tenantId);

  // 3. Select target Identity Server endpoint
  const authUrl = isProduction
    ? "https://id.eta.gov.eg/connect/token"
    : "https://id.preprod.eta.gov.eg/connect/token";

  // 4. Request short-lived token via client credentials grant
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", credentials.ETA_CLIENT_ID);
    params.append("client_secret", credentials.ETA_CLIENT_SECRET);

    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ETA Identity Server returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json() as EtaTokenResponse;

    if (!data.access_token) {
      throw new Error("ETA Token response did not contain an access_token field.");
    }

    // 5. Store in cache based on expires_in seconds payload (defaulting to 3600 if missing)
    const expiresInSeconds = Number(data.expires_in) || 3600;
    const expiresAt = now + expiresInSeconds * 1000;

    tokenCache.set(cacheKey, {
      accessToken: data.access_token,
      expiresAt,
    });

    return data.access_token;
  } catch (error) {
    throw new Error(
      `ETA token retrieval failed for Tenant "${tenantId}" on environment [${
        isProduction ? "PRODUCTION" : "SANDBOX"
      }]: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Clears the in-memory token cache. Used for administrative override or testing.
 */
export function clearTokenCache(): void {
  tokenCache.clear();
}
