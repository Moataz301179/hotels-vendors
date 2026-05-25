#!/usr/bin/env tsx
import dotenv from "dotenv";
dotenv.config();
/**
 * Swarm Dev Runner — VPS Architecture Compatible
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
  } catch (err) {
    console.error("❌ Swarm startup failed:", err);
    process.exit(1);
  }
}

main();
