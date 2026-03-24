"use client"

import Link from "next/link"
import type { Board } from "@/types/board"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBoardStore } from "@/lib/board-store"
import { format } from "date-fns"
import { LayoutDashboard, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function BoardCard({ board }: { board: Board }) {
  const deleteBoard = useBoardStore((s) => s.deleteBoard)
  const totalCards = board.columns.reduce((sum, col) => sum + col.cards.length, 0)
  const doneCards = board.columns
    .filter((col) => col.title.toLowerCase() === "done")
    .reduce((sum, col) => sum + col.cards.length, 0)
  const progress = totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    deleteBoard(board.id)
    toast.success("Board deleted")
  }

  return (
    <Link href={`/boards/${board.id}`}>
      <Card className="group relative h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <CardHeader className="relative">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-xs">
                {format(new Date(board.updatedAt), "MMM d, yyyy")}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <CardTitle className="text-lg">{board.name}</CardTitle>
          {board.description && (
            <CardDescription className="line-clamp-2">
              {board.description}
            </CardDescription>
          )}
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span>{board.columns.length} columns</span>
            <span>{totalCards} cards</span>
            {totalCards > 0 && (
              <span className="text-green-600 dark:text-green-400">
                {progress}%
              </span>
            )}
          </div>
          {totalCards > 0 && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </CardHeader>
      </Card>
    </Link>
  )
}
