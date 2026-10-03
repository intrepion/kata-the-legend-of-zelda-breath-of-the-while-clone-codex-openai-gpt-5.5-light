import { expect, test } from "@playwright/test";

test("MVP 5 completes the physics shrine with block, plate, and spirit token", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    window.__wildreachTest?.activateTower();
    window.__wildreachTest?.movePlayer(21.5, 0, -33);
  });

  await page.keyboard.press("e");
  const opened = await page.evaluate(() => window.__wildreachTest?.shrine());
  expect(opened?.gateOpen).toBe(true);

  await page.evaluate(() => window.__wildreachTest?.movePlayer(28, 0, -36));
  await page.keyboard.press("e");
  const progress = await page.evaluate(() => window.__wildreachTest?.progress());

  expect(progress).toMatchObject({
    shrineCompleted: true,
    spiritTokens: 1,
    recoveryPoint: "shrine"
  });
});
