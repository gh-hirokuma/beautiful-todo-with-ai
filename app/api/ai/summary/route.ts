import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export async function POST(req: Request) {
  const { board } = await req.json()

  const columnSummaries = board.columns
    .map(
      (col: { title: string; cards: { title: string; priority: string }[] }) =>
        `${col.title} (${col.cards.length} cards): ${col.cards.map((c: { title: string }) => c.title).join(", ") || "empty"}`
    )
    .join("\n")

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: `You are a project management assistant. Analyze Kanban boards and provide concise status reports.
Include: overview, progress, potential blockers, and suggestions. Keep it brief and actionable.`,
    prompt: `Analyze this Kanban board "${board.name}":\n\n${columnSummaries}`,
  })

  return result.toTextStreamResponse()
}
