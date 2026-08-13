import { expect, test } from "@playwright/test";

test("open home page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/BaseApp/i);
});
