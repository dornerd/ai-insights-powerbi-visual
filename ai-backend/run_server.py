#!/usr/bin/env python3
"""
Script to run the FastAPI server with proper environment setup
"""
import os
import sys
import subprocess
from pathlib import Path

def check_env_file():
    """Check if .env file exists and create it if needed"""
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  .env file not found. Creating from template...")
        env_example = Path("env.example")
        if env_example.exists():
            with open(env_example, 'r') as f:
                content = f.read()
            with open(env_file, 'w') as f:
                f.write(content)
            print("✅ .env file created from template")
            print("📝 Please edit .env file with your actual Azure OpenAI credentials")
        else:
            print("❌ env.example file not found")
            return False
    else:
        print("✅ .env file found")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import fastapi
        import uvicorn
        import openai
        import pydantic
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing package: {e}")
        print("📦 Installing dependencies...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
            print("✅ Dependencies installed successfully")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies")
            return False

def main():
    """Main function to run the server"""
    print("🚀 Starting AI Insights FastAPI Server Setup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("main.py").exists():
        print("❌ main.py not found. Please run this script from the ai-backend directory")
        return
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Check environment file
    if not check_env_file():
        return
    
    # Check environment variables
    required_vars = ["AZURE_OPENAI_ENDPOINT", "AZURE_OPENAI_API_KEY"]
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var) or os.getenv(var) == "your-api-key-here":
            missing_vars.append(var)
    
    if missing_vars:
        print(f"⚠️  Missing or default environment variables: {', '.join(missing_vars)}")
        print("📝 Please update your .env file with actual values")
        print("🔗 You can get your Azure OpenAI credentials from: https://portal.azure.com")
        print()
        print("The server will start but AI features will be limited.")
        input("Press Enter to continue anyway, or Ctrl+C to exit and update .env file...")
    
    # Start the server
    print("\n🌐 Starting FastAPI server...")
    print("📡 Server will be available at: http://localhost:8000")
    print("📚 API documentation at: http://localhost:8000/docs")
    print("❤️  Health check at: http://localhost:8000/health")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        import uvicorn
        port = int(os.getenv("PORT", 8000))
        uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")

if __name__ == "__main__":
    main()
