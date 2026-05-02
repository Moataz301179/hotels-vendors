import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  base: {
    service: "hotels-vendors",
    version: process.env.npm_package_version || "0.1.0",
  },
});

export function createRequestLogger(requestId: string, tenantId?: string, userId?: string) {
  return logger.child({ requestId, tenantId, userId });
}
