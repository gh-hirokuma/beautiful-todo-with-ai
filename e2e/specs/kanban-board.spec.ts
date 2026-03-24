import { test, expect } from "@playwright/test"
import { seedAndNavigate } from "../helpers/setup"
import { SEED_BOARD_ID } from "../fixtures/board-data"

const BOARD_URL = `/boards/${SEED_BOARD_ID}`

test.describe("Kanban Board", () => {
  test.beforeEach(async ({ page }) => {
    await seedAndNavigate(page, BOARD_URL)
  })

  test("displays all 5 default columns", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Backlog" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Todo" })).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "In Progress" })
    ).toBeVisible()
    await expect(page.getByRole("heading", { name: "Review" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Done" })).toBeVisible()
  })

  test("displays the seed card in Todo column", async ({ page }) => {
    await expect(page.getByText("Test Card")).toBeVisible()
  })

  test("creates a card via inline form", async ({ page }) => {
    // Click Add card in Backlog column (first one)
    await page.getByRole("button", { name: "Add card" }).first().click()
    await page.getByRole("textbox", { name: "Card title..." }).fill("New Task")
    await page.getByRole("textbox", { name: "Card title..." }).press("Enter")

    await expect(page.getByText("New Task")).toBeVisible()
    await expect(page.getByText("Card created")).toBeVisible()
  })

  test("adds a new column", async ({ page }) => {
    await page.getByRole("button", { name: "Add Column" }).click()
    await page.getByRole("textbox", { name: "Column title..." }).fill("Testing")
    // Click the Add button inside the new column form (not the Add card buttons)
    await page
      .getByRole("textbox", { name: "Column title..." })
      .locator("..")
      .locator("..")
      .getByRole("button", { name: "Add", exact: true })
      .click()

    await expect(page.getByRole("heading", { name: "Testing" })).toBeVisible()
    await expect(page.getByText("Column added")).toBeVisible()
  })

  test("shows card count in header", async ({ page }) => {
    await expect(page.getByText("1 cards")).toBeVisible()
  })
})
