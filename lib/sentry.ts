import * as Sentry from "@sentry/node";

let initialized = false;

export function initSentry() {
  if (initialized) return;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    environment: process.env.APP_ENV || process.env.NODE_ENV || "development",
  });
  initialized = true;
}

export function captureException(e: unknown) {
  if (!initialized) return;
  Sentry.captureException(e);
}

export default Sentry;
