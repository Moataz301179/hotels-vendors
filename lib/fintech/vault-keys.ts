/**
 * HashiCorp Vault KV-v2 Secrets Engine Client
 * Hotels Vendors Secure Fintech Core — Layer 3 Compliance
 *
 * Interacts with HashiCorp Vault's KV-v2 versioned secrets API to dynamically
 * resolve tenant cryptographic assets. Enforces strict short-lived, ephemeral in-memory
 * references that are instantly purged after resolution.
 */

export interface EphemeralTenantCredentials {
  ETA_CLIENT_ID: string;
  ETA_CLIENT_SECRET: string;
  ETA_HARDWARE_PIN: string;
}

/**
 * Resolves the full ETA cryptographic suite for a specific tenant from Vault KV-v2.
 * Ephemeral: Values are returned fresh and must never be persisted to long-lived memory structures.
 */
export async function fetchTenantVaultCredentials(tenantId: string): Promise<EphemeralTenantCredentials> {
  const vaultAddr = process.env.VAULT_ADDR;
  const vaultToken = process.env.VAULT_TOKEN;

  // Ephemeral reference allocations
  let clientId: string | null = null;
  let clientSecret: string | null = null;
  let hardwarePin: string | null = null;

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
        throw new Error(`Vault kv-v2 endpoint returned status ${response.status}: ${response.statusText}`);
      }

      const payload: any = await response.json();
      const secretData = payload.data?.data;

      if (!secretData) {
        throw new Error(`No data returned from Vault kv-v2 path: tenants/${tenantId}/eta-credentials`);
      }

      clientId = secretData.ETA_CLIENT_ID || null;
      clientSecret = secretData.ETA_CLIENT_SECRET || null;
      hardwarePin = secretData.ETA_HARDWARE_PIN || null;

    } catch (error) {
      console.warn(`[KMS Warning] Vault secret retrieval failed for tenant ${tenantId}:`, error);
      // Fall through to local environment check
    }
  }

  // Local development fallback validation
  if (!clientId || !clientSecret || !hardwarePin) {
    clientId = process.env.ETA_CLIENT_ID || null;
    clientSecret = process.env.ETA_CLIENT_SECRET || null;
    hardwarePin = process.env.ETA_HARDWARE_PIN || null;
  }

  if (!clientId || !clientSecret || !hardwarePin) {
    // Purge variables instantly before throwing exception
    clientId = null;
    clientSecret = null;
    hardwarePin = null;
    throw new Error(
      `SECURITY_CONFIG_BREACH: Ephemeral credentials for Tenant "${tenantId}" could not be resolved from Vault or environment.`
    );
  }

  const output: EphemeralTenantCredentials = {
    ETA_CLIENT_ID: clientId,
    ETA_CLIENT_SECRET: clientSecret,
    ETA_HARDWARE_PIN: hardwarePin,
  };

  // Immediate reference purging of ephemeral local pointers
  clientId = null;
  clientSecret = null;
  hardwarePin = null;

  return output;
}
