#!/usr/bin/env tsx
/**
 * OpenClaw Workspace Sync Script
 *
 * Compares the OpenClaw workspace with the main repository and
 * allows selective merging of design changes.
 *
 * Usage:
 *   npx tsx scripts/sync-openclaw.ts [--dry-run] [--auto] [path-filter]
 *
 * Examples:
 *   npx tsx scripts/sync-openclaw.ts                    # interactive diff
 *   npx tsx scripts/sync-openclaw.ts --dry-run          # preview only
 *   npx tsx scripts/sync-openclaw.ts --auto app/page.tsx # auto-merge specific file
 *   npx tsx scripts/sync-openclaw.ts app/\(dashboard\)   # filter by path
 */

import { execSync } from "child_process";
import { existsSync, statSync, readFileSync, copyFileSync, mkdirSync } from "fs";
import { dirname, relative, join } from "path";

const OPENCLAW_WORKSPACE = process.env.OPENCLAW_WORKSPACE ||
  `${process.env.HOME}/.openclaw/workspace-dev/hotels-vendors`;
const MAIN_REPO = process.cwd();

const EXCLUDE_PATTERNS = [
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "*.db",
  "*.zip",
  "session-*",
  "prisma/dev.db",
  ".vercel",
];

interface DiffEntry {
  type: "modified" | "added_in_oc" | "added_in_main" | "same";
  path: string;
  ocPath: string;
  mainPath: string;
}

function shouldExclude(relPath: string): boolean {
  return EXCLUDE_PATTERNS.some((p) =>
    relPath.includes(p) || relPath.startsWith(p)
  );
}

function findFiles(dir: string, baseDir: string, files: string[] = []): string[] {
  const entries = execSync(`find "${dir}" -type f 2>/dev/null`, {
    encoding: "utf-8",
    maxBuffer: 50 * 1024 * 1024, // 50MB buffer for large workspaces
  })
    .trim()
    .split("\n")
    .filter(Boolean);

  for (const entry of entries) {
    const rel = relative(baseDir, entry);
    if (!shouldExclude(rel)) {
      files.push(rel);
    }
  }
  return files;
}

function computeDiff(filter?: string): DiffEntry[] {
  const ocFiles = findFiles(OPENCLAW_WORKSPACE, OPENCLAW_WORKSPACE);
  const mainFiles = findFiles(MAIN_REPO, MAIN_REPO);
  const allFiles = new Set([...ocFiles, ...mainFiles]);
  const results: DiffEntry[] = [];

  for (const relPath of allFiles) {
    if (filter && !relPath.includes(filter)) continue;

    const ocPath = join(OPENCLAW_WORKSPACE, relPath);
    const mainPath = join(MAIN_REPO, relPath);
    const ocExists = existsSync(ocPath);
    const mainExists = existsSync(mainPath);

    if (!ocExists && mainExists) {
      results.push({ type: "added_in_main", path: relPath, ocPath, mainPath });
    } else if (ocExists && !mainExists) {
      results.push({ type: "added_in_oc", path: relPath, ocPath, mainPath });
    } else if (ocExists && mainExists) {
      try {
        const ocStat = statSync(ocPath);
        const mainStat = statSync(mainPath);
        if (ocStat.mtimeMs !== mainStat.mtimeMs || ocStat.size !== mainStat.size) {
          // Do a content check
          const ocContent = readFileSync(ocPath, "utf-8");
          const mainContent = readFileSync(mainPath, "utf-8");
          if (ocContent !== mainContent) {
            results.push({ type: "modified", path: relPath, ocPath, mainPath });
          } else {
            results.push({ type: "same", path: relPath, ocPath, mainPath });
          }
        } else {
          results.push({ type: "same", path: relPath, ocPath, mainPath });
        }
      } catch {
        results.push({ type: "modified", path: relPath, ocPath, mainPath });
      }
    }
  }

  return results.sort((a, b) => a.path.localeCompare(b.path));
}

