import { test, expect } from "@playwright/test"
import { seedAndNavigate } from "../helpers/setup"
import { SEED_BOARD_ID } from "../fixtures/board-data"

const BOARD_URL = `/boards/${SEED_BOARD_ID}`

test.describe("Card Detail", () => {
  test.beforeEach(async ({ page }) => {
    await seedAndNavigate(page, BOARD_URL)
  })

  test("opens card detail dialog on click", async ({ page }) => {
    await page.getByText("Test Card").click()

    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(
      page.getByRole("textbox", { name: "Card title" })
    ).toHaveValue("Test Card")
  })

  test("edits card title and saves", async ({ page }) => {
    await page.getByText("Test Card").click()

    const titleInput = page.getByRole("textbox", { name: "Card title" })
    await titleInput.clear()
    await titleInput.fill("Updated Card Title")
    await page.getByRole("button", { name: "Save" }).click()

    await expect(page.getByText("Card updated")).toBeVisible()
    await expect(page.getByText("Updated Card Title")).toBeVisible()
  })

  test("edits description and saves", async ({ page }) => {
    await page.getByText("Test Card").click()

    const descInput = page.getByRole("textbox", { name: /description/i })
    await descInput.clear()
    await descInput.fill("New description text")
    await page.getByRole("button", { name: "Save" }).click()

    await expect(page.getByText("Card updated")).toBeVisible()
  })

  test("selects a label and saves", async ({ page }) => {
    await page.getByText("Test Card").click()

    // Click a label to select it
    await page.getByText("Bug", { exact: true }).click()
    await page.getByRole("button", { name: "Save" }).click()

    await expect(page.getByText("Card updated")).toBeVisible()
    // Verify label shows on card after dialog closes
    // The card should now display the "Bug" label
  })

  test("deletes a card", async ({ page }) => {
    await page.getByText("Test Card").click()
    await page.getByRole("button", { name: "Delete Card" }).click()

    await expect(page.getByText("Card deleted")).toBeVisible()
    await expect(page.getByText("Test Card")).not.toBeVisible()
  })
})
