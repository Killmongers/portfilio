"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Add imports at the top
import { gsap } from "gsap"
import { useRef, useEffect } from "react"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  // In the ThemeToggle component, add this ref
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Add this useEffect for button animation
  useEffect(() => {
    if (!buttonRef.current) return

    const button = buttonRef.current

    const handleClick = () => {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      })
    }

    button.addEventListener("click", handleClick)

    return () => {
      button.removeEventListener("click", handleClick)
    }
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger ref={buttonRef} asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

