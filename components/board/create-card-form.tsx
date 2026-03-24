"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBoardStore } from "@/lib/board-store"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"

export function CreateCardForm({
  boardId,
  columnId,
}: {
  boardId: string
  columnId: string
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const createCard = useBoardStore((s) => s.createCard)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    createCard(boardId, columnId, { title: title.trim() })
    setTitle("")
    toast.success("Card created")
  }

  if (!open) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Add card
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title..."
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
  )
}
