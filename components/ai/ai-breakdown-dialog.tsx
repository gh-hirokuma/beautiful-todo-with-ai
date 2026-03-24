"use client"

import { useState } from "react"
import type { Board } from "@/types/board"
import type { AITaskBreakdown } from "@/types/board"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useBoardStore } from "@/lib/board-store"
import { PRIORITIES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Check, Loader2, Sparkles, X } from "lucide-react"
import { toast } from "sonner"

export function AIBreakdownDialog({ board }: { board: Board }) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [tasks, setTasks] = useState<(AITaskBreakdown & { selected: boolean })[]>([])
  const [loading, setLoading] = useState(false)
  const createCard = useBoardStore((s) => s.createCard)

  async function handleGenerate() {
    if (!description.trim()) return
    setLoading(true)
    setTasks([])

    try {
      const res = await fetch("/api/ai/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          columns: board.columns.map((c) => c.title),
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to generate tasks")
      }

      const text = await res.text()
      try {
        const parsed = JSON.parse(text)
        const generated = (parsed.tasks || []).map((t: AITaskBreakdown) => ({
          ...t,
          selected: true,
        }))
        setTasks(generated)
      } catch {
        throw new Error("Failed to parse AI response")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function toggleTask(index: number) {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, selected: !t.selected } : t))
    )
  }

  function handleAddSelected() {
    const selectedTasks = tasks.filter((t) => t.selected)
    for (const task of selectedTasks) {
      const column = board.columns.find(
        (c) => c.title.toLowerCase() === task.suggestedColumn.toLowerCase()
      ) || board.columns[0]
      if (column) {
        createCard(board.id, column.id, {
          title: task.title,
          description: task.description,
          priority: task.priority,
        })
      }
    }
    toast.success(`Added ${selectedTasks.length} cards`)
    setOpen(false)
    setDescription("")
    setTasks([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" size="sm" className="gap-2" />}
      >
        <Sparkles className="h-4 w-4" />
        AI Breakdown
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Task Breakdown</DialogTitle>
          <DialogDescription>
            Describe a feature and AI will generate actionable tasks for your board.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the feature you want to break down..."
            rows={4}
            disabled={loading}
          />

          <Button
            onClick={handleGenerate}
            disabled={!description.trim() || loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Generating..." : "Generate Tasks"}
          </Button>

          {loading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          )}

          {tasks.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium">
                Generated {tasks.length} tasks ({tasks.filter((t) => t.selected).length} selected)
              </div>
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {tasks.map((task, i) => {
                  const priority = PRIORITIES.find((p) => p.value === task.priority)
                  return (
                    <div
                      key={i}
                      className={cn(
                        "cursor-pointer rounded-lg border p-3 transition-colors",
                        task.selected
                          ? "border-primary/50 bg-primary/5"
                          : "opacity-50"
                      )}
                      onClick={() => toggleTask(i)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                                task.selected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-muted-foreground"
                              )}
                            >
                              {task.selected && <Check className="h-3 w-3" />}
                            </div>
                            <span className="text-sm font-medium">{task.title}</span>
                          </div>
                          <p className="mt-1 pl-7 text-xs text-muted-foreground">
                            {task.description}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          {priority && (
                            <Badge variant="outline" className="text-xs">
                              <span
                                className={cn(
                                  "mr-1 inline-block h-2 w-2 rounded-full",
                                  priority.color
                                )}
                              />
                              {priority.label}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {task.suggestedColumn}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {tasks.length > 0 && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setTasks([])}>
              Clear
            </Button>
            <Button
              onClick={handleAddSelected}
              disabled={tasks.filter((t) => t.selected).length === 0}
            >
              Add {tasks.filter((t) => t.selected).length} Cards
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
