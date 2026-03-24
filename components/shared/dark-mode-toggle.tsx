"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/providers/theme-provider"

export function DarkModeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme()

  function cycle() {
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
    setTheme(next)
  }

  return (
    <Button variant="ghost" size="icon" onClick={cycle} aria-label="Toggle theme">
      {resolvedTheme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  )
}
