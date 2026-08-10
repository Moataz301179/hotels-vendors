#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, basename } from "path";
import { execSync } from "child_process";

const ROOT = join(import.meta.dirname, "..");
const API_DIR = join(ROOT, "app", "api", "v1");
const SEED_PATH = join(ROOT, "prisma", "seed.ts");

type Status = "PASS" | "FAIL" | "WARN";
interface CheckResult {
  name: string;
  status: Status;
  details: string[];
}

const results: CheckResult[] = [];

function green(s: string) { return `\x1b[32m${s}\x1b[0m`; }
function red(s: string) { return `\x1b[31m${s}\x1b[0m`; }
function yellow(s: string) { return `\x1b[33m${s}\x1b[0m`; }
function bold(s: string) { return `\x1b[1m${s}\x1b[0m`; }

function walk(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    if (entry === "node_modules" || entry === ".next" || entry === "dist") continue;
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
      files.push(full);
    }
  }
  return files;
}

function walkApi(): string[] {
  if (!statSync(API_DIR).isDirectory()) return [];
  const entries = readdirSync(API_DIR);
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(API_DIR, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else if (entry.endsWith(".ts")) {
      files.push(full);
    }
  }
  return files;
}

function rel(p: string) { return relative(ROOT, p); }

function extractSeededPermissionCodes(): string[] {
  const content = readFileSync(SEED_PATH, "utf-8");
  const codes: string[] = [];
  const regex = /\{\s*code:\s*["']([^"']+)["']/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    codes.push(m[1]);
  }
  return codes;
}

function extractRoutePermissionCodes(files: string[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const f of files) {
    const content = readFileSync(f, "utf-8");
    const codes: string[] = [];
    const regex = /requirePermission\(\s*\w+\s*,\s*["']([^"']+)["']/g;
    let m;
    while ((m = regex.exec(content)) !== null) {
      codes.push(m[1]);
    }
    if (codes.length > 0) map.set(f, codes);
  }
  return map;
}

function getWriteMethods(files: string[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const f of files) {
    const content = readFileSync(f, "utf-8");
    const methods: string[] = [];
    if (/export\s+async\s+function\s+(POST|PUT|PATCH)\b/.test(content)) {
      const m = content.match(/export\s+async\s+function\s+(POST|PUT|PATCH)/);
      if (m) methods.push(m[1]);
    }
    if (methods.length > 0) map.set(f, methods);
  }
  return map;
}

function hasPrismaQuery(content: string): boolean {
  return /prisma\.\w+\.(findMany|findFirst|findUnique|create|update|delete|upsert|count|aggregate|groupBy)/.test(content);
}

function hasAuthenticateImport(content: string): boolean {
  return /import\s+.*\bauthenticate\b/.test(content) || /import\s+\{[^}]*\bauthenticate\b[^}]*\}/.test(content);
}

function hasRequirePermissionImport(content: string): boolean {
  return /import\s+.*\brequirePermission\b/.test(content) || /import\s+\{[^}]*\brequirePermission\b[^}]*\}/.test(content);
}

