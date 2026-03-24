"use client"

import { useState } from "react"
import type { Board, Card } from "@/types/board"
import { Column } from "@/components/board/column"
import { CreateColumnForm } from "@/components/board/create-column-form"
import { CardDetailDialog } from "@/components/board/card-detail-dialog"
import { LayoutDashboard } from "lucide-react"

export function BoardView({ board }: { board: Board }) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  function handleCardClick(cardId: string) {
    for (const col of board.columns) {
      const card = col.cards.find((c) => c.id === cardId)
      if (card) {
        setSelectedCard(card)
        return
      }
    }
  }

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
    <>
      <div className="flex flex-1 gap-4 overflow-x-auto p-4">
        {board.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            boardId={board.id}
            onCardClick={handleCardClick}
          />
        ))}
        <CreateColumnForm boardId={board.id} />
      </div>

      {selectedCard && (
        <CardDetailDialog
          card={selectedCard}
          boardId={board.id}
          boardLabels={board.labels}
          open={!!selectedCard}
          onOpenChange={(open) => {
            if (!open) setSelectedCard(null)
          }}
        />
      )}
    </>
  )
}
