import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const SESSION_DIR = '.claude/skills/run-hotels-vendors/screenshots';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  const args = process.argv.slice(2);
  const command = args[0] || 'screenshot';

  try {
    switch (command) {
      case 'screenshot': {
        // Navigate to landing page and take a full-page screenshot
        await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
        // Wait for the hero heading to appear
        await page.waitForSelector('h1', { timeout: 15000 });
        const path = `${SESSION_DIR}/landing.png`;
        await page.screenshot({ path, fullPage: false });
        console.log(`Screenshot saved: ${path}`);
        break;
      }

      case 'wizard': {
        // Navigate to landing page, click "Get Started", screenshot the wizard
        await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForSelector('h1', { timeout: 15000 });
        // Click the first "Get Started Free" button
        const btn = page.locator('button', { hasText: 'Get Started Free' }).first();
        await btn.click();
        // Wait for wizard modal to appear
        await page.waitForSelector('text=What best describes your business?', { timeout: 10000 });
        const path = `${SESSION_DIR}/wizard-step1.png`;
        await page.screenshot({ path, fullPage: false });
        console.log(`Screenshot saved: ${path}`);
        break;
      }

      case 'nav': {
        // Navigate to a specific path
        const targetPath = args[1] || '/';
        await page.goto(`${BASE_URL}${targetPath}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        const path = `${SESSION_DIR}/nav-${targetPath.replace(/\//g, '_') || 'root'}.png`;
        await page.screenshot({ path, fullPage: false });
        console.log(`Screenshot saved: ${path}`);
        break;
      }

      case 'console': {
        // Navigate and report console errors
        const errors = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') errors.push(msg.text());
        });
        await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);
        if (errors.length === 0) {
          console.log('No console errors');
        } else {
          console.log(`Console errors (${errors.length}):`);
          errors.forEach((e) => console.log(`  - ${e}`));
        }
        break;
      }

      default:
        console.log(`Unknown command: ${command}`);
        console.log('Usage: node driver.mjs [screenshot|wizard|nav <path>|console]');
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
