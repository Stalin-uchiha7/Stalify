# 🚀 Stalify Deployment Guide

This guide will help you deploy Stalify to production using Vercel (frontend) and Railway/Render (backend).

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Railway/Render account (free tier available)
- Spotify Developer account
- MongoDB Atlas account (optional)

## 🎯 Deployment Overview

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | `https://stalify.vercel.app` |
| Backend | Railway/Render | `https://stalify-api.railway.app` |
| Database | MongoDB Atlas | Cloud-hosted |

## 🔧 Step 1: Prepare Your Code

### 1.1 Push to GitHub

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Stalify project setup"

# Create GitHub repository and push
git remote add origin https://github.com/your-username/stalify.git
git branch -M main
git push -u origin main
```

### 1.2 Update Environment Variables

Update your `.env` files with production URLs:

**backend/.env**
```bash
PORT=5000
SPOTIFY_CLIENT_ID=your_production_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_production_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://stalify.vercel.app/callback
JWT_SECRET=your_secure_jwt_secret
MONGODB_URI=your_mongodb_atlas_uri
FRONTEND_URL=https://stalify.vercel.app
NODE_ENV=production
```

**frontend/.env**
```bash
VITE_API_BASE_URL=https://stalify-api.railway.app
VITE_SPOTIFY_CLIENT_ID=your_production_spotify_client_id
```

## 🌐 Step 2: Deploy Backend (Railway)

### 2.1 Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your Stalify repository
5. Choose the `backend` folder as the root directory
6. Railway will automatically detect it's a Node.js project

### 2.2 Configure Environment Variables

In Railway dashboard:
1. Go to your project → Variables tab
2. Add all environment variables from `backend/.env`
3. Make sure to use production values

### 2.3 Get Backend URL

After deployment, Railway will provide a URL like:
`https://stalify-api-production.up.railway.app`

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project" → Import Git Repository
4. Select your Stalify repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Configure Environment Variables

In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add:
   - `VITE_API_BASE_URL`: Your Railway backend URL
   - `VITE_SPOTIFY_CLIENT_ID`: Your Spotify client ID

### 3.3 Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain (e.g., `stalify.com`)
3. Follow DNS configuration instructions

## 🎵 Step 4: Configure Spotify App

### 4.1 Update Spotify App Settings

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your app
3. Go to Settings
4. Add redirect URI: `https://stalify.vercel.app/callback`
5. Save changes

### 4.2 Update Environment Variables

Update both Railway and Vercel with your Spotify credentials.

## 🗄️ Step 5: Database Setup (Optional)

### 5.1 MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get connection string
4. Add to Railway environment variables as `MONGODB_URI`

## ✅ Step 6: Test Deployment

### 6.1 Test Backend

```bash
# Test health endpoint
curl https://your-railway-url.com/api/health
```

### 6.2 Test Frontend

1. Visit your Vercel URL
2. Try logging in with Spotify
3. Verify all features work

## 🔧 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure `FRONTEND_URL` in backend matches your Vercel domain
- Check CORS configuration in `server.js`

**Spotify Authentication Fails**
- Verify redirect URI matches exactly
- Check client ID and secret are correct
- Ensure scopes are properly configured

**Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript/ESLint errors

**Environment Variables Not Loading**
- Restart deployment after adding variables
- Check variable names match exactly
- Verify no extra spaces or quotes

## 📊 Monitoring

### Vercel Analytics
- Enable in Vercel dashboard
- Monitor page views and performance

### Railway Logs
- View real-time logs in Railway dashboard
- Monitor API performance and errors

### MongoDB Atlas
- Monitor database performance
- Set up alerts for unusual activity

## 🔄 Continuous Deployment

Both platforms support automatic deployments:
- Push to `main` branch triggers deployment
- Preview deployments for pull requests
- Environment-specific configurations

## 🎉 Success!

Your Stalify app should now be live at:
- Frontend: `https://stalify.vercel.app`
- Backend: `https://stalify-api.railway.app`

## 📈 Next Steps

1. **Analytics**: Add Google Analytics or Vercel Analytics
2. **Monitoring**: Set up error tracking with Sentry
3. **Performance**: Optimize images and bundle size
4. **SEO**: Add meta tags and sitemap
5. **PWA**: Make it installable as a Progressive Web App

## 🆘 Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify all environment variables are set correctly
3. Test locally first to isolate issues
4. Check Spotify API status and rate limits

Happy deploying! 🚀
