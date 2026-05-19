/**
 * HashiCorp Vault API Types
 * Enterprise HSM Secret Management
 */

// ============================================================================
// VAULT API RESPONSES
// ============================================================================

export interface VaultSecretMetadata {
  created_time: string;
  custom_metadata?: Record<string, unknown>;
  deletion_time?: string;
  destroyed: boolean;
  version: number;
}

export interface VaultSecretData {
  value: string;
  [key: string]: unknown;
}

export interface VaultSecretResponse {
  data: {
    data: VaultSecretData;
    metadata: VaultSecretMetadata;
  };
}

export interface VaultErrorResponse {
  errors: string[];
}

export interface VaultSealStatus {
  type: string;
  initialized: boolean;
  sealed: boolean;
  t: number;
  n: number;
  progress: number;
}

// ============================================================================
// KMS TYPES (AWS/CloudHSM Compatible)
// ============================================================================

export interface KmsKeyMetadata {
  keyId: string;
  keyArn: string;
  keyUsage: 'ENCRYPT_DECRYPT' | 'SIGN_VERIFY';
  keySpec: string;
  description?: string;
  enabled: boolean;
  creationDate: string;
}

export interface KmsDecryptRequest {
  ciphertextBlob: Uint8Array;
  keyId?: string;
  encryptionAlgorithm?: string;
}

export interface KmsDecryptResponse {
  plaintext: Uint8Array;
  keyId: string;
  encryptionAlgorithm: string;
}

// ============================================================================
// SIGNING KEY TYPES
// ============================================================================

export interface SigningKey {
  keyId: string;
  algorithm: 'RSA_2048' | 'RSA_4096' | 'ECDSA_P256' | 'ECDSA_P384';
  provider: 'VAULT' | 'AWS_KMS' | 'LOCAL_HSM';
}

export interface SigningRequest {
  keyId: string;
  data: string;
  signingAlgorithm: string;
}

export interface SigningResponse {
  signature: string;
  signingAlgorithm: string;
}
