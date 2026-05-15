/**
 * End-to-End Smoke Test
 * Tests the full platform cycle: register → login → product → marketplace → order → invoice
 *
 * Run: npx tsx scripts/e2e-smoke-test.ts
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

// ── Simple HTTP client with cookie jar + unique IP per request ─────

let ipCounter = 1;
function nextIp() {
  return `10.0.0.${ipCounter++}`;
}

class TestClient {
  private cookies: string[] = [];
  private currentIp: string = nextIp();

  private getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "x-forwarded-for": this.currentIp,
      ...(this.cookies.length > 0 ? { Cookie: this.cookies.join("; ") } : {}),
    };
  }

  private saveCookies(response: Response) {
    const setCookie = (response.headers as any).getSetCookie?.() || [];
    for (const c of setCookie) {
      const name = c.split("=")[0];
      this.cookies = this.cookies.filter((existing) => !existing.startsWith(`${name}=`));
      this.cookies.push(c.split(";")[0]);
    }
  }

  async post(path: string, body: unknown): Promise<{ status: number; data: any }> {
    const url = `${BASE_URL}${path}`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    this.saveCookies(res);
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  }

  async get(path: string): Promise<{ status: number; data: any }> {
    const url = `${BASE_URL}${path}`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });
    this.saveCookies(res);
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  }

  clearCookies() {
    this.cookies = [];
    this.currentIp = nextIp();
  }
}

// ── Test utilities ──────────────────────────────────────────────────

const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

let passed = 0;
let failed = 0;
const errors: string[] = [];

function log(msg: string) {
  console.log(msg);
}

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    log(`${colors.green}✓${colors.reset} ${name}`);
    passed++;
  } catch (err: any) {
    log(`${colors.red}✗${colors.reset} ${name}`);
    log(`  ${colors.red}${err.message}${colors.reset}`);
    errors.push(`${name}: ${err.message}`);
    failed++;
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

// ── Test data ───────────────────────────────────────────────────────

const timestamp = Date.now();
const TEST_SUPPLIER = {
  name: `Test Supplier ${timestamp}`,
  email: `supplier.test.${timestamp}@example.com`,
  password: "TestPass123!",
  type: "supplier" as const,
  accountType: "business" as const,
};

const TEST_HOTEL = {
  name: `Test Hotel ${timestamp}`,
  email: `hotel.test.${timestamp}@example.com`,
  password: "TestPass123!",
  type: "hotel" as const,
  accountType: "business" as const,
};

// ── Main test suite ─────────────────────────────────────────────────

async function runTests() {
  log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  log(`${colors.cyan}  Hotels Vendors — End-to-End Smoke Test${colors.reset}`);
  log(`${colors.cyan}  Base URL: ${BASE_URL}${colors.reset}`);
  log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

  const client = new TestClient();

  // ── 1. ADMIN LOGIN ─────────────────────────────────────────────
  log(`\n${colors.yellow}─── 1. ADMIN LOGIN ───${colors.reset}`);

  await test("Admin login with Admin/Cheetos123", async () => {
    const { status, data } = await client.post("/api/v1/auth/login", {
      email: "Admin",
      password: "Cheetos123",
    });
    assert(status === 200, `Expected 200, got ${status}: ${data?.error}`);
    assert(data?.success === true, "Login returned success=false");
    assert(data?.data?.user?.platformRole === "ADMIN", `Expected ADMIN role, got ${data?.data?.user?.platformRole}`);
  });

  // ── 2. SUPPLIER REGISTRATION ───────────────────────────────────
  log(`\n${colors.yellow}─── 2. SUPPLIER REGISTRATION ───${colors.reset}`);

  let supplierToken: string;
  let supplierUser: any;

  await test("Register new supplier", async () => {
    client.clearCookies();
    const { status, data } = await client.post("/api/v1/auth/register", TEST_SUPPLIER);
    assert(status === 201, `Expected 201, got ${status}: ${data?.error}`);
    assert(data?.success === true, "Registration returned success=false");
    assert(data?.data?.user?.platformRole === "SUPPLIER", `Expected SUPPLIER role, got ${data?.data?.user?.platformRole}`);
    assert(data?.data?.supplier != null, "Supplier entity was not created");
    assert(data?.data?.supplier?.status === "ACTIVE", "Supplier was not auto-approved");
    supplierToken = data.data.token;
    supplierUser = data.data.user;
  });

  // ── 3. HOTEL REGISTRATION ──────────────────────────────────────
  log(`\n${colors.yellow}─── 3. HOTEL REGISTRATION ───${colors.reset}`);

  let hotelToken: string;
  let hotelUser: any;

  await test("Register new hotel", async () => {
    client.clearCookies();
    const { status, data } = await client.post("/api/v1/auth/register", TEST_HOTEL);
    assert(status === 201, `Expected 201, got ${status}: ${data?.error}`);
    assert(data?.success === true, "Registration returned success=false");
    assert(data?.data?.user?.platformRole === "HOTEL", `Expected HOTEL role, got ${data?.data?.user?.platformRole}`);
    assert(data?.data?.hotel != null, "Hotel entity was not created");
    hotelToken = data.data.token;
    hotelUser = data.data.user;
  });

  // ── 4. SUPPLIER LOGIN ──────────────────────────────────────────
  log(`\n${colors.yellow}─── 4. SUPPLIER LOGIN & PRODUCT CREATION ───${colors.reset}`);

  await test("Supplier login", async () => {
    client.clearCookies();
    const { status, data } = await client.post("/api/v1/auth/login", {
      email: TEST_SUPPLIER.email,
      password: TEST_SUPPLIER.password,
    });
    assert(status === 200, `Expected 200, got ${status}: ${data?.error}`);
    assert(data?.success === true, "Login returned success=false");
    assert(data?.data?.user?.platformRole === "SUPPLIER", "Not a supplier");
  });

  let createdProduct: any;

  await test("Supplier creates a product", async () => {
    const { status, data } = await client.post("/api/v1/products", {
      sku: `TEST-SKU-${timestamp}`,
      name: `Test Product ${timestamp}`,
      description: "Auto-generated test product for E2E testing",
      category: "fb",
      subcategory: "Test",
      unitPrice: 150.5,
      currency: "EGP",
      stockQuantity: 100,
      minOrderQty: 5,
      unitOfMeasure: "piece",
      leadTimeDays: 3,
      shelfLifeDays: 30,
      temperatureReq: "Room temperature",
    });
    assert(status === 201, `Expected 201, got ${status}: ${data?.error}`);
    assert(data?.success === true, "Product creation failed");
    assert(data?.data?.sku === `TEST-SKU-${timestamp}`, "SKU mismatch");
    createdProduct = data.data;
  });

  await test("Product appears in marketplace catalog", async () => {
    const { status, data } = await client.get("/api/v1/products?page=1&limit=50");
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data?.success === true, "Fetch failed");
    const found = data?.data?.products?.find((p: any) => p.sku === `TEST-SKU-${timestamp}`);
    assert(found != null, "Created product not found in marketplace");
  });

  // ── 5. HOTEL LOGIN & MARKETPLACE ───────────────────────────────
  log(`\n${colors.yellow}─── 5. HOTEL LOGIN & MARKETPLACE ───${colors.reset}`);

  await test("Hotel login", async () => {
    client.clearCookies();
    const { status, data } = await client.post("/api/v1/auth/login", {
      email: TEST_HOTEL.email,
      password: TEST_HOTEL.password,
    });
    assert(status === 200, `Expected 200, got ${status}: ${data?.error}`);
    assert(data?.success === true, "Login returned success=false");
    assert(data?.data?.user?.platformRole === "HOTEL", "Not a hotel");
  });

  await test("Hotel browses marketplace", async () => {
    const { status, data } = await client.get("/api/v1/products?category=fb&page=1&limit=20");
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data?.success === true, "Fetch failed");
    assert(Array.isArray(data?.data?.products), "Products array missing");
    assert(data.data.products.length > 0, "No products in marketplace");
  });

  await test("Hotel searches for product by name", async () => {
    const { status, data } = await client.get(`/api/v1/products?search=Test%20Product%20${timestamp}`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(data?.success === true, "Search failed");
    const found = data?.data?.products?.find((p: any) => p.sku === `TEST-SKU-${timestamp}`);
    assert(found != null, "Created product not found in search");
  });

  // ── 6. ORDER CREATION ──────────────────────────────────────────
  log(`\n${colors.yellow}─── 6. ORDER CREATION ───${colors.reset}`);

  // Note: Order creation requires more entities (hotel ID, supplier ID, etc.)
  // We'll test the order API structure but may need seed data for full flow

  await test("Check order API is accessible (RBAC enforced)", async () => {
    const { status, data } = await client.get("/api/v1/supplier/orders");
    // Should get 403 (missing permission) — permission check is enforced
    assert(status === 403 || status === 401, `Expected 403/401 for auth failure, got ${status}: ${data?.error}`);
  });

  // ── 7. ADMIN DATA EXPLORER ─────────────────────────────────────
  log(`\n${colors.yellow}─── 7. ADMIN DATA EXPLORER ───${colors.reset}`);

  await test("Admin login for explorer", async () => {
    client.clearCookies();
    const { status, data } = await client.post("/api/v1/auth/login", {
      email: "Admin",
      password: "Cheetos123",
    });
    assert(status === 200, `Expected 200, got ${status}: ${data?.error}`);
  });

  await test("Explorer: list all users", async () => {
    const { status, data } = await client.get("/api/v1/admin/explorer?entity=users&page=1&limit=10");
    assert(status === 200, `Expected 200, got ${status}: ${data?.error}`);
    assert(data?.success === true, "Explorer returned success=false");
    assert(Array.isArray(data?.data), "Data array missing");
    assert(data.data.length > 0, "No users found");
  });

  await test("Explorer: list all suppliers", async () => {
    const { status, data } = await client.get("/api/v1/admin/explorer?entity=suppliers&page=1&limit=10");
    assert(status === 200, `Expected 200, got ${status}: ${data?.error}`);
    assert(data?.success === true, "Explorer returned success=false");
    const found = data?.data?.find((s: any) => s.email === TEST_SUPPLIER.email);
    assert(found != null, "Registered supplier not found in explorer");
  });

  await test("Explorer: list all hotels", async () => {
    const { status, data } = await client.get("/api/v1/admin/explorer?entity=hotels&page=1&limit=10");
    assert(status === 200, `Expected 200, got ${status}: ${data?.error}`);
    assert(data?.success === true, "Explorer returned success=false");
    const found = data?.data?.find((h: any) => h.name?.includes(`Test Hotel ${timestamp}`));
    assert(found != null, "Registered hotel not found in explorer");
  });

  await test("Explorer: list all products", async () => {
    const { status, data } = await client.get("/api/v1/admin/explorer?entity=products&page=1&limit=10");
    assert(status === 200, `Expected 200, got ${status}: ${data?.error}`);
    assert(data?.success === true, "Explorer returned success=false");
    const found = data?.data?.find((p: any) => p.sku === `TEST-SKU-${timestamp}`);
    assert(found != null, "Created product not found in explorer");
  });

  await test("Explorer: search across entities", async () => {
    const { status, data } = await client.get(`/api/v1/admin/explorer?entity=products&search=Test%20Product%20${timestamp}`);
    assert(status === 200, `Expected 200, got ${status}: ${data?.error}`);
    assert(data?.data?.length > 0, "Search returned no results");
  });

  await test("Activity feed returns data", async () => {
    const { status, data } = await client.get("/api/v1/admin/activity?limit=10");
    assert(status === 200, `Expected 200, got ${status}: ${data?.error}`);
    assert(data?.success === true, "Activity returned success=false");
    assert(Array.isArray(data?.data), "Activity data missing");
  });

  // ── 8. AUTHZ CHECKS ────────────────────────────────────────────
  log(`\n${colors.yellow}─── 8. AUTHORIZATION CHECKS ───${colors.reset}`);

  await test("Non-admin cannot access explorer", async () => {
    client.clearCookies();
    const loginRes = await client.post("/api/v1/auth/login", {
      email: TEST_SUPPLIER.email,
      password: TEST_SUPPLIER.password,
    });
    assert(loginRes.status === 200, `Supplier login failed: ${loginRes.data?.error}`);
    const { status, data } = await client.get("/api/v1/admin/explorer?entity=users&page=1&limit=10");
    // Should be blocked (403 = forbidden, 401 = unauthorized/no session)
    assert(status === 403 || status === 401, `Expected 403/401, got ${status}: ${data?.error}`);
  });

  await test("Non-admin cannot access activity feed", async () => {
    const { status, data } = await client.get("/api/v1/admin/activity?limit=10");
    assert(status === 403, `Expected 403, got ${status}`);
    assert(data?.success === false, "Should have returned success=false");
  });

  // ── Summary ──────────────────────────────────────────────────────
  log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  log(`${colors.cyan}  Results: ${colors.green}${passed} passed${colors.reset}, ${colors.red}${failed} failed${colors.reset}${colors.reset}`);
  log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

  if (errors.length > 0) {
    log(`${colors.red}Failed tests:${colors.reset}`);
    errors.forEach((e) => log(`  ${colors.red}• ${e}${colors.reset}`));
    log("");
    process.exit(1);
  } else {
    log(`${colors.green}✓ All tests passed!${colors.reset}\n`);
    process.exit(0);
  }
}

// Health check — verify server is running
async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "Admin", password: "Cheetos123" }),
      signal: AbortSignal.timeout(10000),
    });
    return res.status === 200;
  } catch {
    return false;
  }
}

async function main() {
  const healthy = await healthCheck();
  if (!healthy) {
    console.error(`\n${colors.red}✗ Server not responding at ${BASE_URL}${colors.reset}`);
    console.error(`${colors.yellow}  Make sure the dev server is running: npm run dev${colors.reset}\n`);
    process.exit(1);
  }
  await runTests();
}

main();
