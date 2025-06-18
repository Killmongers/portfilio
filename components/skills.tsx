"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import { useEffect, useState } from "react"

export function Skills() {
  const { data, loading } = usePortfolioData()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              DevOps Skills & Tools
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Here's an overview of my technical skills and proficiency levels in various DevOps technologies and tools.
            </p>
          </div>
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((j) => (
                      <div key={j}>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Group skills by category
  const skillCategories: { [key: string]: Array<{ name: string; level: number }> } = {}

  // Ensure skills is an array and has data
  const skills = Array.isArray(data?.skills) ? data.skills : []

  // If no skills from data, use default skills
  const defaultSkills = [
    { name: "AWS", level: 75, category: "Cloud Platforms" },
    { name: "Azure", level: 70, category: "Cloud Platforms" },
    { name: "Google Cloud", level: 60, category: "Cloud Platforms" },
    { name: "DigitalOcean", level: 80, category: "Cloud Platforms" },
    { name: "Jenkins", level: 80, category: "CI/CD & Automation" },
    { name: "GitHub Actions", level: 85, category: "CI/CD & Automation" },
    { name: "GitLab CI", level: 75, category: "CI/CD & Automation" },
    { name: "Ansible", level: 70, category: "CI/CD & Automation" },
    { name: "Docker", level: 85, category: "Containerization" },
    { name: "Kubernetes", level: 75, category: "Containerization" },
    { name: "Docker Compose", level: 90, category: "Containerization" },
    { name: "Helm", level: 65, category: "Containerization" },
    { name: "Terraform", level: 78, category: "Infrastructure & Monitoring" },
    { name: "Prometheus", level: 70, category: "Infrastructure & Monitoring" },
    { name: "Grafana", level: 75, category: "Infrastructure & Monitoring" },
    { name: "ELK Stack", level: 65, category: "Infrastructure & Monitoring" },
  ]

  const skillsToUse = skills.length > 0 ? skills : defaultSkills

  skillsToUse.forEach((skill) => {
    if (!skillCategories[skill.category]) {
      skillCategories[skill.category] = []
    }
    skillCategories[skill.category].push({
      name: skill.name,
      level: skill.level,
    })
  })

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">DevOps Skills & Tools</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Here's an overview of my technical skills and proficiency levels in various DevOps technologies and tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(skillCategories).map(([category, categorySkills], index) => (
            <Card key={index} className="opacity-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">{category}</h3>
                <div className="space-y-4">
                  {categorySkills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{skill.name}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

