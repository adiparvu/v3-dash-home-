import { test, expect } from "@playwright/test";

/**
 * Coverage for the functional-feature batch:
 *  - Add Property form persists
 *  - New automation wizard persists
 *  - Task detail real lookup + status/notes/delete
 *  - Scan "Add Task" prefills from the scanned asset
 *  - Loan history after a return
 */

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "prvio-store-v1",
      JSON.stringify({ onboarded: true, estateName: "Prvio Estate" }),
    );
  });
});

test("add a property and see it in the portfolio", async ({ page }) => {
  await page.goto("/properties/new");
  await page.getByPlaceholder("e.g. Prvio Estate").fill("Test Villa");
  await page.getByPlaceholder("e.g. Cluj-Napoca").fill("Brașov");
  await page.getByPlaceholder("e.g. România").fill("România");
  await page.getByRole("button", { name: "Add Property", exact: true }).click();

  await expect(page).toHaveURL(/\/properties$/);
  await expect(page.getByText("Test Villa")).toBeVisible();
});

test("create an automation through the wizard and see it listed", async ({ page }) => {
  await page.goto("/automations/new");
  // Step 1 — name + zone
  await page.getByPlaceholder("e.g. Morning Irrigation").fill("E2E Test Automation");
  await page.getByRole("button", { name: "Orchard", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  // Step 2 — trigger
  await page.getByRole("button", { name: "Schedule" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  // Step 3 — action
  await page.getByRole("button", { name: "Send Notification" }).click();
  await page.getByRole("button", { name: "Create Automation" }).click();

  await expect(page).toHaveURL(/\/automations$/);
  await expect(page.getByText("E2E Test Automation")).toBeVisible();
});

test("open a task, mark it complete, and persist the status", async ({ page }) => {
  await page.goto("/tasks");
  await page.getByText("Forest Health Survey").click();
  await expect(page).toHaveURL(/\/tasks\/3/);
  await page.getByRole("button", { name: "Mark Complete" }).click();
  await expect(page.getByText("Completed").first()).toBeVisible();

  // Back to the list — the completed filter shows it.
  await page.goto("/tasks");
  await page.getByRole("button", { name: "Completed" }).click();
  await expect(page.getByText("Forest Health Survey")).toBeVisible();
});

test("add a note on a task detail", async ({ page }) => {
  await page.goto("/tasks/3");
  await page.getByRole("button", { name: "Add note" }).click();
  await page.getByPlaceholder("Write a note…").fill("Bring the moisture meter");
  await page.getByRole("button", { name: "Save note" }).click();
  await expect(page.getByText("Bring the moisture meter")).toBeVisible();
});

test("delete a task removes it from the list", async ({ page }) => {
  await page.goto("/tasks/4");
  await page.getByRole("button", { name: "Delete Task" }).click();
  await expect(page).toHaveURL(/\/tasks$/);
  await expect(page.getByText("Lake Water Quality Test")).toHaveCount(0);
});

test("scan Add Task prefills the composer from the asset", async ({ page }) => {
  await page.goto("/inventory/qr/WP-001");
  await page.getByRole("button", { name: "Add Task" }).click();
  await expect(page).toHaveURL(/\/tasks/);
  await expect(page.getByPlaceholder("e.g. Check irrigation valves")).toHaveValue(/Water Pump/);
});

test("loan history records a return", async ({ page }) => {
  await page.goto("/inventory/water-pump");
  await page.getByRole("button", { name: "Lend item" }).click();
  await page.getByPlaceholder("e.g. Maria Popescu").fill("Ion Vasile");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Lent to Ion Vasile")).toBeVisible();

  await page.getByRole("button", { name: "Mark returned" }).click();
  // History section appears with the returned borrower.
  await expect(page.getByText("Loan history")).toBeVisible();
  await expect(page.getByText("Ion Vasile")).toBeVisible();
});