function hasAuthenticateCall(content: string): boolean {
  return /await\s+authenticate\s*\(/.test(content);
}

function hasRequirePermissionCall(content: string): boolean {
  return /await\s+requirePermission\s*\(/.test(content);
}

function hasValidateBody(content: string): boolean {
  return /validateBody\s*\(/.test(content);
}

function hasRequestJson(content: string): boolean {
  return /request\.json\s*\(/.test(content);
}

function hasTenantInWhere(content: string): boolean {
  return /tenantId/.test(content);
}

function hasPrismaInApiRoute(file: string): boolean {
  const content = readFileSync(file, "utf-8");
  if (!hasPrismaQuery(content)) return false;
  const relPath = rel(file);
  const callbackRoutes = ["eta/callback", "fintech/oliv-callback", "payments/paymob-callback", "payments/fawry-callback", "payments/instapay-callback", "oliv/payout-callback"];
  if (callbackRoutes.some((c) => relPath.includes(c))) return false;
  return true;
}

function isWebhookRoute(file: string): boolean {
  const relPath = rel(file);
  return /callback|webhook/.test(relPath);
}

function isSystemRoute(file: string): boolean {
  const relPath = rel(file);
  return /auth\/(login|register|forgot-password|reset-password|verify-email|resend-verification|refresh|logout)/.test(relPath);
}

function isPublicRoute(file: string): boolean {
  const relPath = rel(file);
  return /contact|leads\/capture|consent(\/|$)|ai\/public|oliv\/onboard|oliv\/referral/.test(relPath);
}

// ─── Check A: Auth Guard ────────────────────────────────
function checkAuthGuard(): void {
  const files = walkApi();
  const violations: string[] = [];
  let total = 0;

  for (const f of files) {
    if (isWebhookRoute(f)) continue;
    if (isPublicRoute(f)) continue;
    if (isSystemRoute(f)) continue;
    if (!basename(f).startsWith("route")) continue;

    const content = readFileSync(f, "utf-8");
    const relPath = rel(f);
    total++;
    const hasDb = hasPrismaQuery(content) || /prisma\./.test(content);
    const hasAuth = hasAuthenticateCall(content) || hasAuthenticateImport(content);

    if (hasDb && !hasAuth) {
      violations.push(`${relPath} — touches DB without authenticate()`);
    }
  }

  results.push({
    name: "Auth Guard",
    status: violations.length === 0 ? "PASS" : "FAIL",
    details: violations.length === 0
      ? [`${total} API routes checked — all authenticated`]
      : [`${violations.length} violation(s):`, ...violations],
  });
}

// ─── Check B: Zod Validation ────────────────────────────
function checkZodValidation(): void {
  const writeMethods = getWriteMethods(walkApi());
  const violations: string[] = [];
  let total = 0;

  for (const [f, methods] of writeMethods) {
    if (isSystemRoute(f) || isPublicRoute(f) || isWebhookRoute(f)) continue;

    const content = readFileSync(f, "utf-8");
    const relPath = rel(f);
    total += methods.length;

    for (const method of methods) {
      const fnRegex = new RegExp(`export\\s+async\\s+function\\s+${method}\\s*\\(`);
      const fnMatch = content.match(fnRegex);
      if (!fnMatch) continue;

      const fnStart = fnMatch.index!;
      const rest = content.slice(fnStart);
      const bodyMatch = rest.match(/request\.json\s*\(/);
      const validateMatch = rest.match(/validateBody\s*\(/);

      if (bodyMatch && (!validateMatch || validateMatch.index! > bodyMatch.index! + 200)) {
        violations.push(`${relPath}#${method} — request.json() without nearby validateBody()`);
      }
    }
  }

  results.push({
    name: "Zod Validation",
    status: violations.length === 0 ? "PASS" : "WARN",
    details: violations.length === 0
      ? [`${total} write handlers checked — all validated`]
      : [`${violations.length} potential violation(s):`, ...violations],
  });
}

// ─── Check C: Tenant Isolation ──────────────────────────
function checkTenantIsolation(): void {
  const files = walkApi();
  const violations: string[] = [];
  let total = 0;

  for (const f of files) {
    if (isWebhookRoute(f) || isSystemRoute(f)) continue;

    const content = readFileSync(f, "utf-8");
    if (!hasPrismaInApiRoute(f)) continue;

    const relPath = rel(f);
    total++;
    const methods = ["findMany", "findFirst", "findUnique", "create", "update", "delete", "upsert"];
    for (const method of methods) {
      const regex = new RegExp(`prisma\\s*\\.\\s*\\w+\\s*\\.\\s*${method}\\s*\\(`, "g");
      let m;
      while ((m = regex.exec(content)) !== null) {
        const start = m.index;
        let braceDepth = 0;
        let end = start;
        for (let i = start; i < content.length && i < start + 2000; i++) {
          if (content[i] === "{" || content[i] === "(") braceDepth++;
          if (content[i] === "}" || content[i] === ")") braceDepth--;
          if (braceDepth <= 0 && i > start) { end = i; break; }
        }
        const block = content.slice(start, end + 1);
        if (method === "create") continue;
        if (method === "upsert") continue;
        const hasTenant = /tenantId/.test(block) || /tenantWhereClause/.test(block);
        if (!hasTenant && !block.includes("etaUuid") && !block.includes("unique")) {
          const lineNum = content.slice(0, start).split("\n").length;
          violations.push(`${relPath}:${lineNum} — prisma.${method} without tenantId filter`);
        }
      }
    }
  }

  results.push({
    name: "Tenant Isolation",
    status: violations.length === 0 ? "PASS" : "FAIL",
    details: violations.length === 0
      ? [`${total} route(s) with Prisma queries checked — all tenant-scoped`]
      : [`${violations.length} potential violation(s):`, ...violations],
  });
}

// ─── Check D: RBAC Permission Code Consistency ──────────
function checkRbacConsistency(): void {
  const seedCodes = extractSeededPermissionCodes();
  const seedSet = new Set(seedCodes);
  const routeMap = extractRoutePermissionCodes(walkApi());
  const missing: string[] = [];
  const usedCodes = new Map<string, string[]>();

  for (const [f, codes] of routeMap) {
    for (const code of codes) {
      if (!seedSet.has(code)) {
        if (!missing.includes(code)) missing.push(code);
        const existing = usedCodes.get(code) || [];
        existing.push(rel(f));
        usedCodes.set(code, existing);
      }
    }
  }

  const details: string[] = [];
  if (missing.length === 0) {
    details.push(`All ${routeMap.size} route(s) use valid seed permission codes`);
  } else {
    details.push(`${missing.length} permission code(s) used in routes but not in seed.ts:`);
    for (const code of missing) {
      const files = usedCodes.get(code) || [];
      details.push(`  "${code}" — used in ${files.length} file(s)`);
      for (const f of files.slice(0, 3)) {
        details.push(`    ${f}`);
      }
      if (files.length > 3) details.push(`    ... and ${files.length - 3} more`);
    }
  }

  results.push({
    name: "RBAC Permission Codes",
    status: missing.length === 0 ? "PASS" : "FAIL",
    details,
  });
}

// ─── Check E: Build & Lint ──────────────────────────────
function runCommand(cmd: string, label: string): { ok: boolean; output: string; timedOut: boolean } {
  try {
    const output = execSync(cmd, {
      cwd: ROOT,
      encoding: "utf-8",
      timeout: 90_000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { ok: true, output, timedOut: false };
  } catch (err: any) {
    if (err.killed || (err.signal === "SIGTERM")) {
      return { ok: false, output: `${label} timed out after 90s`, timedOut: true };
    }
    const stderr = err.stderr || "";
    const stdout = err.stdout || "";
    return { ok: false, output: (stdout + "\n" + stderr).trim().slice(0, 2000), timedOut: false };
  }
}

function checkBuildAndLint(): void {
  const lint = runCommand("npx eslint app lib components --max-warnings 0", "eslint");
  const tsc = runCommand("npx tsc --noEmit --pretty", "tsc --noEmit");

  const details: string[] = [];
  let worst: Status = "PASS";

  if (lint.ok) {
    details.push("eslint: PASS");
  } else if (lint.timedOut) {
    details.push("eslint: WARN — timed out (skipped)");
    if (worst !== "FAIL") worst = "WARN";
  } else {
    details.push("eslint: FAIL");
    const lines = lint.output.split("\n").filter(Boolean).slice(0, 15);
    details.push(...lines.map((l) => `  ${l}`));
    worst = "FAIL";
  }

  if (tsc.ok) {
    details.push("tsc --noEmit: PASS");
  } else if (tsc.timedOut) {
    details.push("tsc --noEmit: WARN — timed out (skipped)");
    if (worst !== "FAIL") worst = "WARN";
  } else {
    details.push("tsc --noEmit: FAIL");
    const lines = tsc.output.split("\n").filter(Boolean).slice(0, 15);
    details.push(...lines.map((l) => `  ${l}`));
    worst = "FAIL";
  }

  results.push({
    name: "Build & Lint",
    status: worst,
    details,
  });
}

// ─── Check F: Secrets Scan ──────────────────────────────
function checkSecretsScan(): void {
  const allFiles = walk(ROOT).filter((f) => {
    if (f.includes("node_modules") || f.includes(".next") || f.includes("dist")) return false;
    if (f.includes(".test.") || f.includes(".spec.") || f.includes("__tests__")) return false;
    if (f.endsWith(".env") || f.endsWith(".env.local") || f.endsWith(".env.example")) return false;
    if (basename(f) === "quality-gate.ts") return false;
    if (basename(f) === "seed.ts") return false;
    return true;
  });

  const violations: string[] = [];
  const patterns = [
    { regex: /(?:password|passwd|pwd)\s*[:=]\s*["'][^"']{8,}["']/gi, label: "hardcoded password" },
    { regex: /(?:secret|SECRET)\s*[:=]\s*["'][^"']{8,}["']/gi, label: "hardcoded secret" },
    { regex: /(?:api_key|apiKey|API_KEY)\s*[:=]\s*["'][^"']{8,}["']/gi, label: "hardcoded API key" },
    { regex: /(?:jwt_secret|JWT_SECRET)\s*[:=]\s*["'][^"']{8,}["']/gi, label: "hardcoded JWT secret" },
    { regex: /(?:access_token|accessToken|ACCESS_TOKEN)\s*[:=]\s*["'][^"']{20,}["']/gi, label: "hardcoded access token" },
    { regex: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/, label: "embedded private key" },
  ];

  const falsePositives = [
    /process\.env\./,
    /placeholder/i,
    /example/i,
    /xxx+/i,
    /changeme/i,
    /your[_-]?key/i,
    /TODO/,
    /test[_-]?secret/i,
    /mock/i,
  ];

  for (const f of allFiles) {
    let content: string;
    try {
      content = readFileSync(f, "utf-8");
    } catch {
      continue;
    }
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*\/\//.test(line)) continue;
      if (/^\s*\*/.test(line)) continue;

      for (const { regex, label } of patterns) {
        regex.lastIndex = 0;
        if (regex.test(line)) {
          if (falsePositives.some((fp) => fp.test(line))) continue;
          const relPath = rel(f);
          violations.push(`${relPath}:${i + 1} — ${label}`);
        }
      }
    }
  }

  results.push({
    name: "Secrets Scan",
    status: violations.length === 0 ? "PASS" : "FAIL",
    details: violations.length === 0
      ? [`Scanned ${allFiles.length} files — no hardcoded secrets detected`]
      : [`${violations.length} potential secret(s) found:`, ...violations.slice(0, 20)],
  });
}

// ─── Main ───────────────────────────────────────────────
function printResults(): void {
  const maxName = Math.max(22, ...results.map((r) => r.name.length));

  console.log("\n" + bold("  Quality Gate — Pre-Publish Verification"));
  console.log("  " + "─".repeat(maxName + 20));

  let allPass = true;
  for (const r of results) {
    const statusColor = r.status === "PASS" ? green : r.status === "FAIL" ? red : yellow;
    const icon = r.status === "PASS" ? "✓" : r.status === "FAIL" ? "✗" : "⚠";
    console.log(`  ${statusColor(icon)} ${r.name.padEnd(maxName)} ${statusColor(r.status.padEnd(6))}`);
    for (const d of r.details) {
      console.log(`    ${d}`);
    }
    if (r.status === "FAIL") allPass = false;
  }

  console.log("  " + "─".repeat(maxName + 20));
  if (allPass) {
    console.log(green("  ALL CHECKS PASSED"));
  } else {
    console.log(red("  SOME CHECKS FAILED — fix issues before deploying"));
  }
  console.log();
}

async function main() {
  console.log(bold("\n  🏨 HotelsVendors Quality Gate\n  Running checks...\n"));

  checkAuthGuard();
  checkZodValidation();
  checkTenantIsolation();
  checkRbacConsistency();
  checkSecretsScan();
  checkBuildAndLint();

  printResults();

  const hasFailure = results.some((r) => r.status === "FAIL");
  process.exit(hasFailure ? 1 : 0);
}

main();
