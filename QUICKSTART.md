# 🚀 Quick Start Guide

Get Stalify running locally in under 5 minutes!

## ⚡ Quick Setup

```bash
# 1. Clone and setup
git clone https://github.com/your-username/stalify.git
cd stalify
./setup.sh

# 2. Configure Spotify app
# - Go to https://developer.spotify.com/dashboard
# - Create new app
# - Add redirect URI: http://localhost:5173/callback
# - Copy Client ID and Secret

# 3. Update environment files
# Edit backend/.env and frontend/.env with your Spotify credentials

# 4. Start development servers
./start-dev.sh
```

## 🎯 What You'll See

- **Login Page**: Beautiful Spotify OAuth integration
- **Dashboard**: Your music stats with interactive charts
- **Top Tracks**: Your most-played songs with album art
- **Top Artists**: Your favorite artists with popularity metrics
- **Genre Analysis**: Visual breakdown of your music taste

## 🔧 Development Commands

```bash
# Start both servers
./start-dev.sh

# Start individually
cd backend && npm run dev    # Backend on :5000
cd frontend && npm run dev   # Frontend on :5173

# Build for production
./build.sh

# Install dependencies
cd backend && npm install
cd frontend && npm install
```

## 📁 Project Structure

```
Stalify/
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Main pages (Login, Dashboard, etc.)
│   │   ├── context/         # React Context for auth
│   │   └── utils/           # Helper functions
│   └── package.json
├── backend/                 # Node.js + Express API
│   ├── routes/              # API endpoints
│   ├── middleware/           # Custom middleware
│   ├── utils/               # Spotify API utilities
│   └── package.json
├── setup.sh                 # Automated setup script
├── start-dev.sh             # Start both servers
├── build.sh                 # Build for production
└── README.md                # Full documentation
```

## 🎵 Features Implemented

✅ **Spotify OAuth 2.0** - Secure authentication flow  
✅ **User Dashboard** - Personalized music statistics  
✅ **Top Tracks/Artists** - Your most-played content  
✅ **Genre Analysis** - Interactive charts and visualizations  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Dark Theme** - Spotify-inspired UI  
✅ **Real-time Data** - Live Spotify API integration  

## 🚀 Ready to Deploy?

Check out [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment to Vercel + Railway.

## 🆘 Need Help?

1. **Setup Issues**: Run `./setup.sh` again
2. **Spotify Auth**: Verify redirect URI and scopes
3. **Build Errors**: Check Node.js version (18+)
4. **API Errors**: Verify environment variables

## 🎉 You're All Set!

Visit `http://localhost:5173` and start exploring your music taste! 🎧
