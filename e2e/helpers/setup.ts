import { type Page } from "@playwright/test"
import { createSeedData, createEmptyData } from "../fixtures/board-data"

const STORAGE_KEY = "board-storage"

/**
 * Seed localStorage with test board data, then navigate to the given path.
 * Uses addInitScript to inject data BEFORE the page loads, ensuring
 * Zustand hydrates from the seeded data.
 */
export async function seedAndNavigate(
  page: Page,
  path: string,
  options: { empty?: boolean } = {}
) {
  const data = options.empty ? createEmptyData() : createSeedData()
  const serialized = JSON.stringify(data)

  // Inject localStorage before any page script runs
  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      localStorage.setItem(key, value)
    },
    { key: STORAGE_KEY, value: serialized }
  )

  await page.goto(path)
  // Wait for Zustand hydration
  await page.waitForTimeout(1000)
}

/**
 * Clear localStorage and navigate to the given path.
 */
export async function clearAndNavigate(page: Page, path: string) {
  // Inject localStorage clear before any page script runs
  await page.addInitScript(() => {
    localStorage.clear()
  })

  await page.goto(path)
  // Wait for Zustand hydration
  await page.waitForTimeout(1000)
}
