import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  eslintConfigPrettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "prisma/migrations/**",
    "prisma/schema-v6-*.sql",
    "public/**",
    "*.sql",
    "dist/**",
    ".vercel/**",
    "coverage/**",
    "tmp/**",
    "scripts/**",
    "tests/**",
    "data/**",
    "content/**",
    "docs/**",
    "graphify-out/**",
    "deploy/**",
    "projects/**",
    "research/**",
    "front-end/**",
    "orchestra/**",
    "workspace/**",
    "templates/**",
    "marketing/**",
  ]),
]);

export default eslintConfig;
