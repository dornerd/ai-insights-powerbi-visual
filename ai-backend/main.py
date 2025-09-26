from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Insights API", version="1.0.0")

# Request counter
request_count = 0

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Starting AI Insights API...")
    print("📡 Server is ready to receive requests!")
    print("🔍 Debug logging is ENABLED - you'll see all requests here")
    print("=" * 60)
    if client is None:
        print("⚠️  Warning: Azure OpenAI client not initialized. AI features will be limited.")
    else:
        print("✅ Azure OpenAI client initialized successfully")
    print("=" * 60)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Power BI domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Azure OpenAI
from openai import AzureOpenAI

# Initialize Azure OpenAI client
client = None
try:
    client = AzureOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview")
    )
    print("Azure OpenAI client initialized successfully")
except Exception as e:
    print(f"Warning: Failed to initialize Azure OpenAI client: {e}")
    print("Make sure to set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY environment variables")

# Pydantic models
class ProcessedData(BaseModel):
    category1Data: List[str]
    category2Data: List[str]
    measuresData: List[float]
    measureNames: List[str] = []  # Make optional with default empty list
    rawData: List[Dict[str, Any]]

class AIRequest(BaseModel):
    data: ProcessedData
    questions: List[str]
    numberOfQuestions: int

class AIInsight(BaseModel):
    id: int
    question: str
    answer: str

class InsightsResponse(BaseModel):
    insights: List[AIInsight]

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Insights Power BI Visual API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "health": "/health",
            "generate_insights": "/generate-insights",
            "api_docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "AI Insights API is running"}

@app.post("/api/insights", response_model=InsightsResponse)
@app.post("/generate-insights", response_model=InsightsResponse)
async def generate_insights(request: AIRequest):
    """Generate AI insights from Power BI data"""
    import datetime
    global request_count
    request_count += 1
    
    # Log incoming request
    timestamp = datetime.datetime.now().isoformat()
    print(f"\n🔍 === REQUEST #{request_count} [{timestamp}] ===")
    print(f"📅 Timestamp: {timestamp}")
    print(f"🌐 Endpoint: /generate-insights")
    print(f"📦 Request Data:")
    print(f"  - Number of questions: {request.numberOfQuestions}")
    print(f"  - Questions: {request.questions}")
    print(f"  - Category1 data: {request.data.category1Data}")
    print(f"  - Category2 data: {request.data.category2Data}")
    print(f"  - Measure names: {request.data.measureNames}")
    print(f"  - Measures data: {request.data.measuresData}")
    print(f"  - Raw data count: {len(request.data.rawData)}")
    print("=" * 50)
    
    # PowerBI Data Structure Analysis
    print("🔍 === PowerBI Data Structure Analysis ===")
    print(f"📊 Category 1 Data Count: {len(request.data.category1Data)}")
    print(f"📊 Category 2 Data Count: {len(request.data.category2Data)}")
    print(f"📊 Measures Data Count: {len(request.data.measuresData)}")
    print(f"📊 Measure Names Count: {len(request.data.measureNames)}")
    print(f"📊 Raw Data Count: {len(request.data.rawData)}")
    print(f"📊 Measure Names: {request.data.measureNames}")
    print(f"📊 Measures Data: {request.data.measuresData}")
    print(f"📊 Category 1 Data: {request.data.category1Data}")
    print(f"📊 Category 2 Data: {request.data.category2Data}")
    
    # Analysis flags
    has_multiple_measures = len(request.data.measuresData) > 1
    has_measure_names = len(request.data.measureNames) > 0
    has_multiple_categories = len(request.data.category1Data) > 0 and len(request.data.category2Data) > 0
    data_point_ratio = len(request.data.rawData) / len(request.data.measuresData) if len(request.data.measuresData) > 0 else 0
    
    print("📊 Data Structure Analysis:")
    print(f"   - Has Multiple Measures: {has_multiple_measures}")
    print(f"   - Has Measure Names: {has_measure_names}")
    print(f"   - Has Multiple Categories: {has_multiple_categories}")
    print(f"   - Data Point Ratio: {data_point_ratio:.2f}")
    
    # Show raw data sample
    if request.data.rawData:
        print("📊 Raw Data Sample (first 3):")
        for i, item in enumerate(request.data.rawData[:3], 1):
            print(f"   {i}. {item}")
    
    print("=====================================")
    
    try:
        # Format the data for AI analysis
        formatted_data = format_data_for_ai(request.data)
        print(f"📝 Formatted data for AI (first 200 chars): {formatted_data[:200]}...")
        
        # Generate insights for each question
        insights = []
        for i, question in enumerate(request.questions, 1):
            print(f"🤖 Processing question {i}/{len(request.questions)}: {question}")
            try:
                answer = await generate_ai_response(formatted_data, question)
                print(f"✅ Question {i} completed successfully")
                insights.append(AIInsight(
                    id=i,
                    question=question,
                    answer=answer
                ))
            except Exception as e:
                print(f"❌ Error generating answer for question {i}: {str(e)}")
                insights.append(AIInsight(
                    id=i,
                    question=question,
                    answer=f"Error generating insight: {str(e)}"
                ))
        
        print(f"🎉 Request completed successfully. Generated {len(insights)} insights")
        print("=" * 50)
        
        return InsightsResponse(insights=insights)
        
    except Exception as e:
        print(f"💥 Request failed with error: {str(e)}")
        print("=" * 50)
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")

