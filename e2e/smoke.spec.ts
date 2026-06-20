import { test, expect } from "@playwright/test";

/**
 * Runtime smoke tests — verify the key surfaces actually render and the primary
 * navigation works in the browser (demo / localStorage mode, no backend).
 */

// A brand-new visitor (empty localStorage) is routed through onboarding once.
// These tests exercise the post-onboarding app, so seed the store as onboarded
// before each navigation to land directly on the requested surface.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("prvio-store-v1", JSON.stringify({ onboarded: true }));
  });
});

test.describe("core surfaces render", () => {
  test("Overview (home) loads with stats and bottom nav", async ({ page }) => {
    await page.goto("/");
    // Home shows the live indicator and the health ring.
    await expect(page.getByText("Health Score", { exact: true })).toBeVisible();
    await expect(page.getByText("Quick Access")).toBeVisible();
    // Bottom navigation is present with all five tabs.
    for (const tab of ["Overview", "Zones", "Inventory", "Tasks", "More"]) {
      await expect(page.getByRole("link", { name: tab })).toBeVisible();
    }
  });

  test("Zones list", async ({ page }) => {
    await page.goto("/zones");
    await expect(page.getByRole("heading", { name: "Zones", level: 1 })).toBeVisible();
  });

  test("Inventory list", async ({ page }) => {
    await page.goto("/inventory");
    await expect(page.getByRole("heading", { name: "Inventory", level: 1 })).toBeVisible();
    await expect(page.getByPlaceholder("Search assets...")).toBeVisible();
  });

  test("Tasks list", async ({ page }) => {
    await page.goto("/tasks");
    await expect(page.getByRole("heading", { name: "Tasks", level: 1 })).toBeVisible();
  });

  test("More menu", async ({ page }) => {
    await page.goto("/more");
    await expect(page.getByRole("heading", { name: "More", level: 1 })).toBeVisible();
  });

  test("Settings", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Settings", level: 1 })).toBeVisible();
  });

  test("Zone detail (lake) resolves", async ({ page }) => {
    await page.goto("/zones/lake");
    await expect(page.getByRole("heading", { name: "Heleșteu", level: 1 })).toBeVisible();
  });

  test("Digital Twin — Energy module", async ({ page }) => {
    await page.goto("/twin/energy");
    await expect(page.getByRole("heading", { name: "Energy", level: 1 })).toBeVisible();
  });

  test("AI assistant", async ({ page }) => {
    await page.goto("/ai");
    await expect(page.getByPlaceholder("Ask about your estate...")).toBeVisible();
  });

  test("Login screen", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "PRVIO EARTH" })).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  });
});

test.describe("primary navigation", () => {
  test("bottom nav moves between the main tabs", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Zones" }).click();
    await expect(page).toHaveURL(/\/zones$/);
    await expect(page.getByRole("heading", { name: "Zones", level: 1 })).toBeVisible();

    await page.getByRole("link", { name: "Inventory" }).click();
    await expect(page).toHaveURL(/\/inventory$/);
    await expect(page.getByRole("heading", { name: "Inventory", level: 1 })).toBeVisible();

    await page.getByRole("link", { name: "Tasks" }).click();
    await expect(page).toHaveURL(/\/tasks$/);
    await expect(page.getByRole("heading", { name: "Tasks", level: 1 })).toBeVisible();

    await page.getByRole("link", { name: "Overview" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("Health Score", { exact: true })).toBeVisible();
  });
});
