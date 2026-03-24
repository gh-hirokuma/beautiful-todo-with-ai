"use client"

import { useState } from "react"
import type { Board } from "@/types/board"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

export function AISummaryPanel({ board }: { board: Board }) {
  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    setSummary("")

    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board }),
      })

      if (!res.ok) throw new Error("Failed to generate summary")

      const text = await res.text()
      setSummary(text)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="outline" size="sm" className="gap-2" />}
      >
        <BarChart3 className="h-4 w-4" />
        Summary
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Board Summary</SheetTitle>
          <SheetDescription>
            AI-generated analysis of your board&apos;s current state.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Analyzing..." : "Generate Summary"}
          </Button>

          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}

          {summary && (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-lg border bg-muted/50 p-4">
              {summary}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
