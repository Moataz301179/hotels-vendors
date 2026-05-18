/**
 * Enterprise Key Vault & HSM Secrets Resolver
 * Hotels Vendors Secure Fintech Core
 *
 * Integrates with external Key Vaults (HashiCorp Vault or AWS KMS / CloudHSM)
 * to resolve digital token PINs and PKCS#12 passphrases at runtime.
 * Strips raw secrets out of persistent environment variables or local memory.
 */

/**
 * Resolves sensitive signing secrets (like Meeza USB PINs or PFX passphrases)
 * dynamically from an external vault provider at runtime.
 */
export async function resolveSigningSecret(secretKey: string, version?: number): Promise<string> {
  const vaultAddr = process.env.VAULT_ADDR;
  const vaultToken = process.env.VAULT_TOKEN;

  if (vaultAddr && vaultToken) {
    try {
      const versionQuery = version ? `?version=${version}` : "";
      const response = await fetch(`${vaultAddr}/v1/secret/data/${secretKey}${versionQuery}`, {
        method: "GET",
        headers: {
          "X-Vault-Token": vaultToken,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Vault API error: ${response.statusText}`);
      }

      const payload: any = await response.json();
      const secretValue = payload.data?.data?.value;

      if (!secretValue) {
        throw new Error(`Secret key "${secretKey}" was not found inside the Vault payload.`);
      }

      return secretValue;
    } catch (error) {
      throw new Error(
        `Failed to fetch credential from secure Vault: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // Local fallback for developmental configurations only
  const localEnvSecret = process.env[secretKey];
  if (localEnvSecret) {
    return localEnvSecret;
  }

  throw new Error(`Signing secret key "${secretKey}" could not be resolved by the Vault architecture.`);
}
