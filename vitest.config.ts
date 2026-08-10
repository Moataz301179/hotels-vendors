import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["lib/**/*.ts"],
      exclude: [
        "lib/validators/**",
        "lib/i18n/**",
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
      ],
      thresholds: {
        statements: 25,
        branches: 20,
        functions: 25,
        lines: 25,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "~": path.resolve(__dirname, "."),
    },
  },
});
