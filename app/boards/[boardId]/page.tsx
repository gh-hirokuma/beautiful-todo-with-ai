"use client"

import { use } from "react"
import { useBoardStore } from "@/lib/board-store"
import { BoardView } from "@/components/board/board-view"
import { BoardHeader } from "@/components/board/board-header"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>
}) {
  const { boardId } = use(params)
  const board = useBoardStore((s) => s.getBoard(boardId))
  const hydrated = useBoardStore((s) => s.hydrated)

  if (!hydrated) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="border-b px-4 py-3">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex flex-1 gap-4 overflow-x-auto p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-96 w-72 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!board) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Board not found</h2>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <BoardHeader board={board} />
      <BoardView board={board} />
    </div>
  )
}
