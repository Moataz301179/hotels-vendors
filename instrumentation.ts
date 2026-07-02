export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const isWorkerEnabled = process.env.SMART_SETTLEMENT_WORKER === "true";
  const isProd = process.env.NODE_ENV === "production";
  if (!isWorkerEnabled && !isProd) return;

  try {
    const mod = await import(
      /* webpackIgnore: true */
      "./lib/ai/workflows/smart-settlement-worker"
    );
    await mod.startSmartSettlementWorker();
  } catch {
    // worker startup failures are non-fatal
  }
}