function showDiff(entry: DiffEntry): void {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📄 ${entry.path}  (${entry.type})`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  if (entry.type === "added_in_oc") {
    console.log("🆕 New file in OpenClaw workspace:\n");
    try {
      console.log(readFileSync(entry.ocPath, "utf-8").slice(0, 2000));
    } catch {
      console.log("(binary or unreadable)");
    }
  } else if (entry.type === "modified") {
    try {
      const diff = execSync(
        `diff -u "${entry.mainPath}" "${entry.ocPath}" 2>/dev/null || diff "${entry.mainPath}" "${entry.ocPath}" 2>/dev/null || echo "Files differ"`,
        { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
      );
      console.log(diff.slice(0, 3000));
    } catch (e: any) {
      console.log(e.stdout?.slice(0, 3000) || "Could not generate diff");
    }
  }
}

function mergeFile(entry: DiffEntry): void {
  if (entry.type === "same" || entry.type === "added_in_main") return;

  mkdirSync(dirname(entry.mainPath), { recursive: true });
  copyFileSync(entry.ocPath, entry.mainPath);
  console.log(`✅ Merged: ${entry.path}`);
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const auto = args.includes("--auto");
  const filter = args.find((a) => !a.startsWith("--"));

  if (!existsSync(OPENCLAW_WORKSPACE)) {
    console.error(`❌ OpenClaw workspace not found: ${OPENCLAW_WORKSPACE}`);
    process.exit(1);
  }

  console.log(`🔍 Scanning OpenClaw workspace: ${OPENCLAW_WORKSPACE}`);
  console.log(`🔍 Comparing with main repo: ${MAIN_REPO}`);
  if (filter) console.log(`🔎 Filter: ${filter}`);
  if (dryRun) console.log(`📝 Dry run mode — no files will be changed\n`);
  if (auto) console.log(`🤖 Auto-merge mode — merging all changes without prompts\n`);

  const diffs = computeDiff(filter);
  const meaningful = diffs.filter((d) => d.type !== "same" && d.type !== "added_in_main");

  console.log(`\n📊 Summary: ${meaningful.length} meaningful differences found`);
  console.log(`   Modified: ${meaningful.filter((d) => d.type === "modified").length}`);
  console.log(`   New in OC: ${meaningful.filter((d) => d.type === "added_in_oc").length}`);
  console.log(`   New in Main: ${diffs.filter((d) => d.type === "added_in_main").length}`);
  console.log(`   Unchanged: ${diffs.filter((d) => d.type === "same").length}\n`);

  if (meaningful.length === 0) {
    console.log("✨ Workspaces are in sync. Nothing to merge.");
    return;
  }

  if (dryRun) {
    for (const entry of meaningful) {
      showDiff(entry);
    }
    return;
  }

  if (auto) {
    for (const entry of meaningful) {
      mergeFile(entry);
    }
    console.log("\n🎉 Auto-merge complete. Run `npm run build` to verify.");
    return;
  }

  // Interactive mode
  const readline = require("readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  let index = 0;

  function ask() {
    if (index >= meaningful.length) {
      console.log("\n🎉 Sync complete. Run `npm run build` to verify.");
      rl.close();
      return;
    }

    const entry = meaningful[index];
    showDiff(entry);

    rl.question(`\n[${index + 1}/${meaningful.length}] Merge "${entry.path}"? (y/n/s/q) `, (answer: string) => {
      const a = answer.trim().toLowerCase();
      if (a === "y" || a === "yes") {
        mergeFile(entry);
      } else if (a === "s" || a === "skip") {
        console.log(`⏭️  Skipped: ${entry.path}`);
      } else if (a === "q" || a === "quit") {
        console.log("👋 Sync aborted.");
        rl.close();
        return;
      } else {
        console.log(`❌ Skipped: ${entry.path}`);
      }
      index++;
      ask();
    });
  }

  ask();
}

main();
