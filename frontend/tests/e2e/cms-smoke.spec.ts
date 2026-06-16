import { expect, test } from "@playwright/test";

test.describe("CMS smoke", () => {
  test("loads admin navigation and portal entry points", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("Northstar")).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "콘텐츠 Content" })).toBeVisible();
    await expect(page.getByRole("link", { name: "첨부 Attachments" })).toBeVisible();
    await expect(page.getByRole("link", { name: "운영 Operations" })).toBeVisible();
    await expect(page.getByRole("link", { name: "거버넌스 Governance" })).toBeVisible();

    await page.goto("/portal");
    await expect(page.getByText("Northstar Portal")).toBeVisible();
    await expect(page.getByRole("link", { name: "검색 Search" })).toBeVisible();
  });
});
