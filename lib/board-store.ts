"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Board, Card, Column, Label } from "@/types/board"
import { generateId, nowISO } from "@/lib/utils"
import { DEFAULT_COLUMNS, DEFAULT_LABELS } from "@/lib/constants"

type BoardState = {
  boards: Board[]
  hydrated: boolean
  setHydrated: (value: boolean) => void

  getBoard: (id: string) => Board | undefined
  createBoard: (name: string, description?: string) => Board
  updateBoard: (id: string, data: Partial<Pick<Board, "name" | "description">>) => void
  deleteBoard: (id: string) => void

  createColumn: (boardId: string, title: string) => void
  updateColumn: (boardId: string, columnId: string, title: string) => void
  deleteColumn: (boardId: string, columnId: string) => void
  reorderColumns: (boardId: string, columnIds: string[]) => void

  createCard: (boardId: string, columnId: string, data: Pick<Card, "title"> & Partial<Pick<Card, "description" | "priority" | "labels" | "dueDate" | "assignee">>) => void
  updateCard: (boardId: string, cardId: string, data: Partial<Card>) => void
  deleteCard: (boardId: string, cardId: string) => void
  moveCard: (boardId: string, cardId: string, toColumnId: string, position: number) => void
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boards: [],
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),

      getBoard: (id) => get().boards.find((b) => b.id === id),

      createBoard: (name, description = "") => {
        const now = nowISO()
        const board: Board = {
          id: generateId(),
          name,
          description,
          labels: DEFAULT_LABELS,
          columns: DEFAULT_COLUMNS.map((title, i) => ({
            id: generateId(),
            title,
            boardId: "",
            position: i,
            cards: [],
          })),
          createdAt: now,
          updatedAt: now,
        }
        board.columns = board.columns.map((col) => ({ ...col, boardId: board.id }))
        set((state) => ({ boards: [...state.boards, board] }))
        return board
      },

      updateBoard: (id, data) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === id ? { ...b, ...data, updatedAt: nowISO() } : b
          ),
        })),

      deleteBoard: (id) =>
        set((state) => ({ boards: state.boards.filter((b) => b.id !== id) })),

      createColumn: (boardId, title) =>
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b
            const col: Column = {
              id: generateId(),
              title,
              boardId,
              position: b.columns.length,
              cards: [],
            }
            return { ...b, columns: [...b.columns, col], updatedAt: nowISO() }
          }),
        })),

      updateColumn: (boardId, columnId, title) =>
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b
            return {
              ...b,
              columns: b.columns.map((c) => (c.id === columnId ? { ...c, title } : c)),
              updatedAt: nowISO(),
            }
          }),
        })),

      deleteColumn: (boardId, columnId) =>
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b
            return {
              ...b,
              columns: b.columns.filter((c) => c.id !== columnId),
              updatedAt: nowISO(),
            }
          }),
        })),

      reorderColumns: (boardId, columnIds) =>
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b
            const colMap = new Map(b.columns.map((c) => [c.id, c]))
            const reordered = columnIds
              .map((id, i) => {
                const col = colMap.get(id)
                return col ? { ...col, position: i } : null
              })
              .filter((c): c is Column => c !== null)
            return { ...b, columns: reordered, updatedAt: nowISO() }
          }),
        })),

      createCard: (boardId, columnId, data) =>
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b
            const now = nowISO()
            return {
              ...b,
              columns: b.columns.map((col) => {
                if (col.id !== columnId) return col
                const card: Card = {
                  id: generateId(),
                  title: data.title,
                  description: data.description ?? "",
                  priority: data.priority ?? "medium",
                  labels: data.labels ?? [],
                  dueDate: data.dueDate ?? null,
                  assignee: data.assignee ?? null,
                  columnId,
                  boardId,
                  position: col.cards.length,
                  createdAt: now,
                  updatedAt: now,
                }
                return { ...col, cards: [...col.cards, card] }
              }),
              updatedAt: now,
            }
          }),
        })),

      updateCard: (boardId, cardId, data) =>
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b
            return {
              ...b,
              columns: b.columns.map((col) => ({
                ...col,
                cards: col.cards.map((card) =>
                  card.id === cardId ? { ...card, ...data, updatedAt: nowISO() } : card
                ),
              })),
              updatedAt: nowISO(),
            }
          }),
        })),

      deleteCard: (boardId, cardId) =>
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b
            return {
              ...b,
              columns: b.columns.map((col) => ({
                ...col,
                cards: col.cards.filter((card) => card.id !== cardId),
              })),
              updatedAt: nowISO(),
            }
          }),
        })),

      moveCard: (boardId, cardId, toColumnId, position) =>
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b
            let movedCard: Card | null = null
            const columnsWithout = b.columns.map((col) => {
              const card = col.cards.find((c) => c.id === cardId)
              if (card) movedCard = { ...card, columnId: toColumnId, updatedAt: nowISO() }
              return { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
            })
            if (!movedCard) return b
            const columnsWithCard = columnsWithout.map((col) => {
              if (col.id !== toColumnId) return col
              const cards = [...col.cards]
              cards.splice(position, 0, movedCard!)
              return {
                ...col,
                cards: cards.map((c, i) => ({ ...c, position: i })),
              }
            })
            return { ...b, columns: columnsWithCard, updatedAt: nowISO() }
          }),
        })),
    }),
    {
      name: "board-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
