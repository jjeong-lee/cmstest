import { expect, test } from "@playwright/test";

test.describe("CMS smoke", () => {
  test("loads dashboard and primary navigation", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("Northstar CMS")).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Entries" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Review" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Media" })).toBeVisible();
  });
});
