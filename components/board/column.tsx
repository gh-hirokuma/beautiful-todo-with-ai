"use client"

import type { Column as ColumnType } from "@/types/board"
import { ColumnHeader } from "@/components/board/column-header"
import { CardItem } from "@/components/board/card-item"
import { CreateCardForm } from "@/components/board/create-card-form"

export function Column({
  column,
  boardId,
  onCardClick,
}: {
  column: ColumnType
  boardId: string
  onCardClick?: (cardId: string) => void
}) {
  return (
    <div className="flex h-full w-72 shrink-0 flex-col rounded-xl border bg-card">
      <div className="p-3 pb-2">
        <ColumnHeader column={column} boardId={boardId} />
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-2">
        {column.cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onClick={() => onCardClick?.(card.id)}
          />
        ))}
      </div>
      <div className="p-3 pt-1">
        <CreateCardForm boardId={boardId} columnId={column.id} />
      </div>
    </div>
  )
}
