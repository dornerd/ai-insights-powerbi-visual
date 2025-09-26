# 🚀 FastAPI Deployment Guide - Free Options

This guide will help you deploy your AI Insights FastAPI application to various free hosting platforms.

## 📋 Prerequisites

1. **Git Repository**: Your code should be in a Git repository (GitHub recommended)
2. **Environment Variables**: Set up your Azure OpenAI credentials
3. **Dependencies**: Ensure `requirements.txt` is up to date

## 🏆 **Option 1: Render.com (Recommended)**

### Why Render?
- ✅ Most reliable free tier
- ✅ Easy setup process
- ✅ Custom domains supported
- ✅ Free SSL certificates
- ✅ Good for production use

### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables:
     - `AZURE_OPENAI_ENDPOINT`
     - `AZURE_OPENAI_API_KEY`
     - `AZURE_OPENAI_API_VERSION`
     - `AZURE_OPENAI_DEPLOYMENT_NAME`
   - Click "Deploy Web Service"

3. **Access Your App**
   - Your app will be available at: `https://your-app-name.onrender.com`
   - API docs: `https://your-app-name.onrender.com/docs`

---

## 🚄 **Option 2: Railway.app (Developer-Friendly)**

### Why Railway?
- ✅ $5/month credit (effectively free for small apps)
- ✅ No inactivity timeouts
- ✅ Instant deployments
- ✅ Great developer experience

### Steps:

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables**
   ```bash
   railway variables set AZURE_OPENAI_ENDPOINT=your-endpoint
   railway variables set AZURE_OPENAI_API_KEY=your-key
   railway variables set AZURE_OPENAI_API_VERSION=2024-12-01-preview
   railway variables set AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment
   ```

---

## 🛸 **Option 3: Fly.io (Global Performance)**

### Why Fly.io?
- ✅ Global edge deployment
- ✅ No inactivity timeouts
- ✅ Great performance
- ✅ Generous free tier

### Steps:

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login and Deploy**
   ```bash
   fly auth signup
   fly launch
   ```

3. **Set Secrets**
   ```bash
   fly secrets set AZURE_OPENAI_ENDPOINT=your-endpoint
   fly secrets set AZURE_OPENAI_API_KEY=your-key
   fly secrets set AZURE_OPENAI_API_VERSION=2024-12-01-preview
   fly secrets set AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment
   ```

---

## 🎯 **Option 4: Deta Space (Simplest)**

### Why Deta?
- ✅ Completely free
- ✅ No time limits
- ✅ Simple deployment
- ✅ Perfect for prototypes

### Steps:

1. **Install Deta CLI**
   ```bash
   curl -fsSL https://get.deta.dev/cli.sh | sh
   ```

2. **Deploy**
   ```bash
   deta login
   deta new --python fastapi-app
   ```

3. **Set Environment Variables**
   ```bash
   deta env set AZURE_OPENAI_ENDPOINT your-endpoint
   deta env set AZURE_OPENAI_API_KEY your-key
   deta env set AZURE_OPENAI_API_VERSION 2024-12-01-preview
   deta env set AZURE_OPENAI_DEPLOYMENT_NAME your-deployment
   ```

---

## 🔧 **Environment Variables Setup**

Make sure to set these environment variables on your chosen platform:

```bash
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_API_VERSION=2024-12-01-preview
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
```

## 🧪 **Testing Your Deployment**

Once deployed, test your API:

1. **Health Check**
   ```bash
   curl https://your-app-url/health
   ```

2. **API Documentation**
   Visit: `https://your-app-url/docs`

3. **Test AI Endpoint**
   ```bash
   curl -X POST "https://your-app-url/generate-insights" \
        -H "Content-Type: application/json" \
        -d '{"data": {...}, "questions": ["Test question"], "numberOfQuestions": 1}'
   ```

## 🔄 **Updating Your Deployment**

### Render
- Push changes to GitHub
- Render automatically redeploys

### Railway
```bash
git add .
git commit -m "Update app"
git push
railway up
```

### Fly.io
```bash
fly deploy
```

### Deta
```bash
deta deploy
```

## 🚨 **Troubleshooting**

### Common Issues:

1. **Environment Variables Not Set**
   - Check platform-specific environment variable settings
   - Ensure variable names match exactly

2. **Build Failures**
   - Check `requirements.txt` for missing dependencies
   - Verify Python version compatibility

3. **App Not Starting**
   - Check start command format
   - Verify port configuration (use `$PORT` environment variable)

4. **CORS Issues**
   - Update CORS origins in your FastAPI app
   - Add your Power BI domain to allowed origins

## 📊 **Platform Comparison**

| Platform | Free Tier | Inactivity Timeout | Setup Difficulty | Best For |
|----------|-----------|-------------------|------------------|----------|
| **Render** | 750 hours/month | 15 min | Easy | Production |
| **Railway** | $5 credit/month | None | Easy | Development |
| **Fly.io** | Generous | None | Medium | Global apps |
| **Deta** | Unlimited | None | Very Easy | Prototypes |

## 🎯 **Recommendation for Your Project**

For your **AI Insights Power BI Visual**, I recommend:

1. **Start with Render** - Most reliable and production-ready
2. **Use Railway** for development - Better developer experience
3. **Consider Fly.io** if you need global performance

## 🔗 **Next Steps**

1. Choose your platform
2. Set up your Git repository
3. Deploy using the steps above
4. Update your Power BI visual to use the new URL
5. Test thoroughly with your Power BI data

---

**Need help?** Check the platform-specific documentation or reach out for assistance!
