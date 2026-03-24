"use client"

import type { Column as ColumnType } from "@/types/board"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { ColumnHeader } from "@/components/board/column-header"
import { CardItem } from "@/components/board/card-item"
import { CreateCardForm } from "@/components/board/create-card-form"
import { cn } from "@/lib/utils"

export function Column({
  column,
  boardId,
  onCardClick,
}: {
  column: ColumnType
  boardId: string
  onCardClick?: (cardId: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", column },
  })

  return (
    <div
      className={cn(
        "flex h-full w-72 shrink-0 flex-col rounded-xl border bg-card transition-colors",
        isOver && "border-primary/50 bg-primary/5"
      )}
    >
      <div className="p-3 pb-2">
        <ColumnHeader column={column} boardId={boardId} />
      </div>
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-2"
      >
        <SortableContext
          items={column.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onClick={() => onCardClick?.(card.id)}
            />
          ))}
        </SortableContext>
      </div>
      <div className="p-3 pt-1">
        <CreateCardForm boardId={boardId} columnId={column.id} />
      </div>
    </div>
  )
}
