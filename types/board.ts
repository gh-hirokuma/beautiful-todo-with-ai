export type Priority = "low" | "medium" | "high" | "urgent"

export type Label = {
  id: string
  name: string
  color: string
}

export type Card = {
  id: string
  title: string
  description: string
  priority: Priority
  labels: Label[]
  dueDate: string | null
  assignee: string | null
  columnId: string
  boardId: string
  position: number
  createdAt: string
  updatedAt: string
}

export type Column = {
  id: string
  title: string
  boardId: string
  position: number
  cards: Card[]
}

export type Board = {
  id: string
  name: string
  description: string
  columns: Column[]
  labels: Label[]
  createdAt: string
  updatedAt: string
}

export type AITaskBreakdown = {
  title: string
  description: string
  priority: Priority
  suggestedColumn: string
}

export type AIBoardSummary = {
  overview: string
  blockers: string[]
  completedCount: number
  inProgressCount: number
  suggestions: string[]
}
