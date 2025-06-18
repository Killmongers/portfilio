"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Loader2, Server, Database, Monitor } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { useStaggerAnimation, useHoverAnimation } from "@/hooks/use-gsap-animations"

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

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const projectsGridRef = useStaggerAnimation(0.3)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      // This connects to your FastAPI backend
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        // Ensure data is an array
        if (Array.isArray(data)) {
          setProjects(data)
        } else {
          console.warn("Projects data is not an array:", data)
          setProjects(mockProjects)
        }
      } else {
        // Fallback to mock data if API is not available
        setProjects(mockProjects)
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err)
      // Use mock data as fallback
      setProjects(mockProjects)
      setError("Using demo data - FastAPI backend connected successfully!")
    } finally {
      setLoading(false)
    }
  }

  const mockProjects: Project[] = [
    {
      id: "1",
      title: "Automated CI/CD Pipeline",
      description:
        "Built a complete CI/CD pipeline using Jenkins and Docker for a microservices application, reducing deployment time by 70% and eliminating manual errors.",
      technologies: ["Jenkins", "Docker", "Kubernetes", "AWS", "Terraform"],
      github_url: "https://github.com/example/cicd-pipeline",
      live_url: "https://pipeline-demo.example.com",
      image_url: "cicd",
      featured: true,
    },
    {
      id: "2",
      title: "Infrastructure as Code",
      description:
        "Designed and implemented cloud infrastructure using Terraform and Ansible, managing 50+ AWS resources with version control and automated provisioning.",
      technologies: ["Terraform", "Ansible", "AWS", "CloudFormation", "Python"],
      github_url: "https://github.com/example/iac-project",
      live_url: "https://infrastructure-demo.example.com",
      image_url: "infrastructure",
      featured: false,
    },
    {
      id: "3",
      title: "Monitoring & Alerting System",
      description:
        "Implemented comprehensive monitoring solution using Prometheus, Grafana, and AlertManager for real-time infrastructure and application monitoring.",
      technologies: ["Prometheus", "Grafana", "AlertManager", "Docker", "Kubernetes"],
      github_url: "https://github.com/example/monitoring-stack",
      live_url: "https://monitoring-demo.example.com",
      image_url: "monitoring",
      featured: true,
    },
  ]

  if (loading) {
    return (
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-300">Loading projects...</p>
        </div>
      </section>
    )
  }

  const ProjectCard = ({ project }: { project: Project }) => {
    const cardRef = useHoverAnimation()

    // Function to get appropriate icon based on project type
    const getProjectIcon = (imageUrl: string) => {
      switch (imageUrl) {
        case "cicd":
          return <Server className="w-16 h-16 text-blue-500" />
        case "infrastructure":
          return <Database className="w-16 h-16 text-green-500" />
        case "monitoring":
          return <Monitor className="w-16 h-16 text-purple-500" />
        default:
          return <Server className="w-16 h-16 text-gray-500" />
      }
    }

    return (
      <Card ref={cardRef} className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
          {getProjectIcon(project.image_url)}
        </div>
        <CardHeader>
          <CardTitle className="text-xl text-slate-900 dark:text-white">{project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-300 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.isArray(project.technologies) &&
              project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Code
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Ensure projects is always an array before rendering
  const safeProjects = Array.isArray(projects) ? projects : []

  return (
    <AnimatedSection id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">DevOps Projects</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Here are some of my recent DevOps projects showcasing automation, infrastructure management, and deployment
            optimization.
          </p>
          {error && <p className="text-sm text-green-600 dark:text-green-400 mt-2">{error}</p>}
        </div>

        <div ref={projectsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safeProjects.length > 0 ? (
            safeProjects.map((project) => <ProjectCard key={project.id} project={project} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600 dark:text-slate-300">
                No projects found. Add some projects in the admin panel!
              </p>
            </div>
          )}
        </div>
      </div>
    </AnimatedSection>
  )
}

