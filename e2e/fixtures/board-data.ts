/**
 * Seed data for E2E tests.
 * Matches the Zustand persist format used by board-store.ts.
 */

export const SEED_BOARD_ID = "test-board-001"
export const SEED_COLUMN_IDS = {
  backlog: "col-backlog",
  todo: "col-todo",
  inProgress: "col-in-progress",
  review: "col-review",
  done: "col-done",
}
export const SEED_CARD_ID = "card-001"

export function createSeedData() {
  const now = new Date().toISOString()

  return {
    state: {
      boards: [
        {
          id: SEED_BOARD_ID,
          name: "Test Board",
          description: "A board for E2E testing",
          labels: [
            { id: "label-1", name: "Bug", color: "#EF4444" },
            { id: "label-2", name: "Feature", color: "#8B5CF6" },
            { id: "label-3", name: "Improvement", color: "#3B82F6" },
            { id: "label-4", name: "Documentation", color: "#10B981" },
            { id: "label-5", name: "Design", color: "#F59E0B" },
          ],
          columns: [
            {
              id: SEED_COLUMN_IDS.backlog,
              title: "Backlog",
              boardId: SEED_BOARD_ID,
              position: 0,
              cards: [],
            },
            {
              id: SEED_COLUMN_IDS.todo,
              title: "Todo",
              boardId: SEED_BOARD_ID,
              position: 1,
              cards: [
                {
                  id: SEED_CARD_ID,
                  title: "Test Card",
                  description: "A card for testing",
                  priority: "medium" as const,
                  labels: [],
                  dueDate: null,
                  assignee: null,
                  columnId: SEED_COLUMN_IDS.todo,
                  boardId: SEED_BOARD_ID,
                  position: 0,
                  createdAt: now,
                  updatedAt: now,
                },
              ],
            },
            {
              id: SEED_COLUMN_IDS.inProgress,
              title: "In Progress",
              boardId: SEED_BOARD_ID,
              position: 2,
              cards: [],
            },
            {
              id: SEED_COLUMN_IDS.review,
              title: "Review",
              boardId: SEED_BOARD_ID,
              position: 3,
              cards: [],
            },
            {
              id: SEED_COLUMN_IDS.done,
              title: "Done",
              boardId: SEED_BOARD_ID,
              position: 4,
              cards: [],
            },
          ],
          createdAt: now,
          updatedAt: now,
        },
      ],
      hydrated: true,
    },
    version: 0,
  }
}

export function createEmptyData() {
  return {
    state: {
      boards: [],
      hydrated: true,
    },
    version: 0,
  }
}
