import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Try to fetch from FastAPI backend first
    const response = await fetch("http://127.0.0.1:8000/api/portfolio", {
      cache: "no-store", // Always fetch fresh data
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    // If backend is not available, throw error to use fallback
    throw new Error("Backend not available")
  } catch (error) {
    console.log("Backend not available, using fallback data")

    // Fallback to default data if backend is not available
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
      projects: [
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
      ],
      skills: [
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
      ],
      themeSettings: {
        primaryColor: "#3b82f6",
        darkMode: true,
        animations: true,
        showFloatingElements: true,
      },
    }

    return NextResponse.json(defaultData)
  }
}

export async function POST(request: Request) {
  try {
    const portfolioData = await request.json()

    // Try to send to FastAPI backend
    const response = await fetch("http://127.0.0.1:8000/api/portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(portfolioData),
    })

    if (response.ok) {
      const result = await response.json()
      return NextResponse.json(result)
    } else {
      throw new Error("Backend save failed")
    }
  } catch (error) {
    console.log("Backend not available, data saved locally only")
    return NextResponse.json({
      success: false,
      message: "Backend not available - data saved locally only",
      error: "Backend connection failed",
    })
  }
}

