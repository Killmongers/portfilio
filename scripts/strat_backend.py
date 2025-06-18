#!/usr/bin/env python3
"""
Simple script to start the FastAPI backend
"""
import subprocess
import sys
import os

def main():
    # Change to the scripts directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print("🚀 Starting FastAPI Portfolio Backend...")
    print("📁 Working directory:", os.getcwd())
    print("🌐 Backend will be available at: http://localhost:8000")
    print("📚 API docs will be available at: http://localhost:8000/docs")
    print("=" * 50)
    
    try:
        # Start the FastAPI server
        subprocess.run([
            sys.executable, "fastapi_backend.py"
        ], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Backend stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting backend: {e}")
        print("💡 Make sure you have installed the requirements:")
        print("   pip install -r requirements.txt")
    except FileNotFoundError:
        print("❌ Python not found. Make sure Python is installed and in your PATH.")

if __name__ == "__main__":
    main()

