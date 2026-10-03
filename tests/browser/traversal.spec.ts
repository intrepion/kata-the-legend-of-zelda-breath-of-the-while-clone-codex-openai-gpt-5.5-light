import { expect, test } from "@playwright/test";

test("MVP 3 supports authored climbing and gliding traversal", async ({ page }) => {
  await page.goto("/app.html");

  await page.evaluate(() => window.__wildreachTest?.movePlayer(15, 0, -22));
  await page.keyboard.down("e");
  await page.keyboard.down("w");
  await page.waitForTimeout(450);
  await page.keyboard.up("w");
  await page.keyboard.up("e");

  const climbed = await page.evaluate(() => window.__wildreachTest?.player());
  expect(climbed?.position.y).toBeGreaterThan(0);

  await page.evaluate(() => {
    window.__wildreachTest?.unlockGlider();
    window.__wildreachTest?.movePlayer(0, 8, -18);
  });
  await page.keyboard.down(" ");
  await page.waitForTimeout(450);

  const glided = await page.evaluate(() => window.__wildreachTest?.player());
  await page.keyboard.up(" ");
  expect(glided?.mode).toBe("gliding");
  expect(glided?.position.y).toBeLessThan(8);
});
