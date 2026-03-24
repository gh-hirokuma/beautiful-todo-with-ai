"use client"

import { BoardGrid } from "@/components/dashboard/board-grid"
import { CreateBoardDialog } from "@/components/dashboard/create-board-dialog"
import { DarkModeToggle } from "@/components/shared/dark-mode-toggle"
import { useBoardStore } from "@/lib/board-store"
import { Sparkles } from "lucide-react"

export default function Home() {
  const boards = useBoardStore((s) => s.boards)
  const hydrated = useBoardStore((s) => s.hydrated)

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Beautiful Todo</h1>
          </div>
          <div className="flex items-center gap-2">
            {hydrated && boards.length > 0 && <CreateBoardDialog />}
            <DarkModeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <BoardGrid />
      </main>
    </div>
  )
}
