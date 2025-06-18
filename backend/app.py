from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any
from datetime import datetime
import os, json

app = FastAPI(title="Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "portfolio_data.json"

# Models
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

# Load/Save
def load_data() -> Dict[str, Any]:
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {"projects": [], "skills": [], "personalInfo": {}, "lastUpdated": datetime.now().isoformat()}

def save_data(data: Dict[str, Any]):
    data["lastUpdated"] = datetime.now().isoformat()
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# Routes
@app.get("/")
def root():
    return {"message": "Portfolio API is running"}

@app.get("/api/portfolio")
def get_portfolio():
    return load_data()

@app.post("/api/portfolio")
def update_portfolio(data: Dict[str, Any]):
    save_data(data)
    return {"message": "Portfolio updated"}

@app.get("/api/projects")
def get_projects():
    return load_data().get("projects", [])

@app.get("/api/skills")
def get_skills():
    return load_data().get("skills", [])

@app.post("/api/contact")
def contact(msg: ContactMessage):
    contact_file = "contact_messages.json"
    contacts = []
    if os.path.exists(contact_file):
        with open(contact_file, 'r') as f:
            contacts = json.load(f)
    contacts.append({**msg.dict(), "timestamp": datetime.now().isoformat()})
    with open(contact_file, 'w') as f:
        json.dump(contacts, f, indent=2)
    return {"message": "Message received!"}

@app.get("/health")
def health():
    return {"status": "ok", "data_file_exists": os.path.exists(DATA_FILE)}

if __name__ == "__main__":
    import uvicorn
    if not os.path.exists(DATA_FILE):
        save_data(load_data())
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

