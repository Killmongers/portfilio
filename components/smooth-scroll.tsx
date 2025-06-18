"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin)
}

export function SmoothScroll() {
  useEffect(() => {
    // Enable smooth scrolling for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement
      const href = target.getAttribute("href")

      if (href && href.startsWith("#")) {
        e.preventDefault()
        const targetElement = document.querySelector(href)

        if (targetElement) {
          gsap.to(window, {
            duration: 1,
            scrollTo: {
              y: targetElement,
              offsetY: 80, // Account for fixed header
            },
            ease: "power2.inOut",
          })
        }
      }
    }

    // Add event listeners to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]')
    anchorLinks.forEach((link) => {
      link.addEventListener("click", handleAnchorClick)
    })

    return () => {
      anchorLinks.forEach((link) => {
        link.removeEventListener("click", handleAnchorClick)
      })
    }
  }, [])

  return null
}

