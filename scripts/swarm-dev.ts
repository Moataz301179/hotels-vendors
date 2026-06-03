#!/usr/bin/env tsx
/**
 * Swarm Dev Runner — VPS Architecture Compatible
 * Run this in a separate terminal to activate the full agent swarm locally.
 *
 * Usage:
 *   npx tsx scripts/swarm-dev.ts
 *   npm run swarm
 *
 * This starts workers for:
 *   - ExecutionQueue (general agent tasks)
 *   - IntelligenceQueue (analytics, research, planning)
 *   - ComplianceQueue (ETA transmissions) — already running on VPS
 */

import { bootstrapSwarmDev } from "@/lib/swarm/dev-bootstrap";

async function main() {
  console.log("\n🐝 ═══════════════════════════════════════════");
  console.log("🐝  HOTELS VENDORS — SWARM DEV RUNNER");
  console.log("🐝 ═══════════════════════════════════════════\n");

  try {
    const result = await bootstrapSwarmDev();
    if (!result.success) {
      console.error("❌ Swarm startup failed:", result.message);
      process.exit(1);
    }

    console.log("🚀 Swarm is ACTIVE. Workers are listening for jobs.\n");
    console.log("   Trigger a mission:");
    console.log("   curl -X POST http://localhost:3000/api/v1/swarm/orchestrate \\");
    console.log("     -H 'Content-Type: application/json' \\");
    console.log("     -H 'Cookie: session=YOUR_SESSION' \\");
    console.log("     -d '{\"task\":\"Build authentication flow with JWT and RBAC\"}'\n");
    console.log("   Or trigger Director cycle:");
    console.log("   curl -X POST http://localhost:3000/api/v1/swarm/director/plan \\");
    console.log("     -H 'Cookie: session=YOUR_SESSION'\n");
  } catch (err) {
    console.error("❌ Swarm startup failed:", err);
    process.exit(1);
  }
}

main();
