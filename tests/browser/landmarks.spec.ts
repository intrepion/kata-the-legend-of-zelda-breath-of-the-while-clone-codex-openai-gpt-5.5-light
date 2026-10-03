import { expect, test } from "@playwright/test";

test("MVP 2 reveals Plateau landmarks after tower activation", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("[data-landmark='tower']")).toContainText("Central Tower");
  await expect(page.locator("[data-landmark='shrine']")).toHaveCount(0);

  await page.evaluate(() => window.__wildreachTest?.activateTower());
  await expect(page.locator("[data-landmark='shrine']")).toContainText("Ruin Chamber Shrine");
  await expect(page.locator("[data-landmark='camp']")).toContainText("Lower Meadow Camp");
  await expect(page.locator("[data-landmark='vista']")).toContainText("Final Vista");
});
