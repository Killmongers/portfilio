"use client"

import { useState, useEffect } from "react"

interface PersonalInfo {
  name: string
  title: string
  description: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  avatar: string
}

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  github_url: string
  live_url: string
  image_url: string
  featured: boolean
}

interface Skill {
  name: string
  level: number
  category: string
}

interface ThemeSettings {
  primaryColor: string
  darkMode: boolean
  animations: boolean
  showFloatingElements: boolean
}

interface PortfolioData {
  personalInfo: PersonalInfo
  projects: Project[]
  skills: Skill[]
  themeSettings: ThemeSettings
}

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPortfolioData()
  }, [])

  const loadPortfolioData = async () => {
    try {
      setLoading(true)
      setError(null)

      // First try to load from localStorage for immediate display
      const savedPersonalInfo = localStorage.getItem("portfolio_personal_info")
      const savedProjects = localStorage.getItem("portfolio_projects")
      const savedSkills = localStorage.getItem("portfolio_skills")
      const savedTheme = localStorage.getItem("portfolio_theme")

      if (savedPersonalInfo && savedProjects && savedSkills && savedTheme) {
        const localData = {
          personalInfo: JSON.parse(savedPersonalInfo),
          projects: JSON.parse(savedProjects),
          skills: JSON.parse(savedSkills),
          themeSettings: JSON.parse(savedTheme),
        }

        // Ensure arrays are actually arrays
        if (!Array.isArray(localData.projects)) localData.projects = []
        if (!Array.isArray(localData.skills)) localData.skills = []

        setData(localData)
      }

      // Then try to fetch from API (which will use fallback if backend is down)
      const response = await fetch("/api/portfolio", {
        cache: "no-store",
      })

      if (response.ok) {
        const portfolioData = await response.json()

        // Ensure arrays are actually arrays
        if (!Array.isArray(portfolioData.projects)) portfolioData.projects = []
        if (!Array.isArray(portfolioData.skills)) portfolioData.skills = []

        setData(portfolioData)

        // Update localStorage with fresh data
        localStorage.setItem("portfolio_personal_info", JSON.stringify(portfolioData.personalInfo))
        localStorage.setItem("portfolio_projects", JSON.stringify(portfolioData.projects))
        localStorage.setItem("portfolio_skills", JSON.stringify(portfolioData.skills))
        localStorage.setItem("portfolio_theme", JSON.stringify(portfolioData.themeSettings))
      } else {
        throw new Error("Failed to fetch portfolio data")
      }
    } catch (err) {
      console.error("Error loading portfolio data:", err)
      setError(err instanceof Error ? err.message : "Unknown error")

      // If we don't have any data yet, set default data
      if (!data) {
        const defaultData = {
          personalInfo: {
            name: "Alex Kumar",
            title: "DevOps Engineer",
            description:
              "Passionate DevOps Engineer focused on automating infrastructure, building CI/CD pipelines, and optimizing cloud deployments.",
            email: "alex.kumar@example.com",
            phone: "+1 (555) 123-4567",
            location: "Bangalore, India",
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            avatar: "AK",
          },
          projects: [],
          skills: [],
          themeSettings: {
            primaryColor: "#3b82f6",
            darkMode: true,
            animations: true,
            showFloatingElements: true,
          },
        }
        setData(defaultData)
      }
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    loadPortfolioData()
  }

  return { data, loading, error, refreshData }
}

