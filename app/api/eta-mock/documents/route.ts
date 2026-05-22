import { NextRequest } from "next/server";
import { apiRoute, success, ApiError } from "@/lib/api-utils";
import { getRedisConnection } from "@/lib/queues/connection";

const MOCK_PREFIX = "eta:mock:doc:";

export const GET = apiRoute(async (_request: NextRequest) => {
  if (process.env.ETA_MOCK_MODE !== "true") {
    throw new ApiError("Mock mode is not enabled", 403);
  }

  const redis = getRedisConnection();
  const keys = await redis.keys(`${MOCK_PREFIX}*`);

  // Filter out long-id lookups and pending keys
  const docKeys = keys.filter((k) =>
    k.startsWith(`${MOCK_PREFIX}`) && !k.includes(":long:") && !k.includes(":pending:")
  );

  const docs = [];
  for (const key of docKeys) {
    const data = await redis.get(key);
    if (data) {
      const doc = JSON.parse(data);
      docs.push({
        uuid: doc.uuid,
        longId: doc.longId,
        internalId: doc.internalId,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      });
    }
  }

  docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return success(docs);
});
