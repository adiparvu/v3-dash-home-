import { test, expect } from "@playwright/test";

/**
 * 3D digital-twin demo. WebGL is environment-dependent: in a real browser the
 * canvas mounts; in a headless runner without WebGL the page degrades to a
 * graceful fallback (never crashes). Either way the page scaffolding and the
 * overlay controls (view presets → asset cards) must work.
 */

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "prvio-store-v1",
      JSON.stringify({ onboarded: true, estateName: "Prvio Estate" }),
    );
  });
});

test("3D twin page loads and degrades gracefully", async ({ page }) => {
  await page.goto("/twin/3d");
  await expect(page.getByRole("heading", { name: "3D Digital Twin" })).toBeVisible();

  // Either the WebGL canvas mounts, or the no-WebGL fallback is shown — but the
  // page must not throw a client-side exception.
  const canvas = page.locator("canvas");
  const fallback = page.getByText("3D view isn't available on this device");
  await expect(canvas.or(fallback).first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByText("a client-side exception has occurred")).toHaveCount(0);
});

test("view presets reveal the asset card", async ({ page }) => {
  await page.goto("/twin/3d");
  await page.getByRole("button", { name: "Greenhouse", exact: true }).click();
  await expect(page.getByText("Humidity")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open in app" })).toBeVisible();

  // Switching to Solar swaps the metrics shown in the card.
  await page.getByRole("button", { name: "Solar", exact: true }).click();
  await expect(page.getByText("Battery")).toBeVisible();
});
