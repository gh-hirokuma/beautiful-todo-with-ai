"use client"

import { useCallback, useState } from "react"
import type { Board, Card } from "@/types/board"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import { Column } from "@/components/board/column"
import { CreateColumnForm } from "@/components/board/create-column-form"
import { CardDetailDialog } from "@/components/board/card-detail-dialog"
import { CardItem } from "@/components/board/card-item"
import { useBoardStore } from "@/lib/board-store"
import { LayoutDashboard } from "lucide-react"

export function BoardView({ board }: { board: Board }) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const moveCard = useBoardStore((s) => s.moveCard)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  function handleCardClick(cardId: string) {
    for (const col of board.columns) {
      const card = col.cards.find((c) => c.id === cardId)
      if (card) {
        setSelectedCard(card)
        return
      }
    }
  }

  function findColumnByCardId(cardId: string) {
    return board.columns.find((col) => col.cards.some((c) => c.id === cardId))
  }

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event
      if (active.data.current?.type === "card") {
        setActiveCard(active.data.current.card)
      }
    },
    []
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveCard(null)

      if (!over) return
      if (active.id === over.id) return

      const activeCardData = active.data.current
      if (activeCardData?.type !== "card") return

      const cardId = active.id as string
      let targetColumnId: string
      let targetPosition: number

      if (over.data.current?.type === "column") {
        // Dropped on a column directly
        targetColumnId = over.id as string
        const targetColumn = board.columns.find((c) => c.id === targetColumnId)
        targetPosition = targetColumn?.cards.length ?? 0
      } else if (over.data.current?.type === "card") {
        // Dropped on another card
        const overColumn = findColumnByCardId(over.id as string)
        if (!overColumn) return
        targetColumnId = overColumn.id
        targetPosition = overColumn.cards.findIndex((c) => c.id === over.id)
        if (targetPosition === -1) targetPosition = overColumn.cards.length
      } else {
        return
      }

      moveCard(board.id, cardId, targetColumnId, targetPosition)
    },
    [board, moveCard]
  )

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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
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

        <DragOverlay>
          {activeCard && (
            <div className="w-72 rotate-3 opacity-90">
              <CardItem card={activeCard} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

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
