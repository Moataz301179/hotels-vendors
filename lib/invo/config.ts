/**
 * INVO — Configuration constants.
 */

export const INVO_CONFIG = {
  /** Base URL for INVO API calls */
  BASE_URL: process.env.INVO_API_URL || "http://localhost:3000/api/v1/invo",

  /** Service key for authentication */
  SERVICE_KEY: process.env.INVO_SERVICE_KEY || "dev-key-insecure",

  /** Request timeout in milliseconds */
  TIMEOUT_MS: parseInt(process.env.INVO_TIMEOUT_MS || "10000"),

  /** Number of retries on failure */
  RETRIES: parseInt(process.env.INVO_RETRIES || "3"),

  /** Current environment */
  ENV: process.env.NODE_ENV || "development",

  /** API version */
  VERSION: "1.0.0",
} as const;
