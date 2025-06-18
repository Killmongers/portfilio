"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import { getAvatarText } from "@/lib/avatar-utils"

export function LoadingAnimation() {
  const { data } = usePortfolioData()
  const loaderRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)

  // Get avatar from portfolio data, fallback to "AK"
  const avatar = data?.personalInfo?.avatar || "AK"

  useEffect(() => {
    if (!loaderRef.current || !dotsRef.current) return

    const dots = dotsRef.current.children

    // Animate dots
    gsap.to(dots, {
      scale: 1.5,
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.2,
      repeat: -1,
      yoyo: true,
    })

    // Fade out loader after 2 seconds
    gsap.to(loaderRef.current, {
      opacity: 0,
      duration: 0.5,
      delay: 2,
      onComplete: () => {
        if (loaderRef.current) {
          loaderRef.current.style.display = "none"
        }
      },
    })
  }, [])

  return (
    <div ref={loaderRef} className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {getAvatarText(data?.personalInfo?.avatar, data?.personalInfo?.name)}
          </div>
        </div>
        <div ref={dotsRef} className="flex space-x-2 justify-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
        <p className="mt-4 text-slate-600 dark:text-slate-300">Loading Portfolio...</p>
      </div>
    </div>
  )
}

