import { type Page, type BrowserContext } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "https://www.hotelsvendors.com";

export interface TestUser {
  email: string;
  password: string;
  role: string;
  dashboardPath: string;
  name: string;
}

// Test password — used for both existing and newly registered users
const TEST_PASSWORD = "TestPass123!";

export const TEST_USERS: Record<string, TestUser> = {
  hotel: {
    email: "e2e-hotel@test.hotelsvendors.com",
    password: TEST_PASSWORD,
    role: "HOTEL",
    dashboardPath: "/hotel",
    name: "E2E Hotel User",
  },
  supplier: {
    email: "e2e-supplier@test.hotelsvendors.com",
    password: TEST_PASSWORD,
    role: "SUPPLIER",
    dashboardPath: "/supplier",
    name: "E2E Supplier User",
  },
  admin: {
    email: "e2e-admin@test.hotelsvendors.com",
    password: TEST_PASSWORD,
    role: "ADMIN",
    dashboardPath: "/admin",
    name: "E2E Admin User",
  },
  factoring: {
    email: "e2e-factoring@test.hotelsvendors.com",
    password: TEST_PASSWORD,
    role: "FACTORING",
    dashboardPath: "/factoring",
    name: "E2E Factoring User",
  },
};

/**
 * Ensure a test user exists by trying to register, then login.
 * Returns the auth token.
 */
export async function ensureTestUser(
  context: BrowserContext,
  user: TestUser
): Promise<string | null> {
  // Try login first (user may already exist)
  const loginRes = await context.request.post(`${BASE_URL}/api/v1/auth/login`, {
    data: { email: user.email, password: user.password },
  });

  if (loginRes.ok()) {
    const body = await loginRes.json();
    if (body.success && body.data?.token) {
      return body.data.token;
    }
  }

  // User doesn't exist — try to register
  const registerRes = await context.request.post(`${BASE_URL}/api/v1/auth/register`, {
    data: {
      email: user.email,
      password: user.password,
      name: user.name,
      type: user.role === "HOTEL" ? "HOTEL" : user.role === "SUPPLIER" ? "SUPPLIER" : "BUSINESS",
    },
  });

  // Registration may fail (user exists, email verification required, etc.)
  // Try login again after registration attempt
  const retryLogin = await context.request.post(`${BASE_URL}/api/v1/auth/login`, {
    data: { email: user.email, password: user.password },
  });

  if (retryLogin.ok()) {
    const body = await retryLogin.json();
    if (body.success && body.data?.token) {
      return body.data.token;
    }
  }

  return null;
}

/**
 * Login via API and set session cookies on the browser context.
 */
export async function loginViaAPI(
  context: BrowserContext,
  user: TestUser
): Promise<void> {
  const token = await ensureTestUser(context, user);

  if (!token) {
    throw new Error(`Could not authenticate as ${user.email}`);
  }

  // Set the token as a cookie
  await context.addCookies([
    {
      name: "session-token",
      value: token,
      domain: new URL(BASE_URL).hostname,
      path: "/",
    },
  ]);

  // Also set in localStorage as fallback
  const page = context.pages()[0] || (await context.newPage());
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 15_000 }).catch(() => {});
  await page.evaluate((t: string) => {
    localStorage.setItem("session-token", t);
  }, token);
}

/**
 * Navigate to a page and collect all failed requests (4xx, 5xx).
 */
export async function navigateAndCollectErrors(
  page: Page,
  path: string
): Promise<{ status: number; url: string; statusText: string }[]> {
  const errors: { status: number; url: string; statusText: string }[] = [];

  const handler = (response: import("@playwright/test").Response) => {
    const status = response.status();
    if (status >= 400 && !response.url().includes("_next/data")) {
      errors.push({
        status,
        url: response.url(),
        statusText: response.statusText(),
      });
    }
  };

  page.on("response", handler);
  await page.goto(path, { waitUntil: "networkidle", timeout: 30_000 }).catch(() => {});
  page.off("response", handler);

  return errors;
}

/**
 * Wait for the page to be fully loaded.
 */
export async function waitForDashboardLoad(page: Page): Promise<void> {
  await page.waitForTimeout(1500);
  await page
    .waitForSelector("h1, h2, [data-testid], main, nav", { timeout: 10_000 })
    .catch(() => {});
}
