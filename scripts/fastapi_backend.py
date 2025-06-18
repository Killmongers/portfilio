from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
import uvicorn
from datetime import datetime
import json
import os

app = FastAPI(title="DevOps Portfolio API", version="1.0.0")

# Configure CORS - Updated to include both localhost and 127.0.0.1
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://your-portfolio-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data storage file
DATA_FILE = "portfolio_data.json"

# Pydantic models
class PersonalInfo(BaseModel):
    name: str
    title: str
    description: str
    email: str
    phone: str
    location: str
    github: str
    linkedin: str
    avatar: str

class Project(BaseModel):
    id: str
    title: str
    description: str
    technologies: List[str]
    github_url: str
    live_url: str
    image_url: str
    featured: bool

class Skill(BaseModel):
    name: str
    level: int
    category: str

class ThemeSettings(BaseModel):
    primaryColor: str
    darkMode: bool
    animations: bool
    showFloatingElements: bool

class PortfolioData(BaseModel):
    personalInfo: PersonalInfo
    projects: List[Project]
    skills: List[Skill]
    themeSettings: ThemeSettings
    lastUpdated: Optional[datetime] = None

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactResponse(BaseModel):
    message: str
    timestamp: datetime

# Helper functions
def load_portfolio_data() -> Dict[str, Any]:
    """Load portfolio data from JSON file"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading data: {e}")
    
    # Return default data if file doesn't exist
    return get_default_data()

def save_portfolio_data(data: Dict[str, Any]) -> bool:
    """Save portfolio data to JSON file"""
    try:
        data['lastUpdated'] = datetime.now().isoformat()
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2, default=str)
        print(f"✅ Portfolio data saved successfully to {DATA_FILE}")
        return True
    except Exception as e:
        print(f"❌ Error saving data: {e}")
        return False

def get_default_data() -> Dict[str, Any]:
    """Get default portfolio data"""
    return {
        "personalInfo": {
            "name": "Alex Kumar",
            "title": "DevOps Engineer",
            "description": "Passionate DevOps Engineer focused on automating infrastructure, building CI/CD pipelines, and optimizing cloud deployments. Ready to streamline your development workflow.",
            "email": "alex.kumar@example.com",
            "phone": "+1 (555) 123-4567",
            "location": "Bangalore, India",
            "github": "https://github.com",
            "linkedin": "https://linkedin.com",
            "avatar": "AK"
        },
        "projects": [
            {
                "id": "1",
                "title": "Automated CI/CD Pipeline",
                "description": "Built a complete CI/CD pipeline using Jenkins and Docker for a microservices application, reducing deployment time by 70% and eliminating manual errors.",
                "technologies": ["Jenkins", "Docker", "Kubernetes", "AWS", "Terraform"],
                "github_url": "https://github.com/example/cicd-pipeline",
                "live_url": "https://pipeline-demo.example.com",
                "image_url": "cicd",
                "featured": True
            },
            {
                "id": "2",
                "title": "Infrastructure as Code",
                "description": "Designed and implemented cloud infrastructure using Terraform and Ansible, managing 50+ AWS resources with version control and automated provisioning.",
                "technologies": ["Terraform", "Ansible", "AWS", "CloudFormation", "Python"],
                "github_url": "https://github.com/example/iac-project",
                "live_url": "https://infrastructure-demo.example.com",
                "image_url": "infrastructure",
                "featured": False
            },
            {
                "id": "3",
                "title": "Monitoring & Alerting System",
                "description": "Implemented comprehensive monitoring solution using Prometheus, Grafana, and AlertManager for real-time infrastructure and application monitoring.",
                "technologies": ["Prometheus", "Grafana", "AlertManager", "Docker", "Kubernetes"],
                "github_url": "https://github.com/example/monitoring-stack",
                "live_url": "https://monitoring-demo.example.com",
                "image_url": "monitoring",
                "featured": True
            }
        ],
        "skills": [
            {"name": "AWS", "level": 75, "category": "Cloud Platforms"},
            {"name": "Azure", "level": 70, "category": "Cloud Platforms"},
            {"name": "Google Cloud", "level": 60, "category": "Cloud Platforms"},
            {"name": "DigitalOcean", "level": 80, "category": "Cloud Platforms"},
            {"name": "Jenkins", "level": 80, "category": "CI/CD & Automation"},
            {"name": "GitHub Actions", "level": 85, "category": "CI/CD & Automation"},
            {"name": "GitLab CI", "level": 75, "category": "CI/CD & Automation"},
            {"name": "Ansible", "level": 70, "category": "CI/CD & Automation"},
            {"name": "Docker", "level": 85, "category": "Containerization"},
            {"name": "Kubernetes", "level": 75, "category": "Containerization"},
            {"name": "Docker Compose", "level": 90, "category": "Containerization"},
            {"name": "Helm", "level": 65, "category": "Containerization"},
            {"name": "Terraform", "level": 78, "category": "Infrastructure & Monitoring"},
            {"name": "Prometheus", "level": 70, "category": "Infrastructure & Monitoring"},
            {"name": "Grafana", "level": 75, "category": "Infrastructure & Monitoring"},
            {"name": "ELK Stack", "level": 65, "category": "Infrastructure & Monitoring"}
        ],
        "themeSettings": {
            "primaryColor": "#3b82f6",
            "darkMode": True,
            "animations": True,
            "showFloatingElements": True
        },
        "lastUpdated": datetime.now().isoformat()
    }

# API Routes
@app.get("/")
async def root():
    return {"message": "Portfolio API is running!", "timestamp": datetime.now()}

@app.get("/api/portfolio")
async def get_portfolio():
    """Get complete portfolio data"""
    try:
        data = load_portfolio_data()
        print(f"📤 Sending portfolio data with {len(data.get('projects', []))} projects")
        return data
    except Exception as e:
        print(f"❌ Error loading portfolio: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load portfolio data: {str(e)}")

@app.post("/api/portfolio")
async def update_portfolio(portfolio_data: Dict[str, Any]):
    """Update complete portfolio data"""
    try:
        print(f"📥 Received portfolio update request")
        if save_portfolio_data(portfolio_data):
            return {"message": "Portfolio updated successfully", "timestamp": datetime.now()}
        else:
            raise HTTPException(status_code=500, detail="Failed to save portfolio data")
    except Exception as e:
        print(f"❌ Error updating portfolio: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update portfolio: {str(e)}")

@app.get("/api/projects")
async def get_projects():
    """Get all projects"""
    try:
        data = load_portfolio_data()
        projects = data.get("projects", [])
        print(f"📤 Sending {len(projects)} projects")
        return projects
    except Exception as e:
        print(f"❌ Error loading projects: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load projects: {str(e)}")

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    """Get a specific project by ID"""
    try:
        data = load_portfolio_data()
        projects = data.get("projects", [])
        project = next((p for p in projects if p["id"] == project_id), None)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load project: {str(e)}")

@app.get("/api/skills")
async def get_skills():
    """Get all skills organized by category"""
    try:
        data = load_portfolio_data()
        skills = data.get("skills", [])
        
        # Organize skills by category
        skills_by_category = {}
        for skill in skills:
            category = skill["category"]
            if category not in skills_by_category:
                skills_by_category[category] = []
            skills_by_category[category].append({
                "name": skill["name"],
                "level": skill["level"]
            })
        
        print(f"📤 Sending skills in {len(skills_by_category)} categories")
        return skills_by_category
    except Exception as e:
        print(f"❌ Error loading skills: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load skills: {str(e)}")

@app.get("/api/personal-info")
async def get_personal_info():
    """Get personal information"""
    try:
        data = load_portfolio_data()
        personal_info = data.get("personalInfo", {})
        print(f"📤 Sending personal info for: {personal_info.get('name', 'Unknown')}")
        return personal_info
    except Exception as e:
        print(f"❌ Error loading personal info: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load personal info: {str(e)}")

@app.post("/api/contact")
async def send_contact_message(contact: ContactMessage):
    """Handle contact form submissions"""
    try:
        print(f"📧 New contact message from {contact.name} ({contact.email})")
        print(f"   Subject: {contact.subject}")
        print(f"   Message: {contact.message[:100]}...")
        
        # Save contact message to a separate file
        contact_data = {
            "name": contact.name,
            "email": contact.email,
            "subject": contact.subject,
            "message": contact.message,
            "timestamp": datetime.now().isoformat()
        }
        
        contacts_file = "contact_messages.json"
        contacts = []
        if os.path.exists(contacts_file):
            try:
                with open(contacts_file, 'r') as f:
                    contacts = json.load(f)
            except:
                contacts = []
        
        contacts.append(contact_data)
        
        with open(contacts_file, 'w') as f:
            json.dump(contacts, f, indent=2)
        
        print(f"✅ Contact message saved successfully")
        
        return ContactResponse(
            message="Thank you for your message! I'll get back to you soon.",
            timestamp=datetime.now()
        )
    except Exception as e:
        print(f"❌ Error processing contact message: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process message: {str(e)}")

@app.get("/api/contact-messages")
async def get_contact_messages():
    """Get all contact messages (admin only)"""
    try:
        contacts_file = "contact_messages.json"
        if os.path.exists(contacts_file):
            with open(contacts_file, 'r') as f:
                contacts = json.load(f)
                print(f"📤 Sending {len(contacts)} contact messages")
                return contacts
        return []
    except Exception as e:
        print(f"❌ Error loading contact messages: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load contact messages: {str(e)}")

@app.get("/api/stats")
async def get_portfolio_stats():
    """Get portfolio statistics"""
    try:
        data = load_portfolio_data()
        
        stats = {
            "totalProjects": len(data.get("projects", [])),
            "featuredProjects": len([p for p in data.get("projects", []) if p.get("featured", False)]),
            "totalSkills": len(data.get("skills", [])),
            "skillCategories": len(set(skill["category"] for skill in data.get("skills", []))),
            "lastUpdated": data.get("lastUpdated"),
            "averageSkillLevel": sum(skill["level"] for skill in data.get("skills", [])) / len(data.get("skills", [])) if data.get("skills") else 0
        }
        
        print(f"📊 Sending portfolio stats: {stats['totalProjects']} projects, {stats['totalSkills']} skills")
        return stats
    except Exception as e:
        print(f"❌ Error loading stats: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load stats: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "data_file_exists": os.path.exists(DATA_FILE)
    }

if __name__ == "__main__":
    # Initialize with default data if file doesn't exist
    if not os.path.exists(DATA_FILE):
        print("🚀 Initializing with default portfolio data...")
        save_portfolio_data(get_default_data())
    
    print(f"📁 Portfolio data file: {os.path.abspath(DATA_FILE)}")
    print("🌐 Starting FastAPI server...")
    print("📡 Frontend should connect to: http://127.0.0.1:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

