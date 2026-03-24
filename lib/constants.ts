import type { Label, Priority } from "@/types/board"

export const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: "urgent", label: "Urgent", color: "bg-red-500" },
  { value: "high", label: "High", color: "bg-orange-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "low", label: "Low", color: "bg-blue-500" },
]

export const DEFAULT_LABELS: Label[] = [
  { id: "label-1", name: "Bug", color: "#EF4444" },
  { id: "label-2", name: "Feature", color: "#8B5CF6" },
  { id: "label-3", name: "Improvement", color: "#3B82F6" },
  { id: "label-4", name: "Documentation", color: "#10B981" },
  { id: "label-5", name: "Design", color: "#F59E0B" },
]

export const DEFAULT_COLUMNS = ["Backlog", "Todo", "In Progress", "Review", "Done"]
