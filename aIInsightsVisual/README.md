# AI Insights Visual for Power BI

A custom Power BI visual that generates AI-powered insights and summaries from your data using Azure OpenAI. The visual displays 6 intelligent analysis cards with questions and AI-generated answers.

## Features

- **AI-Powered Analysis**: Uses Azure OpenAI to generate intelligent insights from your Power BI data
- **Beautiful Card Layout**: Displays 6 analysis cards in a responsive grid layout
- **Real-time Processing**: Automatically processes data changes and generates new insights
- **Modern UI**: Built with React and TypeScript for a professional, modern interface
- **FastAPI Backend**: Separate backend service for AI processing

## Architecture

```
Power BI Visual (React + TypeScript)
    ↓ HTTP Requests
FastAPI Backend (Python)
    ↓ API Calls
Azure OpenAI Service
```

## Setup Instructions

### 1. Power BI Visual Setup

The visual is already configured and packaged. The `.pbiviz` file is ready for import into Power BI.

### 2. Backend Service Setup

1. **Navigate to the backend directory:**
   ```bash
   cd ../ai-backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Azure OpenAI:**
   - Copy `env.example` to `.env`
   - Update the following values:
     ```
     AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
     AZURE_OPENAI_API_KEY=your-api-key-here
     AZURE_OPENAI_API_VERSION=2024-02-15-preview
     AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
     ```

4. **Start the backend service:**
   ```bash
   python main.py
   ```
   
   The service will run on `http://localhost:8000`

### 3. Power BI Integration

1. **Import the visual:**
   - Open Power BI Desktop
   - Go to Home → Get More Visuals → Import a visual from a file
   - Select the `.pbiviz` file from the `dist` folder

2. **Use the visual:**
   - Drag the "AI Insights Visual" from the Visualizations pane
   - Add your data fields:
     - **Category 1**: First category field
     - **Category 2**: Second category field  
     - **Measures**: Your measure values

3. **Configure the visual:**
   - The visual will automatically connect to the FastAPI backend
   - Ensure the backend is running on `http://localhost:8000`

## Data Structure

The visual expects:
- **2 Category fields** (e.g., Product Category, Region)
- **1+ Measure fields** (e.g., Sales, Revenue, Count)

## AI Questions Generated

The visual automatically generates insights for these 6 questions:

1. "What are the key trends in this data?"
2. "What insights can you derive from the relationship between the categories and measures?"
3. "Are there any notable patterns or outliers in the data?"
4. "What recommendations would you make based on this data?"
5. "How do the different categories compare to each other?"
6. "What business implications can be drawn from this analysis?"

## Customization

### Modifying Questions

Edit the questions in `src/dataProcessor.ts`:

```typescript
const questions = [
    "Your custom question 1",
    "Your custom question 2",
    // ... add more questions
];
```

### Styling

Modify the visual appearance in `style/visual.less`:

- Card colors and gradients
- Typography and spacing
- Responsive breakpoints
- Animation effects

### Backend Configuration

Modify the AI prompts in `ai-backend/main.py`:

```python
prompt = f"""
Your custom prompt template here.
Data: {data}
Question: {question}
"""
```

## Troubleshooting

### Visual Not Loading
- Ensure the FastAPI backend is running on `http://localhost:8000`
- Check browser console for errors
- Verify Power BI Desktop has internet access

### AI Insights Not Generating
- Verify Azure OpenAI credentials in `.env` file
- Check backend logs for API errors
- Ensure data is properly formatted

### Styling Issues
- Clear browser cache
- Rebuild the visual: `npm run package`
- Check for CSS conflicts

## Development

### Building the Visual
```bash
npm run package
```

### Starting Development Server
```bash
npm run start
```

### Linting
```bash
npm run lint
```

## File Structure

```
AIInsightsVisual/
├── src/
│   ├── visual.ts          # Main visual class
│   ├── component.tsx      # React component
│   ├── dataProcessor.ts   # Data processing logic
│   └── aiService.ts       # AI service integration
├── style/
│   └── visual.less        # Styling
├── capabilities.json      # Power BI capabilities
├── pbiviz.json           # Visual metadata
└── dist/
    └── AIInsightsVisual.pbiviz  # Packaged visual

ai-backend/
├── main.py               # FastAPI application
├── requirements.txt      # Python dependencies
└── env.example          # Environment template
```

## Security Notes

- The backend service should be deployed securely in production
- Use HTTPS for the API endpoint
- Implement proper authentication and rate limiting
- Consider using Azure Key Vault for API keys

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the browser console for errors
3. Check the backend logs
4. Ensure all dependencies are properly installed
