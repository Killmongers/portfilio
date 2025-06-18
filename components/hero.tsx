"use client"

import { useState, useEffect, useRef } from "react"
import { Github, Linkedin, Mail, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import { getAvatarText } from "@/lib/avatar-utils"

export function Hero() {
  const { data, loading } = usePortfolioData()
  const [text, setText] = useState("")
  const fullText = data?.personalInfo?.title || "DevOps Engineer"

  const heroRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!data?.personalInfo) return

    // Wait for next tick to ensure DOM is ready
    const timer = setTimeout(() => {
      // Check if all refs are available
      const elements = [
        avatarRef.current,
        titleRef.current,
        subtitleRef.current,
        descriptionRef.current,
        buttonsRef.current,
        socialRef.current,
      ]

      // Only proceed if all elements exist
      if (elements.every((el) => el !== null)) {
        try {
          // GSAP Timeline for hero animations
          const tl = gsap.timeline()

          // Set initial states
          gsap.set(elements, {
            opacity: 0,
            y: 50,
          })

          // Animate elements in sequence
          tl.to(avatarRef.current, { opacity: 1, y: 0, duration: 1, ease: "back.out(1.7)" })
            .to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
            .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
            .to(descriptionRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
            .to(buttonsRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
            .to(socialRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
        } catch (error) {
          console.warn("GSAP animation error:", error)
          // Fallback: make elements visible without animation
          elements.forEach((el) => {
            if (el) {
              el.style.opacity = "1"
              el.style.transform = "translateY(0)"
            }
          })
        }
      } else {
        // Fallback: make elements visible without animation
        elements.forEach((el) => {
          if (el) {
            el.style.opacity = "1"
            el.style.transform = "translateY(0)"
          }
        })
      }
    }, 100)

    // Typing animation for subtitle
    let index = 0
    const typingTimer = setInterval(() => {
      setText(fullText.slice(0, index))
      index++
      if (index > fullText.length) {
        clearInterval(typingTimer)
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      clearInterval(typingTimer)
    }
  }, [data, fullText])

  // Function to scroll to contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Function to download CV
  const downloadCV = () => {
    // Create a sample CV content
    const personalInfo = data?.personalInfo
    const cvContent = generateCVContent(personalInfo, data?.projects, data?.skills)

    // Create and download the file
    const blob = new Blob([cvContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${personalInfo?.name?.replace(/\s+/g, "_") || "Portfolio"}_CV.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Function to generate CV content
  const generateCVContent = (personalInfo: any, projects: any[], skills: any[]) => {
    const name = personalInfo?.name || "Alex Kumar"
    const title = personalInfo?.title || "DevOps Engineer"
    const email = personalInfo?.email || "alex.kumar@example.com"
    const phone = personalInfo?.phone || "+1 (555) 123-4567"
    const location = personalInfo?.location || "Bangalore, India"
    const description = personalInfo?.description || "Passionate DevOps Engineer"

    let cv = `
${name.toUpperCase()}
${title}
${"=".repeat(50)}

CONTACT INFORMATION
${"-".repeat(20)}
Email: ${email}
Phone: ${phone}
Location: ${location}
GitHub: ${personalInfo?.github || "https://github.com"}
LinkedIn: ${personalInfo?.linkedin || "https://linkedin.com"}

PROFESSIONAL SUMMARY
${"-".repeat(20)}
${description}

TECHNICAL SKILLS
${"-".repeat(20)}`

    // Group skills by category
    const skillsByCategory: { [key: string]: any[] } = {}
    skills?.forEach((skill) => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = []
      }
      skillsByCategory[skill.category].push(skill)
    })

    Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
      cv += `\n\n${category}:\n`
      categorySkills.forEach((skill) => {
        cv += `• ${skill.name} (${skill.level}%)\n`
      })
    })

    cv += `\n\nPROJECTS
${"-".repeat(20)}`

    projects?.forEach((project, index) => {
      cv += `\n\n${index + 1}. ${project.title}`
      if (project.featured) cv += " ⭐ FEATURED"
      cv += `\n   ${project.description}`
      cv += `\n   Technologies: ${project.technologies?.join(", ") || "N/A"}`
      cv += `\n   GitHub: ${project.github_url}`
      cv += `\n   Live Demo: ${project.live_url}`
    })

    cv += `\n\n${"=".repeat(50)}
Generated from Portfolio - ${new Date().toLocaleDateString()}
    `

    return cv
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mx-auto mb-6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  const personalInfo = data?.personalInfo

  return (
    <section ref={heroRef} id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div
            ref={avatarRef}
            className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold opacity-0"
            style={{ transform: "translateY(50px)" }}
          >
            {getAvatarText(personalInfo?.avatar, personalInfo?.name)}
          </div>
          <h1
            ref={titleRef}
            className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-4 opacity-0"
            style={{ transform: "translateY(50px)" }}
          >
            {personalInfo?.name || "Alex Kumar"}
          </h1>
          <h2
            ref={subtitleRef}
            className="text-xl sm:text-2xl text-blue-600 dark:text-blue-400 mb-6 h-8 opacity-0"
            style={{ transform: "translateY(50px)" }}
          >
            {text}
            <span className="animate-pulse">|</span>
          </h2>
          <p
            ref={descriptionRef}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 opacity-0"
            style={{ transform: "translateY(50px)" }}
          >
            {personalInfo?.description ||
              "Passionate DevOps Engineer focused on automating infrastructure, building CI/CD pipelines, and optimizing cloud deployments. Ready to streamline your development workflow."}
          </p>
        </div>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 opacity-0"
          style={{ transform: "translateY(50px)" }}
        >
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={scrollToContact}>
            <Mail className="mr-2 h-4 w-4" />
            Get In Touch
          </Button>
          <Button variant="outline" size="lg" onClick={downloadCV}>
            <Download className="mr-2 h-4 w-4" />
            Download CV
          </Button>
        </div>

        <div
          ref={socialRef}
          className="flex justify-center space-x-6 opacity-0"
          style={{ transform: "translateY(50px)" }}
        >
          <a
            href={personalInfo?.github || "https://github.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Github className="h-6 w-6" />
          </a>
          <a
            href={personalInfo?.linkedin || "https://linkedin.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Linkedin className="h-6 w-6" />
          </a>
          <a
            href={`mailto:${personalInfo?.email || "john@example.com"}`}
            className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Mail className="h-6 w-6" />
          </a>
        </div>
      </div>
    </section>
  )
}

