from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
import uvicorn
from datetime import datetime
import json
import os

app = FastAPI(title="DevOps Portfolio API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data storage
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

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

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
        print(f"✅ Portfolio data saved successfully")
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
            "description": "Passionate DevOps Engineer focused on automating infrastructure, building CI/CD pipelines, and optimizing cloud deployments.",
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
                "image_url": "🚀",
                "featured": True
            },
            {
                "id": "2",
                "title": "Infrastructure as Code",
                "description": "Designed and implemented cloud infrastructure using Terraform and Ansible, managing 50+ AWS resources with version control and automated provisioning.",
                "technologies": ["Terraform", "Ansible", "AWS", "CloudFormation", "Python"],
                "github_url": "https://github.com/example/iac-project",
                "live_url": "https://infrastructure-demo.example.com",
                "image_url": "🏗️",
                "featured": False
            },
            {
                "id": "3",
                "title": "Monitoring & Alerting System",
                "description": "Implemented comprehensive monitoring solution using Prometheus, Grafana, and AlertManager for real-time infrastructure and application monitoring.",
                "technologies": ["Prometheus", "Grafana", "AlertManager", "Docker", "Kubernetes"],
                "github_url": "https://github.com/example/monitoring-stack",
                "live_url": "https://monitoring-demo.example.com",
                "image_url": "📊",
                "featured": True
            }
        ],
        "skills": [
            {"name": "AWS", "level": 85, "category": "Cloud Platforms"},
            {"name": "Azure", "level": 75, "category": "Cloud Platforms"},
            {"name": "Google Cloud", "level": 70, "category": "Cloud Platforms"},
            {"name": "Jenkins", "level": 90, "category": "CI/CD & Automation"},
            {"name": "GitHub Actions", "level": 85, "category": "CI/CD & Automation"},
            {"name": "GitLab CI", "level": 80, "category": "CI/CD & Automation"},
            {"name": "Docker", "level": 95, "category": "Containerization"},
            {"name": "Kubernetes", "level": 85, "category": "Containerization"},
            {"name": "Terraform", "level": 88, "category": "Infrastructure & Monitoring"},
            {"name": "Prometheus", "level": 80, "category": "Infrastructure & Monitoring"},
            {"name": "Grafana", "level": 85, "category": "Infrastructure & Monitoring"}
        ],
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
        
        return {
            "message": "Thank you for your message! I'll get back to you soon.",
            "timestamp": datetime.now()
        }
    except Exception as e:
        print(f"❌ Error processing contact message: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process message: {str(e)}")

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
    print("📱 Frontend: Open index.html in your browser")
    print("🔧 Backend: http://localhost:8000")
    print("📚 API docs: http://localhost:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

