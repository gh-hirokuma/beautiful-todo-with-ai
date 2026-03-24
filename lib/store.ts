import type { Board, Card, Column } from "@/types/board"

export type BoardRepository = {
  getBoards(): Board[]
  getBoard(id: string): Board | null
  createBoard(data: Omit<Board, "id" | "createdAt" | "updatedAt">): Board
  updateBoard(id: string, data: Partial<Board>): Board | null
  deleteBoard(id: string): void

  createColumn(boardId: string, data: Pick<Column, "title">): Column
  updateColumn(boardId: string, columnId: string, data: Partial<Pick<Column, "title">>): Column | null
  deleteColumn(boardId: string, columnId: string): void
  reorderColumns(boardId: string, columnIds: string[]): void

  createCard(boardId: string, columnId: string, data: Pick<Card, "title" | "description" | "priority" | "labels" | "dueDate" | "assignee">): Card
  updateCard(boardId: string, cardId: string, data: Partial<Card>): Card | null
  deleteCard(boardId: string, cardId: string): void
  moveCard(boardId: string, cardId: string, toColumnId: string, position: number): void
}
