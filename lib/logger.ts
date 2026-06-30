type LogLevel = "info" | "warn" | "error" | "debug";

interface LogFn {
  (msg: string, ...args: unknown[]): void;
  (obj: Record<string, unknown>, msg?: string): void;
}

interface Logger {
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  debug: LogFn;
  child: (bindings: Record<string, unknown>) => Logger;
}

const BASE = {
  service: "hotels-vendors",
  version: process.env.npm_package_version || "0.1.0",
} as const;

function createLogFn(level: LogLevel, base: Record<string, unknown>): LogFn {
  return (a: unknown, b?: unknown) => {
    if (typeof a === "string") {
      console[level](JSON.stringify({ ...base, level, msg: a, ...(b ? { extra: b } : {}) }));
    } else if (a && typeof a === "object") {
      const obj = a as Record<string, unknown>;
      console[level](JSON.stringify({ ...base, level, ...obj, ...(b ? { msg: b } : {}) }));
    }
  };
}

function createLogger(bindings: Record<string, unknown> = {}): Logger {
  const base = { ...BASE, ...bindings };
  return {
    info: createLogFn("info", base),
    warn: createLogFn("warn", base),
    error: createLogFn("error", base),
    debug: createLogFn("debug", base),
    child: (extra: Record<string, unknown>) => createLogger({ ...base, ...extra }),
  };
}

export const logger: Logger = createLogger();

export function createRequestLogger(requestId: string, tenantId?: string, userId?: string) {
  return logger.child({ requestId, tenantId, userId });
}
