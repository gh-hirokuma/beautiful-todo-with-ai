"use client"

import { useState } from "react"
import type { Board } from "@/types/board"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DarkModeToggle } from "@/components/shared/dark-mode-toggle"
import { useBoardStore } from "@/lib/board-store"
import { AIBreakdownDialog } from "@/components/ai/ai-breakdown-dialog"
import { AISummaryPanel } from "@/components/ai/ai-summary-panel"
import { ArrowLeft, Check, Pencil, Sparkles } from "lucide-react"
import Link from "next/link"

export function BoardHeader({ board }: { board: Board }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(board.name)
  const updateBoard = useBoardStore((s) => s.updateBoard)

  function handleSave() {
    if (name.trim() && name.trim() !== board.name) {
      updateBoard(board.id, { name: name.trim() })
    }
    setEditing(false)
  }

  return (
    <header className="flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur-sm">
      <Link href="/">
        <Button variant="ghost" size="icon" aria-label="Back to dashboard">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>

      <Sparkles className="h-5 w-5 text-primary" />

      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 text-lg font-semibold"
            autoFocus
            onBlur={handleSave}
          />
          <Button type="submit" size="icon" variant="ghost">
            <Check className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="group flex items-center gap-2 text-lg font-semibold hover:text-primary"
        >
          {board.name}
          <Pencil className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {board.columns.reduce((sum, col) => sum + col.cards.length, 0)} cards
        </span>
        <AIBreakdownDialog board={board} />
        <AISummaryPanel board={board} />
        <DarkModeToggle />
      </div>
    </header>
  )
}
