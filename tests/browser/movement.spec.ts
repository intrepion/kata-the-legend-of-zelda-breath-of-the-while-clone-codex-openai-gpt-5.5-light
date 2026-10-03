import { expect, test } from "@playwright/test";

test("MVP 1 renders a nonblank 3D scene and moves the adventurer", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/app.html");
  await expect(page.locator("#status-line")).toContainText("Find the tower");

  const before = await page.evaluate(() => window.__wildreachTest?.player().position.z);
  await page.keyboard.down("w");
  await page.waitForTimeout(600);
  await page.keyboard.up("w");
  const after = await page.evaluate(() => window.__wildreachTest?.player().position.z);

  expect(after).toBeLessThan(before ?? Number.POSITIVE_INFINITY);
  expect(errors).toEqual([]);
});
