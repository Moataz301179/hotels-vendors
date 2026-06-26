/**
 * Server Initialization Hook (Next.js `instrumentation`).
 *
 * Registers background workers once per server instance.
 * The smart-settlement worker polls for delivered-but-unsettled orders and
 * routes them through the configured settlement path (DIRECT / FACTORING / SPLIT).
 */

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const isWorkerEnabled = process.env.SMART_SETTLEMENT_WORKER === "true";
  const isProd = process.env.NODE_ENV === "production";
  if (!isWorkerEnabled && !isProd) return;

  try {
    const { startSmartSettlementWorker } = await import("@/lib/ai/workflows/smart-settlement-worker");
    await startSmartSettlementWorker();
    // eslint-disable-next-line no-console
    console.log("[instrumentation] smart-settlement worker started");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[instrumentation] smart-settlement worker failed to start:", err);
  }
}
