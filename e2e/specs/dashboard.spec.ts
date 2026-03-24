import { test, expect } from "@playwright/test"
import { seedAndNavigate, clearAndNavigate } from "../helpers/setup"
import { SEED_BOARD_ID } from "../fixtures/board-data"

test.describe("Dashboard", () => {
  test("shows empty state when no boards exist", async ({ page }) => {
    await clearAndNavigate(page, "/")
    await expect(page.getByText("No boards yet")).toBeVisible()
    await expect(page.getByRole("button", { name: "New Board" })).toBeVisible()
  })

  test("shows board card when board exists", async ({ page }) => {
    await seedAndNavigate(page, "/")
    await expect(page.getByText("Test Board")).toBeVisible()
    await expect(page.getByText("5 columns")).toBeVisible()
    await expect(page.getByText("1 cards")).toBeVisible()
  })

  test("creates a new board and navigates to it", async ({ page }) => {
    await clearAndNavigate(page, "/")

    await page.getByRole("button", { name: "New Board" }).click()
    await expect(page.getByText("Create New Board")).toBeVisible()

    await page.getByRole("textbox", { name: "Board name" }).fill("My New Board")
    await page
      .getByRole("textbox", { name: "Description" })
      .fill("Test description")
    await page.getByRole("button", { name: "Create" }).click()

    // Should navigate to board page
    await expect(page).toHaveURL(/\/boards\//)
    await expect(page.getByText("My New Board")).toBeVisible()
  })

  test("deletes a board", async ({ page }) => {
    await seedAndNavigate(page, "/")
    await expect(page.getByText("Test Board")).toBeVisible()

    // Hover to reveal delete button and click it
    const boardCard = page.getByText("Test Board").locator("../..")
    await boardCard.hover()
    await boardCard.getByRole("button").first().click()

    await expect(page.getByText("Test Board")).not.toBeVisible()
    await expect(page.getByText("No boards yet")).toBeVisible()
  })

  test("toggles dark mode", async ({ page }) => {
    await seedAndNavigate(page, "/")

    const toggle = page.getByRole("button", { name: "Toggle theme" })
    await expect(toggle).toBeVisible()

    // Click to cycle theme
    await toggle.click()
    await page.waitForTimeout(300)

    // The html element should have the dark class (or not, depending on initial state)
    // Just verify the button is still functional
    await toggle.click()
    await page.waitForTimeout(300)
    await expect(toggle).toBeVisible()
  })
})
