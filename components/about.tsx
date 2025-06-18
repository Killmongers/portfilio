"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Database, Globe, Zap } from "lucide-react"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import { getAvatarText } from "@/lib/avatar-utils"

export function About() {
  const { data, loading } = usePortfolioData()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: <Code className="h-8 w-8 text-blue-600" />,
      title: "CI/CD Pipelines",
      description:
        "Building automated deployment pipelines with Jenkins, GitHub Actions, and GitLab CI for seamless code delivery.",
    },
    {
      icon: <Database className="h-8 w-8 text-green-600" />,
      title: "Infrastructure as Code",
      description:
        "Managing cloud infrastructure using Terraform, Ansible, and CloudFormation for scalable deployments.",
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      title: "Container Orchestration",
      description: "Deploying and managing applications with Docker, Kubernetes, and container registry solutions.",
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Monitoring & Logging",
      description: "Implementing comprehensive monitoring solutions with Prometheus, Grafana, and ELK stack.",
    },
  ]

  // Always render the component, just show loading state if needed
  const personalInfo = data?.personalInfo

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">About Me</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {loading
              ? "Loading..."
              : personalInfo?.description ||
                "I'm a passionate DevOps engineer with a strong foundation in cloud technologies and automation. I love building efficient, scalable infrastructure that empowers development teams."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">My DevOps Journey</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                As a fresh DevOps engineer, I've been focusing on mastering the core principles of continuous
                integration, continuous deployment, and infrastructure automation.
              </p>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                I have hands-on experience with cloud platforms like AWS and Azure, containerization with Docker and
                Kubernetes, and building robust CI/CD pipelines that reduce deployment time and increase reliability.
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                I'm passionate about learning new technologies, contributing to open-source DevOps tools, and helping
                teams achieve faster, more reliable software delivery.
              </p>
            </div>
            <div className="flex justify-center">
              {loading ? (
                <div className="w-64 h-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
              ) : (
                <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-6xl font-bold">
                  {getAvatarText(personalInfo?.avatar, personalInfo?.name)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

