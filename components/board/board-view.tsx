"use client"

import type { Board } from "@/types/board"
import { Column } from "@/components/board/column"
import { CreateColumnForm } from "@/components/board/create-column-form"
import { LayoutDashboard } from "lucide-react"

export function BoardView({ board }: { board: Board }) {
  if (board.columns.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">No columns yet</h2>
          <p className="mt-1 text-muted-foreground">Add a column to get started.</p>
        </div>
        <CreateColumnForm boardId={board.id} />
      </div>
    )
  }

  return (
    <div className="flex flex-1 gap-4 overflow-x-auto p-4">
      {board.columns.map((column) => (
        <Column key={column.id} column={column} boardId={board.id} />
      ))}
      <CreateColumnForm boardId={board.id} />
    </div>
  )
}
