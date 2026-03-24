import { type Page } from "@playwright/test"
import { createSeedData, createEmptyData } from "../fixtures/board-data"

const STORAGE_KEY = "board-storage"

/**
 * Seed localStorage with test board data, then navigate to the given path.
 * Must be called before interacting with the page.
 */
export async function seedAndNavigate(
  page: Page,
  path: string,
  options: { empty?: boolean } = {}
) {
  // Navigate first to set the origin for localStorage
  await page.goto("/")
  const data = options.empty ? createEmptyData() : createSeedData()
  await page.evaluate(
    ([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    [STORAGE_KEY, data] as const
  )
  // Navigate to the target path to pick up the seeded data
  await page.goto(path)
  // Wait for hydration
  await page.waitForTimeout(500)
}

/**
 * Clear localStorage and navigate to the given path.
 */
export async function clearAndNavigate(page: Page, path: string) {
  await page.goto("/")
  await page.evaluate(() => localStorage.clear())
  await page.goto(path)
  await page.waitForTimeout(500)
}
