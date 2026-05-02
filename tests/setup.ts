import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock environment variables for tests
process.env.SESSION_SECRET = "test-secret-64-characters-long-string-here-1234567890";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.REDIS_URL = "redis://localhost:6379";

// Mock Redis for unit tests
vi.mock("ioredis", () => {
  return {
    Redis: vi.fn().mockImplementation(() => ({
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn().mockResolvedValue("OK"),
      del: vi.fn().mockResolvedValue(1),
      incr: vi.fn().mockResolvedValue(1),
      expire: vi.fn().mockResolvedValue(1),
      lpush: vi.fn().mockResolvedValue(1),
      brpop: vi.fn().mockResolvedValue(null),
      on: vi.fn(),
      quit: vi.fn().mockResolvedValue(undefined),
    })),
  };
});

// Mock Sentry for tests
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
  setTag: vi.fn(),
}));

// Mock Prisma adapter-pg for tests
vi.mock("@prisma/adapter-pg", () => ({
  PrismaPg: vi.fn().mockImplementation(() => ({})),
}));

vi.mock("pg", () => ({
  Pool: vi.fn().mockImplementation(() => ({
    query: vi.fn().mockResolvedValue({ rows: [] }),
    end: vi.fn().mockResolvedValue(undefined),
  })),
}));
