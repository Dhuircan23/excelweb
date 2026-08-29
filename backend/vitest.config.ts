import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    exclude: ["**/node_modules/**", "**/dist/**"],
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "file:./test.db",
      CORS_ORIGIN: "http://localhost:5173",
      UPLOADS_DIR: "./uploads-test",
    },
  },
});
