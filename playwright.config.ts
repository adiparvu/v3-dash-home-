import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end smoke tests for the PRVIO Earth web client.
 *
 * These run against the app in its localStorage prototype mode (no Supabase env
 * vars), so they exercise the real runtime — routing, rendering, navigation and
 * the demo data fallbacks — without needing a live backend.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "list" : "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // Phone-sized viewport — the app is designed as an iOS-style surface.
    viewport: { width: 390, height: 844 },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
