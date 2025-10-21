#!/bin/bash

# 🎧 Stalify Setup Script
# This script sets up the complete Stalify project

echo "🎧 Setting up Stalify - Your Spotify Stats, Amplified!"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm $(npm -v) detected"

echo ""
print_info "Installing backend dependencies..."
cd backend
if npm install; then
    print_status "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

echo ""
print_info "Installing frontend dependencies..."
cd ../frontend
if npm install; then
    print_status "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
print_info "Setting up environment files..."

# Create backend .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << EOF
PORT=5000
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
JWT_SECRET=your_jwt_secret_key_here
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
EOF
    print_status "Created backend/.env file"
else
    print_warning "backend/.env already exists"
fi

# Create frontend .env if it doesn't exist
if [ ! -f "frontend/.env" ]; then
    cat > frontend/.env << EOF
VITE_API_BASE_URL=http://localhost:5000
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
EOF
    print_status "Created frontend/.env file"
else
    print_warning "frontend/.env already exists"
fi

echo ""
print_info "Creating development scripts..."

# Create start script
cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🎧 Starting Stalify development servers..."

# Start backend in background
echo "Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "🚀 Stalify is running!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $FRONTEND_PID $BACKEND_PID
EOF

chmod +x start-dev.sh
print_status "Created start-dev.sh script"

# Create build script
cat > build.sh << 'EOF'
#!/bin/bash
echo "🎧 Building Stalify for production..."

# Build frontend
echo "Building frontend..."
cd frontend && npm run build

if [ $? -eq 0 ]; then
    echo "✓ Frontend built successfully"
else
    echo "✗ Frontend build failed"
    exit 1
fi

cd ..

echo ""
echo "🚀 Build complete!"
echo "Frontend build files are in frontend/dist/"
echo "Backend is ready to deploy from backend/"
EOF

chmod +x build.sh
print_status "Created build.sh script"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up your Spotify app at https://developer.spotify.com/dashboard"
echo "2. Update the environment variables in backend/.env and frontend/.env"
echo "3. Run './start-dev.sh' to start both servers"
echo ""
echo "Required Spotify app settings:"
echo "- Redirect URI: http://localhost:5173/callback"
echo "- Scopes: user-read-private, user-read-email, user-top-read, user-read-recently-played"
echo ""
echo "Happy coding! 🎵"
