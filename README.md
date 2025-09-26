# 🤖 AI Insights Power BI Visual

A powerful Power BI custom visual that provides AI-powered insights and analysis of your data using Azure OpenAI services.

## ✨ Features

- **AI-Powered Analysis**: Generate intelligent insights from your Power BI data
- **Custom Questions**: Ask specific questions about your data
- **Azure OpenAI Integration**: Leverages Azure OpenAI for advanced analytics
- **Real-time Processing**: Get instant insights as you interact with your data
- **Responsive Design**: Works seamlessly across different screen sizes
- **Easy Configuration**: Simple setup with environment variables

## 🏗️ Architecture

This project consists of two main components:

### 1. Power BI Custom Visual (`aIInsightsVisual/`)
- **Frontend**: React/TypeScript visual component
- **Data Processing**: Handles Power BI data transformation
- **AI Service Integration**: Communicates with the FastAPI backend

### 2. FastAPI Backend (`ai-backend/`)
- **API Server**: FastAPI application for AI processing
- **Azure OpenAI Integration**: Handles AI model interactions
- **CORS Support**: Configured for Power BI integration
- **Health Monitoring**: Built-in health check endpoints

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python 3.11+
- Azure OpenAI account
- Power BI Desktop

### Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd ai-backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your Azure OpenAI credentials
   ```

4. **Run the server**
   ```bash
   python run_server.py
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the visual directory**
   ```bash
   cd aIInsightsVisual
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the visual**
   ```bash
   npm run build
   ```

4. **Import into Power BI**
   - Open Power BI Desktop
   - Go to Home → Get Data → More → Other → Power BI visuals
   - Import the generated `.pbiviz` file

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `ai-backend` directory:

```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_API_VERSION=2024-12-01-preview
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
```

### Power BI Visual Settings

The visual supports the following configuration options:

- **API Endpoint**: URL of your deployed FastAPI backend
- **Number of Questions**: How many AI insights to generate
- **Custom Questions**: Specific questions to ask about your data

## 🌐 Deployment

### Free Deployment Options

This project can be deployed to various free hosting platforms:

1. **Render.com** (Recommended)
   - 512 MB RAM free tier
   - Free SSL certificates
   - Automatic deployments from Git

2. **Railway.app**
   - $5/month credit (effectively free for small apps)
   - No inactivity timeouts
   - Great developer experience

3. **Fly.io**
   - Generous free tier
   - Global edge deployment
   - No inactivity timeouts

4. **Deta Space**
   - Completely free
   - Simple deployment
   - Perfect for prototypes

See `ai-backend/DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## 📊 Usage

### In Power BI

1. **Add the visual** to your Power BI report
2. **Configure the data fields**:
   - Category 1: First dimension
   - Category 2: Second dimension (optional)
   - Measures: Values to analyze
3. **Set up the visual**:
   - Enter your API endpoint
   - Configure number of questions
   - Add custom questions (optional)
4. **Generate insights** by interacting with your data

### API Endpoints

- `GET /health` - Health check
- `POST /generate-insights` - Generate AI insights
- `GET /docs` - API documentation

## 🛠️ Development

### Backend Development

```bash
cd ai-backend
python run_server.py
```

### Frontend Development

```bash
cd aIInsightsVisual
npm run start
```

### Building for Production

```bash
# Backend
cd ai-backend
pip install -r requirements.txt

# Frontend
cd aIInsightsVisual
npm run build
```

## 🧪 Testing

### Backend Testing

```bash
cd ai-backend
python test_api.py
```

### Manual Testing

1. Start the backend server
2. Open `http://localhost:8000/docs` for API documentation
3. Test the `/health` endpoint
4. Test the `/generate-insights` endpoint with sample data

## 📁 Project Structure

```
├── ai-backend/                 # FastAPI backend
│   ├── main.py                # Main application file
│   ├── run_server.py          # Server startup script
│   ├── requirements.txt       # Python dependencies
│   ├── env.example           # Environment variables template
│   ├── Dockerfile            # Docker configuration
│   └── DEPLOYMENT_GUIDE.md   # Deployment instructions
├── aIInsightsVisual/          # Power BI custom visual
│   ├── src/                  # Source code
│   │   ├── visual.ts         # Main visual class
│   │   ├── component.tsx     # React component
│   │   ├── aiService.ts      # AI service integration
│   │   └── dataProcessor.ts  # Data processing logic
│   ├── package.json          # Node.js dependencies
│   └── pbiviz.json          # Power BI visual configuration
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/ai-insights-powerbi-visual/issues)
- **Documentation**: Check the `ai-backend/DEPLOYMENT_GUIDE.md` for deployment help
- **API Docs**: Available at `http://your-api-url/docs` when running

## 🙏 Acknowledgments

- [Power BI Custom Visuals](https://docs.microsoft.com/en-us/power-bi/developer/visuals/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Azure OpenAI](https://azure.microsoft.com/en-us/services/cognitive-services/openai-service/)
- [React](https://reactjs.org/)

## 🔄 Version History

- **v1.0.0** - Initial release with basic AI insights functionality
- **v1.0.1** - Added deployment configurations and documentation

---

**Made with ❤️ for the Power BI community**
