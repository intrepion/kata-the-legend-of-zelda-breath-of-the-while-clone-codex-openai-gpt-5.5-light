import { expect, test } from "@playwright/test";

test("MVP 4 tower activation reveals landmarks, unlocks glider, and shows map sketch", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    window.__wildreachTest?.movePlayer(0, 0, -18);
  });

  await page.keyboard.press("e");
  await expect(page.locator("#status-line")).toContainText("Glider earned");
  await expect(page.locator("[data-landmark='shrine']")).toContainText("Ruin Chamber Shrine");

  const progress = await page.evaluate(() => window.__wildreachTest?.progress());
  expect(progress).toMatchObject({
    towerActivated: true,
    gliderUnlocked: true,
    recoveryPoint: "tower"
  });

  await page.keyboard.down("m");
  await expect(page.locator("#map-sketch")).toBeVisible();
  await page.keyboard.up("m");
});
