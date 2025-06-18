"use client"

import { useEffect, useRef, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function useScrollAnimation() {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current

    try {
      // Set initial state
      gsap.set(element, { opacity: 0, y: 50 })

      const animation = gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            gsap.to(element, { opacity: 1, y: 0, duration: 0.8 })
          },
          onLeave: () => {
            gsap.to(element, { opacity: 1, y: 0, duration: 0.3 })
          },
          onEnterBack: () => {
            gsap.to(element, { opacity: 1, y: 0, duration: 0.8 })
          },
        },
      })

      return () => {
        animation.kill()
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    } catch (error) {
      console.warn("GSAP ScrollTrigger error:", error)
      // Fallback: make element visible
      if (element) {
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }
    }
  }, [])

  return elementRef
}

export function useStaggerAnimation(delay = 0.1) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const children = Array.from(container.children)

    if (children.length === 0) return

    try {
      // Set initial state for all children
      gsap.set(children, { opacity: 0, y: 30 })

      const animation = gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: delay,
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            gsap.to(children, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: delay,
              ease: "power2.out",
            })
          },
        },
      })

      return () => {
        animation.kill()
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    } catch (error) {
      console.warn("GSAP stagger animation error:", error)
      // Fallback: make children visible
      children.forEach((child) => {
        if (child instanceof HTMLElement) {
          child.style.opacity = "1"
          child.style.transform = "translateY(0)"
        }
      })
    }
  }, [delay])

  return containerRef
}

export function useProgressAnimation() {
  const progressRef = useRef<HTMLDivElement>(null)

  const animateProgress = useCallback((value: number) => {
    if (!progressRef.current) return

    const indicator = progressRef.current.querySelector("[data-progress-indicator]")
    if (!indicator) return

    try {
      // Set initial state
      gsap.set(indicator, { width: "0%" })

      gsap.to(indicator, {
        width: `${value}%`,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: progressRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    } catch (error) {
      console.warn("GSAP progress animation error:", error)
      // Fallback: set width directly
      if (indicator instanceof HTMLElement) {
        indicator.style.width = `${value}%`
      }
    }
  }, [])

  return { progressRef, animateProgress }
}

export function useHoverAnimation() {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current

    try {
      // Ensure element starts at normal state
      gsap.set(element, { scale: 1 })

      const handleMouseEnter = () => {
        gsap.to(element, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        })
      }

      const handleMouseLeave = () => {
        gsap.to(element, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      }

      element.addEventListener("mouseenter", handleMouseEnter)
      element.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        element.removeEventListener("mouseenter", handleMouseEnter)
        element.removeEventListener("mouseleave", handleMouseLeave)
      }
    } catch (error) {
      console.warn("GSAP hover animation error:", error)
      // No fallback needed for hover animations
    }
  }, [])

  return elementRef
}

// New hook for immediate visibility (no animation delay)
export function useInstantAnimation() {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current

    try {
      // Ensure element is immediately visible
      gsap.set(element, { opacity: 1, y: 0 })

      const animation = gsap.fromTo(
        element,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      )

      return () => {
        animation.kill()
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    } catch (error) {
      console.warn("GSAP instant animation error:", error)
      // Fallback: make element visible
      if (element) {
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }
    }
  }, [])

  return elementRef
}

