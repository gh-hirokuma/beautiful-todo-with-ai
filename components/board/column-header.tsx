"use client"

import { useState } from "react"
import type { Column } from "@/types/board"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBoardStore } from "@/lib/board-store"
import { Check, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function ColumnHeader({
  column,
  boardId,
}: {
  column: Column
  boardId: string
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(column.title)
  const updateColumn = useBoardStore((s) => s.updateColumn)
  const deleteColumn = useBoardStore((s) => s.deleteColumn)

  function handleSave() {
    if (title.trim() && title.trim() !== column.title) {
      updateColumn(boardId, column.id, title.trim())
    }
    setEditing(false)
  }

  function handleDelete() {
    if (column.cards.length > 0) {
      toast.error("Cannot delete a column with cards. Move or delete cards first.")
      return
    }
    deleteColumn(boardId, column.id)
    toast.success("Column deleted")
  }

  return (
    <div className="flex items-center justify-between px-1">
      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
          className="flex flex-1 items-center gap-1"
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-7 text-sm font-semibold"
            autoFocus
            onBlur={handleSave}
          />
          <Button type="submit" size="icon" variant="ghost" className="h-7 w-7">
            <Check className="h-3.5 w-3.5" />
          </Button>
        </form>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {column.cards.length}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="h-7 w-7" />
              }
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  )
}
