#!/usr/bin/env python3
"""
Setup script for AI Insights Backend
"""

import os
import subprocess
import sys

def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False
    return True

def create_env_file():
    """Create .env file from template"""
    if not os.path.exists(".env"):
        if os.path.exists("env.example"):
            print("Creating .env file from template...")
            with open("env.example", "r") as src:
                with open(".env", "w") as dst:
                    dst.write(src.read())
            print("✅ .env file created! Please update it with your Azure OpenAI credentials.")
        else:
            print("❌ env.example file not found!")
            return False
    else:
        print("✅ .env file already exists!")
    return True

def main():
    """Main setup function"""
    print("🚀 Setting up AI Insights Backend...")
    print("=" * 50)
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Create .env file
    if not create_env_file():
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("✅ Setup completed successfully!")
    print("\nNext steps:")
    print("1. Update .env file with your Azure OpenAI credentials")
    print("2. Run: python main.py")
    print("3. The service will be available at http://localhost:8000")

if __name__ == "__main__":
    main()
