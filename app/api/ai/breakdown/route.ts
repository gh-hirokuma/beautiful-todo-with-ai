import { streamText, Output } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"

const taskSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string().describe("Short, actionable task title"),
      description: z
        .string()
        .describe("Clear task description with acceptance criteria"),
      priority: z
        .enum(["low", "medium", "high", "urgent"])
        .describe("Priority based on importance and urgency"),
      suggestedColumn: z
        .string()
        .describe("Which column this task should go into"),
    })
  ),
})

export async function POST(req: Request) {
  const { description, columns } = await req.json()

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    output: Output.object({ schema: taskSchema }),
    system: `You are a project management assistant. Break down feature descriptions into actionable tasks for a Kanban board.
Each task should be specific, measurable, and achievable.
Available columns: ${columns.join(", ")}.
Generate 3-8 tasks depending on complexity. Assign most tasks to the first non-done column (usually "Todo" or "Backlog").`,
    prompt: `Break down this feature into tasks:\n\n${description}`,
  })

  return result.toTextStreamResponse()
}
