"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  Settings,
  User,
  Briefcase,
  Code,
  Mail,
  Upload,
  Download,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

export default function AdminPanel() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
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
  })

  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    primaryColor: "#3b82f6",
    darkMode: true,
    animations: true,
    showFloatingElements: true,
  })

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState<Partial<Project>>({})
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Try to load from API first (which connects to FastAPI backend)
      const response = await fetch("/api/portfolio", {
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.personalInfo) setPersonalInfo(data.personalInfo)
        if (data.projects) setProjects(data.projects)
        if (data.skills) setSkills(data.skills)
        if (data.themeSettings) setThemeSettings(data.themeSettings)

        toast({
          title: "Data Loaded",
          description: "Portfolio data loaded from backend successfully.",
        })
      } else {
        // Fallback to localStorage
        const savedPersonalInfo = localStorage.getItem("portfolio_personal_info")
        const savedProjects = localStorage.getItem("portfolio_projects")
        const savedSkills = localStorage.getItem("portfolio_skills")
        const savedTheme = localStorage.getItem("portfolio_theme")

        if (savedPersonalInfo) setPersonalInfo(JSON.parse(savedPersonalInfo))
        if (savedProjects) setProjects(JSON.parse(savedProjects))
        if (savedSkills) setSkills(JSON.parse(savedSkills))
        if (savedTheme) setThemeSettings(JSON.parse(savedTheme))
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Warning",
        description: "Could not load data from backend. Using local data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveData = async () => {
    try {
      setSaving(true)

      const portfolioData = {
        personalInfo,
        projects,
        skills,
        themeSettings,
      }

      // Save to localStorage first
      localStorage.setItem("portfolio_personal_info", JSON.stringify(personalInfo))
      localStorage.setItem("portfolio_projects", JSON.stringify(projects))
      localStorage.setItem("portfolio_skills", JSON.stringify(skills))
      localStorage.setItem("portfolio_theme", JSON.stringify(themeSettings))

      // Save to backend
      const response = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolioData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success!",
          description: "Portfolio data saved permanently to backend.",
        })
      } else {
        toast({
          title: "Partial Success",
          description: result.message || "Data saved locally but backend sync failed.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving data:", error)
      toast({
        title: "Error",
        description: "Failed to save data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addProject = () => {
    if (!newProject.title || !newProject.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title || "",
      description: newProject.description || "",
      technologies: newProject.technologies || [],
      github_url: newProject.github_url || "",
      live_url: newProject.live_url || "",
      image_url: newProject.image_url || "default",
      featured: newProject.featured || false,
    }

    setProjects([...projects, project])
    setNewProject({})
    toast({
      title: "Success!",
      description: "Project added successfully. Don't forget to save!",
    })
  }

  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
    setEditingProject(null)
    toast({
      title: "Success!",
      description: "Project updated successfully. Don't forget to save!",
    })
  }

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id))
    toast({
      title: "Success!",
      description: "Project deleted successfully. Don't forget to save!",
    })
  }

  const addSkill = () => {
    if (!newSkill.name || !newSkill.level || !newSkill.category) {
      toast({
        title: "Error",
        description: "Please fill in all skill fields.",
        variant: "destructive",
      })
      return
    }

    const skill: Skill = {
      name: newSkill.name || "",
      level: newSkill.level || 0,
      category: newSkill.category || "",
    }

    setSkills([...skills, skill])
    setNewSkill({})
    toast({
      title: "Success!",
      description: "Skill added successfully. Don't forget to save!",
    })
  }

  const deleteSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
    toast({
      title: "Success!",
      description: "Skill deleted successfully. Don't forget to save!",
    })
  }

  const exportData = () => {
    const data = {
      personalInfo,
      projects,
      skills,
      themeSettings,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "portfolio-data.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.personalInfo) setPersonalInfo(data.personalInfo)
        if (data.projects) setProjects(data.projects)
        if (data.skills) setSkills(data.skills)
        if (data.themeSettings) setThemeSettings(data.themeSettings)

        toast({
          title: "Success!",
          description: "Data imported successfully. Don't forget to save!",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Invalid file format.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Portfolio Admin</h1>
            <p className="text-slate-600 dark:text-slate-300">Manage your portfolio content - changes are permanent!</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadData} variant="outline" disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={exportData} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <label>
              <Button variant="outline" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </span>
              </Button>
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            <Button onClick={saveData} disabled={saving}>
              <Save className={`mr-2 h-4 w-4 ${saving ? "animate-spin" : ""}`} />
              {saving ? "Saving..." : "Save All"}
            </Button>
            <Button variant="outline" asChild>
              <a href="/" target="_blank" rel="noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </a>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">
              <User className="mr-2 h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Briefcase className="mr-2 h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="skills">
              <Code className="mr-2 h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Mail className="mr-2 h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={personalInfo.name}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={personalInfo.title}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="avatar">Avatar (2 letters)</Label>
                    <Input
                      id="avatar"
                      value={personalInfo.avatar}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, avatar: e.target.value })}
                      maxLength={2}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    {personalInfo.avatar ||
                      (personalInfo.name
                        ? personalInfo.name
                            .trim()
                            .split(/\s+/)
                            .map((word) => word.charAt(0))
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()
                        : "AK")}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Avatar Preview</p>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={personalInfo.description}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project-title">Project Title</Label>
                      <Input
                        id="project-title"
                        value={newProject.title || ""}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-image">Image Type</Label>
                      <Input
                        id="project-image"
                        value={newProject.image_url || ""}
                        onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                        placeholder="cicd, infrastructure, monitoring, etc."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      value={newProject.description || ""}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project-github">GitHub URL</Label>
                      <Input
                        id="project-github"
                        value={newProject.github_url || ""}
                        onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-live">Live URL</Label>
                      <Input
                        id="project-live"
                        value={newProject.live_url || ""}
                        onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="project-tech">Technologies (comma separated)</Label>
                    <Input
                      id="project-tech"
                      value={newProject.technologies?.join(", ") || ""}
                      onChange={(e) =>
                        setNewProject({ ...newProject, technologies: e.target.value.split(", ").filter(Boolean) })
                      }
                      placeholder="React, Node.js, Docker, AWS"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="project-featured"
                      checked={newProject.featured || false}
                      onCheckedChange={(checked) => setNewProject({ ...newProject, featured: checked })}
                    />
                    <Label htmlFor="project-featured">Featured Project</Label>
                  </div>
                  <Button onClick={addProject}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingProject(project)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteProject(project.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      {project.featured && (
                        <Badge variant="default" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Skill</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="skill-name">Skill Name</Label>
                      <Input
                        id="skill-name"
                        value={newSkill.name || ""}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="skill-level">Level (0-100)</Label>
                      <Input
                        id="skill-level"
                        type="number"
                        min="0"
                        max="100"
                        value={newSkill.level || ""}
                        onChange={(e) => setNewSkill({ ...newSkill, level: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="skill-category">Category</Label>
                      <Input
                        id="skill-category"
                        value={newSkill.category || ""}
                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                        placeholder="Cloud Platforms, CI/CD, etc."
                      />
                    </div>
                  </div>
                  <Button onClick={addSkill}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skill
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Skills ({skills.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-slate-500">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${skill.level}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 mt-1">{skill.category}</span>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => deleteSkill(index)} className="ml-4">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={personalInfo.location}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                      id="github"
                      value={personalInfo.github}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      value={personalInfo.linkedin}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Theme & Display Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input
                    id="primary-color"
                    type="color"
                    value={themeSettings.primaryColor}
                    onChange={(e) => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
                    className="w-20 h-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dark-mode"
                    checked={themeSettings.darkMode}
                    onCheckedChange={(checked) => setThemeSettings({ ...themeSettings, darkMode: checked })}
                  />
                  <Label htmlFor="dark-mode">Enable Dark Mode by Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="animations"
                    checked={themeSettings.animations}
                    onCheckedChange={(checked) => setThemeSettings({ ...themeSettings, animations: checked })}
                  />
                  <Label htmlFor="animations">Enable Animations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="floating-elements"
                    checked={themeSettings.showFloatingElements}
                    onCheckedChange={(checked) => setThemeSettings({ ...themeSettings, showFloatingElements: checked })}
                  />
                  <Label htmlFor="floating-elements">Show Floating Elements</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-image">Image Type</Label>
                  <Input
                    id="edit-image"
                    value={editingProject.image_url}
                    onChange={(e) => setEditingProject({ ...editingProject, image_url: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-github">GitHub URL</Label>
                  <Input
                    id="edit-github"
                    value={editingProject.github_url}
                    onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-live">Live URL</Label>
                  <Input
                    id="edit-live"
                    value={editingProject.live_url}
                    onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-tech">Technologies</Label>
                <Input
                  id="edit-tech"
                  value={editingProject.technologies.join(", ")}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, technologies: e.target.value.split(", ").filter(Boolean) })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={editingProject.featured}
                  onCheckedChange={(checked) => setEditingProject({ ...editingProject, featured: checked })}
                />
                <Label htmlFor="edit-featured">Featured Project</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => updateProject(editingProject)}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingProject(null)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

