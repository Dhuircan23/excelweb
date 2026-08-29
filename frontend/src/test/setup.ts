import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Vitest doesn't expose test globals by default in this project (see
// vitest.config.ts), so React Testing Library can't auto-detect a global
// afterEach to register its cleanup — do it explicitly instead.
afterEach(() => {
  cleanup();
});
