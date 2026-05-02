#!/usr/bin/env tsx
/**
 * Remote Database Setup Script
 * Usage: DATABASE_URL=<neon-url> npx tsx scripts/setup-remote-db.ts
 */

import { execSync } from "child_process";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  console.error("\nTo get a free Neon PostgreSQL database:");
  console.error("  1. Go to https://neon.tech and sign in with GitHub");
  console.error("  2. Create a new project (takes 10 seconds)");
  console.error("  3. Copy the connection string from the dashboard");
  console.error("  4. Run: DATABASE_URL=<your-url> npx tsx scripts/setup-remote-db.ts\n");
  process.exit(1);
}

if (DATABASE_URL.includes("localhost") || DATABASE_URL.includes("127.0.0.1")) {
  console.error("❌ DATABASE_URL points to localhost. Please provide a remote database URL.");
  process.exit(1);
}

async function main() {
  console.log("🚀 Setting up remote database...\n");

  // 1. Push schema
  console.log("📐 Step 1/4: Pushing Prisma schema...");
  execSync("npx prisma db push --accept-data-loss", {
    env: { ...process.env, DATABASE_URL },
    stdio: "inherit",
  });

  // 2. Seed data
  console.log("\n🌱 Step 2/4: Seeding database...");
  execSync("npx tsx prisma/seed.ts", {
    env: { ...process.env, DATABASE_URL },
    stdio: "inherit",
  });

  // 3. Update Vercel env
  console.log("\n🔧 Step 3/4: Updating Vercel environment variables...");
  try {
    execSync(`vercel env add DATABASE_URL production <<< "${DATABASE_URL}"`, {
      stdio: "pipe",
    });
    console.log("✅ Vercel DATABASE_URL updated");
  } catch {
    console.log("⚠️  Could not auto-update Vercel env. Please run:");
    console.log(`   vercel env add DATABASE_URL production`);
    console.log(`   # Then paste: ${DATABASE_URL.split("@")[1]}\n`);
  }

  // 4. Trigger redeploy
  console.log("\n🚀 Step 4/4: Triggering Vercel redeploy...");
  try {
    execSync("vercel --prod --yes", { stdio: "inherit" });
    console.log("\n✅ Deployment complete!");
  } catch {
    console.log("\n⚠️  Auto-deploy failed. Please run manually:");
    console.log("   vercel --prod\n");
  }

  console.log("🎉 Your app should be live at https://hotels-vendors.vercel.app");
}

main().catch((err) => {
  console.error("❌ Setup failed:", err.message);
  process.exit(1);
});
