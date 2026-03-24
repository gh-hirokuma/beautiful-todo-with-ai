import { test, expect } from "@playwright/test"
import { seedAndNavigate } from "../helpers/setup"
import { SEED_BOARD_ID } from "../fixtures/board-data"

const BOARD_URL = `/boards/${SEED_BOARD_ID}`

test.describe("Board Header", () => {
  test.beforeEach(async ({ page }) => {
    await seedAndNavigate(page, BOARD_URL)
  })

  test("displays board name", async ({ page }) => {
    await expect(page.getByText("Test Board")).toBeVisible()
  })

  test("navigates back to dashboard", async ({ page }) => {
    await page
      .getByRole("button", { name: "Back to dashboard" })
      .click()

    await expect(page).toHaveURL("/")
    await expect(
      page.getByRole("heading", { name: "Beautiful Todo" })
    ).toBeVisible()
  })

  test("edits board name", async ({ page }) => {
    // Click board name to enter edit mode
    await page.getByRole("button", { name: "Test Board" }).click()

    const input = page.getByRole("textbox")
    await input.clear()
    await input.fill("Renamed Board")
    await input.press("Enter")

    await expect(page.getByText("Renamed Board")).toBeVisible()
  })

  test("opens AI Breakdown dialog", async ({ page }) => {
    await page.getByRole("button", { name: "AI Breakdown" }).click()

    await expect(page.getByText("AI Task Breakdown")).toBeVisible()
    await expect(
      page.getByRole("textbox", {
        name: /Describe the feature/i,
      })
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Generate Tasks" })
    ).toBeVisible()
  })

  test("opens Summary panel", async ({ page }) => {
    await page.getByRole("button", { name: "Summary" }).click()

    await expect(page.getByText("Board Summary")).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Generate Summary" })
    ).toBeVisible()
  })

  test("shows AI Generate button in card detail", async ({ page }) => {
    await page.getByText("Test Card").click()

    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(
      page.getByRole("button", { name: "AI Generate" })
    ).toBeVisible()
  })
})
