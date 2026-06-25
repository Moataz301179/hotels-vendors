// Run with: node .claude/setup/hostinger-email.js
// Creates support@hotelsvendors.com via Hostinger hPanel

const { chromium } = require("@playwright/test");

const HPANEL_URL = "https://hpanel.hostinger.com";
const EMAILS_TO_CREATE = [
  "support@hotelsvendors.com",
  "integrations@hotelsvendors.com",
  "noreply@hotelsvendors.com",
];

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Login
    console.log("[1/4] Logging into hPanel...");
    await page.goto(HPANEL_URL);
    await page.waitForSelector('input[name="username"], #username, [type="email"]', { timeout: 15000 });

    const usernameInput = await page.$('input[name="username"], #username, [type="email"]');
    const passwordInput = await page.$('input[name="password"], #password, [type="password"]');

    if (usernameInput) {
      await usernameInput.fill("hotelsvendors@gmail.com");
    } else {
      // Try clicking Google login
      const googleBtn = await page.$('button:has-text("Google"), a:has-text("Google"), [class*="google"]');
      if (googleBtn) {
        console.log("  Google login detected — manual intervention needed");
      }
    }

    if (passwordInput) {
      await passwordInput.fill("Moziagent.3011");
    }

    // Submit
    const submitBtn = await page.$('button[type="submit"], input[type="submit"], button:has-text("Log in"), button:has-text("Sign in")');
    if (submitBtn) await submitBtn.click();

    await page.waitForNavigation({ waitUntil: "networkidle", timeout: 20000 }).catch(() => {});
    console.log("  Current URL:", page.url());

    // Step 2: Navigate to Email Accounts
    console.log("[2/4] Navigating to Email Accounts...");
    await page.goto(`${HPANEL_URL}/emails`, { waitUntil: "domcontentloaded", timeout: 15000 }).catch(async () => {
      // Try clicking through UI
      const emailLink = await page.$('a:has-text("Email"), a:has-text("Emails"), [href*="email"]');
      if (emailLink) await emailLink.click();
      await page.waitForTimeout(3000);
    });
    console.log("  Current URL:", page.url());

    // Step 3: Create emails
    for (const email of EMAILS_TO_CREATE) {
      console.log(`[3/4] Creating ${email}...`);
      // Note: Actual creation depends on Hostinger UI version
      // This is a scaffold — real execution may need selector adjustments
      const createBtn = await page.$('button:has-text("Create"), a:has-text("Create"), button:has-text("New")');
      if (createBtn) {
        await createBtn.click();
        await page.waitForTimeout(2000);
        console.log("  Clicked create button — manual steps may be needed");
      }
    }

    // Step 4: Screenshot for verification
    console.log("[4/4] Taking verification screenshot...");
    await page.screenshot({ path: ".claude/setup/hostinger-result.png", fullPage: true });
    console.log("  Screenshot saved to .claude/setup/hostinger-result.png");

  } catch (error) {
    console.error("Error:", error.message);
    await page.screenshot({ path: ".claude/setup/hostinger-error.png", fullPage: true });
  }

  await browser.close();
  console.log("\nDone. Check screenshots for results.");
})();
