"use client"

import Link from "next/link"
import type { Board } from "@/types/board"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { LayoutDashboard } from "lucide-react"

export function BoardCard({ board }: { board: Board }) {
  const totalCards = board.columns.reduce((sum, col) => sum + col.cards.length, 0)
  const doneCards = board.columns
    .filter((col) => col.title.toLowerCase() === "done")
    .reduce((sum, col) => sum + col.cards.length, 0)

  return (
    <Link href={`/boards/${board.id}`}>
      <Card className="group relative h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <CardHeader className="relative">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-xs">
              {format(new Date(board.updatedAt), "MMM d, yyyy")}
            </span>
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
                {doneCards}/{totalCards} done
              </span>
            )}
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}
