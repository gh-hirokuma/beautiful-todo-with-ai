"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

export function AIDescriptionButton({
  title,
  boardContext,
  onGenerated,
}: {
  title: string
  boardContext: string
  onGenerated: (description: string) => void
}) {
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!title.trim()) {
      toast.error("Enter a card title first")
      return
    }
    setLoading(true)

    try {
      const res = await fetch("/api/ai/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, boardContext }),
      })

      if (!res.ok) throw new Error("Failed to generate description")

      const text = await res.text()
      onGenerated(text)
      toast.success("Description generated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="gap-1.5 text-xs"
      onClick={handleGenerate}
      disabled={loading || !title.trim()}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Sparkles className="h-3.5 w-3.5" />
      )}
      {loading ? "Generating..." : "AI Generate"}
    </Button>
  )
}