def format_data_for_ai(data: ProcessedData) -> str:
    """Format the data for AI analysis"""
    formatted = "Data Analysis Request:\n\n"
    
    formatted += f"Category 1 Values: {', '.join(data.category1Data)}\n"
    formatted += f"Category 2 Values: {', '.join(data.category2Data)}\n"
    if data.measureNames:
        formatted += f"Measure Names: {', '.join(data.measureNames)}\n"
    formatted += f"Measure Values: {', '.join(map(str, data.measuresData))}\n\n"
    
    formatted += "Detailed Data Points:\n"
    for i, item in enumerate(data.rawData, 1):
        formatted += f"{i}. Category 1: {item.get('category1', 'N/A')}, "
        formatted += f"Category 2: {item.get('category2', 'N/A')}, "
        measure_name = item.get('measureName', 'Measure')
        formatted += f"{measure_name}: {item.get('measure', 0)}\n"
    
    return formatted

async def generate_ai_response(data: str, question: str) -> str:
    """Generate AI response using Azure OpenAI"""
    try:
        # Check if client is initialized
        if client is None:
            print("❌ Azure OpenAI client not initialized")
            return "AI service is not available. Please check your Azure OpenAI configuration."
        
        # Debug logging
        deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        api_version = os.getenv("AZURE_OPENAI_API_VERSION")
        
        print(f"🔧 OpenAI Config - Deployment: '{deployment_name}', Endpoint: '{endpoint}', API Version: '{api_version}'")
        
        prompt = f"""
You are a data analyst AI assistant. Please analyze the following data and answer the specific question.

Data:
{data}

Question: {question}

Please provide a concise, insightful answer (2-3 sentences) that directly addresses the question based on the data provided. Focus on patterns, trends, and actionable insights.
"""

        print(f"📤 Sending request to Azure OpenAI...")
        print(f"📝 Prompt length: {len(prompt)} characters")
        
        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": "You are a professional data analyst AI assistant. Provide clear, concise, and actionable insights based on the data provided."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        answer = response.choices[0].message.content.strip()
        print(f"📥 Received response from OpenAI (length: {len(answer)} characters)")
        print(f"💬 Response preview: {answer[:100]}...")
        
        return answer
        
    except Exception as e:
        print(f"💥 OpenAI API error: {str(e)}")
        return f"Unable to generate insight due to API error: {str(e)}"

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
