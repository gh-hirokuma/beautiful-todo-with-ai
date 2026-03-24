"use client"

import { useEffect, useState } from "react"
import type { Card, Label, Priority } from "@/types/board"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useBoardStore } from "@/lib/board-store"
import { PRIORITIES } from "@/lib/constants"
import { cn, formatDueDate, isDueDateOverdue } from "@/lib/utils"
import { CalendarIcon, Trash2, X } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

export function CardDetailDialog({
  card,
  boardId,
  boardLabels,
  open,
  onOpenChange,
}: {
  card: Card
  boardId: string
  boardLabels: Label[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description)
  const [priority, setPriority] = useState<Priority>(card.priority)
  const [selectedLabels, setSelectedLabels] = useState<Label[]>(card.labels)
  const [dueDate, setDueDate] = useState<Date | undefined>(
    card.dueDate ? new Date(card.dueDate) : undefined
  )

  const updateCard = useBoardStore((s) => s.updateCard)
  const deleteCard = useBoardStore((s) => s.deleteCard)

  useEffect(() => {
    setTitle(card.title)
    setDescription(card.description)
    setPriority(card.priority)
    setSelectedLabels(card.labels)
    setDueDate(card.dueDate ? new Date(card.dueDate) : undefined)
  }, [card])

  function handleSave() {
    updateCard(boardId, card.id, {
      title: title.trim() || card.title,
      description,
      priority,
      labels: selectedLabels,
      dueDate: dueDate ? dueDate.toISOString() : null,
    })
    toast.success("Card updated")
    onOpenChange(false)
  }

  function handleDelete() {
    deleteCard(boardId, card.id)
    toast.success("Card deleted")
    onOpenChange(false)
  }

  function toggleLabel(label: Label) {
    setSelectedLabels((prev) =>
      prev.some((l) => l.id === label.id)
        ? prev.filter((l) => l.id !== label.id)
        : [...prev, label]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="sr-only">Edit Card</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold"
            placeholder="Card title"
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={4}
          />

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <span className="flex items-center gap-2">
                        <span className={cn("inline-block h-2 w-2 rounded-full", p.color)} />
                        {p.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Due Date</label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button variant="outline" className={cn("justify-start text-left font-normal", !dueDate && "text-muted-foreground")} />
                  }
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "MMM d, yyyy") : "Pick a date"}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                  />
                  {dueDate && (
                    <div className="border-t p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setDueDate(undefined)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Labels</label>
            <div className="flex flex-wrap gap-2">
              {boardLabels.map((label) => {
                const isSelected = selectedLabels.some((l) => l.id === label.id)
                return (
                  <Badge
                    key={label.id}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    style={
                      isSelected
                        ? { backgroundColor: label.color, borderColor: label.color }
                        : { borderColor: label.color, color: label.color }
                    }
                    onClick={() => toggleLabel(label)}
                  >
                    {label.name}
                  </Badge>
                )
              })}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Card
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
