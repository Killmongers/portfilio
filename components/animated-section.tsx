"use client"

import { useScrollAnimation } from "@/hooks/use-gsap-animations"
import type { ReactNode } from "react"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  id?: string
}

export function AnimatedSection({ children, className = "", id }: AnimatedSectionProps) {
  const sectionRef = useScrollAnimation()

  return (
    <section
      ref={sectionRef}
      className={`${className} opacity-100`}
      id={id}
      style={{ opacity: 1, transform: "translateY(0)" }}
    >
      {children}
    </section>
  )
}

