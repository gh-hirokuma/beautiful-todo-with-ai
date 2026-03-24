"use client"

import { useBoardStore } from "@/lib/board-store"
import { BoardCard } from "@/components/dashboard/board-card"
import { CreateBoardDialog } from "@/components/dashboard/create-board-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { LayoutDashboard } from "lucide-react"

export function BoardGrid() {
  const boards = useBoardStore((s) => s.boards)
  const hydrated = useBoardStore((s) => s.hydrated)

  if (!hydrated) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    )
  }

  if (boards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">No boards yet</h2>
          <p className="mt-1 text-muted-foreground">
            Create your first board to get started.
          </p>
        </div>
        <CreateBoardDialog />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </div>
  )
}
