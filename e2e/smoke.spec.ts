import { test, expect } from "@playwright/test";

/**
 * Smoke tests — assert the core surfaces render and the app shell is wired.
 * Intentionally shallow: these guard against build/runtime regressions (blank
 * pages, crashed routes, missing nav) rather than business logic, which the
 * vitest unit suite covers.
 */

// Seed the client store so the app treats the visitor as onboarded — otherwise
// the overview redirects first-launch visitors to /onboarding.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "prvio-store-v1",
      JSON.stringify({ onboarded: true, estateName: "Prvio Estate" }),
    );
  });
});

test("overview renders the estate dashboard with bottom nav", async ({ page }) => {
  await page.goto("/");
  // Health score ring + stats are the signature of the overview.
  await expect(page.getByText("Health Score", { exact: true })).toBeVisible();
  // Bottom navigation is present on the main surfaces.
  await expect(page.getByRole("link", { name: "Overview" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Zones" })).toBeVisible();
});

test("widget gallery shows all three home-screen sizes", async ({ page }) => {
  await page.goto("/widgets");
  await expect(page.getByRole("heading", { name: "Widgets" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Small" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Medium" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Large" })).toBeVisible();
  // Switching size keeps the page alive (no crash).
  await page.getByRole("button", { name: "Large" }).click();
  await expect(page.getByText("Live Activities")).toBeVisible();
});

test("weather API returns a well-formed payload", async ({ request }) => {
  const res = await request.get("/api/v1/weather");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.apiVersion).toBe("1.0.0");
  expect(typeof body.data.tempC).toBe("number");
  expect(["live", "fallback"]).toContain(body.data.source);
});

test("offline fallback page is reachable", async ({ page }) => {
  await page.goto("/offline");
  await expect(page.getByRole("heading", { name: /offline/i })).toBeVisible();
});

test("unconfigured profile API degrades to 401, not 500", async ({ request }) => {
  const res = await request.get("/api/v1/profile");
  // In localStorage prototype mode (no Supabase env) the route must not 500.
  expect(res.status()).toBe(401);
});

test("bottom nav deep-links to the tasks surface", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Tasks" }).click();
  await expect(page).toHaveURL(/\/tasks/);
});

test("diagnostics detail disclosure opens causes + suggestions", async ({ page }) => {
  await page.goto("/diagnostics");
  await expect(page.getByRole("heading", { name: "Diagnostics" })).toBeVisible();
  // Open the first fault's detail sheet via its ⓘ button.
  await page.getByRole("button", { name: /Details and suggestions for/ }).first().click();
  const sheet = page.getByRole("dialog");
  await expect(sheet).toBeVisible();
  await expect(sheet.getByText("Likely causes")).toBeVisible();
  await expect(sheet.getByText("Suggestions")).toBeVisible();
  // Escape closes it.
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
});
