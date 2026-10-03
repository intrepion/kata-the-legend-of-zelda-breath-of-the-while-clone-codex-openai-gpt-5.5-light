import { expect, test } from "@playwright/test";

test("MVP 6 supports enemy camp, pause menu, and Plateau completion", async ({ page }) => {
  await page.goto("/app.html");
  await page.evaluate(() => {
    window.__wildreachTest?.clearProgress();
    window.__wildreachTest?.activateTower();
    window.__wildreachTest?.movePlayer(-22, 0, -3);
  });

  for (let i = 0; i < 3; i += 1) {
    await page.mouse.down();
    await page.waitForTimeout(120);
    await page.mouse.up();
    await page.waitForTimeout(80);
  }
  expect(await page.evaluate(() => window.__wildreachTest?.camp().defeated)).toBe(true);

  await page.keyboard.press("Escape");
  await expect(page.locator("#pause-menu")).toBeVisible();
  await page.locator("#reduced-motion").check();
  await expect(page.locator("body")).toHaveClass(/reduced-motion/);
  await page.locator("[data-action='clear']").click();
  expect(await page.evaluate(() => window.__wildreachTest?.progress().towerActivated)).toBe(false);
  await page.locator("[data-action='resume']").click();
  await expect(page.locator("#pause-menu")).toBeHidden();

  await page.evaluate(() => window.__wildreachTest?.activateTower());
  await page.keyboard.press("Escape");
  await expect(page.locator("#pause-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#pause-menu")).toBeHidden();

  await page.evaluate(() => {
    window.__wildreachTest?.movePlayer(21.5, 0, -33);
  });
  await page.keyboard.press("e");
  await page.evaluate(() => window.__wildreachTest?.movePlayer(28, 0, -36));
  await page.keyboard.press("e");
  await page.evaluate(() => window.__wildreachTest?.movePlayer(34, 0, -48));
  await page.keyboard.press("e");

  await expect(page.locator("#status-line")).toContainText("Plateau Complete");
  expect(await page.evaluate(() => window.__wildreachTest?.progress().plateauComplete)).toBe(true);
});
