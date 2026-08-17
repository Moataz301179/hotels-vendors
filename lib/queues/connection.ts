/**
 * Shared Redis connection for BullMQ queues.
 * Do not assume a local Redis instance exists during build or static generation.
 */

export function getRedisConnection() {
  const url = process.env.REDIS_URL?.trim() || undefined;
  return { url };
}
