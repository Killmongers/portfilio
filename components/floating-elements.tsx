"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { usePortfolioData } from "@/hooks/use-portfolio-data"

export function FloatingElements() {
  const { data } = usePortfolioData()
  const containerRef = useRef<HTMLDivElement>(null)

  // Check if floating elements should be shown
  const showFloatingElements = data?.themeSettings?.showFloatingElements !== false

  useEffect(() => {
    if (!containerRef.current || !showFloatingElements) return

    const elements = containerRef.current.children

    // Create floating animation for each element
    Array.from(elements).forEach((element, index) => {
      gsap.to(element, {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        rotation: "random(-5, 5)",
        duration: "random(3, 6)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.5,
      })
    })
  }, [showFloatingElements])

  if (!showFloatingElements) {
    return null
  }

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500/20 rounded-full"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-purple-500/20 rotate-45"></div>
      <div className="absolute bottom-40 left-20 w-5 h-5 bg-green-500/20 rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-3 h-3 bg-yellow-500/20 rotate-45"></div>
      <div className="absolute top-60 left-1/2 w-4 h-4 bg-pink-500/20 rounded-full"></div>
      <div className="absolute top-80 right-1/3 w-5 h-5 bg-indigo-500/20 rotate-45"></div>
    </div>
  )
}

