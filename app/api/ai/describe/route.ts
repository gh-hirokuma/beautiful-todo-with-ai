import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export async function POST(req: Request) {
  const { title, boardContext } = await req.json()

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: `You are a project management assistant. Write clear, actionable task descriptions for Kanban cards.
Keep descriptions concise (2-4 sentences). Include what needs to be done and any relevant acceptance criteria.`,
    prompt: `Write a task description for this card:\n\nTitle: ${title}\nProject context: ${boardContext}`,
  })

  return result.toTextStreamResponse()
}
