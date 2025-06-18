import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch portfolio data
    const response = await fetch("http://127.0.0.1:8000/api/portfolio", {
      cache: "no-store",
    })

    let portfolioData
    if (response.ok) {
      portfolioData = await response.json()
    } else {
      // Fallback data
      portfolioData = {
        personalInfo: {
          name: "Alex Kumar",
          title: "DevOps Engineer",
          email: "alex.kumar@example.com",
          phone: "+1 (555) 123-4567",
          location: "Bangalore, India",
          github: "https://github.com",
          linkedin: "https://linkedin.com",
          description:
            "Passionate DevOps Engineer focused on automating infrastructure, building CI/CD pipelines, and optimizing cloud deployments.",
        },
        projects: [],
        skills: [],
      }
    }

    // Generate CV content
    const cvContent = generateCVContent(portfolioData)

    return new NextResponse(cvContent, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${portfolioData.personalInfo.name.replace(/\s+/g, "_")}_CV.txt"`,
      },
    })
  } catch (error) {
    console.error("Error generating CV:", error)
    return NextResponse.json({ error: "Failed to generate CV" }, { status: 500 })
  }
}

function generateCVContent(data: any) {
  const { personalInfo, projects, skills } = data
  const name = personalInfo?.name || "Alex Kumar"
  const title = personalInfo?.title || "DevOps Engineer"

  let cv = `
${name.toUpperCase()}
${title}
${"=".repeat(50)}

CONTACT INFORMATION
${"-".repeat(20)}
Email: ${personalInfo?.email || "N/A"}
Phone: ${personalInfo?.phone || "N/A"}
Location: ${personalInfo?.location || "N/A"}
GitHub: ${personalInfo?.github || "N/A"}
LinkedIn: ${personalInfo?.linkedin || "N/A"}

PROFESSIONAL SUMMARY
${"-".repeat(20)}
${personalInfo?.description || "Passionate DevOps Engineer focused on automation and cloud technologies."}

TECHNICAL SKILLS
${"-".repeat(20)}`

  // Group skills by category
  const skillsByCategory: { [key: string]: any[] } = {}
  skills?.forEach((skill: any) => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = []
    }
    skillsByCategory[skill.category].push(skill)
  })

  Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
    cv += `\n\n${category}:\n`
    categorySkills.forEach((skill: any) => {
      cv += `• ${skill.name} (${skill.level}%)\n`
    })
  })

  cv += `\n\nPROJECTS
${"-".repeat(20)}`

  projects?.forEach((project: any, index: number) => {
    cv += `\n\n${index + 1}. ${project.title}`
    if (project.featured) cv += " ⭐ FEATURED"
    cv += `\n   ${project.description}`
    cv += `\n   Technologies: ${project.technologies?.join(", ") || "N/A"}`
    cv += `\n   GitHub: ${project.github_url || "N/A"}`
    cv += `\n   Live Demo: ${project.live_url || "N/A"}`
  })

  cv += `\n\n${"=".repeat(50)}
Generated from Portfolio - ${new Date().toLocaleDateString()}
Portfolio Website: [Your Portfolio URL]
  `

  return cv
}

