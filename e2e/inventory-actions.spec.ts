import { test, expect } from "@playwright/test";

/**
 * Inventory: new asset fields + functional detail/scan actions.
 */

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "prvio-store-v1",
      JSON.stringify({ onboarded: true, estateName: "Prvio Estate" }),
    );
  });
});

test("add an asset with the new fields and see them on the detail page", async ({ page }) => {
  await page.goto("/inventory/new");
  await page.getByPlaceholder("e.g. Water Pump").fill("Test Pump");
  await page.getByPlaceholder("e.g. 1").fill("3");
  await page.getByPlaceholder("e.g. €1,200").fill("€500");
  await page.getByPlaceholder("Anything worth remembering…").fill("Spare in cellar");
  await page.getByRole("button", { name: "Add Asset" }).click();

  await expect(page).toHaveURL(/\/inventory$/);
  await page.getByText("Test Pump").click();
  await expect(page).toHaveURL(/\/inventory\/test-pump/);
  // Details tab shows the new fields.
  await expect(page.getByText("Quantity")).toBeVisible();
  await expect(page.getByText("€500")).toBeVisible();
  await expect(page.getByText("Spare in cellar")).toBeVisible();
});

test("schedule maintenance persists and appears in the list", async ({ page }) => {
  await page.goto("/inventory/water-pump");
  await page.getByRole("button", { name: "Maintenance" }).click();
  await page.getByRole("button", { name: "Schedule Maintenance" }).click();
  await page.getByPlaceholder("e.g. Filter replacement").fill("Oil change");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Oil change")).toBeVisible();
});

test("quick action History opens the Maintenance tab", async ({ page }) => {
  await page.goto("/inventory/water-pump");
  await page.getByRole("button", { name: "History" }).click();
  await expect(page.getByText("Filter Replacement")).toBeVisible();
});

test("quick action Settings navigates to the edit page", async ({ page }) => {
  await page.goto("/inventory/water-pump");
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page).toHaveURL(/\/inventory\/water-pump\/edit/);
});

test("upload a document shows it in the list", async ({ page }) => {
  await page.goto("/inventory/water-pump");
  await page.getByRole("button", { name: "Documents" }).click();
  await page.locator('input[type="file"]').setInputFiles({
    name: "manual.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("hello world"),
  });
  await expect(page.getByText("manual.txt")).toBeVisible();
});

test("scan result Add Task navigates to tasks", async ({ page }) => {
  await page.goto("/inventory/qr/WP-001");
  await page.getByRole("button", { name: "Add Task" }).click();
  await expect(page).toHaveURL(/\/tasks/);
});

test("scan result Report Issue navigates to diagnostics", async ({ page }) => {
  await page.goto("/inventory/qr/WP-001");
  await page.getByRole("button", { name: "Report Issue" }).click();
  await expect(page).toHaveURL(/\/diagnostics/);
});
