import { expect, test } from "@playwright/test";

test.describe("CMS smoke", () => {
  test("loads admin navigation and portal entry points", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("Northstar")).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Content" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Attachments" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Operations" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Governance" })).toBeVisible();

    await page.goto("/portal");
    await expect(page.getByText("Northstar Portal")).toBeVisible();
    await expect(page.getByRole("link", { name: "Search" })).toBeVisible();
  });
});
