#!/usr/bin/env python3
"""
Test script for the AI Insights FastAPI server
"""
import requests
import json
import time

def test_health_endpoint():
    """Test the health check endpoint"""
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Health check failed with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure it's running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_insights_endpoint():
    """Test the insights generation endpoint"""
    try:
        # Sample test data
        test_data = {
            "data": {
                "category1Data": ["Q1", "Q2", "Q3", "Q4"],
                "category2Data": ["North", "South", "East", "West"],
                "measuresData": [100.5, 150.2, 200.8, 175.3],
                "rawData": [
                    {"category1": "Q1", "category2": "North", "measure": 100.5},
                    {"category1": "Q2", "category2": "South", "measure": 150.2},
                    {"category1": "Q3", "category2": "East", "measure": 200.8},
                    {"category1": "Q4", "category2": "West", "measure": 175.3}
                ]
            },
            "questions": [
                "What are the key trends in this data?",
                "Which quarter performed best?"
            ],
            "numberOfQuestions": 2
        }
        
        response = requests.post(
            "http://localhost:8000/api/insights",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Insights endpoint working")
            result = response.json()
            print(f"   Generated {len(result['insights'])} insights")
            for insight in result['insights']:
                print(f"   Q{insight['id']}: {insight['question']}")
                print(f"   A{insight['id']}: {insight['answer'][:100]}...")
            return True
        else:
            print(f"❌ Insights endpoint failed with status {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure it's running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Insights test error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing AI Insights FastAPI Server")
    print("=" * 50)
    
    # Wait a moment for server to be ready
    print("⏳ Waiting for server to be ready...")
    time.sleep(2)
    
    # Test health endpoint
    print("\n1. Testing health endpoint...")
    health_ok = test_health_endpoint()
    
    if not health_ok:
        print("\n❌ Server is not responding. Please start the server first:")
        print("   python run_server.py")
        return
    
    # Test insights endpoint
    print("\n2. Testing insights endpoint...")
    insights_ok = test_insights_endpoint()
    
    # Summary
    print("\n" + "=" * 50)
    if health_ok and insights_ok:
        print("🎉 All tests passed! The FastAPI server is working correctly.")
    elif health_ok:
        print("⚠️  Health check passed but insights endpoint failed.")
        print("   This might be due to missing Azure OpenAI configuration.")
    else:
        print("❌ Tests failed. Please check the server configuration.")

if __name__ == "__main__":
    main()
