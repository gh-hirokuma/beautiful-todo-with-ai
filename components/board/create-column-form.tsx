"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBoardStore } from "@/lib/board-store"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"

export function CreateColumnForm({ boardId }: { boardId: string }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const createColumn = useBoardStore((s) => s.createColumn)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    createColumn(boardId, title.trim())
    setTitle("")
    setOpen(false)
    toast.success("Column added")
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        className="h-auto w-72 shrink-0 justify-start gap-2 border-dashed py-3"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Add Column
      </Button>
    )
  }

  return (
    <div className="w-72 shrink-0 rounded-xl border bg-card p-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Column title..."
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false)
              setTitle("")
            }
          }}
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={!title.trim()}>
            Add
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setOpen(false)
              setTitle("")
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
