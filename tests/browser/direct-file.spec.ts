import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

test("direct file bundle renders the game shell without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(pathToFileURL(resolve("file-dist/index.html")).href);
  await expect(page.locator("#status-line")).toContainText("Find the tower");
  await expect(page.locator("#game-canvas")).toBeVisible();
  expect(errors).toEqual([]);
});

test("root index opens directly from file protocol", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(pathToFileURL(resolve("index.html")).href);
  await expect(page.locator("#status-line")).toContainText("Find the tower");
  await expect(page.locator("#game-canvas")).toBeVisible();
  expect(errors).toEqual([]);
});
