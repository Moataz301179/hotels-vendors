/**
 * Playwright smoke test for hotels-vendors.
 * Usage: node .claude/skills/run-hotels-vendors/smoke.mjs [url]
 * Default url: http://localhost:3000
 *
 * Exits 0 on success (page rendered, no console errors).
 * Exits 1 on failure.
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000";
const SHOT = "/tmp/hv-smoke.png";

const errors = [];
let browser;

try {
  browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collect console errors
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  // Collect page errors (uncaught exceptions)
  page.on("pageerror", (err) => {
    errors.push(`[pageerror] ${err.message}`);
  });

  // Navigate — Next.js dev server compiles on demand, so wait for networkidle
  console.log(`→ Navigating to ${BASE} …`);
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });

  // Wait for the page to settle (Next.js hydration)
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: SHOT, fullPage: false });
  console.log(`→ Screenshot saved: ${SHOT}`);

  // Check for critical errors (filter out benign ones)
  const critical = errors.filter(
    (e) =>
      !e.includes("net::ERR_BLOCKED_BY_CLIENT") &&
      !e.includes("favicon.ico") &&
      !e.includes("ResizeObserver") &&
      !e.includes("React does not recognize") &&
      !e.includes("Received `%s` for a non-boolean attribute")
  );

  if (critical.length > 0) {
    console.error("✗ Console errors:");
    critical.forEach((e) => console.error(`  ${e}`));
    process.exit(1);
  }

  // Verify the page actually rendered something (not a blank screen or 500)
  const bodyText = await page.locator("body").innerText();
  const title = await page.title();

  if (!title || title.includes("500") || title.includes("404")) {
    console.error(`✗ Bad page title: "${title}"`);
    process.exit(1);
  }

  if (!bodyText || bodyText.trim().length < 10) {
    console.error("✗ Page body is empty or near-empty");
    process.exit(1);
  }

  console.log(`✓ Page rendered: "${title}" (${bodyText.length} chars)`);
  console.log("✓ No critical console errors");
  console.log("✓ Smoke test passed");

  await browser.close();
  process.exit(0);
} catch (err) {
  console.error(`✗ Smoke test failed: ${err.message}`);
  if (browser) await browser.close();
  process.exit(1);
}
