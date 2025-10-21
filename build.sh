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
