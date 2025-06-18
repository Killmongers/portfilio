"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}

export function AnimatedCounter({ end, duration = 2, suffix = "", prefix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!counterRef.current) return

    const counter = { value: 0 }

    gsap.to(counter, {
      value: end,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.round(counter.value))
      },
      scrollTrigger: {
        trigger: counterRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [end, duration])

  return (
    <span ref={counterRef}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

