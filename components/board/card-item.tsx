"use client"

import type { Card } from "@/types/board"
import { Card as UICard } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PRIORITIES } from "@/lib/constants"
import { formatDueDate, isDueDateOverdue, cn } from "@/lib/utils"
import { Calendar, GripVertical } from "lucide-react"

export function CardItem({
  card,
  onClick,
}: {
  card: Card
  onClick?: () => void
}) {
  const priority = PRIORITIES.find((p) => p.value === card.priority)

  return (
    <UICard
      className="group cursor-pointer transition-all duration-150 hover:shadow-md hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className="p-3">
        <div className="mb-1 flex items-start gap-2">
          <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="text-sm font-medium leading-snug">{card.title}</span>
        </div>

        {(card.labels.length > 0 || card.dueDate || priority) && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-6">
            {priority && (
              <Badge variant="outline" className="text-xs">
                <span
                  className={cn("mr-1 inline-block h-2 w-2 rounded-full", priority.color)}
                />
                {priority.label}
              </Badge>
            )}
            {card.labels.map((label) => (
              <Badge
                key={label.id}
                variant="secondary"
                className="text-xs"
                style={{ backgroundColor: label.color + "20", color: label.color }}
              >
                {label.name}
              </Badge>
            ))}
            {card.dueDate && (
              <span
                className={cn(
                  "flex items-center gap-1 text-xs",
                  isDueDateOverdue(card.dueDate)
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              >
                <Calendar className="h-3 w-3" />
                {formatDueDate(card.dueDate)}
              </span>
            )}
          </div>
        )}
      </div>
    </UICard>
  )
}
