import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import {
  ENCRYPTED_FIELDS,
  SEARCHABLE_FIELDS,
  decryptField,
  encryptField,
  searchHash,
} from "./crypto/field-encryption";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: parseInt(process.env.DB_POOL_MAX || "10", 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || "30000", 10),
    connectionTimeoutMillis: parseInt(
      process.env.DB_CONNECT_TIMEOUT || "5000",
      10
    ),
  });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  return client;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * SEC-03 (chunk 1C): PII encryption at rest.
 *
 * Transparently encrypts/decrypts sensitive fields (see
 * lib/crypto/field-encryption.ts) via AES-256-GCM with HKDF per-field keys:
 *  - Hotel.taxId, Supplier.taxId, Supplier.bankAccount, Supplier.bankName
 *  - User.phone
 *
 * For Hotel.taxId / Supplier.taxId a deterministic `taxIdSearch` HMAC digest is
 * maintained so exact-match WHERE clauses keep working: any `where.taxId`
 * equality filter on these models is rewritten to `where.taxIdSearch` here.
 */
function installPiiEncryptionMiddleware(client: PrismaClient) {
  // @ts-expect-error prisma middleware params typed loosely
  client.$use(async (params, next) => {
    const fieldMap = ENCRYPTED_FIELDS[params.model];
    if (!fieldMap) return next(params);
    const searchMap = SEARCHABLE_FIELDS[params.model];

    const encryptData = (data: any): void => {
      if (!data || typeof data !== "object") return;
      for (const [field, fieldName] of Object.entries(fieldMap)) {
        if (typeof data[field] === "string") {
          const plaintext = data[field];
          data[field] = encryptField(plaintext, fieldName);
          if (searchMap && searchMap.source === field) {
            // Strip unique placeholder sentinels - they are not real tax IDs.
            data[searchMap.target] = plaintext.startsWith("APIFY-")
              ? null
              : searchHash(plaintext, fieldName);
          }
        }
      }
    };

    if (
      params.action === "create" ||
      params.action === "update" ||
      params.action === "upsert" ||
      params.action === "createMany" ||
      params.action === "updateMany"
    ) {
      encryptData(params.args?.data);
    }

    // Rewrite exact-match taxId filters to the deterministic search digest.
    if (
      params.action.startsWith("find") ||
      params.action === "count" ||
      params.action === "aggregate" ||
      params.action === "update" ||
      params.action === "upsert" ||
      params.action === "delete"
    ) {
      const rewrite = (where: any): void => {
        if (!where || typeof where !== "object") return;
        for (const key of Object.keys(where)) {
          if (
            key === "taxId" &&
            typeof where[key] === "string" &&
            !where[key].startsWith("enc:v1:")
          ) {
            where.taxIdSearch = searchHash(where[key], fieldMap.taxId);
            delete where.taxId;
          } else if (key === "AND" || key === "OR" || key === "NOT") {
            const clauses = Array.isArray(where[key]) ? where[key] : [where[key]];
            clauses.forEach(rewrite);
          }
        }
      };
      rewrite(params.args?.where);
    }

    const result = await next(params);

    const decryptRecord = (record: any): any => {
      if (!record || typeof record !== "object") return record;
      for (const [field, fieldName] of Object.entries(fieldMap)) {
        if (typeof record[field] === "string") {
          record[field] = decryptField(record[field], fieldName);
        }
      }
      return record;
    };

    if (Array.isArray(result)) return result.map(decryptRecord);
    if (result && typeof result === "object" && params.action.startsWith("find")) {
      return decryptRecord(result);
    }
    return result;
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
