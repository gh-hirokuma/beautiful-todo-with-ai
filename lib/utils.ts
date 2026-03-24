import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isPast, isToday, isTomorrow } from "date-fns"
import { nanoid } from "nanoid"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return nanoid()
}

export function formatDueDate(dateString: string): string {
  const date = new Date(dateString)
  if (isToday(date)) return "Today"
  if (isTomorrow(date)) return "Tomorrow"
  return format(date, "MMM d")
}

export function isDueDateOverdue(dateString: string): boolean {
  return isPast(new Date(dateString)) && !isToday(new Date(dateString))
}

export function nowISO(): string {
  return new Date().toISOString()
}
