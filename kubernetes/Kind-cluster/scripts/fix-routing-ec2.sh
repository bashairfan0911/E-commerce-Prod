#!/bin/bash
# Quick fix for API routing on EC2 deployment

echo "🔧 Fixing API routing for EC2 deployment..."
echo ""

# Get public IP
echo "🌐 Getting public IP..."
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)

if [ -z "$PUBLIC_IP" ]; then
    echo "❌ Could not get public IP. Please enter it manually:"
    read -p "Enter your EC2 public IP: " PUBLIC_IP
fi

echo "📍 Using IP: $PUBLIC_IP"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Rebuild frontend with backend URL
echo "🏗️  Rebuilding frontend with backend URL..."
docker build --build-arg VITE_API_URL=http://${PUBLIC_IP}:31100 -t ecommerce-frontend:latest ./frontend

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

echo ""
echo "📦 Loading image into Kind cluster..."
kind load docker-image ecommerce-frontend:latest --name ekomart

if [ $? -ne 0 ]; then
    echo "❌ Failed to load image into Kind"
    exit 1
fi

echo ""
echo "🔄 Restarting frontend deployment..."
kubectl rollout restart deployment frontend-deployment -n ekomart

echo ""
echo "⏳ Waiting for rollout to complete..."
kubectl rollout status deployment frontend-deployment -n ekomart

echo ""
echo "✅ Done! Frontend has been updated."
echo ""
echo "📍 Access your application at:"
echo "   Frontend: http://${PUBLIC_IP}:31000"
echo "   Backend:  http://${PUBLIC_IP}:31100"
echo ""
echo "🔍 Verify deployment:"
echo "   kubectl get pods -n ekomart"
echo ""
