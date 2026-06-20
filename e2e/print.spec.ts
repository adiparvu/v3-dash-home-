import { test, expect, type Page } from "@playwright/test";

/**
 * Print-label verification. Printing uses window.open + window.print, which
 * can't be asserted via an OS dialog, so we stub window.open to capture the
 * HTML handed to the print window. That proves the meaningful chain works:
 * QR canvas → PNG data URL → populated label (name, Asset ID, brand).
 */

declare global {
  interface Window {
    __printed: { html: string }[];
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "prvio-store-v1",
      JSON.stringify({ onboarded: true, estateName: "Prvio Estate" }),
    );
    // Capture whatever the print window receives instead of opening a popup.
    window.__printed = [];
    window.open = function () {
      const captured = { html: "" };
      window.__printed.push(captured);
      return {
        document: { write: (h: string) => { captured.html += h; }, close: () => {} },
        focus: () => {},
        print: () => {},
      } as unknown as Window;
    } as typeof window.open;
  });
});

async function lastPrintedHtml(page: Page): Promise<string> {
  await expect
    .poll(async () => page.evaluate(() => window.__printed.length), { timeout: 5000 })
    .toBeGreaterThan(0);
  return page.evaluate(() => window.__printed[window.__printed.length - 1].html);
}

test("inventory list: print button produces a real QR label", async ({ page }) => {
  await page.goto("/inventory");
  await page.getByRole("button", { name: "Print Label" }).first().click();
  const html = await lastPrintedHtml(page);
  expect(html).toContain("data:image/png");   // QR was rendered to a PNG
  expect(html).toContain("Water Pump");        // first seed asset name
  expect(html).toContain("WATER-PUMP");        // slug-derived Asset ID
  expect(html).toContain("PRVIO Earth");       // label brand line
});

test("asset detail QR tab: Print Label produces a real QR label", async ({ page }) => {
  await page.goto("/inventory/water-pump");
  await page.getByRole("button", { name: "QR Code" }).click();
  await page.getByRole("button", { name: "Print Label" }).click();
  const html = await lastPrintedHtml(page);
  expect(html).toContain("data:image/png");
  expect(html).toContain("Water Pump");
  expect(html).toContain("WP-001");            // catalog Asset ID on the detail page
  expect(html).toContain("PRVIO Earth");
});

test("scan result page: Print Label produces a real QR label", async ({ page }) => {
  await page.goto("/inventory/qr/WP-001");
  await expect(page.getByRole("heading", { name: "Water Pump" })).toBeVisible();
  await page.getByRole("button", { name: "Print Label" }).click();
  const html = await lastPrintedHtml(page);
  expect(html).toContain("data:image/png");
  expect(html).toContain("Water Pump");
  expect(html).toContain("WP-001");
  expect(html).toContain("PRVIO Earth");
});

test("downloaded QR canvas yields a non-trivial PNG", async ({ page }) => {
  await page.goto("/inventory/water-pump");
  await page.getByRole("button", { name: "QR Code" }).click();
  // The on-screen QR canvas must produce a real, sizeable PNG data URL.
  const len = await page.evaluate(() => {
    const c = document.querySelector("canvas") as HTMLCanvasElement | null;
    return c ? c.toDataURL("image/png").length : 0;
  });
  expect(len).toBeGreaterThan(1000);
});
