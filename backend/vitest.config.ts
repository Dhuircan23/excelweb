import { defineConfig } from "vitest/config";

// Override with your own local Postgres if excelweb_test@localhost isn't
// what you use — see README.md "Testing" for how to set it up.
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ?? "postgresql://excelweb:excelweb@localhost:5432/excelweb_test";

export default defineConfig({
  test: {
    environment: "node",
    exclude: ["**/node_modules/**", "**/dist/**"],
    env: {
      NODE_ENV: "test",
      DATABASE_URL: TEST_DATABASE_URL,
      CORS_ORIGIN: "http://localhost:5173",
      UPLOADS_DIR: "./uploads-test",
    },
  },
});
