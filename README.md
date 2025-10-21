# 🎧 Stalify

**Your Spotify Stats, Amplified.**

Stalify connects to your Spotify account to visualize your top songs, artists, and genres. Discover your unique vibe — powered by data and music.

## 🚀 Features

- **Spotify OAuth Integration** - Secure login with your Spotify account
- **Personalized Dashboard** - View your top tracks, artists, and genres
- **Interactive Charts** - Beautiful visualizations of your listening habits
- **Your Vibe Summary** - AI-style insights about your music taste
- **Responsive Design** - Works perfectly on desktop and mobile
- **Dark Theme** - Spotify-inspired sleek interface

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Authentication | Spotify OAuth 2.0 |
| Database | MongoDB Atlas (optional) |
| Charts | Recharts |
| Animations | Framer Motion |
| Deployment | Vercel (frontend) + Railway (backend) |

## 🏗️ Project Structure

```
Stalify/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── context/       # React Context for state management
│   │   ├── utils/         # Helper functions
│   │   └── styles/        # Global styles
│   └── package.json
├── backend/           # Node.js + Express API
│   ├── routes/        # API route handlers
│   ├── middleware/    # Custom middleware
│   ├── utils/         # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Spotify Developer Account
- MongoDB Atlas account (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/stalify.git
cd stalify
```

### 2. Set Up Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://localhost:5173/callback`
4. Note your Client ID and Client Secret

### 3. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
PORT=5000
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_uri
```

Start the backend:
```bash
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 🔐 Required Spotify Scopes

- `user-read-private` - Read user's subscription details
- `user-read-email` - Read user's email address
- `user-top-read` - Read user's top artists and tracks
- `user-read-recently-played` - Read user's recently played tracks

## 🎨 Design System

### Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Background | Dark Gray | `#121212` |
| Primary Accent | Spotify Green | `#1DB954` |
| Text | White | `#FFFFFF` |
| Secondary Text | Light Gray | `#B3B3B3` |
| Card Background | Darker Gray | `#1E1E1E` |

## 📱 Pages

- **`/login`** - Spotify authentication
- **`/callback`** - OAuth callback handler
- **`/dashboard`** - Main stats dashboard
- **`/about`** - Project information

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spotify Web API for providing access to user data
- TailwindCSS for the amazing utility-first CSS framework
- React and Vite for the modern frontend experience

---

**Made with ❤️ and 🎵 by Stalin**
