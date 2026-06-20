import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E smoke configuration.
 *
 * Specs live in ./e2e (kept out of the vitest `tests/**` glob). The webServer
 * builds and serves the production app so smoke runs hit the same output users
 * get. Run with `npm run test:e2e` (set PLAYWRIGHT_BASE_URL to target a remote
 * deployment and skip the local server).
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
