import { test, expect } from "@playwright/test"

test.describe("Data Persistence", () => {
  test.beforeEach(async ({ page }) => {
    // Clear any previous state - go to page first, then clear
    await page.goto("/")
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForTimeout(1000)
  })

  test("board persists after page reload", async ({ page }) => {
    // Create a board via UI
    await page.getByRole("button", { name: "New Board" }).click()
    await page
      .getByRole("textbox", { name: "Board name" })
      .fill("Persistent Board")
    await page.getByRole("button", { name: "Create" }).click()
    await expect(page).toHaveURL(/\/boards\//)

    // Go back to dashboard
    await page.getByRole("button", { name: "Back to dashboard" }).click()
    await expect(page.getByText("Persistent Board")).toBeVisible()

    // Reload the page
    await page.reload()
    await page.waitForTimeout(1000)

    // Board should still be there
    await expect(page.getByText("Persistent Board")).toBeVisible()
  })

  test("card persists after page reload", async ({ page }) => {
    // Create board via UI
    await page.getByRole("button", { name: "New Board" }).click()
    await page
      .getByRole("textbox", { name: "Board name" })
      .fill("Card Test Board")
    await page.getByRole("button", { name: "Create" }).click()
    await expect(page).toHaveURL(/\/boards\//)

    // Add a card
    await page.getByRole("button", { name: "Add card" }).first().click()
    await page
      .getByRole("textbox", { name: "Card title..." })
      .fill("Persistent Card")
    await page
      .getByRole("textbox", { name: "Card title..." })
      .press("Enter")
    await expect(page.getByText("Persistent Card")).toBeVisible()

    // Reload
    await page.reload()
    await page.waitForTimeout(1000)

    // Card should still be there
    await expect(page.getByText("Persistent Card")).toBeVisible()
  })

  test("board deletion persists after reload", async ({ page }) => {
    // Create board via UI
    await page.getByRole("button", { name: "New Board" }).click()
    await page
      .getByRole("textbox", { name: "Board name" })
      .fill("Delete Me Board")
    await page.getByRole("button", { name: "Create" }).click()

    // Go back and delete
    await page.getByRole("button", { name: "Back to dashboard" }).click()

    const boardCard = page.getByText("Delete Me Board").locator("../..")
    await boardCard.hover()
    await boardCard.getByRole("button").first().click()

    await expect(page.getByText("No boards yet")).toBeVisible()

    // Reload
    await page.reload()
    await page.waitForTimeout(1000)

    // Should still be empty
    await expect(page.getByText("No boards yet")).toBeVisible()
  })
})
